from app.services.chat.mistral_client import MistralClient, MistralConfig, MistralPart, MistralClientError as ClientError
import logging
import re
from typing import Optional, List, Tuple, AsyncIterator
from app.config import settings
from app.services.chat.html_completer import HTMLCompleter, fix_incomplete_html
import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type, before_sleep_log, AsyncRetrying
from openai import AsyncOpenAI
from pydantic import BaseModel, Field
from pathlib import Path
import time
import httpx
from bs4 import BeautifulSoup

class EditScope(BaseModel):
    scope: str = Field(..., description="Either 'specific_pages' or 'global'")
    involved_pages: List[int] = Field(default_factory=list, description="List of 1-based page numbers that need changes")
    reasoning: str = Field(..., description="Reasoning for the scope identification")

logger = logging.getLogger(__name__)

class ContentFormatter:
    """Handles extraction of HTML content from AI responses."""

    @staticmethod
    def extract_html_content(text: str) -> str:
        """Extract HTML content from the AI response."""
        if "```html" in text:
            parts = text.split("```html", 1)
            if len(parts) > 1:
                html_part = parts[1].split("```", 1)[0]
                return html_part.strip()

        html_start = max(text.find("<!DOCTYPE html>"), text.find("<html"))
        if html_start != -1:
            return text[html_start:].strip()

        body_start = text.find("<body")
        body_end = text.find("</body>")
        if body_start != -1 and body_end != -1:
            return f"<!DOCTYPE html>\n<html>\n{text[body_start:body_end+7]}\n</html>"

        replacements = {
            "\nhtml": "",
            "HTML code": "document",
            "HTML document": "document",
            "HTML5 code": "document",
            "HTML resume": "document",
            "by Mistral": "by BylyAI",
            "par Mistral": "par BylyAI",
            "```html": "",
            "```": ""
        }

        for old, new in replacements.items():
            text = text.replace(old, new)

        return text.strip()

