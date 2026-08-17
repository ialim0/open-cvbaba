"""
LangGraph Multi-Agent Document Generation Pipeline
===================================================
Architecture:
┌─────────────────┐     ┌──────────────────────┐     ┌──────────────┐     ┌─────────────┐
│ Visual Sketch / │────▶│ Parse Visual Layout  │────▶│ Parse Intent │────▶│ Plan Layout │
│ Napkin Photo    │     │  (Mistral Vision)    │     │(Mistral Large)│    │(Mistral Large)
└─────────────────┘     └──────────────────────┘     └──────────────┘     └──────┬──────┘
                                                                                 │
                                ┌────────────────────────────────────────────────┘
                                ▼
                       ┌──────────────┐     ┌─────────────┐
                       │ Validate HTML│◄────│Generate Code│
                       │  (parser)    │     │ (Codestral) │
                       └──────┬───────┘     └─────────────┘
                              │
                     ┌────────┴────────┐
                     ▼                 ▼
                ┌─────────┐      ┌──────────┐
                │  Error  │      │  Render  │
                │  Retry  │      │  to PDF  │
                └─────────┘      └──────────┘
"""

import json
import logging
import re
from typing import TypedDict, List, Optional, Dict, Any, Literal, AsyncIterator, Union
from pydantic import BaseModel, Field
from bs4 import BeautifulSoup
from langgraph.graph import StateGraph, START, END
from app.services.chat.html_renderer import render_html_screenshot

from app.config import settings
from app.services.chat.mistral_client import MistralClient, MistralConfig
from app.services.chat.html_completer import fix_incomplete_html

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Pydantic Schemas for Structured Node Outputs
# ---------------------------------------------------------------------------

class VisualLayoutData(BaseModel):
    has_sketch: bool = Field(default=True, description="Whether visual sketch or layout wireframe was analyzed")
    layout_type: str = Field(default="two-column-sidebar", description="Detected column/grid layout (e.g. single-column, two-column-sidebar, modern-split, header-banner, portfolio-grid)")
    column_ratio: str = Field(default="30_70", description="Column distribution ratio (e.g. 30_70, 50_50, 25_75, 100)")
    header_style: str = Field(default="top-banner", description="Detected header style (e.g. top-banner, split-header, left-sidebar-header, centered)")
    sections_order: List[str] = Field(default_factory=list, description="Ordered detected sections from sketch")
    visual_elements: List[str] = Field(default_factory=list, description="Detected visual UI elements (e.g. avatar_circle, skill_pill_tags, timeline_border, boxed_cards, rating_dots)")
    spatial_notes: str = Field(default="", description="Detailed summary of spatial wireframe")


class IntentData(BaseModel):
    document_type: str = Field(default="document", description="Type of document (e.g., cv, cover_letter, report, book, letter)")
    language: str = Field(default="en", description="Target output language")
    target_audience: str = Field(default="General", description="Target audience or industry")
    tone: str = Field(default="Professional", description="Tone and voice style")
    key_sections: List[str] = Field(default_factory=list, description="List of essential sections to include")
    key_highlights: List[str] = Field(default_factory=list, description="Core facts, accomplishments, or content items")
    formatting_requirements: List[str] = Field(default_factory=list, description="Specific layout/formatting constraints")


class LayoutPlanData(BaseModel):
    page_count: int = Field(default=1, description="Estimated/planned page count")
    color_palette: Dict[str, str] = Field(
        default_factory=lambda: {
            "primary": "#1f2937",
            "secondary": "#3b82f6",
            "accent": "#60a5fa",
            "background": "#ffffff",
            "text": "#111827",
            "text_muted": "#4b5563"
        },
        description="Hex colors for document styling"
    )
    typography: Dict[str, str] = Field(
        default_factory=lambda: {
            "heading_font": "Merriweather, serif",
            "body_font": "Inter, sans-serif",
            "body_size": "10.5pt",
            "h1_size": "22pt",
            "h2_size": "15pt",
            "h3_size": "12pt"
        },
        description="Font pairings and sizes in pt"
    )
    page_structure: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Section breakdown assigned to each page"
    )
    layout_system: str = Field(default="single-column", description="Grid/flex layout system (single-column, two-column-sidebar, modern-split)")


class VisualCritique(BaseModel):
    matches_request: bool = True
    issues: List[str] = Field(default_factory=list)
    fix_instructions: List[str] = Field(default_factory=list)
    severity: Literal["none", "minor", "major"] = "none"


class ValidationResult(BaseModel):
    is_valid: bool = Field(default=True, description="Whether HTML passes structural and syntax checks")
    errors: List[str] = Field(default_factory=list, description="Errors requiring regeneration")
    warnings: List[str] = Field(default_factory=list, description="Non-fatal warnings")
    page_count: int = Field(default=1, description="Number of detected .pdf-page elements")


# ---------------------------------------------------------------------------
# LangGraph Graph State Definition
# ---------------------------------------------------------------------------

