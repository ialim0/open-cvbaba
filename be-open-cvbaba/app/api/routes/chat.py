from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form, Request
from fastapi.responses import StreamingResponse, Response
from fastapi_cache.decorator import cache
from starlette.concurrency import run_in_threadpool
from sqlalchemy.orm import Session
from typing import List, Optional
import logging
import json
import tempfile
from pathlib import Path
from app.services.chat.ai_response import AIGenerator

from app.db import get_db
from app.models import User
from app.schemas.chat import (
    ChatInput, ChatResponse, ChatUpdate, ChatHistoryResponse, ChatListResponse, 
    ChatPaginationMeta, TogglePublicRequest, PublicChatAccess, AddPagesInput, 
    EditPageInput, ChatStructureResponse, ChatPageResponse, TranslateRequest
)
from app.schemas.chat_version import ChatVersionResponse
from app.schemas.chat_share import ChatShareCreate, ChatShareUpdate, ChatShareResponse, SharedChatAccess
from app.services.chat.chat_service import ChatService
from app.services.pdf_service import PDFService
from app.services.word_service import WordService
from app.core.workspace import get_workspace_user

logger = logging.getLogger(__name__)

def parse_page_range(page_range: Optional[str]) -> Optional[List[int]]:
    """
    Parse page range string (e.g. '1-3', '1,5') into 0-based indices.
    Raises HTTPException for invalid inputs or excessive ranges.
    """
    if not page_range or page_range.lower() == 'full':
        return None
        
    pages = set()
    MAX_PAGES_LIMIT = 70  # Prevent DoS via huge ranges
    
    try:
        parts = page_range.split(',')
        if len(parts) > 20: 
             raise ValueError("Too many individual segments specified")

        for part in parts:
            part = part.strip()
            if not part:
                continue
            
            # Simple validation: only allow digits and hyphen
            if not all(c.isdigit() or c == '-' for c in part):
                 raise ValueError(f"Invalid characters in segment '{part}'")
            
            if '-' in part:
                if part.count('-') > 1:
                     raise ValueError(f"Invalid range format: {part}")
                     
                start_str, end_str = part.split('-')
                start, end = int(start_str), int(end_str)
                
                if start > end:
                    raise ValueError(f"Start page {start} cannot be greater than end page {end}")
                if start < 1:
                    raise ValueError("Page numbers must be positive")
                if (end - start + 1) > MAX_PAGES_LIMIT:
                    raise ValueError(f"Range {start}-{end} exceeds limit of {MAX_PAGES_LIMIT} pages")
                
                # 1-based massive loop prevention
                for i in range(start, end + 1):
                    pages.add(i - 1)
            else:
                p = int(part)
                if p < 1:
                    raise ValueError("Page numbers must be positive")
                pages.add(p - 1)
        
        if not pages:
            return None
            
        if len(pages) > MAX_PAGES_LIMIT:
            raise ValueError(f"Total requested pages ({len(pages)}) exceeds limit of {MAX_PAGES_LIMIT}")
            
        return sorted(list(pages))
        
    except ValueError as e:
        logger.warning(f"Invalid page range request: {page_range} - {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid page range: {str(e)}"
        )

def get_chat_service() -> ChatService:
    return ChatService()