class AIGenerator:
    """Handles long-form HTML generation using Mistral with outline + section chunking."""

    GENERAL_PROMPT = (
        "# Role\n"
        "You are an expert Backend Layout Engine optimized for print-perfect HTML generation.\n"
        "Your goal is to create professional, print-ready HTML documents that render perfectly in:\n"
        "1. **Browser Preview** (page-by-page visualization)\n"
        "2. **Print-to-PDF Service** (high-quality A4 output)\n"
        "\n"
        "# CRITICAL: Page Container Structure (MANDATORY)\n"
        "You MUST wrap ALL content in `<div class=\"pdf-page\">` containers.\n"
        "Each `.pdf-page` div represents ONE physical A4 page.\n"
        "\n"
        "## Rules for `.pdf-page` containers:\n"
        "- Each page's content MUST fit within the container\n"
        "- When content exceeds one page, close the div and start a new one\n"
        "- Do NOT use inline `page-break-before: always` styles\n"
        "- The CSS handles page breaks automatically via `.pdf-page` styling\n"
        "\n"
        "# Core Directives\n"
        "1. **Output Format**: Return ONLY valid HTML5 with embedded CSS. No markdown.\n"
        "2. **Units**: Use `mm` for layout, `pt` for fonts. NEVER use `px`.\n"
        "3. **Fonts**: Google Fonts via `@import` (Inter, Merriweather)\n"
        "\n"
        "# Typography Standards\n"
        "- Body: 10.5pt, line-height 1.5\n"
        "- H1: 22pt, H2: 16pt, H3: 12pt\n"
        "- Use `orphans: 2; widows: 2` on paragraphs\n"
        "- Headings: `page-break-after: avoid`\n"
        "\n"
        "# REQUIRED Template Structure\n"
        "<!DOCTYPE html>\n"
        "<html lang=\"en\">\n"
        "<head>\n"
        "  <meta charset=\"UTF-8\">\n"
        "  <style>\n"
        "    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&display=swap');\n"
        "    \n"
        "    /* Print @page rule for PDF generation */\n"
        "    @page {\n"
        "        size: A4;\n"
        "        margin: 0; /* Margins handled by .pdf-page padding */\n"
        "    }\n"
        "\n"
        "    * { box-sizing: border-box; margin: 0; padding: 0; }\n"
        "    \n"
        "    body {\n"
        "        font-family: 'Inter', sans-serif;\n"
        "        font-size: 10.5pt;\n"
        "        line-height: 1.5;\n"
        "        color: #1f2937;\n"
        "        background: #525659; /* Preview background */\n"
        "    }\n"
        "\n"
        "    /* PAGE CONTAINER - Critical for preview AND print */\n"
        "    .pdf-page {\n"
        "        width: 210mm;\n"
        "        min-height: 297mm;\n"
        "        padding: 15mm;\n"
        "        margin: 0 auto 20px auto;\n"
        "        background: white;\n"
        "        box-shadow: 0 2px 8px rgba(0,0,0,0.2);\n"
        "        page-break-after: always;\n"
        "        page-break-inside: avoid;\n"
        "        overflow: hidden;\n"
        "    }\n"
        "    \n"
        "    .pdf-page:last-child {\n"
        "        page-break-after: auto;\n"
        "    }\n"
        "\n"
        "    /* Typography */\n"
        "    h1, h2, h3, h4 {\n"
        "        font-family: 'Merriweather', serif;\n"
        "        color: #111827;\n"
        "        page-break-after: avoid;\n"
        "    }\n"
        "    h1 { font-size: 22pt; margin-bottom: 8mm; border-bottom: 2pt solid #111; padding-bottom: 3mm; }\n"
        "    h2 { font-size: 16pt; margin-top: 8mm; margin-bottom: 4mm; border-bottom: 1pt solid #e5e7eb; padding-bottom: 2mm; }\n"
        "    h3 { font-size: 12pt; margin-top: 6mm; margin-bottom: 3mm; }\n"
        "    \n"
        "    p { margin-bottom: 4mm; orphans: 2; widows: 2; text-align: justify; }\n"
        "    ul, ol { margin-bottom: 4mm; padding-left: 6mm; }\n"
        "    li { margin-bottom: 2mm; }\n"
        "    \n"
        "    table { width: 100%; border-collapse: collapse; margin: 4mm 0; }\n"
        "    th, td { border: 1px solid #d1d5db; padding: 2mm 3mm; text-align: left; }\n"
        "    th { background: #f9fafb; font-weight: 600; }\n"
        "    \n"
        "    .header { margin-bottom: 8mm; }\n"
        "    .section { margin-bottom: 6mm; }\n"
        "    \n"
        "    /* Print-specific overrides */\n"
        "    @media print {\n"
        "        body { background: white; }\n"
        "        .pdf-page { \n"
        "            box-shadow: none; \n"
        "            margin: 0;\n"
        "        }\n"
        "    }\n"
        "  </style>\n"
        "</head>\n"
        "<body>\n"
        "\n"
        "  <!-- PAGE 1 -->\n"
        "  <div class=\"pdf-page\">\n"
        "    <h1>Document Title</h1>\n"
        "    <div class=\"section\">\n"
        "      <h2>Section 1</h2>\n"
        "      <p>Content here...</p>\n"
        "    </div>\n"
        "  </div>\n"
        "\n"
        "  <!-- PAGE 2 -->\n"
        "  <div class=\"pdf-page\">\n"
        "    <div class=\"section\">\n"
        "      <h2>Section 2 (Continued)</h2>\n"
        "      <p>More content...</p>\n"
        "    </div>\n"
        "  </div>\n"
        "\n"
        "</body>\n"
        "</html>\n"
    )

    _max_template_chars = 12000
    _max_history_chars = 2500

    @classmethod
    def _get_async_client(cls):
        # Always return a new client instance to avoid GRPC/concurrency issues
        # caused by sharing a single client across parallel tasks (malloc error fix)
        return MistralClient(api_key=settings.MISTRAL_API_KEY).aio

    @staticmethod
    def _minify_template(html: str, max_chars: int) -> str:
        if not html:
            return ""
        collapsed = re.sub(r">\s+<", "><", html)
        collapsed = re.sub(r"\s{2,}", " ", collapsed)
        collapsed = collapsed.strip()
        if len(collapsed) <= max_chars:
            return collapsed
        half = max_chars // 2
        return (
            collapsed[:half]
            + "<!-- TEMPLATE TRUNCATED FOR LATENCY -->"
            + collapsed[-half:]
        )

    @staticmethod
    def _trim_history(history: str, max_chars: int) -> str:
        if not history:
            return ""
        history = history.strip()
        if len(history) <= max_chars:
            return history
        return history[-max_chars:]
    
    @staticmethod
    def _estimate_required_pages(user_input: str, document_type: Optional[str], num_pages: Optional[int] = None) -> str:
        """
        Estimate how many pages the document will need and provide pagination guidance.
        If num_pages is explicitly provided, use that instead of estimating.
        """
        # If user explicitly requested a page count, use that
        if num_pages is not None:
            return (
                f"PAGINATION REQUIREMENT: Generate EXACTLY {num_pages} page(s) of content. "
                f"You MUST create {num_pages} <div class='pdf-page'> element(s). "
                "Do NOT generate fewer pages than requested. "
                "Do NOT stop generation early. Complete ALL {num_pages} pages fully."
            )
        
        input_length = len(user_input)
        
        if document_type == "cover_letter":
            return (
                "PAGINATION GUIDANCE: Cover letters should fit on 1 page. "
                "Use only one <div class='pdf-page'>. Keep content concise and professional."
            )
        elif document_type == "resume":
            # Rough heuristic: <500 chars = 1 page, 500-1500 = 2 pages, >1500 = 3 pages
            if input_length < 500:
                pages = "1-2 pages"
            elif input_length < 1500:
                pages = "2-3 pages"
            elif input_length < 2500:
                pages = "3-5 pages"
            else:
                pages = "4-6 pages"
            
            return (
                f"PAGINATION GUIDANCE: This resume will likely need {pages}. "
                "Split content logically: Page 1 (header, summary, main experience), "
                "Page 2+ (additional experience, education, skills). "
                "Use multiple <div class='pdf-page'> elements as needed."
            )
        else:
            # General documents - can go up to 70 pages
            if input_length < 800:
                pages = "1-2 pages"
            elif input_length < 2000:
                pages = "2-4 pages"
            elif input_length < 3000:
                pages = "4-6 pages"
            else:
                # Long comprehensive documents
                pages = "7-70 pages"
            
            return (
                f"PAGINATION GUIDANCE: This document will likely need {pages}. "
                "Split content at natural section boundaries. "
                "Remember: only 1047px of vertical content fits per page. "
                "Use multiple <div class='pdf-page'> elements as needed. "
                "For very long documents (7-70 pages), ensure each major section starts on a new page. "
                "CRITICAL: Do NOT stop generation until the document is complete."
            )

    @staticmethod
    def _extract_response_text(response) -> str:
        # Native Mistral Chat Completion streaming chunks.
        data = getattr(response, "data", None)
        if data is not None:
            choices = getattr(data, "choices", None) or []
            if choices:
                delta = getattr(choices[0], "delta", None)
                content = getattr(delta, "content", None) if delta else None
                if isinstance(content, str):
                    return content
                if isinstance(content, list):
                    return "".join(getattr(item, "text", "") or "" for item in content)
        # Prioritize manual extraction to avoid warnings about non-text parts (like thoughts)
        # appearing when accessing the convenience .text property
        candidates = getattr(response, "candidates", None)
        if candidates:
            first_candidate = candidates[0]
            content = getattr(first_candidate, "content", None)
            if content:
                parts = getattr(content, "parts", None)
                if parts:
                    extracted = []
                    for part in parts:
                        if part is None:
                            continue
                        
                        # Only extract text parts, ignoring thoughts/function calls
                        part_text = getattr(part, "text", None)
                        if part_text:
                            extracted.append(part_text)
                            continue
                            
                        if isinstance(part, dict):
                            value = part.get("text")
                            if value:
                                extracted.append(value)
                    
                    if extracted:
                        return "".join(extracted)

        # Fallback to .text if manual extraction yields nothing
        text = getattr(response, "text", "")
        if text:
            return text

        return ""

    @staticmethod
    def _get_speed_config(
        max_tokens: int = 2500,
        response_mime_type: Optional[str] = None
    ) -> MistralConfig:
        """Get optimized config for faster generation"""
        return MistralConfig(
            temperature=0.5,  # Lower for faster, more focused responses
            max_output_tokens=max_tokens,
            top_p=0.9,
            top_k=40,
            response_mime_type=response_mime_type
        )

    @staticmethod
    def calculate_tokens_for_pages(num_pages: Optional[int], has_template: bool) -> int:
        """
        Calculate appropriate token limit based on requested page count.
        
        Args:
            num_pages: Requested number of pages (1-70), or None for auto
            has_template: Whether a template is being used
        
        Returns:
            Calculated max_output_tokens value
        
        Note: Mistral 2.0 Flash supports up to 64k output tokens.
        We use 32k max which is sufficient for 70+ pages.
        """
        BASE_TOKENS = 3000
        TOKENS_PER_PAGE = 1500  # ~1500 tokens per A4 page for safety margin
        
        if num_pages is None:
            # Default: enough for 4-5 pages
            return 8000 if has_template else 6000
        
        # Scale tokens with requested pages
        calculated = BASE_TOKENS + (num_pages * TOKENS_PER_PAGE)
        # Cap at 32k tokens (Mistral 2.0 Flash supports 64k, we use half for safety)
        return min(calculated, 32000)

    @classmethod
    def get_generation_prompts(
        cls,
        user_input: str,
        conversation_history: Optional[str],
        document_type: Optional[str],
        template_content: Optional[str],
        template_id: Optional[str],
        num_pages: Optional[int] = None
    ) -> Tuple[str, str]:
        """
        Generate the system prompt and user prompt for document generation.
        Returns: (system_prompt, user_prompt)
        """
        constraints: List[str] = []
        if document_type == "cover_letter":
            constraints.append(
                "The output MUST be a professional cover letter. Do not produce a resume/CV even if asked."
            )
        elif document_type == "resume":
            constraints.append(
                "The output MUST be a resume/CV. Do not produce a cover letter even if asked."
            )

        if template_content:
            constraints.append(
                "Adhere strictly to the provided TEMPLATE STRUCTURE: preserve layout, hierarchy, section order, class names, and ids."
            )
            constraints.append(
                "Modify only textual content and placeholders to reflect the user's request."
            )
            constraints.append(
                "Do NOT change the design unless the user explicitly requests a different format/style."
            )

        system_prompt = (
            cls.GENERAL_PROMPT
            + "\nConstraint: Output must be complete, valid HTML5 only."
            + "\nConstraint: Do NOT output JSON, Markdown, or explanations."
        )
        if constraints:
            system_prompt = system_prompt + "\n" + "\n".join([f"Constraint: {c}" for c in constraints])

        prompt_blocks: List[str] = []
        if template_content:
            prompt_blocks.append(
                "===== TEMPLATE STRUCTURE =====\n"
                + cls._minify_template(template_content, cls._max_template_chars)
            )
        if document_type:
            prompt_blocks.append("===== DOCUMENT TYPE =====\n" + document_type)
        if conversation_history:
            prompt_blocks.append(
                "===== CONVERSATION HISTORY =====\n"
                + cls._trim_history(conversation_history, cls._max_history_chars)
            )
        if "===== PREVIOUS DOCUMENT STRUCTURE =====" in user_input:
            prompt_blocks.append(
                "INSTRUCTION: Update the existing document content while preserving structure/design."
            )
        
        # Add pagination guidance based on document type, input length, and explicit page count
        pagination_guidance = cls._estimate_required_pages(user_input, document_type, num_pages)
        prompt_blocks.append("===== " + pagination_guidance + " =====")
        
        prompt_blocks.append("===== USER REQUEST =====\n" + user_input)
        
        # Add completion instruction at the end
        prompt_blocks.append(
            "\n===== CRITICAL COMPLETION REQUIREMENT =====\n"
            "You MUST complete the entire HTML document. Do NOT stop mid-generation.\n"
            "Ensure you close ALL tags: </div>, </body>, </html>\n"
            "The document must be fully complete and valid."
        )

        prompt = "\n\n".join(prompt_blocks)
        return system_prompt, prompt

    @classmethod
    def _prepare_generation(
        cls,
        user_input: str,
        conversation_history: Optional[str],
        document_type: Optional[str],
        template_content: Optional[str],
        template_id: Optional[str],
        num_pages: Optional[int] = None
    ) -> Tuple[str, str, MistralConfig, str, int]:
        model_name = getattr(settings, "MISTRAL_MODEL", settings.MISTRAL_MODEL)
        
        system_prompt, prompt = cls.get_generation_prompts(
            user_input, 
            conversation_history, 
            document_type, 
            template_content, 
            template_id,
            num_pages
        )
        
        # Calculate tokens dynamically based on page count
        estimated_tokens = cls.calculate_tokens_for_pages(num_pages, has_template=bool(template_content))
        logger.info(f"Token limit set to {estimated_tokens} for num_pages={num_pages}, has_template={bool(template_content)}")
        
        config = cls._get_speed_config(max_tokens=estimated_tokens, response_mime_type="text/plain")
        config.system_instruction = system_prompt

        return prompt, system_prompt, config, model_name, estimated_tokens

    @classmethod
    async def generate_document(
        cls,
        user_input: str,
        conversation_history: Optional[str] = None,
        document_type: Optional[str] = None,
        template_content: Optional[str] = None,
        template_id: Optional[str] = None,
        num_pages: Optional[int] = None
    ) -> str:
        """
        Long-form generation pipeline:
        1) Compose system constraints and contextual blocks.
        2) Issue a single async content-generation call with the consolidated prompt.
        3) Extract HTML from the model response.
        Fallback: simplified single-shot generation when primary attempt fails.
        """
        try:
            from app.services.chat.langgraph_pipeline import generate_document_with_langgraph
            logger.info("Executing LangGraph multi-agent pipeline (Mistral Large + Codestral)")
            result = await generate_document_with_langgraph(
                user_input=user_input,
                conversation_history=conversation_history,
                document_type=document_type,
                template_content=template_content,
                template_id=template_id,
                num_pages=num_pages or 1
            )
            if result and len(result.strip()) > 50:
                return result
        except Exception as e:
            logger.warning(f"LangGraph pipeline error: {e}. Falling back to standard generation.")

        prompt, system_prompt, config, model_name, estimated_tokens = cls._prepare_generation(
            user_input=user_input,
            conversation_history=conversation_history,
            document_type=document_type,
            template_content=template_content,
            template_id=template_id,
            num_pages=num_pages
        )

        try:
            client = cls._get_async_client()
            async for attempt in AsyncRetrying(
                retry=retry_if_exception_type(ClientError),
                stop=stop_after_attempt(5),
                wait=wait_exponential(multiplier=1, min=4, max=60),
                before_sleep=before_sleep_log(logger, logging.WARNING),
                reraise=True
            ):
                with attempt:
                    single_resp = await client.models.generate_content(
                        model=model_name,
                        contents=[{"role": "user", "parts": [{"text": prompt}]}],
                        config=config
                    )
            single_text = cls._extract_response_text(single_resp)

            # Extract HTML content
            html_content = ContentFormatter.extract_html_content(single_text)
            
            # Auto-complete if HTML is incomplete
            fixed_html, was_incomplete = fix_incomplete_html(html_content)
            if was_incomplete:
                logger.warning(f"HTML was incomplete and has been auto-fixed. Template: {template_id}")
            
            return fixed_html

        except Exception as e:
            logger.error(f"Error generating long-form document: {e}")
            # Last-resort fallback: minimal single-turn
            try:
                client = cls._get_async_client()
                fallback_config = cls._get_speed_config(max_tokens=estimated_tokens)
                fallback_config.system_instruction = cls.GENERAL_PROMPT
                fallback_prompt = (
                    "===== USER REQUEST =====\n"
                    + user_input
                )
                fallback_resp = await client.models.generate_content(
                    model=getattr(settings, "MISTRAL_MODEL", settings.MISTRAL_MODEL),
                    contents=[{"role": "user", "parts": [{"text": fallback_prompt}]}],
                    config=fallback_config
                )
                final_response = cls._extract_response_text(fallback_resp)
                return ContentFormatter.extract_html_content(final_response)
            except Exception:
                raise

    @classmethod
    async def stream_generate_document_chunks(
        cls,
        user_input: str,
        conversation_history: Optional[str] = None,
        document_type: Optional[str] = None,
        template_content: Optional[str] = None,
        template_id: Optional[str] = None,
        num_pages: Optional[int] = None
    ) -> AsyncIterator[str]:
        """
        Stream document generation using single-pass Mistral generation.
        
        Mistral 2.0 Flash supports 64k output tokens, which is more than enough
        for 70 pages (~105,000 tokens). Single-pass is more reliable than multi-pass.
        """
        logger.info(f"Using LangGraph + Codestral stream generation (num_pages={num_pages}, document_type={document_type})")
        
        try:
            from app.services.chat.langgraph_pipeline import stream_document_with_langgraph
            yielded_any = False
            async for chunk in stream_document_with_langgraph(
                user_input=user_input,
                conversation_history=conversation_history,
                document_type=document_type,
                template_content=template_content,
                template_id=template_id,
                num_pages=num_pages or 1
            ):
                if chunk:
                    yielded_any = True
                    yield chunk
            if yielded_any:
                return
        except Exception as e:
            logger.warning(f"LangGraph stream generation encountered error: {e}. Falling back to standard stream.")

        prompt, _, config, model_name, estimated_tokens = cls._prepare_generation(
            user_input=user_input,
            conversation_history=conversation_history,
            document_type=document_type,
            template_content=template_content,
            template_id=template_id,
            num_pages=num_pages
        )
        
        logger.info(f"Streaming with model={model_name}, max_tokens={estimated_tokens}")
        client = cls._get_async_client()
        
        # Retry loop for streaming to handle 429 errors
        max_retries = 3
        attempt_count = 0
        
        while True:
            try:
                stream = await client.models.generate_content_stream(
                    model=model_name,
                    contents=[{"role": "user", "parts": [{"text": prompt}]}],
                    config=config
                )
                
                yielded_any = False
                async for chunk in stream:
                    text = cls._extract_response_text(chunk)
                    if text:
                        yielded_any = True
                        yield text
                
                # If we complete the loop without error, break the retry loop
                break
                
            except ClientError as e:
                # Only retry on 429
                if e.code != 429:
                    raise e
                
                attempt_count += 1
                if attempt_count >= max_retries:
                    logger.error(f"Max retries reached for 429 error: {e}")
                    # Re-raise so the caller can trigger fallback
                    raise e
                    
                if yielded_any:
                    logger.error("Rate limit 429 occurred AFTER partial content yielded. Cannot cleanly retry.")
                    raise e
                    
                wait_time = min(10, (2 ** attempt_count)) 
                logger.warning(f"Rate limit 429 hit. Retrying in {wait_time}s (attempt {attempt_count}/{max_retries})")
                await asyncio.sleep(wait_time)

    @classmethod
    async def stream_add_pages(
        cls,
        last_page_html: str,
        user_input: str,
        num_pages: Optional[int] = None
    ) -> AsyncIterator[str]:
        """
        Stream generation of new pages to append to an existing document.
        
        This generates ONLY new <div class="pdf-page"> elements without
        DOCTYPE, html, head, or body tags. The output can be directly
        appended to existing document HTML.
        
        Args:
            last_page_html: The last page of the existing document (for context/style matching)
            user_input: User's prompt describing what content to add
            num_pages: Optional number of pages to generate (1-10)
        
        Yields:
            HTML chunks containing new pdf-page elements
        """
        logger.info(f"Streaming add-pages generation (num_pages={num_pages})")
        
        # Calculate tokens for the requested pages
        base_tokens = 2000
        tokens_per_page = 1500
        if num_pages:
            max_tokens = min(base_tokens + (num_pages * tokens_per_page), 16000)
        else:
            max_tokens = 6000  # Default for 2-3 pages
        
        page_guidance = f"Generate EXACTLY {num_pages} new page(s)." if num_pages else "Generate 1-3 new pages as appropriate for the content."
        
        prompt = f"""You are an expert HTML document editor. Generate NEW PAGES to append to an existing document.

===== CONTEXT: LAST PAGE OF EXISTING DOCUMENT =====
{last_page_html[:4000]}

===== USER REQUEST =====
{user_input}

===== CRITICAL OUTPUT REQUIREMENTS =====
- {page_guidance}
- Output ONLY <div class="pdf-page">...</div> elements
- Do NOT include <!DOCTYPE>, <html>, <head>, <body>, or closing </body></html> tags
- Do NOT include <style> tags - reuse styles from the existing document
- Match the styling, fonts, and formatting of the existing document exactly
- Content should continue logically from the last page shown above
- Each page has 794px width x 1123px height with 38px padding (1047px usable vertical space)
- Use the same class names and structure as the existing pages
- Return ONLY raw HTML - no markdown, no explanations, no code fences
"""

        model_name = getattr(settings, "MISTRAL_MODEL", settings.MISTRAL_MODEL)
        config = cls._get_speed_config(max_tokens=max_tokens, response_mime_type="text/plain")
        config.system_instruction = (
            "You are an HTML document editor that appends new pages to existing documents. "
            "You output ONLY <div class='pdf-page'>...</div> elements. "
            "Never output DOCTYPE, html, head, body, or style tags."
        )
        
        client = cls._get_async_client()
        
        max_retries = 3
        attempt_count = 0
        
        while True:
            try:
                stream = await client.models.generate_content_stream(
                    model=model_name,
                    contents=[{"role": "user", "parts": [{"text": prompt}]}],
                    config=config
                )
                
                yielded_any = False
                async for chunk in stream:
                    text = cls._extract_response_text(chunk)
                    if text:
                        yielded_any = True
                        yield text
                
                break
                
            except ClientError as e:
                if e.code != 429:
                    raise e
                
                attempt_count += 1
                if attempt_count >= max_retries:
                    logger.error(f"Max retries reached for add-pages 429 error: {e}")
                    raise e
                    
                if yielded_any:
                    logger.error("Rate limit 429 occurred AFTER partial add-pages content yielded.")
                    raise e
                    
                wait_time = min(10, (2 ** attempt_count))
                logger.warning(f"Add-pages rate limit 429. Retrying in {wait_time}s (attempt {attempt_count}/{max_retries})")
                await asyncio.sleep(wait_time)

    @classmethod
    async def stream_edit_page(
        cls,
        target_page_html: str,
        prev_page_html: Optional[str],
        next_page_html: Optional[str],
        user_input: str
    ) -> AsyncIterator[str]:
        """
        Stream generation of a replacement page for an existing page.
        
        Args:
            target_page_html: The current page content to be edited
            prev_page_html: The page before the target (for context), or None
            next_page_html: The page after the target (for context), or None
            user_input: User's instructions for how to edit the page
        
        Yields:
            HTML chunks containing the replacement pdf-page element
        """
        logger.info("Streaming edit-page generation")
        
        max_tokens = 3500  # Single page
        
        context_parts = []
        if prev_page_html:
            context_parts.append(f"===== PREVIOUS PAGE (for context) =====\n{prev_page_html[:3000]}")
        context_parts.append(f"===== CURRENT PAGE TO EDIT =====\n{target_page_html}")
        if next_page_html:
            context_parts.append(f"===== NEXT PAGE (for context) =====\n{next_page_html[:3000]}")
        
        context = "\n\n".join(context_parts)
        
        prompt = f"""You are an expert HTML document editor. Edit the CURRENT PAGE based on the user's instructions.

{context}

===== USER EDIT INSTRUCTIONS =====
{user_input}

===== CRITICAL OUTPUT REQUIREMENTS =====
- Output EXACTLY ONE <div class="pdf-page">...</div> element
- This will REPLACE the current page shown above
- Do NOT include <!DOCTYPE>, <html>, <head>, <body>, or closing </body></html> tags
- Do NOT include <style> tags - reuse styles from the existing document
- Match the styling, fonts, and formatting of the existing document exactly
- Apply the user's edit instructions to transform the current page content
- Each page has 794px width x 1123px height with 38px padding (1047px usable vertical space)
- Use the same class names and structure as the existing pages
- Return ONLY raw HTML - no markdown, no explanations, no code fences
"""

        model_name = getattr(settings, "MISTRAL_MODEL", settings.MISTRAL_MODEL)
        config = cls._get_speed_config(max_tokens=max_tokens, response_mime_type="text/plain")
        config.system_instruction = (
            "You are an HTML document editor that edits a single page. "
            "You output ONLY ONE <div class='pdf-page'>...</div> element. "
            "Never output DOCTYPE, html, head, body, or style tags."
        )
        
        client = cls._get_async_client()
        
        max_retries = 3
        attempt_count = 0
        
        while True:
            try:
                stream = await client.models.generate_content_stream(
                    model=model_name,
                    contents=[{"role": "user", "parts": [{"text": prompt}]}],
                    config=config
                )
                
                yielded_any = False
                async for chunk in stream:
                    text = cls._extract_response_text(chunk)
                    if text:
                        yielded_any = True
                        yield text
                
                break
                
            except ClientError as e:
                if e.code != 429:
                    raise e
                
                attempt_count += 1
                if attempt_count >= max_retries:
                    logger.error(f"Max retries reached for edit-page 429 error: {e}")
                    raise e
                    
                if yielded_any:
                    logger.error("Rate limit 429 occurred AFTER partial edit-page content yielded.")
                    raise e
                    
                wait_time = min(10, (2 ** attempt_count))
                logger.warning(f"Edit-page rate limit 429. Retrying in {wait_time}s (attempt {attempt_count}/{max_retries})")
                await asyncio.sleep(wait_time)

    @classmethod
    async def analyze_edit_scope(
        cls,
        user_input: str,
        total_pages: int,
        document_type: str = "document"
    ) -> EditScope:
        """
        Analyze the user's request to determine if we can just patch specific pages
        or if we need to regenerate the whole document.
        """
        logger.info(f"Analyzing edit scope for input: '{user_input[:50]}...' on {total_pages} pages")
        
        # If document is small (<5 pages), just regenerate globally to be safe/consistent
        # unless it's a very specific clear typo fix.
        # However, for the sake of this prompt, we'll let the AI decide.
        
        prompt = f"""You are a Document Refresh Planner. Your job is to determine the SCOPE of changes needed.
        
        DOC METADATA:
        - Type: {document_type}
        - Total Pages: {total_pages}
        
        USER REQUEST:
        "{user_input}"
        
        DECISION RULES:
        1. "specific_pages": If the request is about fixing a typo, changing a specific section (e.g. "Work Experience"), or rephrasing a paragraph.
           - Provide the list of involved page numbers (1-based).
           - Be conservative: include the page before/after if context might spill over.
           - If the user says "Change X on page 3", involved pages = [3].
           - If user says "Update my experience", and experience is likely on page 1-2, involved pages = [1, 2].
           
        2. "global": If the request forces a layout shift (e.g. "Make font bigger", "Change theme"), adds significant length (e.g. "Add 5 new sections"), or affects the whole tone ("Rewrite everything to be funny").
        
        OUTPUT FORMAT:
        Return JSON matching this schema:
        {{
            "scope": "specific_pages" | "global",
            "involved_pages": [1, 2], // Only if scope is specific_pages
            "reasoning": "Explanation..."
        }}
        """
        
        client = cls._get_async_client()
        model_name = getattr(settings, "MISTRAL_MODEL", settings.MISTRAL_MODEL)
        
        try:
            # We enforce JSON output
            response = await client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=MistralConfig(
                    response_mime_type="application/json",
                    temperature=0.1 # Very deterministic
                )
            )
            
            text = cls._extract_response_text(response)
            # Parse Pydantic
            # Using orjson or pydantic parse
            import json
            data = json.loads(text)
            
            # Bound checks
            if data.get("involved_pages"):
                valid_pages = [p for p in data["involved_pages"] if 1 <= p <= total_pages]
                if not valid_pages and data["scope"] == "specific_pages":
                     # Fallback to global if pages are invalid
                     logger.warning("AI suggested specific pages but they were invalid. Fallback to global.")
                     return EditScope(scope="global", reasoning="Invalid page numbers predicted")
                data["involved_pages"] = sorted(list(set(valid_pages)))
            
            return EditScope(**data)
            
        except Exception as e:
            logger.error(f"Failed to analyze edit scope: {e}")
            # Fail safe -> Global
            return EditScope(scope="global", reasoning="Analysis failed, safety fallback")

    @classmethod
    async def stream_translate_page(
        cls,
        page_html: str,
        target_language: str
    ) -> AsyncIterator[str]:
        """
        Stream translation of a single page's HTML content.
        CRITICAL: Preserve HTML structure, classes, and layout. Translate TEXT only.
        """
        logger.info(f"Streaming translation for page to {target_language}")
        
        max_tokens = 3000
        
        prompt = f"""You are a Professional Document Translator.
        
        TASK: Translate the textual content of the provided HTML page to {target_language}.
        
        INPUT HTML:
        {page_html}
        
        ===== CRITICAL RULES =====
        1. **Preserve Structure**: Do NOT add, remove, or reorder any HTML tags (divs, spans, classes, etc.).
           - The output structure MUST match the input structure exactly.
           - Only the text inside the tags should change.
           
        2. **Preserve Layout**: Keep all <div class="pdf-page"> wrappers and internal classes.
        
        3. **Translate Content**:
           - Translate all visible text to {target_language}.
           - Adapt currency (e.g. $ -> relevant currency if needed, or keep generic) and dates if appropriate for the locale.
           - Keep proper nouns (names, companies) original unless there's a standard translation.
        
        4. **Output Format**:
           - Return ONLY the valid HTML for the page.
           - **CRITICAL**: Do NOT return markdown code blocks (e.g. ```html). Return raw HTML string only.
           - Ensure the output starts with <div class="pdf-page"> and ends with </div>.
        """
        
        model_name = getattr(settings, "MISTRAL_MODEL", settings.MISTRAL_MODEL)
        config = cls._get_speed_config(max_tokens=max_tokens, response_mime_type="text/plain")
        config.system_instruction = (
            f"You are a strict HTML Translator. You translate text to {target_language}. "
            "You NEVER change HTML structure, classes, or IDs."
        )
        
        client = cls._get_async_client()
        
        max_retries = 3
        attempt_count = 0
        
        while True:
            try:
                stream = await client.models.generate_content_stream(
                    model=model_name,
                    contents=[{"role": "user", "parts": [{"text": prompt}]}],
                    config=config
                )
                
                yielded_any = False
                async for chunk in stream:
                    text = cls._extract_response_text(chunk)
                    if text:
                        yielded_any = True
                        yield text
                
                break
                
            except ClientError as e:
                if e.code != 429:
                    raise e
                
                attempt_count += 1
                if attempt_count >= max_retries:
                    logger.error(f"Max retries reached for translate 429 error: {e}")
                    raise e
                    
                if yielded_any:
                    logger.error("Rate limit 429 occurred AFTER partial translate content yielded.")
                    raise e
                    
                wait_time = min(10, (2 ** attempt_count))
                logger.warning(f"Translate rate limit 429. Retrying in {wait_time}s")
                await asyncio.sleep(wait_time)

    @classmethod
    async def generate_from_files(
        cls,
        file_paths: List[Path],
        prompt: str
    ) -> str:
        """
        Generate document content by analyzing multiple files (PDFs, Images, etc.)
        using Mistral's File API.
        
        Args:
            file_paths: List of local paths to the files to be uploaded.
            prompt: User instructions for generation.
            
        Returns:
            The generated HTML string.
        """
        # Re-instantiate a clean client for upload operations (Sync typically)
        upload_client = MistralClient(api_key=settings.MISTRAL_API_KEY)
        
        # We reuse the async client for the generation part if possible, 
        # but the prompt example suggests using the same client for everything.
        # Let's trust the async client we have for generation, but use sync for upload if needed.
        # Actually, let's use the same client instance if possible or a new one to match the snippet.
        
        # Using a new client for this specific flow to ensure clean state and adherence to snippet
        client = cls._get_async_client() 
        model_name = getattr(settings, "MISTRAL_MODEL", settings.MISTRAL_MODEL)
        
        uploaded_files = []
        try:
             # 1. Upload (Using sync client for upload as per snippet recommendation/common SDK behavior)
             # We run this in a thread to avoid blocking the event loop
             def upload_and_wait(paths):
                 uploaded = []
                 for path in paths:
                     logger.info(f"Uploading file for AI analysis: {path}")
                     # Ensure path is string
                     file_obj = upload_client.files.upload(file=str(path))
                     uploaded.append(file_obj)
                 
                 # Wait for processing
                 for f in uploaded:
                     while f.state.name == "PROCESSING":
                         logger.info(f"Waiting for file {f.name} to process...")
                         time.sleep(2)
                         f = upload_client.files.get(name=f.name)
                     
                     if f.state.name != "ACTIVE":
                         raise Exception(f"File {f.name} failed to process. State: {f.state.name}")
                 return uploaded

             # Offload sync upload/wait to thread
             uploaded_files = await asyncio.to_thread(upload_and_wait, file_paths)
             
             logger.info(f"All {len(uploaded_files)} files processed. Generating content...")
             
             # 3. Generate (Using Async Client)
             # The uploaded_files objects from sync client might need to be compatible.
             # They are likely just references (names/uris). 
             # Mistral file references are passed to the generation client. 
             # but to be safe, we can just pass them as they are or check if we need to convert to Part.
             # The snippet says: contents=[*uploaded_files, prompt_text]
             
             response = await client.models.generate_content(
                model=model_name,
                contents=[*uploaded_files, prompt]
             )
             
             text = cls._extract_response_text(response)
             return text
             
        except Exception as e:
            logger.error(f"Error in generate_from_files: {e}")
            raise e

    @classmethod
    async def generate_from_multimodal(
        cls,
        file_paths: List[Path],
        youtube_urls: List[str],
        webpage_urls: List[str],
        prompt: str
    ) -> str:
        """
        Generate document from multimodal inputs: files, YouTube, web pages.
        Uses Mistral 2.5 Flash for input processing, Mistral 3 Pro for generation.
        """
        logger.info(f"Multimodal generation: {len(file_paths)} files, {len(youtube_urls)} videos, {len(webpage_urls)} pages")
        
        # Client(s)
        upload_client = MistralClient(api_key=settings.MISTRAL_API_KEY)
        async_client = cls._get_async_client()
        
        # Model names
        processing_model = settings.MISTRAL_MODEL
        generation_model = getattr(settings, "MISTRAL_MODEL", settings.MISTRAL_MODEL)
        
        content_parts = []
        
        try:
            # ===== 1. FILES (File API) =====
            if file_paths:
                def upload_and_wait(paths):
                    uploaded = []
                    for path in paths:
                        logger.info(f"Uploading file: {path}")
                        file_obj = upload_client.files.upload(file=str(path))
                        uploaded.append(file_obj)
                    
                    for f in uploaded:
                        retry_count = 0
                        while f.state.name == "PROCESSING" and retry_count < 30:
                            time.sleep(2)
                            f = upload_client.files.get(name=f.name)
                            retry_count += 1
                        
                        if f.state.name != "ACTIVE":
                            raise Exception(f"File {f.name} failed: {f.state.name}")
                    return uploaded
                
                uploaded_files = await asyncio.to_thread(upload_and_wait, file_paths)
                content_parts.extend(uploaded_files)
            
            # ===== 2. YOUTUBE URLs =====
            for yt_url in youtube_urls:
                if yt_url and "youtube.com" in yt_url:
                    logger.info(f"Adding YouTube: {yt_url}")
                    youtube_part = MistralPart.from_uri(
                        file_uri=yt_url,
                        mime_type="video/mp4"
                    )
                    content_parts.append(youtube_part)
            
            # ===== 3. WEB PAGES (Scrape) =====
            for web_url in webpage_urls:
                if not web_url:
                    continue
                try:
                    logger.info(f"Fetching webpage: {web_url}")
                    async with httpx.AsyncClient(timeout=30.0) as http_client:
                        response = await http_client.get(web_url)
                        response.raise_for_status()
                        html = response.text
                    
                    soup = BeautifulSoup(html, "html.parser")
                    for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
                        tag.decompose()
                    
                    text = soup.get_text(separator="\n", strip=True)[:10000]
                    content_parts.append(f"\n[Source: {web_url}]\n{text}\n")
                except Exception as e:
                    logger.warning(f"Failed to fetch webpage {web_url}: {e}")
            
            # ===== 4. PROMPT (Last) =====
            content_parts.append(prompt)
            
            # ===== STAGE 1: Analyze with 2.5 Flash =====
            logger.info(f"Stage 1: Analyzing inputs with {processing_model}")
            analysis_prompt = (
                "Analyze all the provided sources (files, videos, web pages) and extract "
                "the key information relevant to generating a professional document. "
                "Summarize the most important points, skills, experiences, and context."
            )
            content_parts_stage1 = content_parts[:-1] + [analysis_prompt]  # Replace final prompt
            
            analysis_response = await async_client.models.generate_content(
                model=processing_model,
                contents=content_parts_stage1
            )
            analysis_text = cls._extract_response_text(analysis_response)
            
            # ===== STAGE 2: Generate with Mistral 3 Pro =====
            logger.info(f"Stage 2: Generating document with {generation_model}")
            generation_prompt = f"""
Based on the following extracted information, generate a professional document.

=== EXTRACTED INFORMATION ===
{analysis_text}

=== USER REQUEST ===
{prompt}

=== OUTPUT REQUIREMENTS ===
Generate a beautifully formatted HTML document using the standard A4 page layout:
- Use <div class="pdf-page"> wrappers for each page.
- Professional typography and spacing.
- Return only valid HTML (no markdown blocks).
"""
            
            final_response = await async_client.models.generate_content(
                model=generation_model,
                contents=[generation_prompt]
            )
            
            return cls._extract_response_text(final_response)
            
        except Exception as e:
            logger.error(f"Error in generate_from_multimodal: {e}")
            raise e

    @classmethod
    async def stream_generate_from_multimodal(
        cls,
        file_paths: List[Path],
        youtube_urls: List[str],
        webpage_urls: List[str],
        prompt: str
    ) -> AsyncIterator[str]:
        """
        Stream generated document from multimodal inputs.
        2-Stage Process:
        1. Await analysis of inputs (Mistral 2.5 Flash).
        2. Stream generation of document (Mistral 3 Pro).
        """
        logger.info(f"Multimodal STREAM generation: {len(file_paths)} files, {len(youtube_urls)} videos, {len(webpage_urls)} pages")
        
        upload_client = MistralClient(api_key=settings.MISTRAL_API_KEY)
        async_client = cls._get_async_client()
        
        processing_model = settings.MISTRAL_MODEL
        generation_model = getattr(settings, "MISTRAL_MODEL", settings.MISTRAL_MODEL)
        
        content_parts = []
        
        try:
            # ===== 1. FILES (File API) =====
            if file_paths:
                def upload_and_wait(paths):
                    uploaded = []
                    for path in paths:
                        logger.info(f"Uploading file: {path}")
                        file_obj = upload_client.files.upload(file=str(path))
                        uploaded.append(file_obj)
                    
                    for f in uploaded:
                        retry_count = 0
                        while f.state.name == "PROCESSING" and retry_count < 30:
                            time.sleep(2)
                            f = upload_client.files.get(name=f.name)
                            retry_count += 1
                        if f.state.name != "ACTIVE":
                            raise Exception(f"File {f.name} failed: {f.state.name}")
                    return uploaded
                
                uploaded_files = await asyncio.to_thread(upload_and_wait, file_paths)
                content_parts.extend(uploaded_files)
            
            # ===== 2. YOUTUBE URLs =====
            for yt_url in youtube_urls:
                if yt_url and "youtube.com" in yt_url:
                    content_parts.append(MistralPart.from_uri(file_uri=yt_url, mime_type="video/mp4"))
            
            # ===== 3. WEB PAGES =====
            for web_url in webpage_urls:
                if not web_url: continue
                try:
                    async with httpx.AsyncClient(timeout=30.0) as http_client:
                        response = await http_client.get(web_url)
                        response.raise_for_status()
                        html = response.text
                    soup = BeautifulSoup(html, "html.parser")
                    for tag in soup(["script", "style", "nav", "footer"]): tag.decompose()
                    text = soup.get_text(separator="\n", strip=True)[:10000]
                    content_parts.append(f"\n[Source: {web_url}]\n{text}\n")
                except Exception as e:
                    logger.warning(f"Failed to fetch webpage {web_url}: {e}")
            
            # ===== 4. PROMPT & STAGE 1 (Analysis) =====
            content_parts.append(prompt)
            
            logger.info("Stage 1: Analyzing inputs (Before Stream)...")
            analysis_prompt = "Analyze provided sources and extract key info for a professional document. Summarize points, skills, etc."
            content_parts_stage1 = content_parts[:-1] + [analysis_prompt]
            
            analysis_response = await async_client.models.generate_content(
                model=processing_model,
                contents=content_parts_stage1
            )
            analysis_text = cls._extract_response_text(analysis_response)
            
            # ===== STAGE 2: Stream Generation =====
            logger.info("Stage 2: Streaming content generation...")
            generation_prompt = f"""
Based on the following extracted information, generate a professional document.

=== EXTRACTED INFORMATION ===
{analysis_text}

=== USER REQUEST ===
{prompt}

=== OUTPUT REQUIREMENTS ===
Generate a beautifully formatted HTML document using the standard A4 page layout:
- Use <div class="pdf-page"> wrappers for each page.
- Professional typography and spacing.
- Return only valid HTML (no markdown blocks).
"""
            stream = await async_client.models.generate_content_stream(
                model=generation_model,
                contents=[generation_prompt]
            )
            
            async for chunk in stream:
                text = cls._extract_response_text(chunk)
                if text:
                    yield text

        except Exception as e:
            logger.error(f"Error in stream_generate_from_multimodal: {e}")
            yield f"Error: {str(e)}"
            raise e