class DocumentGraphState(TypedDict, total=False):
    # Inputs
    user_input: str
    conversation_history: Optional[str]
    document_type: Optional[str]
    template_content: Optional[str]
    template_id: Optional[str]
    num_pages: Optional[int]
    language: Optional[str]
    user_profile: Optional[Dict[str, Any]]
    attached_context: Optional[str]
    include_photo: bool
    photo_url: Optional[str]
    layout_image_base64: Optional[str]
    layout_image_url: Optional[str]
    brand_id: Optional[str]
    brand_context: Optional[str]

    # Pipeline Intermediate Data
    visual_layout: Optional[Dict[str, Any]]
    intent: Optional[Dict[str, Any]]
    layout_plan: Optional[Dict[str, Any]]
    generated_code: Optional[str]
    validation_result: Optional[Dict[str, Any]]
    screenshot_base64: Optional[str]
    visual_critique: Optional[Dict[str, Any]]
    error_feedback: Optional[str]
    retry_count: int
    max_retries: int

    # Final Output
    final_html: Optional[str]
    status: str
    logs: List[str]


# ---------------------------------------------------------------------------
# Helper: Mistral Client Instance
# ---------------------------------------------------------------------------

def _get_mistral_client() -> MistralClient:
    api_key = settings.MISTRAL_API_KEY
    base_url = getattr(settings, "MISTRAL_BASE_URL", "https://api.mistral.ai/v1")
    return MistralClient(api_key=api_key, base_url=base_url)


def _extract_clean_html(text: str) -> str:
    """Extract and sanitize HTML from model response."""
    if "```html" in text:
        parts = text.split("```html", 1)
        if len(parts) > 1:
            return parts[1].split("```", 1)[0].strip()
    elif "```" in text:
        parts = text.split("```", 1)
        if len(parts) > 1:
            return parts[1].split("```", 1)[0].strip()

    html_start = max(text.find("<!DOCTYPE html>"), text.find("<!doctype html>"), text.find("<html"))
    if html_start != -1:
        return text[html_start:].strip()

    return text.strip()


# ---------------------------------------------------------------------------
# Node 0: Parse Visual Layout (Mistral Vision / Pixtral)
# ---------------------------------------------------------------------------

async def parse_visual_layout_node(state: DocumentGraphState) -> Dict[str, Any]:
    """
    Vision-to-Layout Node: Uses Mistral Vision (Pixtral / Mistral Vision) to
    interpret napkin drawings, canvas sketches, or wireframe images and extract
    exact spatial intent into structured JSON.
    """
    layout_image_base64 = state.get("layout_image_base64")
    layout_image_url = state.get("layout_image_url")

    # If no sketch is provided, pass through
    if not layout_image_base64 and not layout_image_url:
        return {
            "visual_layout": None,
            "status": "no_visual_sketch"
        }

    vision_model = getattr(settings, "MISTRAL_VISION_MODEL", "pixtral-large-latest")
    client = _get_mistral_client()

    image_source = layout_image_url or (
        layout_image_base64 if layout_image_base64.startswith("data:") else f"data:image/png;base64,{layout_image_base64}"
    )

    system_instruction = (
        "You are an expert Vision-to-Layout Wireframe Interpreter.\n"
        "Analyze the provided napkin sketch, canvas drawing, or wireframe diagram.\n"
        "Extract the spatial layout structure, column division, section order, and visual design elements in JSON format.\n"
        "Your JSON MUST conform to this schema:\n"
        "{\n"
        '  "has_sketch": true,\n'
        '  "layout_type": "single-column" | "two-column-sidebar" | "modern-split" | "header-banner" | "portfolio-grid",\n'
        '  "column_ratio": "30_70" | "50_50" | "25_75" | "100",\n'
        '  "header_style": "top-banner" | "split-header" | "left-sidebar-header" | "centered",\n'
        '  "sections_order": ["Header", "Summary", "Experience", "Skills", ...],\n'
        '  "visual_elements": ["avatar_circle", "skill_pill_tags", "timeline_border", "boxed_cards", ...],\n'
        '  "spatial_notes": "Detailed summary of where elements are located on the page"\n'
        "}\n"
        "Return ONLY raw valid JSON without markdown code fences."
    )

    user_prompt = "Interpret this layout sketch/wireframe and extract its spatial structure for document generation."

    contents = [
        {"type": "text", "text": user_prompt},
        {"type": "image_url", "image_url": {"url": image_source}}
    ]

    try:
        config = MistralConfig(
            temperature=0.2,
            max_output_tokens=1500,
            system_instruction=system_instruction
        )
        response = await client.models.generate_content(
            model=vision_model,
            contents=contents,
            config=config
        )
        raw_text = response.text.strip()
        if raw_text.startswith("```"):
            raw_text = re.sub(r"^```(?:json)?\n?", "", raw_text)
            raw_text = re.sub(r"\n?```$", "", raw_text).strip()

        parsed = json.loads(raw_text)
        visual_layout = VisualLayoutData(**parsed).model_dump()
        logger.info(f"Visual layout successfully parsed from sketch: {visual_layout.get('layout_type')}")
    except Exception as e:
        logger.warning(f"Error interpreting visual sketch with Mistral Vision: {e}. Falling back to standard layout.")
        visual_layout = VisualLayoutData(
            has_sketch=True,
            layout_type="two-column-sidebar",
            column_ratio="30_70",
            header_style="top-banner",
            sections_order=["Header", "Summary", "Experience", "Skills", "Education"],
            visual_elements=["avatar_circle", "skill_pill_tags", "boxed_cards"],
            spatial_notes=f"Visual sketch provided (fallback parsing): {str(e)}"
        ).model_dump()

    return {
        "visual_layout": visual_layout,
        "status": "visual_layout_parsed"
    }