class ChatRouter:
    def __init__(self):
        self.router = APIRouter()
        self._register_routes()

    def _register_routes(self):
        self.router.post("/chat/", response_model=ChatResponse)(self.create_chat)
        self.router.post(
            "/chat/stream",
            response_class=StreamingResponse
        )(self.create_chat_stream)
        self.router.get("/chat/", response_model=ChatHistoryResponse)(self.get_chat_history)
        self.router.get("/chat/{slug}", response_model=ChatResponse)(self.get_specific_chat)
        self.router.patch("/chat/{slug}", response_model=ChatResponse)(self.update_chat)
        self.router.patch(
            "/chat/{slug}/stream",
            response_class=StreamingResponse
        )(self.update_chat_stream)
        self.router.post(
            "/chat/{slug}/add-pages/stream",
            response_class=StreamingResponse
        )(self.add_pages_stream)
        self.router.post(
            "/chat/{slug}/edit-page/stream",
            response_class=StreamingResponse
        )(self.edit_page_stream)
        self.router.delete(
            "/chat/{slug}/page/{page_number}", 
            response_model=ChatResponse
        )(self.delete_page)
        self.router.post(
            "/chat/{slug}/swap-pages", 
            response_model=ChatResponse
        )(self.swap_pages)
        self.router.post(
            "/chat/{slug}/translate",
            response_model=ChatResponse
        )(self.translate_chat)

        self.router.get("/chat/{slug}/export/word")(self.export_chat_word)
        self.router.get("/chat/{slug}/export/pdf")(self.export_chat_to_pdf)
        
        self.router.delete("/chat/{slug}", status_code=status.HTTP_204_NO_CONTENT)(self.delete_chat)
        self.router.get("/chat/{slug}/versions", response_model=List[ChatVersionResponse])(self.get_chat_versions)
        self.router.post("/chat/{slug}/revert/{version_id}", response_model=ChatResponse)(self.revert_to_version)
        
        # Chat sharing routes
        self.router.post("/chat/{slug}/share", response_model=ChatShareResponse)(self.share_chat)
        self.router.get("/chat/shared/{slug}", response_model=SharedChatAccess)(self.get_shared_chat)
        self.router.get("/chat/shares/my-shares", response_model=List[dict])(self.get_my_shared_chats)
        self.router.get("/chat/shares/shared-with-me", response_model=List[dict])(self.get_chats_shared_with_me)
        self.router.get("/chat/{slug}/shares", response_model=List[dict])(self.get_chat_shared_emails)
        self.router.patch("/chat/shares/{share_id}/access", response_model=ChatShareResponse)(self.update_share_access_level)
        self.router.post("/chat/shared/{slug}/copy", response_model=ChatResponse)(self.copy_shared_chat)
        self.router.delete("/chat/shares/{share_id}", status_code=status.HTTP_204_NO_CONTENT)(self.revoke_share)

        # New Modular Architecture Routes (Lazy Loading)
        self.router.get("/chat/{slug}/structure", response_model=ChatStructureResponse)(self.get_chat_structure)
        self.router.get("/chat/{slug}/structure", response_model=ChatStructureResponse)(self.get_chat_structure)
        self.router.get("/chat/{slug}/page/{page_number}", response_model=ChatPageResponse)(self.get_page_content)
        
        # Read Receipts
        self.router.post("/chat/{slug}/read", status_code=status.HTTP_204_NO_CONTENT)(self.mark_chat_read)
        self.router.get("/chat/{slug}/pixel.png")(self.tracking_pixel)
        self.router.post("/chat/{slug}/notifications")(self.toggle_notifications)
        self.router.get("/chat/stats/me")(self.get_my_stats)
        
        # Public chat routes
        self.router.post("/chat/{slug}/public", response_model=ChatResponse)(self.toggle_public_status)
        self.router.get("/chat/public/{slug}", response_model=PublicChatAccess)(self.get_public_chat)
        
        self.router.get("/health", name="health")(self.check_api_health)

    def _log_user_activity(self, action: str, current_user: User, slug: str = None, template_id: str = None):
        user_info = f"{current_user.email[:5]}**** (ID: {current_user.id})"
        log_message = f"{action} chat"
        if slug:
            log_message += f" with slug {slug}"
        if template_id:
            log_message += f" using template {template_id}"
        log_message += f" for user: {user_info}"
        logger.info(log_message)

    async def create_chat(
        self,
        request: Request,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        await chat_service.ensure_api_keys_valid()
        
        # Determine Content-Type
        content_type = request.headers.get("content-type", "")
        
        # Initialize variables
        user_input = ""
        template_id = None
        num_pages = None
        files = []
        yt_urls = []
        web_urls = []
        
        temp_dir = None
        temp_paths = []

        try:
            if "application/json" in content_type:
                # JSON FLOW (Legacy)
                try:
                    data = await request.json()
                    chat_input = ChatInput(**data)
                    user_input = chat_input.user_input
                    template_id = chat_input.template_id
                    num_pages = chat_input.num_pages
                except Exception as e:
                    raise HTTPException(status_code=400, detail=f"Invalid JSON: {e}")
                    
            elif "multipart/form-data" in content_type:
                # MULTIMODAL FLOW
                form = await request.form()
                user_input = form.get("user_input")
                template_id = form.get("template_id") or None
                num_pages_raw = form.get("num_pages")
                num_pages = int(num_pages_raw) if num_pages_raw else None
                
                youtube_urls = form.get("youtube_urls")
                webpage_urls = form.get("webpage_urls")
                files = form.getlist("files")
                
                # Parse URLs
                yt_urls = [u.strip() for u in (youtube_urls or "").split(",") if u.strip()]
                web_urls = [u.strip() for u in (webpage_urls or "").split(",") if u.strip()]

                # Validate limits
                if len(files) > 5:
                     raise HTTPException(status_code=400, detail="Maximum 5 files allowed")
                if len(yt_urls) > 3:
                     raise HTTPException(status_code=400, detail="Maximum 3 YouTube URLs allowed")
                if len(web_urls) > 5:
                     raise HTTPException(status_code=400, detail="Maximum 5 web pages allowed")

                # Temp file handling
                if files:
                    temp_dir = tempfile.mkdtemp()
                    for file in files:
                        if not file.filename: continue
                        path = Path(temp_dir) / file.filename
                        content = await file.read()
                        with open(path, "wb") as buffer:
                            buffer.write(content)
                        temp_paths.append(path)
            else:
                raise HTTPException(status_code=415, detail="Unsupported Content-Type")

            if not user_input:
                raise HTTPException(status_code=400, detail="user_input is required")

            self._log_user_activity("Creating", current_user, template_id=template_id)
            
            chat = await chat_service.create_chat(
                db=db, 
                user_id=current_user.id, 
                user_input=user_input,
                template_id=template_id,
                user_email=current_user.email,
                num_pages=num_pages,
                file_paths=temp_paths,
                youtube_urls=yt_urls,
                webpage_urls=web_urls
            )
            return ChatResponse.model_validate(chat)
            
        except HTTPException as http_exc:
            logger.warning(f"HTTPException: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Chat creation failed: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")
        finally:
            if temp_dir:
                import shutil
                try: shutil.rmtree(temp_dir)
                except: pass


    async def create_chat_stream(
        self,
        request: Request,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        await chat_service.ensure_api_keys_valid()
        
        # Determine Content-Type
        content_type = request.headers.get("content-type", "")
        
        # Initialize variables
        user_input = ""
        template_id = None
        num_pages = None
        files = []
        yt_urls = []
        web_urls = []
        
        temp_dir = None
        temp_paths = []

        try:
            if "application/json" in content_type:
                # JSON FLOW (Legacy)
                try:
                    data = await request.json()
                    chat_input = ChatInput(**data)
                    user_input = chat_input.user_input
                    template_id = chat_input.template_id
                    num_pages = chat_input.num_pages
                except Exception as e:
                    raise HTTPException(status_code=400, detail=f"Invalid JSON: {e}")
                    
            elif "multipart/form-data" in content_type:
                # MULTIMODAL FLOW
                form = await request.form()
                user_input = form.get("user_input")
                template_id = form.get("template_id") or None
                num_pages_raw = form.get("num_pages")
                num_pages = int(num_pages_raw) if num_pages_raw else None
                
                youtube_urls = form.get("youtube_urls")
                webpage_urls = form.get("webpage_urls")
                files = form.getlist("files")
                
                # Parse URLs
                yt_urls = [u.strip() for u in (youtube_urls or "").split(",") if u.strip()]
                web_urls = [u.strip() for u in (webpage_urls or "").split(",") if u.strip()]

                # Validate limits
                if len(files) > 5:
                     raise HTTPException(status_code=400, detail="Maximum 5 files allowed")
                if len(yt_urls) > 3:
                     raise HTTPException(status_code=400, detail="Maximum 3 YouTube URLs allowed")
                if len(web_urls) > 5:
                     raise HTTPException(status_code=400, detail="Maximum 5 web pages allowed")

                # Temp file handling
                if files:
                    temp_dir = tempfile.mkdtemp()
                    for file in files:
                        if not file.filename: continue
                        path = Path(temp_dir) / file.filename
                        content = await file.read()
                        with open(path, "wb") as buffer:
                            buffer.write(content)
                        temp_paths.append(path)
            else:
                raise HTTPException(status_code=415, detail="Unsupported Content-Type")

            if not user_input:
                 raise HTTPException(status_code=400, detail="user_input is required")

            self._log_user_activity("Streaming creation", current_user, template_id=template_id)
            
            stream = await chat_service.stream_chat_generation(
                db=db,
                user_id=current_user.id,
                user_input=user_input,
                template_id=template_id,
                user_email=current_user.email,
                num_pages=num_pages,
                file_paths=temp_paths,
                youtube_urls=yt_urls,
                webpage_urls=web_urls
            )
            
            async def cleanup_stream(inner_stream):
                try:
                    async for chunk in inner_stream:
                        yield chunk
                finally:
                    if temp_dir:
                        import shutil
                        try:
                            shutil.rmtree(temp_dir)
                        except Exception as e:
                            logger.warning(f"Failed to cleanup temp dir {temp_dir}: {e}")

            headers = {
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no"
            }
            return StreamingResponse(cleanup_stream(stream), media_type="text/event-stream", headers=headers)

        except Exception as e:
            if temp_dir:
                import shutil
                try: shutil.rmtree(temp_dir)
                except: pass
            
            logger.error(
                f"Streaming chat creation failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}"
            )
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )
        await chat_service.ensure_api_keys_valid()
        self._log_user_activity("Streaming creation", current_user, template_id=template_id)
        
        # Parse URLs
        yt_urls = [u.strip() for u in (youtube_urls or "").split(",") if u.strip()]
        web_urls = [u.strip() for u in (webpage_urls or "").split(",") if u.strip()]

        # Validate limits
        if len(files) > 5:
            raise HTTPException(status_code=400, detail="Maximum 5 files allowed")
        if len(yt_urls) > 3:
            raise HTTPException(status_code=400, detail="Maximum 3 YouTube URLs allowed")
        if len(web_urls) > 5:
            raise HTTPException(status_code=400, detail="Maximum 5 web pages allowed")
        
        # Temp file handling
        temp_dir = tempfile.mkdtemp()
        temp_paths = []
        try:
            for file in files:
                if not file.filename: continue
                path = Path(temp_dir) / file.filename
                with open(path, "wb") as buffer:
                    content = await file.read()
                    buffer.write(content)
                temp_paths.append(path)

            stream = await chat_service.stream_chat_generation(
                db=db,
                user_id=current_user.id,
                user_input=user_input,
                template_id=template_id,
                user_email=current_user.email,
                num_pages=num_pages,
                file_paths=temp_paths,
                youtube_urls=yt_urls,
                webpage_urls=web_urls
            )
            
            async def cleanup_stream(inner_stream):
                try:
                    async for chunk in inner_stream:
                        yield chunk
                finally:
                    import shutil
                    try:
                        shutil.rmtree(temp_dir)
                    except Exception as e:
                        logger.warning(f"Failed to cleanup temp dir {temp_dir}: {e}")

            headers = {
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no"
            }
            return StreamingResponse(cleanup_stream(stream), media_type="text/event-stream", headers=headers)

        except Exception as e:
            # Cleanup if initialization failed
            import shutil
            try: shutil.rmtree(temp_dir)
            except: pass
            
            logger.error(
                f"Streaming chat creation failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )
            headers = {
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no"
            }
            return StreamingResponse(stream, media_type="text/event-stream", headers=headers)
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during streaming chat creation: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(
                f"Streaming chat creation failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def get_chat_history(
        self,
        skip: int = Query(0, ge=0, description="Number of chats to skip"),
        limit: int = Query(20, ge=1, le=100, description="Number of chats to return (max 100)"),
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        self._log_user_activity(f"Retrieving chat history (skip={skip}, limit={limit})", current_user)
        try:
            chats, total = await chat_service.get_chat_history(
                db=db, 
                user_id=current_user.id, 
                skip=skip, 
                limit=limit
            )
            items = [ChatListResponse.model_validate(chat) for chat in chats]
            next_skip = skip + len(items) if (skip + len(items)) < total else None
            meta = ChatPaginationMeta(
                skip=skip,
                limit=limit,
                total=total,
                has_more=(skip + len(items)) < total,
                next_skip=next_skip
            )
            return ChatHistoryResponse(items=items, meta=meta)
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during chat history retrieval: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Chat history retrieval failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

   
    async def get_specific_chat(
        self,
        slug: str,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        self._log_user_activity("Retrieving specific", current_user, slug)
        try:
            # Use get_chat_for_viewing to allow access if chat is public or shared
            chat = await chat_service.get_chat_for_viewing(
                db=db, 
                user_id=current_user.id, 
                user_email=current_user.email,
                slug=slug
            )
            
            # Determine access level
            access_level = "full"  # Default for owner
            if chat.user_id != current_user.id:
                # Check if shared
                from app.models import ChatShare
                share = db.query(ChatShare).filter(
                    ChatShare.chat_id == chat.id,
                    ChatShare.shared_with_email == current_user.email
                ).first()
                
                if share:
                    access_level = share.access_level
                elif chat.is_public:
                    access_level = "view"  # Public chats are view-only
                    
            # Convert to dict and add access_level
            chat_dict = {
                "slug": chat.slug,
                "title": chat.title,
                "user_input": chat.user_input,
                "pdf_content": chat.pdf_content,
                "created_at": chat.created_at,
                "updated_at": chat.updated_at,
                "is_public": chat.is_public,
                "access_level": access_level
            }
            return ChatResponse.model_validate(chat_dict)
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during specific chat retrieval: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Specific chat retrieval failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )


    async def get_chat_structure(
        self,
        slug: str,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """
        Get chat metadata and page structure for lazy loading.
        """
        self._log_user_activity("Fetching chat structure", current_user, slug)
        return await chat_service.get_chat_structure(db, current_user.id, current_user.email, slug)

    async def get_page_content(
        self,
        slug: str,
        page_number: int,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """
        Get content of a specific page.
        """
        self._log_user_activity(f"Fetching page {page_number}", current_user, slug)
        return await chat_service.get_page_content(db, current_user.id, current_user.email, slug, page_number)

    async def update_chat(
        self,
        slug: str,
        chat_update: ChatUpdate,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        self._log_user_activity("Updating", current_user, slug)
        try:
            chat = await chat_service.update_chat(db, current_user.id, slug, chat_update, user_email=current_user.email)
            return ChatResponse.model_validate(chat)
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during chat update: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Chat update failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def update_chat_stream(
        self,
        slug: str,
        chat_update: ChatUpdate,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        await chat_service.ensure_api_keys_valid()
        self._log_user_activity("Streaming update", current_user, slug)
        try:
            if not chat_update.user_input:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="user_input is required for streaming updates"
                )
            
            stream = await chat_service.stream_chat_update(
                db=db,
                user_id=current_user.id,
                slug=slug,
                user_input=chat_update.user_input,
                user_email=current_user.email
            )
            headers = {
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no"
            }
            return StreamingResponse(stream, media_type="text/event-stream", headers=headers)
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during streaming chat update: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(
                f"Streaming chat update failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def add_pages_stream(
        self,
        slug: str,
        add_pages_input: AddPagesInput,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Stream new pages to append to an existing document."""
        await chat_service.ensure_api_keys_valid()
        self._log_user_activity("Adding pages to", current_user, slug)
        try:
            stream = await chat_service.stream_add_pages(
                db=db,
                user_id=current_user.id,
                slug=slug,
                user_input=add_pages_input.user_input,
                num_pages=add_pages_input.num_pages,
                current_page=add_pages_input.current_page,
                insert_after=add_pages_input.insert_after,
                user_email=current_user.email
            )
            headers = {
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no"
            }
            return StreamingResponse(stream, media_type="text/event-stream", headers=headers)
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during add-pages: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(
                f"Add-pages failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def edit_page_stream(
        self,
        slug: str,
        edit_page_input: EditPageInput,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Stream edit of a single page in an existing document."""
        await chat_service.ensure_api_keys_valid()
        self._log_user_activity("Editing page in", current_user, slug)
        try:
            stream = await chat_service.stream_edit_page(
                db=db,
                user_id=current_user.id,
                slug=slug,
                user_input=edit_page_input.user_input,
                page_number=edit_page_input.page_number,
                user_email=current_user.email
            )
            headers = {
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no"
            }
            return StreamingResponse(stream, media_type="text/event-stream", headers=headers)
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during edit-page: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(
                f"Edit-page failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )


    async def delete_page(
        self,
        slug: str,
        page_number: int,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Delete a specific page from the document."""
        await chat_service.ensure_api_keys_valid()
        self._log_user_activity("Deleting page", current_user, slug)
        try:
            chat = await chat_service.delete_page(
                db=db,
                user_id=current_user.id,
                slug=slug,
                page_number=page_number,
                user_email=current_user.email
            )
            return ChatResponse.model_validate(chat)
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during page deletion: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Page deletion failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def swap_pages(
        self,
        slug: str,
        page_a: int = Query(..., description="First page number (1-based)"),
        page_b: int = Query(..., description="Second page number (1-based)"),
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Swap the positions of two pages in a document."""
        self._log_user_activity("Swapping pages", current_user, slug)
        try:
            chat = await chat_service.swap_pages(
                db=db,
                user_id=current_user.id,
                slug=slug,
                page_a=page_a,
                page_b=page_b,
                user_email=current_user.email
            )
            return ChatResponse.model_validate(chat)
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during page swap: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Page swap failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def translate_chat(
        self,
        slug: str,
        request: TranslateRequest,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Translate the document to a target language page-by-page."""
        self._log_user_activity("Translating chat", current_user, slug)
        try:
             chat = await chat_service.translate_chat(
                 db=db,
                 user_id=current_user.id,
                 slug=slug,
                 target_language=request.target_language,
                 user_email=current_user.email
             )
             return ChatResponse.model_validate(chat)
        except HTTPException as http_exc:
            raise http_exc
        except Exception as e:
            logger.error(f"Translation failed: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")

    async def export_chat_pdf(
        self,
        slug: str,
        pages: Optional[str] = Query(None, description="Page range (e.g. '1-3', '1,5', 'full')"),
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Export chat as PDF."""
        self._log_user_activity("Exporting PDF", current_user, slug)
        try:
            # Get chat (permissions checked inside get_chat_by_slug)
            chat = await chat_service.get_chat_by_slug(db, current_user.id, slug)
            
            # Parse page range
            page_indices = parse_page_range(pages)
            if page_indices:
                logger.info(f"Exporting PDF pages {page_indices} for chat {slug}")
            
            # Increment download counter
            chat_service.increment_download_count(db, slug, "pdf")

            # Generate PDF
            pdf_bytes = PDFService.html_to_pdf(chat.pdf_content, pages=page_indices)
            filename = PDFService.generate_filename(chat.title)
            
            # Return as downloadable file
            return Response(
                content=pdf_bytes,
                media_type="application/pdf",
                headers={
                    "Content-Disposition": f'attachment; filename="{filename}"',
                    "Cache-Control": "no-cache"
                }
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(
                f"PDF export failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}"
            )
            # Check for common WeasyPrint errors
            if "weasyprint" in str(e).lower() or "cairo" in str(e).lower():
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="PDF generation service is currently unavailable. Please contact support."
                )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate PDF"
            )

    async def export_chat_word(
        self,
        slug: str,
        pages: Optional[str] = Query(None, description="Page range (e.g. '1-3', '1,5', 'full')"),
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Export chat as Word document."""
        self._log_user_activity("Exporting Word", current_user, slug)
        try:
            # Get chat (permissions checked inside get_chat_by_slug)
            chat = await chat_service.get_chat_by_slug(db, current_user.id, slug)
            
            # Parse page range
            page_indices = parse_page_range(pages)
            if page_indices:
                logger.info(f"Exporting Word pages {page_indices} for chat {slug}")
            
            # Increment download counter
            chat_service.increment_download_count(db, slug, "docx")

            # Generate Word document
            word_bytes = WordService.html_to_word(chat.pdf_content, pages=page_indices)
            filename = WordService.generate_filename(chat.title)
            
            # Return as downloadable file
            return Response(
                content=word_bytes,
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                headers={
                    "Content-Disposition": f'attachment; filename="{filename}"',
                    "Cache-Control": "no-cache"
                }
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(
                f"Word export failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate Word document"
            )

    @cache(expire=300)
    async def get_my_stats(
        self,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Get aggregated statistics for the current user."""
        return await chat_service.get_user_stats(db, current_user.id)

    async def mark_chat_read(
        self,
        slug: str,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Mark a chat as read by the current user."""
        await chat_service.mark_chat_as_read(db, slug, current_user.id)

    async def toggle_notifications(
        self,
        slug: str,
        muted: bool = Query(..., description="Set to true to mute, false to unmute"),
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Toggle email notifications for a specific chat."""
        is_muted = await chat_service.toggle_notifications(db, slug, current_user.id, muted)
        return {"muted": is_muted}

    async def tracking_pixel(
        self,
        slug: str,
        token: str,
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Tracking pixel endpoint to mark chat as read via email."""
        # Validate token
        payload = chat_service.decode_tracking_pixel_token(token)
        if not payload or payload.get("slug") != slug:
            # Return transparent pixel anyway to avoid broken image icon
            pass
        else:
            try:
                user_id = payload.get("uid")
                # Fire and forget update (we don't want to block the image load if DB is slow)
                # But since we're in async, we can just await it. Error handling inside service ensures no crash.
                await chat_service.mark_chat_as_read(db, slug, user_id)
            except Exception as e:
                logger.error(f"Pixel tracking failed: {e}")

        # Return 1x1 transparent PNG
        return Response(
            content=b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82',
            media_type="image/png",
            headers={"Cache-Control": "no-cache, no-store, must-revalidate"}
        )

    async def delete_chat(
        self,
        slug: str,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        self._log_user_activity("Deleting", current_user, slug)
        try:
            deleted = await chat_service.delete_chat(db, current_user.id, slug)
            if not deleted:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Chat not found"
                )
            return None
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during chat deletion: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Chat deletion failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )
            
    async def get_chat_versions(
        self,
        slug: str,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        self._log_user_activity("Retrieving versions for", current_user, slug)
        try:
            versions = await chat_service.get_chat_versions(
                db, 
                current_user.id, 
                slug,
                user_email=current_user.email
            )
            return [
                ChatVersionResponse(
                    id=version.id,
                    chat_id=version.chat_id,
                    pdf_content=version.pdf_content,
                    created_at=version.created_at,
                    version_number=index
                )
                for index, version in enumerate(versions, start=1)
            ]
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during chat version retrieval: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Chat version retrieval failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def revert_to_version(
        self,
        slug: str,
        version_id: int,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        self._log_user_activity(f"Reverting to version {version_id} for", current_user, slug)
        try:
            chat = await chat_service.revert_to_version(
                db, 
                current_user.id, 
                slug, 
                version_id,
                user_email=current_user.email
            )
            return ChatResponse.model_validate(chat)
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during chat revert: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Chat revert failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def check_api_health(
        self,
        chat_service: ChatService = Depends(get_chat_service)
    ):
        await chat_service.ensure_api_keys_valid()
        """Check connectivity with all configured AI APIs"""
        try:
            await chat_service._validate_api_keys()
            return {"status": "healthy"}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"API health check failed: {str(e)}"
            )

    async def share_chat(
        self,
        slug: str,
        share_data: ChatShareCreate,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Share a chat with another user by email"""
        self._log_user_activity(f"Sharing with {share_data.email}", current_user, slug)
        try:
            share = await chat_service.share_chat(
                db=db,
                user_id=current_user.id,
                slug=slug,
                share_with_email=share_data.email,
                access_level=share_data.access_level.value
            )
            return ChatShareResponse.model_validate(share)
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during chat sharing: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Chat sharing failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def update_share_access_level(
        self,
        share_id: int,
        update_data: ChatShareUpdate,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Update the access level of a chat share"""
        self._log_user_activity(f"Updating access level for share {share_id}", current_user)
        try:
            share = await chat_service.update_share_access_level(
                db=db,
                user_id=current_user.id,
                share_id=share_id,
                new_access_level=update_data.access_level.value
            )
            return ChatShareResponse.model_validate(share)
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during access level update: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Access level update failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )


    async def get_shared_chat(
        self,
        slug: str,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Get a chat that has been shared with the current user"""
        self._log_user_activity("Accessing shared", current_user, slug)
        try:
            chat_data = await chat_service.get_shared_chat(
                db=db,
                user_email=current_user.email,
                slug=slug
            )
            return SharedChatAccess(**chat_data)
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during shared chat access: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Shared chat access failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def get_my_shared_chats(
        self,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Get all chats that the current user has shared with others"""
        self._log_user_activity("Retrieving shared chats list", current_user)
        try:
            shares = await chat_service.get_my_shared_chats(
                db=db,
                user_id=current_user.id
            )
            return shares
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during shared chats retrieval: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Shared chats retrieval failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )


    async def get_chats_shared_with_me(
        self,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Get all chats shared WITH the current user"""
        self._log_user_activity("Retrieving chats shared with me", current_user)
        try:
            chats = await chat_service.get_chats_shared_with_me(
                db=db,
                user_email=current_user.email
            )
            return chats
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during shared-with-me retrieval: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Shared-with-me retrieval failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def copy_shared_chat(
        self,
        slug: str,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Create a copy of a shared chat"""
        self._log_user_activity("Copying shared chat", current_user, slug)
        try:
            new_chat = await chat_service.copy_shared_chat(
                db=db,
                user_id=current_user.id,
                user_email=current_user.email,
                slug=slug
            )
            return ChatResponse.model_validate(new_chat)
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during chat copy: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Chat copy failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def revoke_share(
        self,
        share_id: int,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Revoke a chat share"""
        self._log_user_activity(f"Revoking share {share_id}", current_user)
        try:
            await chat_service.revoke_chat_share(
                db=db,
                user_id=current_user.id,
                share_id=share_id
            )
            return None
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during share revocation: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Share revocation failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def get_chat_shared_emails(
        self,
        slug: str,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Get list of emails that a specific chat is shared with"""
        self._log_user_activity(f"Getting shared emails for", current_user, slug)
        try:
            shares = await chat_service.get_chat_shared_emails(
                db=db,
                user_id=current_user.id,
                slug=slug
            )
            return shares
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during get shared emails: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Get shared emails failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )


    async def toggle_public_status(
        self,
        slug: str,
        request: TogglePublicRequest,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Toggle public status of a chat"""
        self._log_user_activity(f"Setting public status to {request.is_public}", current_user, slug)
        try:
            chat = await chat_service.toggle_public_status(
                db=db,
                user_id=current_user.id,
                slug=slug,
                is_public=request.is_public
            )
            return ChatResponse.model_validate(chat)
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during toggle public status: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Toggle public status failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def get_public_chat(
        self,
        slug: str,
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Get a public chat (no authentication required)"""
        logger.info(f"Public access (no auth required) for chat: {slug}")
        try:
            chat_data = await chat_service.get_public_chat(db=db, slug=slug)
            return chat_data
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during public chat access: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Public chat access failed for slug {slug}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def export_chat_word(
        self,
        slug: str,
        pages: Optional[str] = Query(None, description="Page range (e.g. '1-3', '1,5')"),
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Export chat as Word document."""
        self._log_user_activity("Exporting Word", current_user, slug)
        try:
            # Parse page range
            page_indices = None
            if pages:
                # Local helper or import if moved
                def parse_page_range_local(pr):
                     parts = pr.split(',')
                     indices = []
                     for part in parts:
                         if '-' in part:
                             start, end = map(int, part.split('-'))
                             indices.extend(range(start, end + 1))
                         else:
                             indices.append(int(part))
                     return [i - 1 for i in indices] # Convert to 0-based
                page_indices = parse_page_range_local(pages)

            # Get chat content
            chat_data = await chat_service.get_specific_chat(
                db=db, 
                user_id=current_user.id, 
                slug=slug
            )
            
            # Use WordService
            word_service = WordService()
            doc_stream = await word_service.create_word_document(
                html_content=chat_data["content"],
                page_indices=page_indices
            )
            
            filename = f"{chat_data.get('title', 'document')}.docx"
            headers = {
                'Content-Disposition': f'attachment; filename="{filename}"'
            }
            
            return StreamingResponse(
                doc_stream, 
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                headers=headers
            )
            
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during Word export: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"Word export failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

    async def export_chat_to_pdf(
        self,
        slug: str,
        current_user: User = Depends(get_workspace_user),
        db: Session = Depends(get_db),
        chat_service: ChatService = Depends(get_chat_service)
    ):
        """Export chat as PDF document."""
        self._log_user_activity("Exporting PDF", current_user, slug)
        try:
            # Get chat content
            chat_data = await chat_service.get_specific_chat(
                db=db, 
                user_id=current_user.id, 
                slug=slug
            )
            
            # Use PDFService
            pdf_service = PDFService()
            pdf_bytes = await run_in_threadpool(pdf_service.html_to_pdf, chat_data["pdf_content"])
            
            filename = f"{chat_data.get('title', 'document')}.pdf"
            headers = {
                'Content-Disposition': f'attachment; filename="{filename}"'
            }
            
            return Response(
                content=pdf_bytes,
                media_type="application/pdf",
                headers=headers
            )
            
        except HTTPException as http_exc:
            logger.warning(f"HTTPException during PDF export: {http_exc.detail}")
            raise http_exc
        except Exception as e:
            logger.error(f"PDF export failed for user {current_user.email[:5]}**** (ID: {current_user.id}): {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal Server Error"
            )

chat_router = ChatRouter().router