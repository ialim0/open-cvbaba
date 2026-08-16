import asyncio
import json
from typing import List, Optional, AsyncIterator
from pathlib import Path
import os
from sqlalchemy import func
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status
from fastapi_cache.decorator import cache
from app.models import Chat, ChatShare, User, ChatComment, ChatReadStatus
from datetime import datetime, timezone, timedelta
from app.models.chat_version import ChatVersion
from app.models.chat_page import ChatPage
from bs4 import BeautifulSoup
from app.schemas.chat import ChatUpdate
from app.services.chat.mistral_client import MistralClient
from app.services.chat.ai_response import (
    AIGenerator,
    ContentFormatter,
    generate_ai_response,
    generate_title_from_input,
    EditScope,
)
from app.services.chat.html_completer import fix_incomplete_html
from app.config import settings
import logging
import uuid
import jwt
from datetime import datetime, timezone
import httpx
from httpx import TimeoutException
from enum import Enum
from openai import OpenAI, AsyncOpenAI

from app.models.enums import AIModel, AccessLevel

logger = logging.getLogger(__name__)

def get_model_names():
    """Return the single configured Mistral model."""
    return {AIModel.MISTRAL: settings.MISTRAL_MODEL}

def get_default_model() -> AIModel:
    return AIModel.MISTRAL

def clean_html_response(html: str) -> str:
    """Clean HTML response from AI, removing markdown code blocks and ensuring proper structure."""
    # Remove markdown code blocks
    if "```html" in html:
        html = html.split("```html", 1)[1]
        if "```" in html:
            html = html.split("```", 1)[0]
    elif "```" in html:
        html = html.replace("```", "")
    
    html = html.strip()
    
    # Ensure it starts with DOCTYPE
    if not html.startswith("<!DOCTYPE"):
        logger.warning("HTML response missing DOCTYPE, attempting to fix")
        if html.startswith("<html"):
            html = "<!DOCTYPE html>\n" + html
    
    if "pdf-page" not in html:
        logger.warning("HTML response missing .pdf-page structure")
    
    return html

def auto_paginate_html(html: str) -> str:
    """Automatically split long single-page content into multiple pages."""
    try:
        from bs4 import BeautifulSoup
        
        soup = BeautifulSoup(html, 'html.parser')
        pdf_pages = soup.find_all('div', class_='pdf-page')
        
        # Only process if there's exactly one page
        if len(pdf_pages) != 1:
            logger.info(f"Document has {len(pdf_pages)} pages, skipping auto-pagination")
            return html
        
        page = pdf_pages[0]
        block_elements = page.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'div', 'section', 'article'])
        
        # Heuristic: if more than 30 block elements, split into pages
        if len(block_elements) < 30:
            logger.info(f"Content has {len(block_elements)} blocks, fits on one page")
            return html
        
        logger.info(f"Content has {len(block_elements)} blocks, auto-paginating")
        
        # Split into ~20 blocks per page
        blocks_per_page = 20
        new_pages = []
        current_blocks = []
        
        for i, elem in enumerate(block_elements):
            current_blocks.append(str(elem))
            
            if (i + 1) % blocks_per_page == 0 or i == len(block_elements) - 1:
                content = '\n    '.join(current_blocks)
                new_pages.append(f'  <div class="pdf-page">\n    {content}\n  </div>')
                current_blocks = []
        
        # Rebuild HTML
        body = soup.find('body')
        if body and len(new_pages) > 1:
            body.clear()
            pages_html = '\n\n'.join(new_pages)
            body.append(BeautifulSoup(pages_html, 'html.parser'))
            logger.info(f"Split into {len(new_pages)} pages")
            return str(soup)
        
        return html
    except ImportError:
        logger.warning("BeautifulSoup not installed, skipping auto-pagination")
        return html
    except Exception as e:
        logger.error(f"Auto-pagination error: {e}")
        return html

class InputValidator:
    @staticmethod
    async def validate_user_input(user_input: str) -> None:
        """Validate user input meets requirements."""
        if not user_input or not user_input.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User input cannot be empty"
            )
        
        if len(user_input) > 12000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User input exceeds maximum length of 12000 characters"
            )

class TemplateManager:
    def __init__(self):
        self.templates_path = Path(__file__).resolve().parent.parent.parent / "templates" / "documents"
        os.makedirs(self.templates_path, exist_ok=True)
        # OPTIMIZATION: Cache templates in memory to avoid repeated file I/O - REPLACED BY REDIS
        logger.info(f"Initialized TemplateManager with path: {self.templates_path}")
    
    def _get_template_folder(self, template_id: str) -> Path:
        """Return the shared document-template directory."""
        return self.templates_path

    def __repr__(self):
        return "TemplateManager"

    async def get_template_content(self, template_id: str) -> Optional[str]:
        """Retrieve template content by ID with async file I/O."""
        # Delegating caching to Redis via decorator
        return await self._get_content_from_disk(template_id)

    @cache(expire=3600)
    async def _get_content_from_disk(self, template_id: str) -> Optional[str]:
        """Actual disk read, cached by wrapper."""
        try:
            template_folder = self._get_template_folder(template_id)
            
            # First try exact filename match (without extension)
            template_file = template_folder / template_id
            
            # If not found, try with .html extension for backward compatibility
            if not template_file.exists():
                template_file = template_folder / f"{template_id}.html"
                
            if not template_file.exists():
                available_files = [f.name for f in template_folder.glob("*")]
                logger.warning(
                    f"Template {template_id} not found in {template_folder}. "
                    f"Available files: {available_files}"
                )
                return None
                
            logger.debug(f"Loading template from: {template_file}")
            # Use async file I/O to avoid blocking
            content = await asyncio.to_thread(
                template_file.read_text,
                encoding='utf-8'
            )
            return content.strip()
            
        except Exception as e:
            logger.error(f"Error reading template {template_id}: {str(e)}", exc_info=True)
            return None

from app.services.email import EmailService