# ---------------------------------------------------------------------------
# Node 1: Parse Intent (Mistral Large)
# ---------------------------------------------------------------------------

async def parse_intent_node(state: DocumentGraphState) -> Dict[str, Any]:
    """
    Parse Intent Node: Uses Mistral Large to deeply analyze user request,
    identify document type, tone, language, audience, and key sections.
    """
    planning_model = getattr(settings, "MISTRAL_PLANNING_MODEL", "mistral-large-latest")
    client = _get_mistral_client()

    user_input = state.get("user_input", "")
    doc_type = state.get("document_type") or "document"
    lang = state.get("language") or "en"
    user_profile = state.get("user_profile") or {}
    attached_context = state.get("attached_context") or ""
    brand_context = state.get("brand_context") or ""
    visual_layout = state.get("visual_layout")

    system_instruction = (
        "You are an expert Document Intent Analyst.\n"
        "Analyze the user's document creation request and extract the core intent in JSON format.\n"
        "Your JSON MUST conform to this schema:\n"
        "{\n"
        '  "document_type": "cv" | "cover_letter" | "report" | "book" | "letter",\n'
        '  "language": "en" | "fr" | "de" | etc.,\n'
        '  "target_audience": "string",\n'
        '  "tone": "professional" | "academic" | "creative" | "executive",\n'
        '  "key_sections": ["Section 1", "Section 2", ...],\n'
        '  "key_highlights": ["Point 1", "Point 2", ...],\n'
        '  "formatting_requirements": ["Requirement 1", ...]\n'
        "}\n"
        "Return ONLY raw valid JSON. No markdown ticks, no conversational text."
    )

    user_content_parts = [
        f"User Prompt: {user_input}",
        f"Specified Document Type: {doc_type}",
        f"Target Language: {lang}",
        f"User Profile Info: {json.dumps(user_profile)}",
        f"Attached File/Web Context: {attached_context[:2000] if attached_context else 'None'}",
        f"Brand DNA Context: {brand_context[:3000] if brand_context else 'None'}"
    ]

    if visual_layout:
        user_content_parts.append(
            f"Visual Wireframe Sketch Analysis: {json.dumps(visual_layout)}"
        )

    user_content = "\n".join(user_content_parts)

    try:
        config = MistralConfig(
            temperature=0.2,
            max_output_tokens=1200,
            system_instruction=system_instruction
        )
        response = await client.models.generate_content(
            model=planning_model,
            contents=user_content,
            config=config
        )
        raw_text = response.text.strip()
        if raw_text.startswith("```"):
            raw_text = re.sub(r"^```(?:json)?\n?", "", raw_text)
            raw_text = re.sub(r"\n?```$", "", raw_text).strip()

        parsed = json.loads(raw_text)
        intent = IntentData(**parsed).model_dump()
    except Exception as e:
        logger.warning(f"Error parsing intent with Mistral Large: {e}. Using fallback defaults.")
        default_sections = visual_layout.get("sections_order") if visual_layout else ["Header", "Summary", "Experience", "Education", "Skills"]
        intent = IntentData(
            document_type=doc_type,
            language=lang,
            target_audience="Professional",
            tone="Professional",
            key_sections=default_sections or ["Header", "Summary", "Experience", "Education", "Skills"],
            key_highlights=[user_input[:200]],
            formatting_requirements=["Clean print-ready layout matching sketch" if visual_layout else "Clean print-ready layout"]
        ).model_dump()

    return {
        "intent": intent,
        "status": "intent_parsed"
    }


# ---------------------------------------------------------------------------
# Node 2: Plan Layout (Mistral Large)
# ---------------------------------------------------------------------------