async def classify_document_intent(user_input: str) -> str:
    """Classify user intent into a document type: 'resume', 'cover_letter', or 'other'.
    Uses fast heuristics first; falls back to a lightweight model call.
    """
    text = (user_input or "").lower()
    resume_keywords = ["resume", "cv", "curriculum vitae", "profil", "compétences", "expérience"]
    cover_keywords = ["cover letter", "lettre de motivation", "motivation", "candidature", "poste"]
    if any(k in text for k in cover_keywords) and not any(k in text for k in resume_keywords):
        return "cover_letter"
    if any(k in text for k in resume_keywords) and not any(k in text for k in cover_keywords):
        return "resume"

    # Fallback to a quick model classification
    # Ambiguous intent defaults to resume, but we keep a conservative "other" when unclear.
    if any(k in text for k in resume_keywords) and any(k in text for k in cover_keywords):
        if text.count("cover") > text.count("resume"):
            return "cover_letter"
        if text.count("resume") > text.count("cover"):
            return "resume"
    return "other"

async def generate_ai_response(
    user_input: str,
    conversation_history: Optional[str] = None,
    document_type: Optional[str] = None,
    template_content: Optional[str] = None,
    template_id: Optional[str] = None,
    num_pages: Optional[int] = None
) -> str:
    """Generate an AI response for document creation using a single async content call.
    Template-aware and document-type constrained for consistent outputs.
    """
    return await AIGenerator.generate_document(
        user_input,
        conversation_history=conversation_history,
        document_type=document_type,
        template_content=template_content,
        template_id=template_id,
        num_pages=num_pages
    )