class ChatService:
    def __init__(self):
        self.template_manager = TemplateManager()
        self.validator = InputValidator()
        
        # Initialize email service
        self.email_service = EmailService()
        
        # Mistral is the only AI provider used by this application.
        self.clients = {
            AIModel.MISTRAL: OpenAI(
                api_key=settings.MISTRAL_API_KEY,
                base_url=settings.MISTRAL_BASE_URL,
            )
        }
        self._api_keys_validated = False
        logger.info("ChatService initialized with SDK clients")
    
    @staticmethod
    def _format_sse_event(payload: dict) -> str:
        return f"data: {json.dumps(payload)}\n\n"

    def _calculate_unread_count(self, db: Session, chat_id: int, user_id: int) -> int:
        """Calculate number of unread comments for a chat/user pair."""
        # Get last read timestamp
        last_read_at = db.query(ChatReadStatus.last_read_at).filter(
            ChatReadStatus.chat_id == chat_id,
            ChatReadStatus.user_id == user_id
        ).scalar()
        
        # Count comments created after last read, or all comments if never read
        query = db.query(ChatComment).filter(ChatComment.chat_id == chat_id)
        
        if last_read_at:
            query = query.filter(ChatComment.created_at > last_read_at)
            
        return query.count()

    @staticmethod
    def _serialize_chat(chat: Chat) -> dict:
        return {
            "slug": chat.slug,
            "title": chat.title,
            "user_input": chat.user_input,
            "pdf_content": chat.pdf_content,
            "created_at": chat.created_at.isoformat() if chat.created_at else None,
            "updated_at": chat.updated_at.isoformat() if chat.updated_at else None,
        }

    async def ensure_api_keys_valid(self):
        """Ensure API keys are validated (only validates once)"""
        if not self._api_keys_validated:
            await self._validate_api_keys()
            self._api_keys_validated = True
    
    async def _validate_api_keys(self):
        if not settings.MISTRAL_API_KEY:
            logger.warning("MISTRAL_API_KEY is not configured; AI requests will fail until it is set")
            return
        await self._call_api("Hello", AIModel.MISTRAL, max_tokens=8)
        logger.info("Mistral API key validated successfully")

    async def _call_api(self, prompt: str, model: AIModel, **kwargs):
        """Generate a response through Mistral's OpenAI-compatible endpoint."""
        try:
            response = await asyncio.to_thread(
                self.clients[AIModel.MISTRAL].chat.completions.create,
                model=settings.MISTRAL_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=kwargs.get("temperature", 0.5),
                max_tokens=kwargs.get("max_tokens", 2500),
                stream=False,
            )
            return response.choices[0].message.content or ""
        except Exception as exc:
            logger.error("Mistral API call failed: %s", exc)
            raise HTTPException(status_code=500, detail="Failed to generate Mistral response") from exc

    async def _prepare_generation_inputs(
        self,
        db: Session,
        user_id: int,
        user_input: str,
        template_id: Optional[str],
        user_email: Optional[str]
    ) -> tuple[str, Optional[str], Optional[str]]:
        """Validate inputs and resolve template/document context."""
        await self.validator.validate_user_input(user_input)

        document_type: Optional[str] = None
        template_content: Optional[str] = None

        if template_id:
            template_content = await self.template_manager.get_template_content(template_id)
            if template_content:
                if template_id.startswith("fl"):
                    document_type = "cover_letter"
                elif template_id.startswith(("cv", "resume")):
                    document_type = "resume"
            else:
                logger.warning(f"Template {template_id} not found or empty")
        else:
            logger.info("No template provided - AI will follow user instructions freely")

        sanitized_input = user_input.replace("\x00", "")
        sanitized_template = template_content.replace("\x00", "") if template_content else None

        return sanitized_input, sanitized_template, document_type

    async def _save_chat_version(self, db: Session, chat_id: int, pdf_content: str) -> ChatVersion:
        """Save a new version of the chat's PDF content."""
        try:
            new_version = ChatVersion(
                chat_id=chat_id,
                pdf_content=pdf_content
            )
            db.add(new_version)
            db.commit()
            db.refresh(new_version)
            logger.debug(f"Created new version for chat ID {chat_id}")
            return new_version
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Failed to save chat version: {e}")
            raise

    async def create_chat_from_files(
        self,
        db: Session,
        user_id: int,
        prompt: str,
        file_paths: List[Path],
        user_email: str,
        youtube_urls: List[str] = None,
        webpage_urls: List[str] = None
    ) -> Chat:
        """Create a new chat document by analyzing uploaded files and other sources."""
        
        
        youtube_urls = youtube_urls or []
        webpage_urls = webpage_urls or []
        
        # Generate content (use multimodal if YouTube/Web present, else basic files)
        logger.info(f"Generating document from {len(file_paths)} files, {len(youtube_urls)} videos, {len(webpage_urls)} pages")
        
        if youtube_urls or webpage_urls:
            generated_html = await AIGenerator.generate_from_multimodal(
                file_paths=file_paths,
                youtube_urls=youtube_urls,
                webpage_urls=webpage_urls,
                prompt=prompt
            )
        else:
            generated_html = await AIGenerator.generate_from_files(file_paths, prompt)
        
        # Create Chat
        slug = f"doc_{uuid.uuid4().hex[:8]}"
        title = "Generated Document"
        try:
            title = await AIGenerator.generate_chat_title(prompt[:100], generated_html[:5000])
        except Exception:
            pass

        chat = Chat(
            user_id=user_id,
            slug=slug,
            title=title,
            pdf_content=generated_html,
            user_input=prompt
        )
        db.add(chat)
        db.flush()
        
        # Initialize pages
        self._sync_pages_from_html(db, chat, generated_html)
        
        # Save first version
        await self._save_chat_version(db, chat.id, generated_html)
        
        db.commit()
        db.refresh(chat)
        return chat

    async def get_chat_by_slug(self, db: Session, user_id: int, slug: str) -> Chat:
        """Retrieve a chat by its slug."""
        try:
            chat = db.query(Chat).filter(
                Chat.slug == slug,
                Chat.user_id == user_id
            ).first()

            if not chat:
                logger.warning(f"Chat not found - slug: {slug}, user_id: {user_id}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Chat not found"
                )

            chat.pdf_content = self._assemble_html(chat)
            return chat

        except SQLAlchemyError as e:
            logger.error(f"Database error in get_chat_by_slug: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )

    async def get_chat_for_viewing(
        self, 
        db: Session, 
        user_id: int, 
        user_email: str, 
        slug: str
    ) -> Chat:
        """
        Retrieve a chat for viewing, checking all access rights:
        1. Ownership
        2. Public status
        3. Shared access
        """
        try:
            chat = db.query(Chat).filter(Chat.slug == slug).first()

            if not chat:
                # Return 404 if chat doesn't exist
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Chat not found"
                )

            # Check access rights
            is_owner = chat.user_id == user_id
            is_public = chat.is_public
            is_shared = False
            share = None
            
            if not (is_owner or is_public):
                # Only check shared if not owner and not public (optimization)
                share = db.query(ChatShare).filter(
                    ChatShare.chat_id == chat.id,
                    ChatShare.shared_with_email == user_email
                ).first()
                
                if share:
                    is_shared = True
                    # Track first access if not already tracked
                    if not share.accessed_at:
                        share.accessed_at = func.now()
                        db.commit()
                        logger.info(f"First access tracked for share {share.id} by {user_email}")

            # Set access_level on chat object before returning
            if is_owner:
                chat.access_level = "full"
            elif is_shared and share: # Ensure 'share' object exists before accessing its properties
                chat.access_level = share.access_level
            elif is_public:
                chat.access_level = "view"

            if is_owner or is_public or is_shared:
                chat.pdf_content = self._assemble_html(chat)
                # Calculate unread count
                chat.unread_count = self._calculate_unread_count(db, chat.id, user_id)
                return chat

            # If no access, return 404 to hide existence (security best practice)
            # or 403 if you prefer explicit denial
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat not found"
            )


        except HTTPException:
            raise
        except SQLAlchemyError as e:
            logger.error(f"Database error in get_chat_for_viewing: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )



    async def get_chat_structure(self, db: Session, user_id: int, user_email: str, slug: str) -> dict:
        """
        Retrieve chat metadata and structure for frontend skeleton.
        """
        try:
            chat = db.query(Chat).filter(Chat.slug == slug).first()
            if not chat:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")

            # Access Control (simplified version of get_chat_for_viewing)
            is_owner = chat.user_id == user_id
            is_public = chat.is_public
            is_shared = False
            
            if not (is_owner or is_public):
                 share = db.query(ChatShare).filter(
                    ChatShare.chat_id == chat.id,
                    ChatShare.shared_with_email == user_email
                ).first()
                 if share:
                     is_shared = True

            if not (is_owner or is_public or is_shared):
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")

            # Fetch page numbers
            page_numbers = [
                p.page_number for p in 
                db.query(ChatPage.page_number)
                .filter(ChatPage.chat_id == chat.id)
                .order_by(ChatPage.page_number)
                .all()
            ]

            return {
                "slug": chat.slug,
                "title": chat.title,
                "total_pages": len(page_numbers),
                "global_styles": chat.global_styles,
                "page_numbers": page_numbers
            }
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching structure for {slug}: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")

    async def get_page_content(self, db: Session, user_id: int, user_email: str, slug: str, page_number: int) -> dict:
        """
        Retrieve content for a specific page.
        """
        try:
            chat = db.query(Chat).filter(Chat.slug == slug).first()
            if not chat:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")

            # Access Control
            is_owner = chat.user_id == user_id
            is_public = chat.is_public
            is_shared = False
            
            if not (is_owner or is_public):
                 share = db.query(ChatShare).filter(
                    ChatShare.chat_id == chat.id,
                    ChatShare.shared_with_email == user_email
                ).first()
                 if share:
                     is_shared = True

            if not (is_owner or is_public or is_shared):
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")

            page = db.query(ChatPage).filter(
                ChatPage.chat_id == chat.id,
                ChatPage.page_number == page_number
            ).first()

            if not page:
                raise HTTPException(status_code=404, detail=f"Page {page_number} not found")

            return {
                "page_number": page.page_number,
                "content": page.content
            }
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching page {page_number} for {slug}: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")

    def increment_download_count(self, db: Session, slug: str, download_type: str):
        """
        Increment the download counter for a chat.
        download_type should be 'pdf' or 'docx'.
        """
        try:
            chat = db.query(Chat).filter(Chat.slug == slug).first()
            if not chat:
                return # Fail silently if chat not found (this is just stats)
            
            if download_type == 'pdf':
                chat.pdf_downloads += 1
            elif download_type == 'docx':
                chat.docx_downloads += 1
                
            db.commit()
        except Exception as e:
            logger.error(f"Failed to increment download count for {slug} ({download_type}): {e}")
            # Do not raise - analytics shouldn't break the download flow
            
    async def mark_chat_as_read(self, db: Session, slug: str, user_id: int):
        """Mark a chat as read by the user."""
        try:
            chat = db.query(Chat).filter(Chat.slug == slug).first()
            if not chat:
                raise HTTPException(status_code=404, detail="Chat not found")
                
            # Check or create read status
            read_status = db.query(ChatReadStatus).filter(
                ChatReadStatus.chat_id == chat.id,
                ChatReadStatus.user_id == user_id
            ).first()
            
            if read_status:
                read_status.last_read_at = func.now()
            else:
                read_status = ChatReadStatus(
                    chat_id=chat.id,
                    user_id=user_id,
                    last_read_at=func.now()
                )
                db.add(read_status)
            
            db.commit()
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error marking chat {slug} as read for user {user_id}: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")

    async def toggle_notifications(
        self,
        db: Session,
        slug: str,
        user_id: int,
        muted: bool
    ) -> bool:
        """Toggle email notifications for a user on a chat."""
        # Get chat first
        chat = db.query(Chat).filter(Chat.slug == slug).first()
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")

        # Get or create read status
        status_record = db.query(ChatReadStatus).filter(
            ChatReadStatus.chat_id == chat.id,
            ChatReadStatus.user_id == user_id
        ).first()

        if not status_record:
            status_record = ChatReadStatus(
                chat_id=chat.id,
                user_id=user_id,
                is_muted=muted
            )
            db.add(status_record)
        else:
            status_record.is_muted = muted
            
        db.commit()
        db.refresh(status_record)
        return status_record.is_muted

    def create_chat_token(self, slug: str) -> str:
        """Create a short-lived token for chat access."""
        payload = {
            "slug": slug,
            "exp": datetime.now(timezone.utc) + timedelta(hours=settings.VERIFICATION_TOKEN_EXPIRE_HOURS)
        }
        return jwt.encode(payload, settings.EMAIL_VERIFICATION_SECRET, algorithm="HS256")

    def create_tracking_pixel_token(self, chat_slug: str, user_id: int) -> str:
        """Create a secure token for the tracking pixel."""
        payload = {
            "slug": chat_slug,
            "uid": user_id,
            "exp": datetime.now(timezone.utc) + timedelta(hours=settings.VERIFICATION_TOKEN_EXPIRE_HOURS)
        }
        # Use existing secret from settings
        return jwt.encode(payload, settings.EMAIL_VERIFICATION_SECRET, algorithm="HS256")
        
    def decode_tracking_pixel_token(self, token: str) -> dict:
        """Decode and validate tracking pixel token."""
        try:
            return jwt.decode(token, settings.EMAIL_VERIFICATION_SECRET, algorithms=["HS256"])
        except Exception:
            return None

    async def create_chat(
        self, 
        db: Session, 
        user_id: int, 
        user_input: str,
        template_id: Optional[str] = None,
        user_email: str = None,
        num_pages: Optional[int] = None,
        file_paths: List[Path] = None,
        youtube_urls: List[str] = None,
        webpage_urls: List[str] = None
    ) -> Chat:
        """Create a new chat with AI-generated content (supports multimodal)."""
        try:
            # OPTIMIZATION: Reduced logging for performance
            user_input_clean, template_content, document_type = await self._prepare_generation_inputs(
                db, user_id, user_input, template_id, user_email
            )
            
            # Start title generation in parallel
            title_task = asyncio.create_task(generate_title_from_input(user_input_clean))

            # Multimodal Check
            file_paths_safe = file_paths or []
            youtube_urls_safe = youtube_urls or []
            webpage_urls_safe = webpage_urls or []
            is_multimodal = bool(file_paths_safe or youtube_urls_safe or webpage_urls_safe)

            pdf_content = ""
            
            if is_multimodal:
                 logger.info(f"Using Multimodal Generator defined in AIGenerator ({len(file_paths_safe)} files)")
                 pdf_content = await AIGenerator.generate_from_multimodal(
                    file_paths=file_paths_safe,
                    youtube_urls=youtube_urls_safe,
                    webpage_urls=webpage_urls_safe,
                    prompt=user_input_clean
                 )
            elif True:
                # Use Gemini for document generation (original behavior)
                logger.debug(f"Generating AI response... (num_pages={num_pages})")
                logger.info(f"Using Gemini for document generation (num_pages={num_pages})")
                pdf_content = await generate_ai_response(
                    user_input=user_input_clean,
                    conversation_history=None,
                    document_type=document_type,
                    template_content=template_content,
                    template_id=template_id,
                    num_pages=num_pages
                )
            else:
                # Use the configured Mistral model
                default_model = get_default_model()
                logger.info(f"Using {default_model.value} for document generation")
                
                # Build comprehensive prompt for document generation with A4 page structure
                prompt_parts = []
                prompt_parts.append("You are an expert HTML document generator. Generate a professional, accessible, and semantic HTML5 document.")
                prompt_parts.append("\n===== CRITICAL FORMATTING REQUIREMENTS =====")
                prompt_parts.append("The HTML MUST follow this exact structure:")
                prompt_parts.append("""<!DOCTYPE html>
<html>
<head>
  <style>
    /* A4 Page Dimensions at 96 DPI */
    .pdf-page {
      width: 794px;           /* 210mm */
      height: 1123px;         /* 297mm */
      margin: 0 auto 20px;    /* Center pages with spacing */
      padding: 38px;          /* 1cm margins on all sides */
      box-sizing: border-box;
      background: white;
      position: relative;
      page-break-after: always;
    }
    
    /* Content area is 718px × 1047px (794-76 × 1123-76) */
    body {
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    
    /* Add your document-specific styles here */
  </style>
</head>
<body>
  <div class="pdf-page">
    <!-- Page 1 content goes here -->
  </div>
  
  <div class="pdf-page">
    <!-- Page 2 content (if needed) -->
  </div>
</body>
</html>""")
                prompt_parts.append("\nIMPORTANT: Each <div class='pdf-page'> represents one A4 page. Split content across multiple pages if needed.")
                prompt_parts.append("IMPORTANT: Content area inside each .pdf-page is 718px wide × 1047px tall (after 38px padding on all sides).")
                prompt_parts.append("IMPORTANT: Do NOT add extra margins or padding inside .pdf-page - the 38px padding is already applied.")
                
                if document_type == "cover_letter":
                    prompt_parts.append("\nThe output MUST be a professional cover letter in HTML format. Do not produce a resume/CV.")
                    prompt_parts.append("A cover letter typically fits on ONE page. Use only one <div class='pdf-page'>.")
                elif document_type == "resume":
                    prompt_parts.append("\nThe output MUST be a resume/CV in HTML format. Do not produce a cover letter.")
                    prompt_parts.append("A resume may span multiple pages. Use multiple <div class='pdf-page'> elements as needed.")
                
                if template_content:
                    prompt_parts.append(f"\n===== TEMPLATE STRUCTURE =====\n{template_content}")
                    prompt_parts.append("Adhere strictly to the provided template structure. Preserve layout, hierarchy, section order, class names, and ids.")
                    prompt_parts.append("Ensure the template content is wrapped in the .pdf-page structure described above.")
                
                prompt_parts.append(f"\n===== USER REQUEST =====\n{user_input_clean}")
                prompt_parts.append("\n===== OUTPUT REQUIREMENTS =====")
                prompt_parts.append("- Return ONLY valid HTML5 code following the exact structure shown above")
                prompt_parts.append("- Include the complete <!DOCTYPE html>, <html>, <head>, and <body> tags")
                prompt_parts.append("- All content MUST be inside <div class='pdf-page'> elements")
                prompt_parts.append("- Use clean, professional styling within the <style> tag")
                prompt_parts.append("- Do NOT include explanations, markdown formatting, or code blocks")
                prompt_parts.append("- Do NOT use ```html or ``` markers")
                
                full_prompt = "\n".join(prompt_parts)
                pdf_content = await self._call_api(full_prompt, default_model, max_tokens=4000)
            
            title = await title_task
            pdf_content = pdf_content.replace('\x00', '')
            title = title.replace('\x00', '')
            
            # Debug log the content lengths
            logger.debug(f"Content lengths - user_input: {len(user_input_clean)}, pdf_content: {len(pdf_content)}, title: {len(title)}")
            
            if not pdf_content.strip() or "I'm sorry" in pdf_content:
                logger.error("AI response generation failed")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to generate AI response"
                )


            # Parse content for pages and global styles
            soup = BeautifulSoup(pdf_content, 'html.parser')
            styles = [str(s) for s in soup.find_all('style')]
            global_styles = "\n".join(styles) if styles else None
            page_divs = soup.find_all('div', class_='pdf-page')
            
            pages_to_create = []
            if not page_divs and pdf_content.strip():
                 pages_to_create.append(ChatPage(page_number=1, content=f'<div class="pdf-page">{pdf_content}</div>'))
            else:
                 for i, p in enumerate(page_divs):
                     pages_to_create.append(ChatPage(page_number=i+1, content=str(p)))

            new_chat = Chat(
                slug=str(uuid.uuid4()),
                user_id=user_id,
                user_input=user_input_clean,
                pdf_content="", # DEPRECATED: Use ChatPage table
                global_styles=global_styles,
                title=title,
                updated_at=func.now()
            )

            db.add(new_chat)
            db.flush()
            
            for p in pages_to_create:
                p.chat_id = new_chat.id
            db.add_all(pages_to_create)
            
            db.commit()
            db.refresh(new_chat)
            
            # Save initial version
            await self._save_chat_version(db, new_chat.id, pdf_content)

            # Restore pdf_content for immediate return (frontend expects it)
            new_chat.pdf_content = pdf_content
            
            logger.info(f"Chat created successfully: {new_chat.slug}")
            return new_chat

        except HTTPException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Database error in create_chat: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )
        except Exception as e:
            logger.error(f"Unexpected error in create_chat: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred"
            )

    async def _stream_fallback_generation(
        self,
        user_input: str,
        conversation_history: Optional[str],
        document_type: Optional[str],
        template_content: Optional[str],
        template_id: Optional[str],
        num_pages: Optional[int] = None
    ) -> AsyncIterator[str]:
        """Fallback generation using the configured Mistral model."""
        logger.info(f"Initiating Mistral fallback generation (num_pages={num_pages})...")
        
        system_prompt, user_prompt = AIGenerator.get_generation_prompts(
            user_input, conversation_history, document_type, template_content, template_id, num_pages
        )
        
        # Calculate tokens based on page count
        max_tokens = AIGenerator.calculate_tokens_for_pages(num_pages, has_template=bool(template_content))
        logger.info(f"Fallback generation max_tokens set to {max_tokens}")
        
        if not settings.MISTRAL_API_KEY:
            raise Exception("MISTRAL_API_KEY is not configured")

        client = MistralClient(api_key=settings.MISTRAL_API_KEY)
        try:
            stream = await client.chat.stream_async(
                model=settings.MISTRAL_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.5,
                max_tokens=max_tokens,
            )
            async for chunk in stream:
                data = getattr(chunk, "data", None)
                choices = getattr(data, "choices", None) or []
                if choices:
                    content = getattr(getattr(choices[0], "delta", None), "content", None)
                    if isinstance(content, str) and content:
                        yield content
        except Exception as e:
            logger.error(f"Fallback generation error: {e}")
            raise e
        finally:
            pass

    async def stream_chat_generation(
        self,
        db: Session,
        user_id: int,
        user_input: str,
        template_id: Optional[str] = None,
        user_email: Optional[str] = None,
        num_pages: Optional[int] = None,
        file_paths: List[Path] = None,
        youtube_urls: List[str] = None,
        webpage_urls: List[str] = None
    ) -> AsyncIterator[str]:
        try:
            user_input_clean, template_content, document_type = await self._prepare_generation_inputs(
                db, user_id, user_input, template_id, user_email
            )
            # Start title generation in parallel
            title_task = asyncio.create_task(generate_title_from_input(user_input_clean))
            
            chunks: List[str] = []

            async def event_stream() -> AsyncIterator[str]:
                yield self._format_sse_event({"type": "status", "message": "started"})
                try:
                    # Multimodal Check
                    file_paths_safe = file_paths or []
                    youtube_urls_safe = youtube_urls or []
                    webpage_urls_safe = webpage_urls or []
                    is_multimodal = bool(file_paths_safe or youtube_urls_safe or webpage_urls_safe)
                    
                    if is_multimodal:
                        logger.info(f"Using Multimodal Generator ({len(file_paths_safe)} files)")
                        async for chunk in AIGenerator.stream_generate_from_multimodal(
                            file_paths=file_paths_safe,
                            youtube_urls=youtube_urls_safe,
                            webpage_urls=webpage_urls_safe,
                            prompt=user_input_clean
                        ):
                             chunks.append(chunk)
                             yield self._format_sse_event({"type": "chunk", "content": chunk})
                    else:
                         # TEXT ONLY FLOW (Existing)
                         should_use_gemini = True or True

                         if not should_use_gemini:
                             logger.info(f"Using {"mistral"} as primary streaming provider (num_pages={num_pages})")
                             async for chunk in self._stream_fallback_generation(
                                 user_input=user_input_clean,
                                 conversation_history=None,
                                 document_type=document_type,
                                 template_content=template_content,
                                 template_id=template_id,
                                 num_pages=num_pages
                             ):
                                 chunks.append(chunk)
                                 yield self._format_sse_event({"type": "chunk", "content": chunk})
                         else:
                             logger.info(f"Using Gemini as primary streaming provider (num_pages={num_pages})")
                             try:
                                 async for chunk in AIGenerator.stream_generate_document_chunks(
                                     user_input=user_input_clean,
                                     conversation_history=None,
                                     document_type=document_type,
                                     template_content=template_content,
                                     template_id=template_id,
                                     num_pages=num_pages
                                 ):
                                     chunks.append(chunk)
                                     yield self._format_sse_event({"type": "chunk", "content": chunk})
                             except ClientError as e:
                                 if e.code == 429:
                                     logger.warning("Gemini 429 Limit reached. Switching to fallback provider...")
                                     yield self._format_sse_event({"type": "status", "message": "switching_provider"})
                                     
                                     if chunks:
                                         logger.warning("Partial content generated before 429. Clearing and restarting with fallback.")
                                         chunks.clear()
                                     
                                     async for chunk in self._stream_fallback_generation(
                                         user_input=user_input_clean,
                                         conversation_history=None,
                                         document_type=document_type,
                                         template_content=template_content,
                                         template_id=template_id,
                                         num_pages=num_pages
                                     ):
                                         chunks.append(chunk)
                                         yield self._format_sse_event({"type": "chunk", "content": chunk})
                                 else:
                                     raise e

                    combined = "".join(chunks)
                    html_content = ContentFormatter.extract_html_content(combined).replace("\x00", "")
                    
                    # Auto-complete if HTML is incomplete
                    fixed_html, was_incomplete = fix_incomplete_html(html_content)
                    if was_incomplete:
                        logger.warning(f"Streaming generation produced incomplete HTML - auto-fixed. Template: {template_id}")
                        html_content = fixed_html

        
                    # Await title generation here
                    title = await title_task
                    title = title.replace("\x00", "") if title else "Untitled"

                    soup = BeautifulSoup(html_content, 'html.parser')
                    styles = [str(s) for s in soup.find_all('style')]
                    global_styles = "\n".join(styles) if styles else None
                    page_divs = soup.find_all('div', class_='pdf-page')
                    
                    pages_to_create = []
                    if not page_divs and html_content.strip():
                         pages_to_create.append(ChatPage(page_number=1, content=f'<div class="pdf-page">{html_content}</div>'))
                    else:
                         for i, p in enumerate(page_divs):
                             pages_to_create.append(ChatPage(page_number=i+1, content=str(p)))

                    new_chat = Chat(
                        slug=str(uuid.uuid4()),
                        user_id=user_id,
                        user_input=user_input_clean,
                        pdf_content="", # DEPRECATED: Use ChatPage table
                        global_styles=global_styles,
                        title=title,
                        updated_at=func.now()
                    )

                    db.add(new_chat)
                    db.flush()
                    
                    for p in pages_to_create:
                        p.chat_id = new_chat.id
                    db.add_all(pages_to_create)
                    
                    db.commit()
                    db.refresh(new_chat)
                    
                    new_chat.pdf_content = html_content
                    await self._save_chat_version(db, new_chat.id, html_content)
                    payload = self._serialize_chat(new_chat)
                    yield self._format_sse_event({"type": "complete", "chat": payload})

                except Exception as exc:
                    logger.error(
                        f"Streaming chat generation failed for user {user_id}: {exc}",
                        exc_info=True
                    )
                    db.rollback()
                    yield self._format_sse_event(
                        {
                            "type": "error",
                            "message": "Generation failed. Please try again.",
                        }
                    )
                    return
                finally:
                    chunks.clear()

            return event_stream()

        except HTTPException:
            raise
        except Exception as exc:
            logger.error(
                f"Failed to initiate streaming chat generation for user {user_id}: {exc}",
                exc_info=True
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to start streaming generation"
            )

    async def stream_chat_update(
        self,
        db: Session,
        user_id: int,
        slug: str,
        user_input: str,
        user_email: Optional[str] = None
    ) -> AsyncIterator[str]:
        """Stream an update to an existing chat."""
        try:
            # Get the existing chat
            try:
                chat = await self.get_chat_by_slug(db, user_id, slug)
            except HTTPException as e:
                if e.status_code == status.HTTP_404_NOT_FOUND:
                    # Check if chat exists but is shared/public
                    chat = db.query(Chat).filter(Chat.slug == slug).first()
                    if chat:
                        is_public = chat.is_public
                        is_shared = False
                        share = None
                        if not is_public and user_email:
                            share = db.query(ChatShare).filter(
                                ChatShare.chat_id == chat.id,
                                ChatShare.shared_with_email == user_email
                            ).first()
                            is_shared = share is not None
                        
                        if is_public or is_shared:
                            # Check access level for shared chat
                            if is_shared and share and share.access_level in ["edit", "full"]:
                                # Allow update
                                pass
                            else:
                                raise HTTPException(
                                    status_code=status.HTTP_403_FORBIDDEN,
                                    detail="You are viewing a shared chat. Please make a copy to edit."
                                )
                        else:
                            raise e
                    else:
                        raise e
                else:
                    raise e
            chat_id = chat.id
            old_pdf_content = chat.pdf_content
            
            
            await self.validator.validate_user_input(user_input)
            
            # Prepare combined context for update
            combined_context = f"""
You are an expert HTML document editor. Update the existing HTML document based on the user's request.

===== CRITICAL FORMATTING REQUIREMENTS =====
The HTML MUST maintain this structure:
- All content inside <div class='pdf-page'> elements
- Each .pdf-page is 794px × 1123px with 38px padding (A4 at 96 DPI)
- Content area is 718px × 1047px
- Include complete <!DOCTYPE html>, <html>, <head> with styles, and <body>
- Split content across multiple pages if needed

===== PREVIOUS DOCUMENT STRUCTURE =====
{old_pdf_content}

===== USER REQUEST =====
{user_input}

===== OUTPUT REQUIREMENTS =====
- Return ONLY the updated HTML5 code
- Preserve the .pdf-page structure
- Do NOT include explanations, markdown, or code blocks
- Do NOT use ```html or ``` markers
"""
            
            chunks: List[str] = []

            async def event_stream() -> AsyncIterator[str]:
                yield self._format_sse_event({"type": "status", "message": "started"})
                try:
                    should_use_gemini = True or True

                    if not should_use_gemini:
                        logger.info(f"Using {"mistral"} for streaming update")
                        async for chunk in self._stream_fallback_generation(
                            user_input=combined_context,
                            conversation_history=None,
                            document_type=None,
                            template_content=None,
                            template_id=None
                        ):
                            chunks.append(chunk)
                            yield self._format_sse_event({"type": "chunk", "content": chunk})
                    else:
                        logger.info("Using Gemini for streaming update")
                        try:
                            async for chunk in AIGenerator.stream_generate_document_chunks(
                                user_input=combined_context,
                                conversation_history=None,
                                document_type=None,
                                template_content=None,
                                template_id=None
                            ):
                                chunks.append(chunk)
                                yield self._format_sse_event({"type": "chunk", "content": chunk})
                        except ClientError as e:
                            if e.code == 429:
                                logger.warning("Gemini 429 Limit reached during update. Switching to fallback...")
                                yield self._format_sse_event({"type": "status", "message": "switching_provider"})
                                
                                if chunks:
                                    chunks.clear()
                                
                                async for chunk in self._stream_fallback_generation(
                                    user_input=combined_context,
                                    conversation_history=None,
                                    document_type=None,
                                    template_content=None,
                                    template_id=None
                                ):
                                    chunks.append(chunk)
                                    yield self._format_sse_event({"type": "chunk", "content": chunk})
                            else:
                                raise e
                    
                    combined = "".join(chunks)
                    html_content = ContentFormatter.extract_html_content(combined).replace("\x00", "")
                    
                    if not html_content.strip() or "I'm sorry" in html_content:
                        logger.error("AI response generation failed during streaming update")
                        yield self._format_sse_event({
                            "type": "error",
                            "message": "Failed to generate AI response"
                        })
                        return
                    
                    
                            
                    # Re-query the chat to ensure it's attached to the session
                    chat = db.query(Chat).filter(Chat.id == chat_id).first()
                    if not chat:
                        logger.error(f"Chat {chat_id} not found after streaming")
                        yield self._format_sse_event({
                            "type": "error",
                            "message": "Chat not found"
                        })
                        return
                    
                    # Update the chat with new content
                    chat.user_input = user_input
                    chat.pdf_content = html_content
                    
                    # Save version if content changed
                    if chat.pdf_content != old_pdf_content:
                        await self._save_chat_version(db, chat.id, chat.pdf_content)
                    
                    chat.updated_at = func.now()
                    db.commit()
                    db.refresh(chat)
                    
                    payload = self._serialize_chat(chat)
                    yield self._format_sse_event({"type": "complete", "chat": payload})
                    
                except Exception as exc:
                    logger.error(
                        f"Streaming chat update failed for user {user_id}, chat {slug}: {exc}",
                        exc_info=True
                    )
                    db.rollback()
                    yield self._format_sse_event({
                        "type": "error",
                        "message": "Update failed. Please try again."
                    })
                    return
                finally:
                    chunks.clear()
            
            return event_stream()
        
        except HTTPException:
            raise
        except Exception as exc:
            logger.error(
                f"Failed to initiate streaming chat update for user {user_id}, chat {slug}: {exc}",
                exc_info=True
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to start streaming update"
            )


    async def get_specific_chat(self, db: Session, user_id: int, slug: str) -> dict:
        """Get a specific chat by slug, ensuring ownership or access."""
        chat = await self.get_chat_by_slug(db, user_id, slug)
        return self._serialize_chat(chat)

    async def stream_add_pages(
        self,
        db: Session,
        user_id: int,
        slug: str,
        user_input: str,
        num_pages: int = 1,
        current_page: Optional[int] = None,
        insert_after: bool = True,
        user_email: Optional[str] = None
    ) -> AsyncIterator[str]:
        """
        Stream generation of new pages to insert into an existing document.
        
        Args:
            current_page: Reference page number (1-based). If None, appends at end.
            insert_after: If True, insert after current_page. If False, insert before.
        """
        try:
            # Get the existing chat
            try:
                chat = await self.get_chat_by_slug(db, user_id, slug)
            except HTTPException as e:
                if e.status_code == status.HTTP_404_NOT_FOUND:
                    # Check if chat exists but is shared with edit access
                    chat = db.query(Chat).filter(Chat.slug == slug).first()
                    if chat and user_email:
                        share = db.query(ChatShare).filter(
                            ChatShare.chat_id == chat.id,
                            ChatShare.shared_with_email == user_email
                        ).first()
                        if share and share.access_level in ["edit", "full"]:
                            pass  # Allow add-pages
                        else:
                            raise HTTPException(
                                status_code=status.HTTP_403_FORBIDDEN,
                                detail="You don't have permission to add pages to this document."
                            )
                    else:
                        raise e
                else:
                    raise e
            
            # Analyze existing pages (Modular Architecture)
            chat_id = chat.id
            total_pages = db.query(ChatPage).filter(ChatPage.chat_id == chat.id).count()
            
            context_page_num = current_page
            if current_page is None:    
                # Append mode: context is last page
                last_page = db.query(ChatPage).filter(ChatPage.chat_id == chat.id).order_by(ChatPage.page_number.desc()).first()
                context_html = last_page.content if last_page else ""
            else:
                # Insert mode
                if not insert_after:
                    context_page_num = current_page - 1 
                
                if context_page_num and context_page_num > 0:
                     page = db.query(ChatPage).filter(ChatPage.chat_id == chat.id, ChatPage.page_number == context_page_num).first()
                     context_html = page.content if page else ""
                else:
                     context_html = "" # Beginning of doc
            
            # Validate total page limit (max 70)
            MAX_TOTAL_PAGES = 70
            if total_pages + num_pages > MAX_TOTAL_PAGES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cannot add {num_pages} page(s). Document already has {total_pages} pages (max {MAX_TOTAL_PAGES})."
                )
            
            # Validate current_page is within bounds
            if current_page is not None and current_page > total_pages:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"current_page ({current_page}) exceeds current page count ({total_pages})."
                )
            
            position_desc = f"{'after' if insert_after else 'before'} page {current_page}" if current_page else "at end"
            logger.info(f"Adding {num_pages} page(s) {position_desc} (current: {total_pages} pages)")
            
            chunks: List[str] = []

            async def event_stream() -> AsyncIterator[str]:
                yield self._format_sse_event({"type": "status", "message": "started"})
                try:
                    # Stream new pages generation
                    async for chunk in AIGenerator.stream_add_pages(
                        last_page_html=context_html,
                        user_input=user_input,
                        num_pages=num_pages
                    ):
                        chunks.append(chunk)
                        yield self._format_sse_event({"type": "chunk", "content": chunk})
                    
                    # Combine new pages HTML
                    new_pages_html = "".join(chunks).strip()
                    
                    # Clean up any unwanted tags that might have slipped through
                    new_pages_html = self._clean_appended_html(new_pages_html)
                    
                    if not new_pages_html or "<div" not in new_pages_html.lower():
                        logger.error("Add-pages generation returned no valid HTML")
                        yield self._format_sse_event({
                            "type": "error",
                            "message": "Failed to generate new pages"
                        })
                        return
                    
                    
                            
                    # Re-query the chat
                    chat = db.query(Chat).filter(Chat.id == chat_id).first()
                    if not chat:
                        yield self._format_sse_event({
                            "type": "error",
                            "message": "Chat not found"
                        })
                        return
                    
                    # Insert new pages at the specified position
                    # Parse new pages
                    soup = BeautifulSoup(new_pages_html, 'html.parser')
                    new_page_divs = soup.find_all('div', class_='pdf-page')
                    
                    if not new_page_divs and new_pages_html.strip():
                         # Fallback wrap
                         new_pages_content = [f'<div class="pdf-page">{new_pages_html}</div>']
                    else:
                         new_pages_content = [str(p) for p in new_page_divs]
                    
                    num_new_pages = len(new_pages_content)
                    
                    # Shift existing pages
                    insertion_point = (current_page + 1) if (current_page is not None and insert_after) else (current_page if current_page is not None else total_pages + 1)
                    
                    pages_to_shift = db.query(ChatPage).filter(
                        ChatPage.chat_id == chat_id,
                        ChatPage.page_number >= insertion_point
                    ).all()
                    
                    for p in pages_to_shift:
                        p.page_number += num_new_pages
                    
                    # Insert new pages
                    new_chat_pages = []
                    for i, content in enumerate(new_pages_content):
                        new_chat_pages.append(ChatPage(
                            chat_id=chat_id,
                            page_number=insertion_point + i,
                            content=content
                        ))
                    
                    db.add_all(new_chat_pages)
                    
                    chat.updated_at = func.now()
                    # Re-assemble content for legacy/cache and versioning
                    # We need to commit first to get order correct? 
                    # Actually we have objects in session.
                    # But _assemble_html queries DB? No, it uses relationships.
                    # Updates to relationship might not be reflected until commit/refresh.
                    # So we construct manually or commit first.
                    
                    # Store empty for now to force assembly on read, or assemble here?
                    # Let's assemble.
                    # But simpler: just save version with assembled content AFTER commit.
                    
                    # chat.pdf_content = updated_content # Removed monolithic update logic
                    
                    db.commit()
                    db.refresh(chat)
                    
                    # Assemble for versioning
                    full_content = self._assemble_html(chat)
                    chat.pdf_content = full_content
                    await self._save_chat_version(db, chat.id, full_content)
                    
                    payload = self._serialize_chat(chat)
                    yield self._format_sse_event({"type": "complete", "chat": payload})
                    
                except Exception as exc:
                    logger.error(
                        f"Streaming add-pages failed for user {user_id}, chat {slug}: {exc}",
                        exc_info=True
                    )
                    db.rollback()
                    yield self._format_sse_event({
                        "type": "error",
                        "message": "Add pages failed. Please try again."
                    })
                    return
                finally:
                    chunks.clear()
            
            return event_stream()
        
        except HTTPException:
            raise
        except Exception as exc:
            logger.error(
                f"Failed to initiate add-pages for user {user_id}, chat {slug}: {exc}",
                exc_info=True
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to start add-pages generation"
            )

    async def stream_edit_page(
        self,
        db: Session,
        user_id: int,
        slug: str,
        user_input: str,
        page_number: int,
        user_email: Optional[str] = None
    ) -> AsyncIterator[str]:
        """
        Stream generation of a replacement for a single page.
        
        Args:
            page_number: 1-based page number to edit
            user_input: Instructions for how to edit the page
        """
        try:
            # Get the existing chat
            try:
                chat = await self.get_chat_by_slug(db, user_id, slug)
            except HTTPException as e:
                if e.status_code == status.HTTP_404_NOT_FOUND:
                    # Check if chat exists but is shared with edit access
                    chat = db.query(Chat).filter(Chat.slug == slug).first()
                    if chat and user_email:
                        share = db.query(ChatShare).filter(
                            ChatShare.chat_id == chat.id,
                            ChatShare.shared_with_email == user_email
                        ).first()
                        if share and share.access_level in ["edit", "full"]:
                            pass  # Allow edit-page
                        else:
                            raise HTTPException(
                                status_code=status.HTTP_403_FORBIDDEN,
                                detail="You don't have permission to edit this document."
                            )
                    else:
                        raise e
                else:
                    raise e
            
            chat_id = chat.id
            old_pdf_content = chat.pdf_content
            
            
            await self.validator.validate_user_input(user_input)
            
            # Extract pages (Modular Architecture)
            total_pages = db.query(ChatPage).filter(ChatPage.chat_id == chat.id).count()
            target_page_obj = db.query(ChatPage).filter(ChatPage.chat_id == chat.id, ChatPage.page_number == page_number).first()
            
            if not target_page_obj:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"page_number ({page_number}) invalid or exceeds usage ({total_pages})."
                )
            target_page = target_page_obj.content
            
            prev_page_obj = db.query(ChatPage).filter(ChatPage.chat_id == chat.id, ChatPage.page_number == page_number - 1).first()
            prev_page = prev_page_obj.content if prev_page_obj else None
            
            next_page_obj = db.query(ChatPage).filter(ChatPage.chat_id == chat.id, ChatPage.page_number == page_number + 1).first()
            next_page = next_page_obj.content if next_page_obj else None
            
            if target_page is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"page_number ({page_number}) exceeds current page count ({total_pages})."
                )
            
            logger.info(f"Editing page {page_number} of {total_pages} pages")
            
            chunks: List[str] = []

            async def event_stream() -> AsyncIterator[str]:
                yield self._format_sse_event({"type": "status", "message": "started"})
                try:
                    # Stream page edit generation
                    async for chunk in AIGenerator.stream_edit_page(
                        target_page_html=target_page,
                        prev_page_html=prev_page,
                        next_page_html=next_page,
                        user_input=user_input
                    ):
                        chunks.append(chunk)
                        yield self._format_sse_event({"type": "chunk", "content": chunk})
                    
                    # Combine edited page HTML
                    new_page_html = "".join(chunks).strip()
                    
                    # Clean up any unwanted tags
                    new_page_html = self._clean_appended_html(new_page_html)
                    
                    if not new_page_html or "<div" not in new_page_html.lower():
                        logger.error("Edit-page generation returned no valid HTML")
                        yield self._format_sse_event({
                            "type": "error",
                            "message": "Failed to generate edited page"
                        })
                        return
                    
                    
                            
                    # Re-query the chat
                    chat = db.query(Chat).filter(Chat.id == chat_id).first()
                    if not chat:
                        yield self._format_sse_event({
                            "type": "error",
                            "message": "Chat not found"
                        })
                        return
                    
                    # Replace the target page
                    # Replace the target page
                    # Fetch fresh object or use existing if session open
                    # Verify chat still exists
                    chat = db.query(Chat).filter(Chat.id == chat_id).first()
                    page_obj = db.query(ChatPage).filter(ChatPage.chat_id == chat_id, ChatPage.page_number == page_number).first()
                    
                    if page_obj:
                        page_obj.content = new_page_html
                        chat.updated_at = func.now()
                        
                        db.commit()
                        db.refresh(chat)
                        
                        # Assemble for versioning
                        full_content = self._assemble_html(chat)
                        chat.pdf_content = full_content
                        await self._save_chat_version(db, chat.id, full_content)
                    
                    db.commit()
                    db.refresh(chat)
                    
                    payload = self._serialize_chat(chat)
                    yield self._format_sse_event({"type": "complete", "chat": payload})
                    
                except Exception as exc:
                    logger.error(
                        f"Streaming edit-page failed for user {user_id}, chat {slug}: {exc}",
                        exc_info=True
                    )
                    db.rollback()
                    yield self._format_sse_event({
                        "type": "error",
                        "message": "Edit page failed. Please try again."
                    })
                    return
                finally:
                    chunks.clear()
            
            return event_stream()
        
        except HTTPException:
            raise
        except Exception as exc:
            logger.error(
                f"Failed to initiate edit-page for user {user_id}, chat {slug}: {exc}",
                exc_info=True
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to start edit-page generation"
            )

    async def delete_page(
        self,
        db: Session,
        user_id: int,
        slug: str,
        page_number: int,
        user_email: Optional[str] = None
    ) -> Chat:
        """
        Delete a specific page from the document.
        
        Args:
            page_number: 1-based page number to delete
            
        Returns:
            Updated Chat object
        """
        try:
            # Get the existing chat
            try:
                chat = await self.get_chat_by_slug(db, user_id, slug)
            except HTTPException as e:
                if e.status_code == status.HTTP_404_NOT_FOUND:
                    # Check if chat exists but is shared with edit access
                    chat = db.query(Chat).filter(Chat.slug == slug).first()
                    if chat and user_email:
                        share = db.query(ChatShare).filter(
                            ChatShare.chat_id == chat.id,
                            ChatShare.shared_with_email == user_email
                        ).first()
                        if share and share.access_level in ["edit", "full"]:
                            pass  # Allow delete-page
                        else:
                            raise HTTPException(
                                status_code=status.HTTP_403_FORBIDDEN,
                                detail="You don't have permission to delete pages from this document."
                            )
                    else:
                        raise e
                else:
                    raise e
            
            # Delete logic (Modular Architecture)
            total_pages = db.query(ChatPage).filter(ChatPage.chat_id == chat.id).count()
            
            if page_number < 1 or page_number > total_pages:
                 raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid page number {page_number}. Document has {total_pages} pages."
                )
            
            if total_pages <= 1:
                raise HTTPException(
                     status_code=status.HTTP_400_BAD_REQUEST,
                     detail="Cannot delete the last remaining page."
                )
            
            # Delete page
            db.query(ChatPage).filter(
                ChatPage.chat_id == chat.id,
                ChatPage.page_number == page_number
            ).delete()
            
            # Shift subsequent pages
            pages_to_shift = db.query(ChatPage).filter(
                ChatPage.chat_id == chat.id,
                ChatPage.page_number > page_number
            ).all()
            
            for p in pages_to_shift:
                p.page_number -= 1
            
            chat.updated_at = func.now()
            db.commit()
            db.refresh(chat)
            
            full_content = self._assemble_html(chat)
            chat.pdf_content = full_content
            await self._save_chat_version(db, chat.id, full_content)
            
            return chat

        except HTTPException:
            raise
        except Exception as exc:
            logger.error(f"Failed to delete page for user {user_id}, chat {slug}: {exc}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete page"
            )

    async def swap_pages(
        self,
        db: Session,
        user_id: int,
        slug: str,
        page_a: int,
        page_b: int,
        user_email: Optional[str] = None
    ) -> Chat:
        """
        Swap the positions of two pages in a document.
        
        Args:
            page_a: 1-based page number of first page
            page_b: 1-based page number of second page
            
        Returns:
            Updated Chat object
        """
        try:
            # Get the existing chat
            try:
                chat = await self.get_chat_by_slug(db, user_id, slug)
            except HTTPException as e:
                if e.status_code == status.HTTP_404_NOT_FOUND:
                    # Check if chat exists but is shared with edit access
                    chat = db.query(Chat).filter(Chat.slug == slug).first()
                    if chat and user_email:
                        share = db.query(ChatShare).filter(
                            ChatShare.chat_id == chat.id,
                            ChatShare.shared_with_email == user_email
                        ).first()
                        if share and share.access_level in ["edit", "full"]:
                            pass  # Allow swap
                        else:
                            raise HTTPException(
                                status_code=status.HTTP_403_FORBIDDEN,
                                detail="You don't have permission to reorder pages in this document."
                            )
                    else:
                        raise e
                else:
                    raise e
            
            # Validate page numbers
            total_pages = db.query(ChatPage).filter(ChatPage.chat_id == chat.id).count()
            
            if page_a < 1 or page_a > total_pages:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid page number {page_a}. Document has {total_pages} pages."
                )
            
            if page_b < 1 or page_b > total_pages:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid page number {page_b}. Document has {total_pages} pages."
                )
            
            if page_a == page_b:
                # No-op, same page
                return chat
            
            # Fetch both pages
            page_obj_a = db.query(ChatPage).filter(
                ChatPage.chat_id == chat.id,
                ChatPage.page_number == page_a
            ).first()
            
            page_obj_b = db.query(ChatPage).filter(
                ChatPage.chat_id == chat.id,
                ChatPage.page_number == page_b
            ).first()
            
            if not page_obj_a or not page_obj_b:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="One or both pages not found."
                )
            
            # Swap page numbers
            page_obj_a.page_number, page_obj_b.page_number = page_b, page_a
            
            chat.updated_at = func.now()
            db.commit()
            db.refresh(chat)
            
            # Reassemble and save version
            full_content = self._assemble_html(chat)
            chat.pdf_content = full_content
            await self._save_chat_version(db, chat.id, full_content)
            
            return chat

        except HTTPException:
            raise
        except Exception as exc:
            logger.error(f"Failed to swap pages for user {user_id}, chat {slug}: {exc}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to swap pages"
            )

    def _extract_page_context(self, html_content: str, page_number: int) -> tuple[Optional[str], Optional[str], Optional[str], int]:
        """
        Extract target page and surrounding pages for context.
        
        Args:
            html_content: The full HTML document
            page_number: 1-based page number
            
        Returns:
            (target_page_html, prev_page_html, next_page_html, total_pages)
        """
        try:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(html_content, 'html.parser')
            pages = soup.find_all('div', class_='pdf-page')
            total_pages = len(pages)
            
            if page_number < 1 or page_number > total_pages:
                return (None, None, None, total_pages)
            
            idx = page_number - 1
            target_page = str(pages[idx])
            prev_page = str(pages[idx - 1]) if idx > 0 else None
            next_page = str(pages[idx + 1]) if idx < total_pages - 1 else None
            
            return (target_page, prev_page, next_page, total_pages)
            
        except ImportError:
            logger.warning("BeautifulSoup not available")
            return (None, None, None, 0)
        except Exception as e:
            logger.warning(f"Error extracting page context: {e}")
            return (None, None, None, 0)

    def _replace_page_in_html(self, existing_html: str, new_page_html: str, page_number: int) -> str:
        """
        Replace a specific page in the HTML document.
        
        Args:
            existing_html: The full HTML document
            new_page_html: HTML string containing the replacement pdf-page div
            page_number: 1-based page number to replace
            
        Returns:
            Updated HTML with the page replaced
        """
        try:
            from bs4 import BeautifulSoup
            
            soup = BeautifulSoup(existing_html, 'html.parser')
            existing_pages = soup.find_all('div', class_='pdf-page')
            
            if page_number < 1 or page_number > len(existing_pages):
                logger.warning(f"Invalid page_number {page_number} for replacement")
                return existing_html
            
            # Parse new page
            new_soup = BeautifulSoup(new_page_html, 'html.parser')
            new_page = new_soup.find('div', class_='pdf-page')
            
            if not new_page:
                logger.warning("No pdf-page div found in new_page_html")
                return existing_html
            
            # Replace the target page
            target_page = existing_pages[page_number - 1]
            target_page.replace_with(new_page)
            
            return str(soup)
            
        except ImportError:
            logger.warning("BeautifulSoup not available for page replacement")
            return existing_html
        except Exception as e:
            logger.error(f"Error replacing page: {e}")
            return existing_html

    def _remove_page_from_html(self, existing_html: str, page_number: int) -> str:
        """
        Remove a specific page from the HTML document.
        
        Args:
            existing_html: The full HTML document
            page_number: 1-based page number to remove
            
        Returns:
            Updated HTML with the page removed
        """
        try:
            from bs4 import BeautifulSoup
            
            soup = BeautifulSoup(existing_html, 'html.parser')
            existing_pages = soup.find_all('div', class_='pdf-page')
            
            if page_number < 1 or page_number > len(existing_pages):
                logger.warning(f"Invalid page_number {page_number} for deletion")
                return existing_html
            
            # Remove the target page
            target_page = existing_pages[page_number - 1]
            target_page.decompose()
            
            return str(soup)
            
        except ImportError:
            logger.warning("BeautifulSoup not available for page deletion")
            return existing_html
        except Exception as e:
            logger.error(f"Error deleting page: {e}")
            return existing_html


    MAX_TOKEN_LIMIT = 12000

    def _assemble_html(self, chat: Chat) -> str:
        """
        Reconstruct full HTML from ChatPage records and global styles.
        """
        # If no pages, fallback to legacy pdf_content (though migration should have covered it)
        # Note: We rely on the relationship loading pages.
        if not chat.pages and chat.pdf_content:
             return chat.pdf_content
             
        # Sort pages (relationship should be ordered, but verify)
        pages = sorted(chat.pages, key=lambda p: p.page_number)
        
        pages_html = "\n".join([page.content for page in pages])
        
        # Inject global styles if present
        if chat.global_styles:
             # simple injection, or use soup? 
             # We want to ensure styles are in <head> or at least present.
             # If pages are just divs, we need to wrap them?
             # Actually, _assemble_html implies returning the FULL document (doctype to html).
             # But migration saved inner HTML in ChatPage.content.
             # And global_styles from <style>.
             # So we need to reconstruct the wrapper!
             pass
        
        # Reconstruct wrapper
        # We need a standard template.
        # Wait, the prompt asked for full HTML.
        # My migration extracted inner content.
        # I should output valid HTML.
        
        styles_content = chat.global_styles if chat.global_styles else ""
        
        # Basic HTML skeleton matching the prompt
        return f"""<!DOCTYPE html>
<html>
<head>
  <style>
    /* A4 Page Dimensions at 96 DPI */
    .pdf-page {{
      width: 794px;
      height: 1123px;
      margin: 0 auto 20px;
      padding: 38px;
      box-sizing: border-box;
      background: white;
      position: relative;
      page-break-after: always;
    }}
    body {{
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }}
    {styles_content}
  </style>
</head>
<body>
{pages_html}
</body>
</html>"""

    def _sync_pages_from_html(self, db: Session, chat: Chat, html_content: str) -> int:
        """
        Parse full HTML, extract pages, and strictly synchronize ChatPage records.
        Deletes all existing pages and recreates them to ensure 1:1 mapping.
        """
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            page_divs = soup.find_all('div', class_='pdf-page')
            
            if not page_divs:
                logger.warning("No .pdf-page divs found during sync. Wrapping content.")
                # Fallback: wrap everything in one page
                wrapper = f'<div class="pdf-page">{html_content}</div>'
                page_divs = [BeautifulSoup(wrapper, 'html.parser').find('div')]
            
            # Delete existing pages
            db.query(ChatPage).filter(ChatPage.chat_id == chat.id).delete()
            
            # Create new pages
            new_pages = []
            for idx, div in enumerate(page_divs):
                # Ensure we store the string representation of the specific page div
                page_content = str(div)
                new_page = ChatPage(
                    chat_id=chat.id,
                    page_number=idx + 1,
                    content=page_content
                )
                db.add(new_page)
                new_pages.append(new_page)
            
            db.flush() # Ensure IDs are generated if needed, but commit is handled by caller
            logger.info(f"Synced {len(new_pages)} pages for chat {chat.id}")
            return len(new_pages)
            
        except Exception as e:
            logger.error(f"Failed to sync pages from HTML: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to process document structure"
            )

    def _get_page_context(self, html_content: str, after_page: Optional[int] = None) -> tuple[str, int]:
        """
        Get context HTML and total page count for adding new pages.
        
        Args:
            html_content: The full HTML document
            after_page: 1-based page number after which to insert. None means end.
            
        Returns:
            (context_html, total_pages): The context page HTML and total page count
        """
        try:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(html_content, 'html.parser')
            pages = soup.find_all('div', class_='pdf-page')
            total_pages = len(pages)
            
            if total_pages == 0:
                # No pages found, return truncated content as context
                return (html_content[-3000:] if len(html_content) > 3000 else html_content, 0)
            
            # Determine which page to use as context
            if after_page is not None and 1 <= after_page <= total_pages:
                # Use the specified page as context (1-based -> 0-based)
                context_page = pages[after_page - 1]
            else:
                # Use the last page as context
                context_page = pages[-1]
            
            return (str(context_page), total_pages)
            
        except ImportError:
            logger.warning("BeautifulSoup not available, using regex fallback")
            import re
            pages = re.findall(r'<div\s+class=["\']pdf-page["\'][^>]*>.*?</div>', html_content, re.DOTALL | re.IGNORECASE)
            total_pages = len(pages)
            if pages:
                return (pages[-1], total_pages)
            return (html_content[-3000:] if len(html_content) > 3000 else html_content, 0)
        except Exception as e:
            logger.warning(f"Error analyzing pages: {e}")
            return (html_content[-3000:] if len(html_content) > 3000 else html_content, 0)

    def _clean_appended_html(self, html: str) -> str:
        """Clean HTML that should only contain pdf-page divs."""
        # Remove any DOCTYPE, html, head, body tags that shouldn't be there
        import re
        html = re.sub(r'<!DOCTYPE[^>]*>', '', html, flags=re.IGNORECASE)
        html = re.sub(r'</?html[^>]*>', '', html, flags=re.IGNORECASE)
        html = re.sub(r'<head>.*?</head>', '', html, flags=re.IGNORECASE | re.DOTALL)
        html = re.sub(r'</?body[^>]*>', '', html, flags=re.IGNORECASE)
        html = re.sub(r'```html?', '', html, flags=re.IGNORECASE)
        html = re.sub(r'```', '', html)
        return html.strip()

    def _insert_pages_into_html(self, existing_html: str, new_pages_html: str, current_page: Optional[int] = None, insert_after: bool = True) -> str:
        """
        Insert new pages into existing HTML document at the specified position.
        
        Args:
            existing_html: The full HTML document
            new_pages_html: HTML string containing new pdf-page divs
            current_page: 1-based reference page number. If None, appends at end.
            insert_after: If True, insert after current_page. If False, insert before.
            
        Returns:
            Updated HTML with new pages inserted
        """
        try:
            from bs4 import BeautifulSoup
            
            soup = BeautifulSoup(existing_html, 'html.parser')
            existing_pages = soup.find_all('div', class_='pdf-page')
            
            if not existing_pages:
                # No existing pages, just append to body
                body = soup.find('body')
                if body:
                    new_soup = BeautifulSoup(new_pages_html, 'html.parser')
                    for new_page in new_soup.find_all('div', class_='pdf-page'):
                        body.append(new_page)
                    return str(soup)
                else:
                    # Fallback: append at the end
                    return existing_html + "\n\n" + new_pages_html
            
            # Parse new pages
            new_soup = BeautifulSoup(new_pages_html, 'html.parser')
            new_pages = new_soup.find_all('div', class_='pdf-page')
            
            if not new_pages:
                logger.warning("No pdf-page divs found in new_pages_html")
                return existing_html
            
            # Determine insertion point based on current_page and insert_after
            if current_page is not None and 1 <= current_page <= len(existing_pages):
                target_page = existing_pages[current_page - 1]
                if insert_after:
                    # Insert after current_page
                    for new_page in reversed(new_pages):
                        target_page.insert_after(new_page)
                else:
                    # Insert before current_page
                    for new_page in reversed(new_pages):
                        target_page.insert_before(new_page)
            else:
                # Default: Append after last page
                target_page = existing_pages[-1]
                for new_page in new_pages:
                    target_page.insert_after(new_page)
                    target_page = new_page  # Chain insertions
            
            return str(soup)
            
        except ImportError:
            logger.warning("BeautifulSoup not available, using append fallback")
            return self._append_pages_fallback(existing_html, new_pages_html)
        except Exception as e:
            logger.error(f"Error inserting pages: {e}")
            return self._append_pages_fallback(existing_html, new_pages_html)
    
    def _append_pages_fallback(self, existing_html: str, new_pages_html: str) -> str:
        """Fallback append method when BeautifulSoup fails."""
        body_close_idx = existing_html.lower().rfind('</body>')
        if body_close_idx != -1:
            return existing_html[:body_close_idx] + "\n\n" + new_pages_html + "\n" + existing_html[body_close_idx:]
        
        html_close_idx = existing_html.lower().rfind('</html>')
        if html_close_idx != -1:
            return existing_html[:html_close_idx] + "\n\n" + new_pages_html + "\n" + existing_html[html_close_idx:]
        
        return existing_html + "\n\n" + new_pages_html

    async def get_chat_history(
        self,
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[Chat], int]:
        """Retrieve user's chat history with pagination.
        Returns chats and the total count for pagination metadata."""
        try:
            if skip < 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Skip value cannot be negative"
                )
            if limit < 1 or limit > 100:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Limit must be between 1 and 100"
                )

            query = db.query(Chat).filter(Chat.user_id == user_id)
            total = query.count()

            chats = query.order_by(
                Chat.updated_at.desc().nullslast(),
                Chat.created_at.desc(),
                Chat.id.desc()
            ).offset(skip).limit(limit).all()

            # Populate unread count for each chat
            for chat in chats:
                chat.unread_count = self._calculate_unread_count(db, chat.id, user_id)

            logger.debug(f"Retrieved {len(chats)} chats for user {user_id}")
            return chats, total

        except SQLAlchemyError as e:
            logger.error(f"Database error in get_chat_history: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )

    
    async def update_chat(
        self,
        db: Session,
        user_id: int,
        slug: str,
        chat_update: ChatUpdate,
        skip_ai_generation: bool = False,
        user_email: str = None
    ) -> Chat:
        """Update an existing chat, optionally generating new AI content."""
        try:
            logger.info(f"Updating chat {slug} for user {user_id}")
            try:
                chat = await self.get_chat_by_slug(db, user_id, slug)
            except HTTPException as e:
                if e.status_code == status.HTTP_404_NOT_FOUND:
                    # Check if chat exists but is shared/public
                    chat = db.query(Chat).filter(Chat.slug == slug).first()
                    if chat:
                        is_public = chat.is_public
                        is_shared = False
                        share = None
                        if not is_public and user_email:
                            share = db.query(ChatShare).filter(
                                ChatShare.chat_id == chat.id,
                                ChatShare.shared_with_email == user_email
                            ).first()
                            is_shared = share is not None
                        
                        if is_public or is_shared:
                            # Check access level for shared chat
                            if is_shared and share and share.access_level in ["edit", "full"]:
                                # Allow update
                                pass
                            else:
                                raise HTTPException(
                                    status_code=status.HTTP_403_FORBIDDEN,
                                    detail="You are viewing a shared chat. Please make a copy to edit."
                                )
                        else:
                            raise e
                    else:
                        raise e
                else:
                    raise e
            
            # Store old PDF content before updating
            old_pdf_content = chat.pdf_content

            if chat_update.user_input is not None:
                await self.validator.validate_user_input(chat_update.user_input)
                chat.user_input = chat_update.user_input
                
                if not skip_ai_generation and chat_update.pdf_content is None:
                            
                    # 1. Smart Patching Analysis
                    total_pages_count = db.query(ChatPage).filter(ChatPage.chat_id == chat.id).count()
                    
                    # Default to global if 0 pages (shouldn't happen for valid docs, but safety)
                    edit_scope = await AIGenerator.analyze_edit_scope(chat_update.user_input, total_pages_count) if total_pages_count > 0 else EditScope(scope="global", reasoning="No pages found")
                    
                    logger.info(f"Smart Patching Decision: {edit_scope.scope} ({edit_scope.reasoning})")
                    
                    # 2. Targeted Patching Path
                    if edit_scope.scope == "specific_pages" and edit_scope.involved_pages and True:
                         logger.info(f"Performing Targeted Patching on pages: {edit_scope.involved_pages}")

                         # Map existing pages for easy access
                         # Ensure we query fresh to avoid stale objects
                         current_pages = db.query(ChatPage).filter(ChatPage.chat_id == chat.id).all()
                         pages_map = {p.page_number: p for p in current_pages}
                         
                         pages_updated_count = 0
                         
                         for page_num in edit_scope.involved_pages:
                            if page_num not in pages_map:
                                logger.warning(f"Target page {page_num} not found. Skipping.")
                                continue
                            
                            target_page = pages_map[page_num]
                            
                            # Get Context
                            prev_html = pages_map.get(page_num - 1).content if (page_num - 1) in pages_map else None
                            next_html = pages_map.get(page_num + 1).content if (page_num + 1) in pages_map else None
                            
                            logger.info(f"Patching page {page_num}...")
                            
                            try:
                                # Stream generation for this page
                                new_page_content_parts = []
                                async for chunk in AIGenerator.stream_edit_page(
                                    target_page_html=target_page.content,
                                    prev_page_html=prev_html,
                                    next_page_html=next_html,
                                    user_input=chat_update.user_input
                                ):
                                     new_page_content_parts.append(chunk)
                                
                                new_page_full = "".join(new_page_content_parts)
                                
                                # Basic validation
                                if "pdf-page" in new_page_full:
                                     target_page.content = new_page_full
                                     db.add(target_page)
                                     pages_updated_count += 1
                                else:
                                     logger.error(f"AI returned invalid content for page {page_num}: {new_page_full[:100]}...")
                            except Exception as e:
                                logger.error(f"Failed to patch page {page_num}: {e}")
                                # Continue to next page? or fail? Continue allows partial success.
                         
                         if pages_updated_count > 0:
                             db.flush()
                             # Re-assemble full document from updated pages
                             # Check if we need to reload chat.pages
                             db.refresh(chat) 
                             chat.pdf_content = self._assemble_html(chat)
                         else:
                             # If targeted patch failed completely, assume no changes or fallback?
                             # For now, we leave it. User can try again or we could trigger fallback here.
                             logger.warning("Targeted patching yielded no valid updates.")

                    # 3. Global Update Path (Fallback or Intentional)
                    else:
                        logger.info("Performing Global Document Update")
                        
                        combined_context = f"""
===== PREVIOUS DOCUMENT STRUCTURE =====
{chat.pdf_content}

===== USER REQUEST =====
{chat_update.user_input}
"""
                        # Choose generation method based on configuration
                        if True:
                            new_response = await generate_ai_response(
                                user_input=combined_context,
                                conversation_history=None,
                                document_type=None,
                                template_content=None,
                                template_id=None
                            )
                        else:
                            # Use configured default model
                            default_model = get_default_model()
                            logger.info(f"Using {default_model.value} for document update")
                            
                            prompt = (
                                "You are an expert HTML document editor. Update the existing HTML document based on the user's request.\n"
                                "\\n===== CRITICAL FORMATTING REQUIREMENTS =====\\n"
                                "The HTML MUST maintain this structure:\\n"
                                "- All content inside <div class='pdf-page'> elements\\n"
                                "- Each .pdf-page is 794px × 1123px with 38px padding (A4 at 96 DPI)\\n"
                                "- Content area is 718px × 1047px\\n"
                                "- Include complete <!DOCTYPE html>, <html>, <head> with styles, and <body>\\n"
                                "- Split content across multiple pages if needed\\n\\n"
                                f"{combined_context}\\n\\n"
                                "===== OUTPUT REQUIREMENTS =====\\n"
                                "- Return ONLY the updated HTML5 code\\n"
                                "- Preserve the .pdf-page structure\\n"
                                "- Do NOT include explanations, markdown, or code blocks\\n"
                                "- Do NOT use ```html or ``` markers"
                            )
                            new_response = await self._call_api(prompt, default_model, max_tokens=4000)
                            
                            # Clean and auto-paginate the HTML response
                            new_response = clean_html_response(new_response)
                            new_response = auto_paginate_html(new_response)
                        
                        if not new_response.strip() or "I'm sorry" in new_response:
                            logger.error("AI response generation failed during update")
                            raise HTTPException(
                                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail="Failed to generate AI response"
                            )

                                    
                        # CRITICAL: Sync pages architecture
                        self._sync_pages_from_html(db, chat, new_response)
                        chat.pdf_content = new_response

            if chat_update.pdf_content is not None:
                if not chat_update.pdf_content.strip():
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="PDF content cannot be empty"
                    )
                chat.pdf_content = chat_update.pdf_content

            if chat_update.title is not None:
                if not chat_update.title.strip():
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Title cannot be empty"
                    )
                chat.title = chat_update.title

            # Save version if pdf_content changed
            if chat.pdf_content != old_pdf_content:
                await self._save_chat_version(db, chat.id, chat.pdf_content)

            chat.updated_at = func.now()
            db.commit()
            db.refresh(chat)

            logger.info(f"Chat {slug} updated successfully")
            return chat

        except HTTPException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Database error in update_chat: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )
        except Exception as e:
            logger.error(f"Unexpected error in update_chat: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An unexpected error occurred: {str(e)}"
            )

    async def translate_chat(
        self,
        db: Session,
        user_id: int,
        slug: str,
        target_language: str,
        user_email: str
    ) -> Chat:
        """
        Translate a chat document page-by-page to the target language.
        Preserves layout by using targeted HTML translation.
        """
        logger.info(f"Translating chat {slug} to {target_language}")
        try:
            # 1. Fetch Chat and Pages
            chat = await self.get_chat_by_slug(db, user_id, slug)

            pages = db.query(ChatPage).filter(ChatPage.chat_id == chat.id).order_by(ChatPage.page_number).all()
            
            if not pages:
                 # If no pages, maybe sync from content first?
                 if chat.pdf_content:
                     self._sync_pages_from_html(db, chat, chat.pdf_content)
                     pages = db.query(ChatPage).filter(ChatPage.chat_id == chat.id).order_by(ChatPage.page_number).all()
            
            if not pages:
                raise HTTPException(status_code=400, detail="Document has no content to translate")

            # 2. Iterate and Translate with Concurrency
            translated_count = 0
            semaphore = asyncio.Semaphore(3) # Process 3 pages at a time
            
            async def process_page(page: ChatPage):
                nonlocal translated_count
                async with semaphore:
                    logger.info(f"Translating page {page.page_number}...")
                    try:
                        translated_chunks = []
                        # Use a reasonable timeout per page (e.g. 60s) to prevent hanging
                        async for chunk in AIGenerator.stream_translate_page(page.content, target_language):
                            translated_chunks.append(chunk)
                        
                        full_translated_html = "".join(translated_chunks)
                        
                        # Layout Safety: Check for wrapper
                        if "pdf-page" not in full_translated_html:
                            logger.warning(f"Translation output missing .pdf-page wrapper for page {page.page_number}. Auto-wrapping.")
                            # Simple clean up - remove markdown blocks if any remaining despite prompt
                            clean_html = full_translated_html.replace("```html", "").replace("```", "").strip()
                            full_translated_html = f'<div class="pdf-page">{clean_html}</div>'

                        page.content = full_translated_html
                        return True
                    except Exception as e:
                        logger.error(f"Error translating page {page.page_number}: {e}")
                        return False

            # Create tasks
            tasks = [process_page(page) for page in pages]
            results = await asyncio.gather(*tasks)
            
            translated_count = sum(1 for r in results if r)
            
            if translated_count > 0:
                # Batch save all updates
                db.add_all(pages)
                db.flush()
                
                # 3. updates
                chat.language = target_language # Assuming checking if this field exists or we just track it in title?
                
                # Re-assemble
                chat.pdf_content = self._assemble_html(chat)
                
                # Save version
                await self._save_chat_version(db, chat.id, chat.pdf_content)
                
                db.commit()
                db.refresh(chat)
                return chat
            else:
                raise HTTPException(status_code=500, detail="Translation failed to produce valid output")

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Translation error: {e}")
            db.rollback()
            raise HTTPException(status_code=500, detail="Internal server error during translation")

    async def update_chat_without_ai(
        self,
        db: Session,
        user_id: int,
        slug: str,
        chat_update: ChatUpdate
    ) -> Chat:
        """Update chat without generating new AI response."""
        return await self.update_chat(db, user_id, slug, chat_update, skip_ai_generation=True)

    async def delete_chat(self, db: Session, user_id: int, slug: str) -> bool:
        """Delete a chat by slug."""
        try:
            logger.info(f"Deleting chat {slug} for user {user_id}")
            chat = await self.get_chat_by_slug(db, user_id, slug)
            db.delete(chat)
            db.commit()
            logger.info(f"Chat {slug} deleted successfully")
            return True

        except HTTPException as e:
            if e.status_code == status.HTTP_404_NOT_FOUND:
                logger.warning(f"Chat not found during deletion: {slug}")
                return False
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Database error in delete_chat: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )
            
    async def get_chat_versions(
        self,
        db: Session,
        user_id: int,
        slug: str,
        user_email: Optional[str] = None
    ) -> List[ChatVersion]:
        """Retrieve version history for a chat."""
        try:
            # First get the chat to verify ownership
            try:
                chat = await self.get_chat_by_slug(db, user_id, slug)
            except HTTPException as e:
                if e.status_code == status.HTTP_404_NOT_FOUND:
                    # Check if chat exists but is shared/public
                    chat = db.query(Chat).filter(Chat.slug == slug).first()
                    if chat:
                        is_public = chat.is_public
                        is_shared = False
                        if not is_public and user_email:
                            is_shared = db.query(ChatShare).filter(
                                ChatShare.chat_id == chat.id,
                                ChatShare.shared_with_email == user_email
                            ).first() is not None
                        
                        if is_public or is_shared:
                            raise HTTPException(
                                status_code=status.HTTP_403_FORBIDDEN,
                                detail="You are viewing a shared chat. Please make a copy to view versions."
                            )
                raise e
            
            # Then get all versions ordered by creation date (oldest first)
            versions = db.query(ChatVersion).filter(
                ChatVersion.chat_id == chat.id
            ).order_by(
                ChatVersion.created_at.asc()
            ).all()
            
            return versions
            
        except HTTPException:
            raise
        except SQLAlchemyError as e:
            logger.error(f"Database error in get_chat_versions: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )

    async def get_chat_version(
        self,
        db: Session,
        user_id: int,
        slug: str,
        version_id: int
    ) -> ChatVersion:
        """Retrieve a specific version of a chat."""
        try:
            # First get the chat to verify ownership
            chat = await self.get_chat_by_slug(db, user_id, slug)
            
            # Then get the specific version
            version = db.query(ChatVersion).filter(
                ChatVersion.id == version_id,
                ChatVersion.chat_id == chat.id
            ).first()
            
            if not version:
                logger.warning(f"Version {version_id} not found for chat {slug}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Version not found"
                )
            
            return version
            
        except HTTPException:
            raise
        except SQLAlchemyError as e:
            logger.error(f"Database error in get_chat_version: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )



    async def revert_to_version(
        self,
        db: Session,
        user_id: int,
        slug: str,
        version_id: int,
        user_email: Optional[str] = None
    ) -> Chat:
        """Revert chat to a specific version using sequential ID."""
        try:
            logger.info(f"Reverting chat {slug} to version {version_id} for user {user_id}")

            # Get the chat to verify ownership
            try:
                chat = await self.get_chat_by_slug(db, user_id, slug)
            except HTTPException as e:
                if e.status_code == status.HTTP_404_NOT_FOUND:
                    # Check if chat exists but is shared/public
                    chat = db.query(Chat).filter(Chat.slug == slug).first()
                    if chat:
                        is_public = chat.is_public
                        is_shared = False
                        if not is_public and user_email:
                            is_shared = db.query(ChatShare).filter(
                                ChatShare.chat_id == chat.id,
                                ChatShare.shared_with_email == user_email
                            ).first() is not None
                        
                        if is_public or is_shared:
                            raise HTTPException(
                                status_code=status.HTTP_403_FORBIDDEN,
                                detail="You are viewing a shared chat. Please make a copy to revert versions."
                            )
                raise e

            # Get all versions ordered by creation date (same as get_chat_versions)
            versions = db.query(ChatVersion).filter(
                ChatVersion.chat_id == chat.id
            ).order_by(
                ChatVersion.created_at.asc()
            ).all()

            # Check if version_id is valid (must be between 0 and len(versions)-1)
            if version_id < 0 or version_id >= len(versions):
                logger.warning(f"Version {version_id} not found for chat {slug}. Available versions: 0-{len(versions)-1}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Version {version_id} not found. Available versions: 0-{len(versions)-1}"
                )

            # Get the target version by sequential index
            target_version = versions[version_id]

            # Store old PDF content before updating
            old_pdf_content = chat.pdf_content

            # Update chat with the target version's content
            chat.pdf_content = target_version.pdf_content
            chat.updated_at = func.now()

            # Create a new version to record this reversion
            await self._save_chat_version(db, chat.id, old_pdf_content)

            db.commit()
            db.refresh(chat)

            logger.info(f"Chat {slug} successfully reverted to version {version_id}")
            return chat

        except HTTPException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Database error in revert_to_version: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )
        except Exception as e:
            logger.error(f"Unexpected error in revert_to_version: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred"
            )

    async def share_chat(
        self,
        db: Session,
        user_id: int,
        slug: str,
        share_with_email: str,
        access_level: str = "view"
    ) -> ChatShare:
        """Share a chat with another user by email"""
        try:
            # Get the chat and verify ownership
            chat = await self.get_chat_by_slug(db, user_id, slug)
            
            # Get the owner's email to check for self-sharing
            owner = db.query(User).filter(User.id == user_id).first()
            if not owner:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            # Prevent self-sharing
            if owner.email.lower() == share_with_email.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="You cannot share a chat with yourself"
                )
            
            # Check if already shared with this email
            existing_share = db.query(ChatShare).filter(
                ChatShare.chat_id == chat.id,
                ChatShare.shared_with_email == share_with_email
            ).first()
            
            if existing_share:
                # Update access level if it exists
                if existing_share.access_level != access_level:
                    existing_share.access_level = access_level
                    db.commit()
                    db.refresh(existing_share)
                    logger.info(f"Updated access level for existing share of chat {slug} with {share_with_email}")
                return existing_share
            
            # Create new share
            new_share = ChatShare(
                chat_id=chat.id,
                shared_with_email=share_with_email,
                shared_by_user_id=user_id,
                access_level=access_level
            )
            
            db.add(new_share)
            db.commit()
            db.refresh(new_share)
            
            # Get the sharer's information for the email (reuse owner from earlier)
            sharer_name = owner.full_name if owner and owner.full_name else owner.email if owner else "A user"
            sharer_email = owner.email if owner else None
            
            # Send email notification to the recipient
            try:
                await self.email_service.send_chat_share_notification(
                    recipient_email=share_with_email,
                    sharer_name=sharer_name,
                    chat_title=chat.title,
                    chat_slug=chat.slug
                )
                logger.info(f"Share notification email sent to {share_with_email}")
            except Exception as email_error:
                # Log error but don't fail the share operation
                logger.error(f"Failed to send share notification email: {email_error}")
            
            # Send confirmation email to the sharer
            if sharer_email:
                try:
                    await self.email_service.send_chat_share_confirmation(
                        sharer_email=sharer_email,
                        sharer_name=sharer_name,
                        recipient_email=share_with_email,
                        chat_title=chat.title,
                        chat_slug=chat.slug
                    )
                    logger.info(f"Share confirmation email sent to {sharer_email}")
                except Exception as email_error:
                    # Log error but don't fail the share operation
                    logger.error(f"Failed to send share confirmation email: {email_error}")
            
            logger.info(f"Chat {slug} shared with {share_with_email}")
            return new_share
            
        except HTTPException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Database error in share_chat: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )
        except Exception as e:
            logger.error(f"Unexpected error in share_chat: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred"
            )

    async def update_share_access(
        self,
        db: Session,
        user_id: int,
        share_id: int,
        access_level: AccessLevel
    ) -> ChatShare:
        """Update access level for a shared chat"""
        try:
            share = db.query(ChatShare).filter(
                ChatShare.id == share_id,
                ChatShare.shared_by_user_id == user_id
            ).first()
            
            if not share:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Share not found or you don't have permission to update it"
                )
            
            share.access_level = access_level
            db.commit()
            db.refresh(share)
            
            logger.info(f"Share {share_id} access updated to {access_level} by user {user_id}")
            return share
            
        except HTTPException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Database error in update_share_access: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )
        except Exception as e:
            logger.error(f"Unexpected error in update_share_access: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred"
            )

    async def update_share_access_level(
        self,
        db: Session,
        user_id: int,
        share_id: int,
        new_access_level: str
    ) -> ChatShare:
        """Update the access level of an existing chat share"""
        try:
            # Get the share and verify ownership
            share = db.query(ChatShare).filter(
                ChatShare.id == share_id,
                ChatShare.shared_by_user_id == user_id
            ).first()
            
            if not share:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Share not found or you don't have permission to modify it"
                )
            
            # Update the access level
            share.access_level = new_access_level
            db.commit()
            db.refresh(share)
            
            logger.info(f"Access level updated for share {share_id} to {new_access_level}")
            return share
            
        except HTTPException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Database error in update_share_access_level: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )
        except Exception as e:
            logger.error(f"Unexpected error in update_share_access_level: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred"
            )

    async def get_shared_chat(
        self,
        db: Session,
        user_email: str,
        slug: str
    ) -> dict:
        """Get a chat that has been shared with the current user"""
        try:
            # Find the chat by slug
            chat = db.query(Chat).filter(Chat.slug == slug).first()
            
            if not chat:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Chat not found"
                )
            
            # Check if this chat is shared with the user
            share = db.query(ChatShare).filter(
                ChatShare.chat_id == chat.id,
                ChatShare.shared_with_email == user_email
            ).first()
            
            if not share:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You don't have access to this chat"
                )
            
            # Track first access if not already tracked
            if not share.accessed_at:
                share.accessed_at = func.now()
                db.commit()
                logger.info(f"First access tracked for share {share.id} by {user_email}")
            
            # Get the owner's email
            owner = db.query(User).filter(User.id == chat.user_id).first()
            
            return {
                "slug": chat.slug,
                "title": chat.title,
                "pdf_content": chat.pdf_content,
                "created_at": chat.created_at,
                "updated_at": chat.updated_at,
                "shared_by": owner.email if owner else "Unknown",
                "access_level": share.access_level
            }
            
        except HTTPException:
            raise
        except SQLAlchemyError as e:
            logger.error(f"Database error in get_shared_chat: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )
        except Exception as e:
            logger.error(f"Unexpected error in get_shared_chat: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred"
            )

    async def get_my_shared_chats(
        self,
        db: Session,
        user_id: int
    ) -> List[dict]:
        """Get all chats that the user has shared with others"""
        try:
            shares = db.query(ChatShare).filter(
                ChatShare.shared_by_user_id == user_id
            ).all()
            
            result = []
            for share in shares:
                chat = db.query(Chat).filter(Chat.id == share.chat_id).first()
                if chat:
                    result.append({
                        "share_id": share.id,
                        "chat_slug": chat.slug,
                        "chat_title": chat.title,
                        "shared_with_email": share.shared_with_email,
                        "shared_at": share.created_at
                    })
            
            return result
            
        except SQLAlchemyError as e:
            logger.error(f"Database error in get_my_shared_chats: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )
        except Exception as e:
            logger.error(f"Unexpected error in get_my_shared_chats: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred"
            )

    async def revoke_chat_share(
        self,
        db: Session,
        user_id: int,
        share_id: int
    ) -> None:
        try:
            share = db.query(ChatShare).filter(
                ChatShare.id == share_id,
                ChatShare.shared_by_user_id == user_id
            ).first()
            
            if not share:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Share not found or you don't have permission to revoke it"
                )
            
            db.delete(share)
            db.commit()
            
            logger.info(f"Share {share_id} revoked by user {user_id}")
            
        except HTTPException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Database error in revoke_chat_share: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )
        except Exception as e:
            logger.error(f"Unexpected error in revoke_chat_share: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred"
            )

    async def get_chat_shared_emails(
        self,
        db: Session,
        user_id: int,
        slug: str
    ) -> List[dict]:
        """Get list of emails that a specific chat is shared with.
        
        Args:
            db: Database session
            user_id: ID of the user requesting (must be chat owner)
            slug: Chat slug
            
        Returns:
            List of dicts with shared_with_email, shared_at, and share_id
        """
        try:
            # Get the chat and verify ownership
            chat = await self.get_chat_by_slug(db, user_id, slug)
            
            # Get all shares for this chat
            shares = db.query(ChatShare).filter(
                ChatShare.chat_id == chat.id
            ).order_by(ChatShare.created_at.desc()).all()
            
            # Format the response
            result = [
                {
                    "share_id": share.id,
                    "shared_with_email": share.shared_with_email,
                    "shared_at": share.created_at,
                    "has_accessed": share.accessed_at is not None,
                    "accessed_at": share.accessed_at,
                    "access_level": share.access_level
                }
                for share in shares
            ]
            
            logger.info(f"Retrieved {len(result)} shares for chat {slug}")
            return result
            
        except HTTPException:
            raise
        except SQLAlchemyError as e:
            logger.error(f"Database error in get_chat_shared_emails: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )
        except Exception as e:
            logger.error(f"Unexpected error in get_chat_shared_emails: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred"
            )


    async def copy_shared_chat(
        self,
        db: Session,
        user_id: int,
        user_email: str,
        slug: str
    ) -> Chat:
        """Create a copy of a shared chat for the current user"""
        try:
            # 1. Find the original chat
            original_chat = db.query(Chat).filter(Chat.slug == slug).first()
            
            if not original_chat:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Chat not found"
                )
            
            # 2. Verify access
            # Access is granted if:
            # a) User is the owner (copying their own chat)
            # b) Chat is public
            # c) Chat is shared with user's email
            
            is_owner = original_chat.user_id == user_id
            is_public = original_chat.is_public
            
            if not (is_owner or is_public):
                share = db.query(ChatShare).filter(
                    ChatShare.chat_id == original_chat.id,
                    ChatShare.shared_with_email == user_email
                ).first()
                
                if not share:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="You don't have access to copy this chat"
                    )
            
            # 3. Create copy
            new_chat = Chat(
                user_id=user_id,
                title=f"Copy of {original_chat.title}",
                user_input=original_chat.user_input,
                pdf_content=original_chat.pdf_content,
                # slug will be auto-generated
            )
            
            db.add(new_chat)
            
            # Increment copy count on original chat if it's not the owner copying (though owner copy counts too as "re-use")
            # Requirements said "how many time user made copy of their shared document"
            # Typically this implies "others copying my doc". 
            # If I copy my own doc, it's also a copy. Let's count all copies for simplicity and robustness.
            original_chat.copy_count += 1
            
            db.commit()
            db.refresh(new_chat)
            
            logger.info(f"Chat {slug} copied by user {user_id} -> New slug: {new_chat.slug}")
            return new_chat
            
        except HTTPException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Database error in copy_shared_chat: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )
        except Exception as e:
            logger.error(f"Unexpected error in copy_shared_chat: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred"
            )

    async def toggle_public_status(
        self,
        db: Session,
        user_id: int,
        slug: str,
        is_public: bool
    ) -> Chat:
        """Toggle the public status of a chat"""
        try:
            # Get the chat and verify ownership
            chat = await self.get_chat_by_slug(db, user_id, slug)
            
            # Update public status
            chat.is_public = is_public
            db.commit()
            db.refresh(chat)
            
            logger.info(f"Chat {slug} public status set to {is_public} by user {user_id}")
            return chat
            
        except HTTPException:
            raise
        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Database error in toggle_public_status: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )
        except Exception as e:
            logger.error(f"Unexpected error in toggle_public_status: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred"
            )

    async def get_public_chat(
        self,
        db: Session,
        slug: str
    ) -> dict:
        """Get a public chat (no authentication required)"""
        try:
            # Find the chat by slug
            chat = db.query(Chat).filter(Chat.slug == slug).first()
            
            if not chat:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Chat not found"
                )
            
            # Check if chat is public
            if not chat.is_public:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="This chat is not public"
                )
            
            # Get owner information
            owner = db.query(User).filter(User.id == chat.user_id).first()
            
            return {
                "slug": chat.slug,
                "title": chat.title,
                "pdf_content": chat.pdf_content,
                "created_at": chat.created_at,
                "updated_at": chat.updated_at,
                "owner": owner.email if owner else "Unknown"
            }
            
        except HTTPException:
            raise
        except SQLAlchemyError as e:
            logger.error(f"Database error in get_public_chat: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )
        except Exception as e:
            logger.error(f"Unexpected error in get_public_chat: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred"
            )

    async def get_chats_shared_with_me(
        self,
        db: Session,
        user_email: str
    ) -> List[dict]:
        """Get all chats shared WITH the current user"""
        try:
            # Query chats shared with this email, joining with User to get owner info
            # We select Chat objects and specific fields from other tables
            query = db.query(
                Chat,
                ChatShare.created_at.label("shared_at"),
                ChatShare.id.label("share_id"),
                ChatShare.access_level,
                User.email.label("owner_email")
            ).join(
                ChatShare, Chat.id == ChatShare.chat_id
            ).join(
                User, Chat.user_id == User.id
            ).filter(
                ChatShare.shared_with_email == user_email
            ).order_by(ChatShare.created_at.desc())
            
            results = query.all()
            
            # Resolve user ID for unread count
            user = db.query(User).filter(User.email == user_email).first()
            user_id = user.id if user else None

            # Format the output
            output = []
            for chat, shared_at, share_id, access_level, owner_email in results:
                unread = 0
                if user_id:
                    unread = self._calculate_unread_count(db, chat.id, user_id)
                
                output.append({
                    "slug": chat.slug,
                    "title": chat.title,
                    "created_at": chat.created_at,
                    "updated_at": chat.updated_at,
                    "owner_email": owner_email,
                    "shared_at": shared_at,
                    "share_id": share_id,
                    "is_public": chat.is_public,
                    "access_level": access_level,
                    "unread_count": unread
                })
            return output
            
        except SQLAlchemyError as e:
            logger.error(f"Database error in get_chats_shared_with_me: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred"
            )
        except Exception as e:
            logger.error(f"Unexpected error in get_chats_shared_with_me: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred"
            )

    async def add_comment(
        self,
        db: Session,
        slug: str,
        user: User,
        content: str,
        page_number: Optional[int] = None
    ) -> ChatComment:
        """Add a comment to a shared chat."""
        chat = db.query(Chat).filter(Chat.slug == slug).first()
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
            
        # Permission check
        is_owner = chat.user_id == user.id
        is_shared = db.query(ChatShare).filter(
            ChatShare.chat_id == chat.id,
            ChatShare.shared_with_email == user.email
        ).first() is not None
        
        if not (is_owner or is_shared):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to comment on this document"
            )
            
        new_comment = ChatComment(
            chat_id=chat.id,
            user_id=user.id,
            user_name=user.full_name or user.email,
            content=content,
            page_number=page_number
        )
        
        db.add(new_comment)
        db.commit()
        db.refresh(new_comment)
        
        # --- Send Email Notifications ---
        try:
            # 1. Identify recipients
            recipients = set()
            
            # Add owner if not the commenter
            if chat.user_id != user.id:
                # Need to fetch owner email
                owner = db.query(User).filter(User.id == chat.user_id).first()
                if owner:
                    recipients.add(owner.email)
            
            # Add shared users if not the commenter
            shares = db.query(ChatShare).filter(ChatShare.chat_id == chat.id).all()
            for share in shares:
                if share.shared_with_email != user.email:
                    recipients.add(share.shared_with_email)
            
            # 2. Send emails
            if recipients:
                # Resolve users for tracking and mute check
                recipient_users = db.query(User).filter(User.email.in_(recipients)).all()
                
                # Fetch mute status for all recipients
                recipient_ids = [u.id for u in recipient_users]
                mute_statuses = db.query(ChatReadStatus).filter(
                    ChatReadStatus.chat_id == chat.id,
                    ChatReadStatus.user_id.in_(recipient_ids)
                ).all()
                
                muted_user_ids = {s.user_id for s in mute_statuses if s.is_muted}
                
                # Filter out muted users
                final_recipients = [u for u in recipient_users if u.id not in muted_user_ids]
                
                email_service = EmailService()
                commenter_name = user.full_name or user.email
                
                # In a real async worker environment, this should be offloaded a task queue
                # OPTIMIZATION: Use asyncio.gather for parallel email dispatch
                if final_recipients:
                    async def send_notification(recipient_user):
                        try:
                            pixel_token = self.create_tracking_pixel_token(chat.slug, recipient_user.id)
                            base_url = settings.BACKEND_BASE_URL.rstrip('/')
                            pixel_url = f"{base_url}/api/chat/{chat.slug}/pixel.png?token={pixel_token}"

                            await email_service.send_comment_notification(
                                recipient_email=recipient_user.email,
                                commenter_name=commenter_name,
                                chat_title=chat.title,
                                comment_content=content, 
                                chat_slug=slug,
                                tracking_pixel_url=pixel_url,
                                page_number=page_number
                            )
                        except Exception as e:
                            logger.error(f"Failed to send notification to {recipient_user.email}: {e}")
                    
                    # Fire all emails in parallel, don't wait for all to complete to avoid blocking
                    await asyncio.gather(
                        *[send_notification(u) for u in final_recipients],
                        return_exceptions=True  # Don't fail if one email fails
                    )
        except Exception as e:
            # Log but don't fail the comment creation
            logger.error(f"Failed to send comment notifications for chat {slug}: {e}")

        return new_comment

    async def get_comments(
        self,
        db: Session,
        slug: str,
        user: User
    ) -> List[ChatComment]:
        """List comments for a shared chat."""
        chat = db.query(Chat).filter(Chat.slug == slug).first()
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
            
        # Permission check: Only owner and shared users can see comments
        is_owner = chat.user_id == user.id
        is_shared = db.query(ChatShare).filter(
            ChatShare.chat_id == chat.id,
            ChatShare.shared_with_email == user.email
        ).first() is not None
        
        if not (is_owner or is_shared):
            # If it's a public chat but user is not in the collaboration circle,
            # they shouldn't even know comments exist.
            return []
            
        return db.query(ChatComment).filter(
            ChatComment.chat_id == chat.id
        ).order_by(ChatComment.created_at.asc()).all()

    async def update_comment(
        self,
        db: Session,
        comment_id: int,
        user_id: int,
        content: str
    ) -> ChatComment:
        """Update an existing comment."""
        comment = db.query(ChatComment).filter(ChatComment.id == comment_id).first()
        if not comment:
            raise HTTPException(status_code=404, detail="Comment not found")
            
        # Verify ownership
        if comment.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only edit your own comments"
            )
            
        comment.content = content
        db.commit()
        db.refresh(comment)
        return comment

    async def get_user_stats(self, db: Session, user_id: int) -> dict:
        """Get aggregated statistics for a user."""
        try:
            # Aggregate stats from all chats owned by user
            stats = db.query(
                func.sum(Chat.pdf_downloads).label("total_pdf_downloads"),
                func.sum(Chat.docx_downloads).label("total_docx_downloads"),
                func.sum(Chat.copy_count).label("total_copies")
            ).filter(Chat.user_id == user_id).first()
            
            # Count total comments made by user (across all documents)
            total_comments = db.query(ChatComment).filter(
                ChatComment.user_id == user_id
            ).count()
            
            return {
                "total_pdf_downloads": stats.total_pdf_downloads or 0,
                "total_docx_downloads": stats.total_docx_downloads or 0,
                "total_copies": stats.total_copies or 0,
                "total_comments": total_comments
            }
        except Exception as e:
            logger.error(f"Error fetching user stats for {user_id}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to fetch user statistics"
            )
        
    async def delete_comment(
        self,
        db: Session,
        comment_id: int,
        user_id: int
    ):
        """Delete a comment."""
        comment = db.query(ChatComment).filter(ChatComment.id == comment_id).first()
        if not comment:
            raise HTTPException(status_code=404, detail="Comment not found")
            
        # Verify ownership
        if comment.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own comments"
            )
            
        db.delete(comment)
        db.commit()