async def plan_layout_node(state: DocumentGraphState) -> Dict[str, Any]:
    """
    Plan Layout Node: Uses Mistral Large to design a print-perfect CSS & page
    blueprint conforming to A4 physical dimensions, .pdf-page containers, and
    user hand-drawn visual sketch (if provided).
    """
    planning_model = getattr(settings, "MISTRAL_PLANNING_MODEL", "mistral-large-latest")
    client = _get_mistral_client()

    intent = state.get("intent") or {}
    visual_layout = state.get("visual_layout")
    template_content = state.get("template_content")
    template_id = state.get("template_id")
    brand_context = state.get("brand_context") or ""
    num_pages = state.get("num_pages") or 1
    doc_orientation = state.get("document_orientation") or "portrait"

    system_instruction = (
        "You are an expert Print Layout Architect.\n"
        "Create a comprehensive design & layout plan for a print-ready HTML/PDF document in JSON format.\n"
        "Rules:\n"
        "- Layout MUST be designed for physical A4 pages (width: 210mm, min-height: 297mm).\n"
        "- All content must be organized inside .pdf-page containers.\n"
        "- If a visual sketch / wireframe is provided, you MUST adopt the sketch's layout system, column ratio, and section order.\n"
        "- Typography: Use pt units (Body: 10pt-11pt, H1: 20pt-24pt, H2: 14pt-16pt).\n"
        "- Spacing: Use mm units for margins and padding.\n"
        "Your JSON output MUST match this schema:\n"
        "{\n"
        '  "page_count": 1,\n'
        '  "color_palette": {"primary": "#...", "secondary": "#...", "accent": "#...", "background": "#...", "text": "#...", "text_muted": "#..."},\n'
        '  "typography": {"heading_font": "...", "body_font": "...", "body_size": "10.5pt", "h1_size": "22pt", "h2_size": "15pt", "h3_size": "12pt"},\n'
        '  "page_structure": [{"page_number": 1, "sections": ["Header", "Summary", "Experience"], "layout_style": "header + 2-column"}],\n'
        '  "layout_system": "single-column" | "two-column-sidebar" | "modern-split"\n'
        "}\n"
        "Return ONLY raw JSON. No markdown, no commentary."
    )

    user_content_parts = [
        f"Intent Analysis: {json.dumps(intent)}",
        f"Target Page Count: {num_pages}",
        f"Document Orientation: {doc_orientation}",
        f"Template ID: {template_id or 'none'}",
        f"Template Sample Excerpt: {template_content[:1500] if template_content else 'None'}",
        f"Brand DNA (follow exactly where present): {brand_context[:4000] if brand_context else 'None'}"
    ]

    if visual_layout:
        user_content_parts.append(
            f"SPATIAL SKETCH DIRECTIVE (MUST MIRROR THIS STRUCTURE):\n{json.dumps(visual_layout, indent=2)}"
        )

    user_content = "\n\n".join(user_content_parts)

    try:
        config = MistralConfig(
            temperature=0.3,
            max_output_tokens=1500,
            system_instruction=system_instruction
        )
        response = await client.models.generate_content(
            model=planning_model,
            contents=user_content,
            config=config
        )
        raw_text = response.text.strip()
        if raw_text.startswith("```"):
            raw_text = re.sub(r"^```(?:json)?\n?", "", raw_text)
            raw_text = re.sub(r"\n?```$", "", raw_text).strip()

        parsed = json.loads(raw_text)
        layout_plan = LayoutPlanData(**parsed).model_dump()
    except Exception as e:
        logger.warning(f"Error planning layout with Mistral Large: {e}. Using fallback layout plan.")
        default_layout_sys = visual_layout.get("layout_type") if visual_layout else "two-column-sidebar"
        layout_plan = LayoutPlanData(
            page_count=num_pages,
            color_palette={
                "primary": "#0f172a",
                "secondary": "#2563eb",
                "accent": "#38bdf8",
                "background": "#ffffff",
                "text": "#1e293b",
                "text_muted": "#64748b"
            },
            typography={
                "heading_font": "Merriweather, serif",
                "body_font": "Inter, sans-serif",
                "body_size": "10.5pt",
                "h1_size": "22pt",
                "h2_size": "15pt",
                "h3_size": "12pt"
            },
            page_structure=[{"page_number": 1, "sections": intent.get("key_sections", ["Content"])}],
            layout_system=default_layout_sys
        ).model_dump()

    return {
        "layout_plan": layout_plan,
        "status": "layout_planned"
    }


# ---------------------------------------------------------------------------
# Node 3: Generate Code (Codestral)
# ---------------------------------------------------------------------------