async def generate_title_from_input(user_input: str) -> str:
    """
    Generate a concise title (max 3 words) from the user input.
    Prioritizes Mistral, falls back to Mistral, then to simple truncation.
    """
    if not user_input:
        return "Untitled"

    prompt = (
        "Generate a generic, professional title for a document based on this user description.\n"
        "CRITICAL CONSTRAINTS:\n"
        "1. MAXIMUM 3 words.\n"
        "2. Output ONLY the title text.\n"
        "3. Do not use quotes, punctuation, or 'Title:'.\n"
        "4. Example valid outputs: 'Resume John Doe', 'Marketing Manager CV', 'Project Cover Letter'\n"
        f"\nUSER DESCRIPTION:\n{user_input[:1000]}"
    )

    # Helper for post-processing
    def clean_title(t: str) -> str:
        t = t.replace('"', '').replace("'", "").replace("Title:", "").strip()
        words = t.split()
        if len(words) > 3:
            t = " ".join(words[:3])
        return t

    # 1. Try Mistral (Preferred)
    try:
        if getattr(settings, "MISTRAL_API_KEY", None):
            client = AsyncOpenAI(
                api_key=settings.MISTRAL_API_KEY,
                base_url=settings.MISTRAL_BASE_URL
            )
            response = await client.chat.completions.create(
                model=settings.MISTRAL_MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=20,
                temperature=0.5
            )
            title = response.choices[0].message.content.strip()
            title = clean_title(title)
            if title:
                return title
    except Exception as e:
        logger.warning(f"Mistral title generation failed: {e}. Trying Mistral.")

    # 2. Try Mistral (Fallback)
    try:
        client = AIGenerator._get_async_client()
        model_name = getattr(settings, "MISTRAL_MODEL", settings.MISTRAL_MODEL)
        
        config = AIGenerator._get_speed_config(max_tokens=20, response_mime_type="text/plain")
        
        response = await client.models.generate_content(
            model=model_name,
            contents=[{"role": "user", "parts": [{"text": prompt}]}],
            config=config
        )
        
        title = AIGenerator._extract_response_text(response).strip()
        title = clean_title(title)
        
        if title:
            return title

    except Exception as e:
        logger.warning(f"Mistral title generation failed: {e}. Falling back to truncation.")

    # 3. Fallback to truncation
    clean_input = user_input.split("\n", 1)[0].replace('"', '').strip()
    words = clean_input.split()
    title = " ".join(words[:3])
    return title if title else "Untitled Document"