async def generate_code_node(state: DocumentGraphState) -> Dict[str, Any]:
    """
    Generate Code Node: Uses Codestral (codestral-latest) to generate complete,
    valid HTML5 with embedded CSS inside .pdf-page containers following the
    intent, layout plan, and visual sketch directives.
    """
    code_model = getattr(settings, "MISTRAL_CODE_MODEL", "codestral-latest")
    client = _get_mistral_client()

    user_input = state.get("user_input", "")
    intent = state.get("intent") or {}
    visual_layout = state.get("visual_layout")
    layout_plan = state.get("layout_plan") or {}
    template_content = state.get("template_content")
    error_feedback = state.get("error_feedback")
    num_pages = state.get("num_pages") or 1
    attached_context = state.get("attached_context")
    brand_context = state.get("brand_context") or ""
    include_photo = state.get("include_photo", False)
    photo_url = state.get("photo_url")

    system_instruction = (
        "You are Codestral, an expert Frontend & Layout Engineer generating print-perfect HTML documents.\n\n"
        "CRITICAL RULES:\n"
        "1. Output ONLY valid, complete HTML5 with an embedded <style> block.\n"
        "2. Do NOT output markdown code blocks (no ```html), JSON, or conversational filler.\n"
        "3. Every page MUST be wrapped in `<div class=\"pdf-page\">...</div>`.\n"
        "4. Layout standard: width: 210mm; min-height: 297mm; padding: 15mm; margin: 0 auto 20px auto; background: white;\n"
        "5. @page rule: @page { size: A4; margin: 0; }\n"
        "6. Typography: Use Google Fonts @import ('Inter', 'Merriweather'). Use pt units for text.\n"
        "7. Spacing: Use mm for padding and margins. No px units.\n"
        "8. Headings: page-break-after: avoid. Paragraphs: orphans: 2; widows: 2.\n"
        "9. Make sure all tags are cleanly closed (</html>, </body>, </div>)."
    )

    prompt_parts = [
        f"===== USER GOAL & INPUT =====\n{user_input}",
        f"===== INTENT ANALYSIS =====\n{json.dumps(intent, indent=2)}",
        f"===== LAYOUT PLAN BLUEPRINT =====\n{json.dumps(layout_plan, indent=2)}",
    ]

    if visual_layout:
        prompt_parts.append(
            f"===== SPATIAL WIREFRAME DIRECTIVE (FROM USER'S HAND-DRAWN SKETCH) =====\n"
            f"- Column Layout: {visual_layout.get('layout_type')} ({visual_layout.get('column_ratio')})\n"
            f"- Header Style: {visual_layout.get('header_style')}\n"
            f"- Section Ordering: {' -> '.join(visual_layout.get('sections_order', []))}\n"
            f"- Visual Design Elements: {', '.join(visual_layout.get('visual_elements', []))}\n"
            f"- Spatial Notes: {visual_layout.get('spatial_notes')}\n"
            f"Mirror the user's sketch faithfully using CSS grid / flexbox."
        )

    if brand_context:
        prompt_parts.append(f"===== BRAND DNA DESIGN SYSTEM (AUTHORITATIVE) =====\n{brand_context[:6000]}\nUse these exact colors, fonts, spacing and header/footer patterns.")

    if template_content:
        prompt_parts.append(f"===== BASE TEMPLATE STRUCTURE =====\n{template_content[:3000]}")

    if attached_context:
        prompt_parts.append(f"===== ATTACHED CONTENT CONTEXT =====\n{attached_context[:2500]}")

    if include_photo and photo_url:
        prompt_parts.append(f"===== USER PHOTO =====\nInclude profile photo: <img src=\"{photo_url}\" class=\"profile-photo\" alt=\"Profile\" />")

    if error_feedback:
        prompt_parts.append(
            f"===== PREVIOUS VALIDATION ERRORS (MUST FIX IN THIS GENERATION) =====\n{error_feedback}"
        )

    prompt_parts.append(
        "===== FINAL DIRECTIVE =====\n"
        f"Generate exactly {num_pages} page container(s) and never exceed {num_pages}. "
        f"Generate the full {num_pages}-page document now. Return ONLY raw HTML starting with <!DOCTYPE html>."
    )

    full_prompt = "\n\n".join(prompt_parts)

    max_tokens = max(3500, min(16000, num_pages * 3000))

    config = MistralConfig(
        temperature=0.2,
        max_output_tokens=max_tokens,
        system_instruction=system_instruction
    )

    try:
        response = await client.models.generate_content(
            model=code_model,
            contents=full_prompt,
            config=config
        )
        raw_html = _extract_clean_html(response.text)
    except Exception as e:
        logger.error(f"Codestral code generation error: {e}")
        fallback_model = getattr(settings, "MISTRAL_MODEL", "mistral-large-latest")
        logger.info(f"Retrying code generation with fallback model: {fallback_model}")
        response = await client.models.generate_content(
            model=fallback_model,
            contents=full_prompt,
            config=config
        )
        raw_html = _extract_clean_html(response.text)

    return {
        "generated_code": raw_html,
        "status": "code_generated"
    }


# ---------------------------------------------------------------------------
# Node 4: Validate HTML (Parser & DOM Validation)
# ---------------------------------------------------------------------------

async def validate_html_node(state: DocumentGraphState) -> Dict[str, Any]:
    """
    Validate HTML Node: Uses BeautifulSoup to parse and validate HTML5 structure,
    .pdf-page containers, CSS @page rules, and tag integrity.
    """
    raw_html = state.get("generated_code", "") or ""
    errors: List[str] = []
    warnings: List[str] = []

    if not raw_html or len(raw_html.strip()) < 50:
        errors.append("Generated HTML is empty or too short.")
        return {
            "validation_result": ValidationResult(is_valid=False, errors=errors, warnings=warnings, page_count=0).model_dump(),
            "status": "validation_failed"
        }

    if "<html" not in raw_html.lower():
        errors.append("Missing root <html> tag.")

    if "```html" in raw_html or "```" in raw_html:
        warnings.append("Raw markdown codeblock delimiters detected in output.")
        raw_html = _extract_clean_html(raw_html)

    try:
        soup = BeautifulSoup(raw_html, "html.parser")
    except Exception as e:
        errors.append(f"HTML parsing failed with syntax error: {str(e)}")
        return {
            "validation_result": ValidationResult(is_valid=False, errors=errors, warnings=warnings, page_count=0).model_dump(),
            "status": "validation_failed"
        }

    pages = soup.find_all(class_=re.compile(r"\bpdf-page\b"))
    target_pages = max(1, min(int(state.get("num_pages") or 1), 4))
    if not pages:
        errors.append("Document missing required .pdf-page container element.")
    elif len(pages) > target_pages:
        errors.append(f"Document contains {len(pages)} pages; maximum for this request is {target_pages}.")

    styles = soup.find_all("style")
    style_text = "\n".join(s.get_text() for s in styles) if styles else ""
    if "@page" not in style_text:
        warnings.append("Missing CSS @page size declaration.")

    is_valid = len(errors) == 0
    return {
        "validation_result": ValidationResult(
            is_valid=is_valid,
            errors=errors,
            warnings=warnings,
            page_count=len(pages)
        ).model_dump(),
        "status": "validated" if is_valid else "validation_failed"
    }


# ---------------------------------------------------------------------------
# Node 5: Error Retry (Feedback Formulation for Codestral)
# ---------------------------------------------------------------------------

async def error_retry_node(state: DocumentGraphState) -> Dict[str, Any]:
    """
    Error Retry Node: Analyzes validation errors and formats concrete,
    actionable fix instructions to feed back into Codestral.
    """
    validation = state.get("validation_result") or {}
    errors = validation.get("errors", [])
    warnings = validation.get("warnings", [])
    retry_count = state.get("retry_count", 0) + 1

    feedback_parts = [
        f"Attempt {retry_count} produced validation errors:",
    ]
    for err in errors:
        feedback_parts.append(f"- ERROR: {err}")
    for warn in warnings:
        feedback_parts.append(f"- WARNING: {warn}")

    feedback_parts.append(
        "\nCORRECTION DIRECTIVES:\n"
        "1. Ensure root <html>, <head>, <style>, and <body> tags are properly formed.\n"
        "2. Ensure all content is wrapped in `<div class=\"pdf-page\">...</div>`.\n"
        "3. Include `@page { size: A4; margin: 0; }` in your <style>.\n"
        "4. Close every HTML tag cleanly without markdown delimiters."
    )

    error_feedback = "\n".join(feedback_parts)
    logger.info(f"Formulated error feedback for Codestral retry {retry_count}:\n{error_feedback}")

    return {
        "error_feedback": error_feedback,
        "retry_count": retry_count,
        "status": "retrying"
    }


# ---------------------------------------------------------------------------
# Node 6: Render + Visual Critique

async def visual_critic_node(state: DocumentGraphState) -> Dict[str, Any]:
    """Render the current HTML and ask a vision model for actionable repairs."""
    html = state.get("generated_code", "") or ""
    screenshot = await render_html_screenshot(html)
    if not screenshot or not getattr(settings, "ENABLE_VISUAL_CRITIC", True):
        return {"visual_critique": VisualCritique().model_dump(), "status": "visual_critique_skipped"}
    client = _get_mistral_client()
    prompt = """Review this rendered document against the user's request and layout plan. Return ONLY JSON: {\"matches_request\":true|false,\"issues\":[string],\"fix_instructions\":[string],\"severity\":\"none\"|\"minor\"|\"major\"}. Focus on spatial hierarchy, clipping, overflow, whitespace, typography and brand compliance."""
    try:
        response = await client.models.generate_content(
            model=getattr(settings, "MISTRAL_CRITIC_MODEL", "mistral-large-latest"),
            contents=[{"type":"text", "text": prompt + "\nUser request: " + state.get("user_input", "")}, {"type":"image_url", "image_url":{"url": "data:image/png;base64," + screenshot}}],
            config=MistralConfig(temperature=0.1, max_output_tokens=1200),
        )
        raw=response.text.strip()
        raw=re.sub(r"^```(?:json)?\s*|\s*```$", "", raw).strip()
        critique=VisualCritique(**json.loads(raw)).model_dump()
    except Exception as exc:
        logger.warning("Visual critique unavailable: %s", exc)
        critique=VisualCritique().model_dump()
    return {"screenshot_base64": screenshot, "visual_critique": critique, "status": "visual_critique_complete"}

async def visual_repair_node(state: DocumentGraphState) -> Dict[str, Any]:
    critique=state.get("visual_critique") or {}
    instructions=critique.get("fix_instructions", [])
    issues=critique.get("issues", [])
    feedback="Visual QA found issues in the rendered screenshot:\n" + "\n".join(f"- {x}" for x in issues + instructions)
    return {"error_feedback": feedback, "retry_count": state.get("retry_count", 0) + 1, "status": "visual_repair_requested"}

def decide_visual_next_step(state: DocumentGraphState) -> Literal["render_to_pdf", "visual_repair"]:
    critique=state.get("visual_critique") or {}
    if critique.get("matches_request", True) or not critique.get("issues"):
        return "render_to_pdf"
    if state.get("retry_count", 0) < min(state.get("max_retries", 3), getattr(settings, "VISUAL_CRITIC_MAX_RETRIES", 2)):
        return "visual_repair"
    return "render_to_pdf"


# ---------------------------------------------------------------------------
# Node 6: Render to PDF / Finalize Document
# ---------------------------------------------------------------------------

async def render_to_pdf_node(state: DocumentGraphState) -> Dict[str, Any]:
    """
    Render to PDF / Finalizer Node: Applies HTML auto-completion and final
    sanitization to produce the finalized document.
    """
    raw_html = state.get("generated_code", "")
    clean_html = _extract_clean_html(raw_html)

    try:
        res = fix_incomplete_html(clean_html)
        fixed_html = res[0] if isinstance(res, tuple) else res
    except Exception as e:
        logger.warning(f"Error in fix_incomplete_html sanitizer: {e}. Using raw clean HTML.")
        fixed_html = clean_html

    if fixed_html:
        clean_html = fixed_html

    if not clean_html.startswith("<!DOCTYPE") and not clean_html.startswith("<!doctype"):
        clean_html = "<!DOCTYPE html>\n" + clean_html

    return {
        "final_html": clean_html,
        "status": "completed"
    }


# ---------------------------------------------------------------------------
# Conditional Edge Router
# ---------------------------------------------------------------------------

def decide_next_step(state: DocumentGraphState) -> Literal["render_to_pdf", "error_retry"]:
    """
    Conditional Edge: Checks if validation passed or if retries are available.
    """
    validation = state.get("validation_result") or {}
    is_valid = validation.get("is_valid", False)
    retry_count = state.get("retry_count", 0)
    max_retries = state.get("max_retries", 3)

    if is_valid:
        return "render_to_pdf"

    if retry_count < max_retries:
        return "error_retry"

    logger.warning(f"Max retries ({max_retries}) reached. Proceeding to final HTML sanitizer.")
    return "render_to_pdf"


# ---------------------------------------------------------------------------
# LangGraph Graph Assembly & Compilation
# ---------------------------------------------------------------------------

def create_document_generation_graph():
    """
    Build and compile the multi-agent LangGraph workflow with Vision-to-Layout support.
    """
    workflow = StateGraph(DocumentGraphState)

    # Add Nodes
    workflow.add_node("parse_visual_layout", parse_visual_layout_node)
    workflow.add_node("parse_intent", parse_intent_node)
    workflow.add_node("plan_layout", plan_layout_node)
    workflow.add_node("generate_code", generate_code_node)
    workflow.add_node("validate_html", validate_html_node)
    workflow.add_node("error_retry", error_retry_node)
    workflow.add_node("visual_critic", visual_critic_node)
    workflow.add_node("visual_repair", visual_repair_node)
    workflow.add_node("render_to_pdf", render_to_pdf_node)

    # Add Directed Edges
    workflow.add_edge(START, "parse_visual_layout")
    workflow.add_edge("parse_visual_layout", "parse_intent")
    workflow.add_edge("parse_intent", "plan_layout")
    workflow.add_edge("plan_layout", "generate_code")
    workflow.add_edge("generate_code", "validate_html")

    # Add Conditional Branching from Validation
    workflow.add_conditional_edges(
        "validate_html",
        decide_next_step,
        {
            "render_to_pdf": "render_to_pdf",
            "error_retry": "error_retry"
        }
    )

    # Loop retry back to Codestral code generation
    workflow.add_edge("error_retry", "generate_code")
    workflow.add_edge("render_to_pdf", "visual_critic")
    workflow.add_conditional_edges("visual_critic", decide_visual_next_step, {"render_to_pdf": END, "visual_repair": "visual_repair"})
    workflow.add_edge("visual_repair", "generate_code")

    # Finalize to END
    return workflow.compile()


# Compile global graph instance
document_generation_graph = create_document_generation_graph()


# ---------------------------------------------------------------------------
# Public Execution APIs
# ---------------------------------------------------------------------------

async def generate_document_with_langgraph(
    user_input: str,
    conversation_history: Optional[str] = None,
    document_type: Optional[str] = None,
    template_content: Optional[str] = None,
    template_id: Optional[str] = None,
    num_pages: Optional[int] = 1,
    language: Optional[str] = "en",
    user_profile: Optional[Dict[str, Any]] = None,
    attached_context: Optional[str] = None,
    include_photo: bool = False,
    photo_url: Optional[str] = None,
    layout_image_base64: Optional[str] = None,
    layout_image_url: Optional[str] = None,
    brand_id: Optional[str] = None,
    brand_context: Optional[str] = None,
    max_retries: int = 3
) -> str:
    """
    Execute the multi-agent LangGraph workflow end-to-end and return the final HTML.
    Supports text prompts and multimodal hand-drawn layout sketches.
    """
    initial_state: DocumentGraphState = {
        "user_input": user_input,
        "conversation_history": conversation_history,
        "document_type": document_type,
        "template_content": template_content,
        "template_id": template_id,
        "num_pages": num_pages or 1,
        "language": language or "en",
        "user_profile": user_profile,
        "attached_context": attached_context,
        "include_photo": include_photo,
        "photo_url": photo_url,
        "layout_image_base64": layout_image_base64,
        "layout_image_url": layout_image_url,
        "brand_id": brand_id,
        "brand_context": brand_context,
        "retry_count": 0,
        "max_retries": max_retries,
        "logs": []
    }

    final_state = await document_generation_graph.ainvoke(initial_state)
    return final_state.get("final_html", "")


async def stream_document_with_langgraph(
    user_input: str,
    conversation_history: Optional[str] = None,
    document_type: Optional[str] = None,
    template_content: Optional[str] = None,
    template_id: Optional[str] = None,
    num_pages: Optional[int] = 1,
    language: Optional[str] = "en",
    user_profile: Optional[Dict[str, Any]] = None,
    attached_context: Optional[str] = None,
    include_photo: bool = False,
    photo_url: Optional[str] = None,
    layout_image_base64: Optional[str] = None,
    layout_image_url: Optional[str] = None,
    max_retries: int = 3
) -> AsyncIterator[str]:
    """
    Stream document generation using LangGraph with Vision-to-Layout support.
    Yields HTML chunks and tokens as Codestral generates them, then validates
    and yields the complete document.
    """
    # 1. Parse visual wireframe sketch if provided
    visual_layout = None
    if layout_image_base64 or layout_image_url:
        vision_state = await parse_visual_layout_node({
            "layout_image_base64": layout_image_base64,
            "layout_image_url": layout_image_url
        })
        visual_layout = vision_state.get("visual_layout")

    # 2. Run intent parsing and layout planning with Mistral Large
    intent_state = await parse_intent_node({
        "user_input": user_input,
        "document_type": document_type,
        "language": language,
        "user_profile": user_profile,
        "attached_context": attached_context,
        "visual_layout": visual_layout
    })

    layout_state = await plan_layout_node({
        "intent": intent_state.get("intent"),
        "visual_layout": visual_layout,
        "template_content": template_content,
        "template_id": template_id,
        "num_pages": num_pages,
        "document_orientation": "portrait"
    })

    # 3. Stream generation with Codestral
    code_model = getattr(settings, "MISTRAL_CODE_MODEL", "codestral-latest")
    client = _get_mistral_client()

    system_instruction = (
        "You are Codestral, an expert Frontend & Layout Engineer generating print-perfect HTML documents.\n"
        "Output ONLY valid HTML5 wrapped in .pdf-page containers. No markdown ticks, no conversational text."
    )

    prompt_parts = [
        f"===== USER REQUEST =====\n{user_input}",
        f"===== INTENT ANALYSIS =====\n{json.dumps(intent_state.get('intent'), indent=2)}",
        f"===== LAYOUT PLAN =====\n{json.dumps(layout_state.get('layout_plan'), indent=2)}"
    ]

    if visual_layout:
        prompt_parts.append(
            f"===== SPATIAL SKETCH DIRECTIVE =====\n"
            f"- Layout Structure: {visual_layout.get('layout_type')} ({visual_layout.get('column_ratio')})\n"
            f"- Header Style: {visual_layout.get('header_style')}\n"
            f"- Section Ordering: {' -> '.join(visual_layout.get('sections_order', []))}\n"
            f"- Visual Design Elements: {', '.join(visual_layout.get('visual_elements', []))}\n"
            f"- Spatial Notes: {visual_layout.get('spatial_notes')}"
        )

    if template_content:
        prompt_parts.append(f"===== TEMPLATE =====\n{template_content[:2500]}")

    prompt_parts.append("Generate the complete HTML5 document now.")
    full_prompt = "\n\n".join(prompt_parts)

    config = MistralConfig(
        temperature=0.2,
        max_output_tokens=max(3500, min(16000, (num_pages or 1) * 3000)),
        system_instruction=system_instruction
    )

    stream = await client.models.generate_content_stream(
        model=code_model,
        contents=full_prompt,
        config=config
    )

    chunks = []
    async for chunk in stream:
        text = ""
        if hasattr(chunk, "choices") and chunk.choices:
            choice = chunk.choices[0]
            if hasattr(choice, "delta") and hasattr(choice.delta, "content") and choice.delta.content:
                text = choice.delta.content
            elif hasattr(choice, "text") and choice.text:
                text = choice.text
        elif hasattr(chunk, "text") and chunk.text:
            text = chunk.text

        if text:
            chunks.append(text)
            yield text

    # If stream was empty, run fallback graph invocation
    if not chunks:
        final_html = await generate_document_with_langgraph(
            user_input=user_input,
            conversation_history=conversation_history,
            document_type=document_type,
            template_content=template_content,
            template_id=template_id,
            num_pages=num_pages,
            language=language,
            user_profile=user_profile,
            attached_context=attached_context,
            include_photo=include_photo,
            photo_url=photo_url,
            layout_image_base64=layout_image_base64,
            layout_image_url=layout_image_url,
            max_retries=max_retries
        )
        yield final_html
