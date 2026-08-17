from __future__ import annotations

import asyncio
import base64
import io
import json
import logging
from typing import AsyncIterator

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, WebSocket, WebSocketDisconnect

from app.config import settings
from app.core.workspace import get_workspace_user
from app.models import User
import httpx

logger = logging.getLogger(__name__)
router = APIRouter()


def _client():
    from mistralai import Mistral
    return Mistral(api_key=settings.MISTRAL_API_KEY)


def _require_key() -> None:
    if not settings.MISTRAL_API_KEY:
        raise HTTPException(status_code=503, detail="MISTRAL_API_KEY is not configured")



@router.post("/realtime/token")
async def create_realtime_token(current_user: User = Depends(get_workspace_user)):
    """Mint a short-lived Mistral realtime token for the browser microphone client."""
    _require_key()
    model = settings.MISTRAL_REALTIME_MODEL
    try:
        async with httpx.AsyncClient(timeout=15.0) as http_client:
            response = await http_client.post(
                f"{settings.MISTRAL_BASE_URL.rstrip('/')}/client/sessions",
                headers={
                    "Authorization": f"Bearer {settings.MISTRAL_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={"purpose": "realtime", "model": model},
            )
        response.raise_for_status()
        payload = response.json()
        client_secret = payload.get("client_secret") or {}
        token = client_secret.get("value")
        if not token:
            raise ValueError("Mistral did not return a realtime client token")
        return {
            "token": token,
            "model": model,
            "expires_at": client_secret.get("expires_at") or payload.get("expires_at"),
        }
    except (httpx.HTTPError, ValueError) as exc:
        logger.exception("Failed to mint Mistral realtime token")
        raise HTTPException(status_code=502, detail="Unable to start realtime transcription") from exc

@router.post("/extract_text")
async def extract_text(file: UploadFile = File(...)):
    """Extract text from a PDF or image using Mistral OCR."""
    _require_key()
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded file is empty")
    mime = (file.content_type or "application/octet-stream").lower()
    if mime == "application/pdf" or (file.filename or "").lower().endswith(".pdf"):
        document = {"type": "document_url", "document_url": f"data:application/pdf;base64,{base64.b64encode(content).decode()}"}
    elif mime.startswith("image/"):
        document = {"type": "image_url", "image_url": f"data:{mime};base64,{base64.b64encode(content).decode()}"}
    else:
        raise HTTPException(status_code=415, detail="Only PDF and image files are supported")
    try:
        response = await asyncio.to_thread(
            _client().ocr.process,
            model=settings.MISTRAL_OCR_MODEL,
            document=document,
            table_format="html",
            include_image_base64=False,
        )
        pages = getattr(response, "pages", None)
        if pages is None:
            pages = response.get("pages", []) if isinstance(response, dict) else []
        def page_markdown(page):
            return getattr(page, "markdown", None) or (page.get("markdown", "") if isinstance(page, dict) else "")
        text = "\n\n".join(page_markdown(page) for page in pages)
        return {"extracted_text": text, "pages": len(pages), "model": settings.MISTRAL_OCR_MODEL}
    except Exception as exc:
        logger.exception("Mistral OCR failed")
        raise HTTPException(status_code=502, detail="Mistral OCR failed") from exc


@router.post("/vision/parse-layout")
async def parse_vision_layout(
    file: Optional[UploadFile] = File(None),
    image_base64: Optional[str] = None
):
    """
    Interpret a hand-drawn sketch, napkin drawing, or wireframe image
    into structured spatial layout AST using Mistral Vision.
    """
    _require_key()
    from app.services.chat.langgraph_pipeline import parse_visual_layout_node

    img_b64 = image_base64
    if file:
        content = await file.read()
        mime = (file.content_type or "image/png").lower()
        img_b64 = f"data:{mime};base64,{base64.b64encode(content).decode()}"

    if not img_b64:
        raise HTTPException(status_code=400, detail="Must provide an uploaded image file or image_base64 string")

    result = await parse_visual_layout_node({"layout_image_base64": img_b64})
    visual_layout = result.get("visual_layout")
    if not visual_layout:
        raise HTTPException(status_code=422, detail="Failed to interpret layout from provided sketch")

    return visual_layout


async def _audio_chunks(websocket: WebSocket) -> AsyncIterator[bytes]:
    while True:
        yield await websocket.receive_bytes()


@router.websocket("/ws/transcribe/{language}")
async def realtime_transcription(websocket: WebSocket, language: str = "en-US"):
    """Stream 16-bit mono PCM audio to Mistral Voxtral realtime transcription."""
    await websocket.accept()
    if not settings.MISTRAL_API_KEY:
        await websocket.send_json({"type": "error", "text": "MISTRAL_API_KEY is not configured", "is_final": True})
        await websocket.close(code=1011)
        return
    try:
        from mistralai.client.models import AudioFormat
        client = _client()
        partial_text = ""
        async for event in client.audio.realtime.transcribe_stream(
            audio_stream=_audio_chunks(websocket),
            model=settings.MISTRAL_REALTIME_MODEL,
            audio_format=AudioFormat(encoding="pcm_s16le", sample_rate=16000),
        ):
            text = getattr(event, "text", None)
            if text:
                partial_text += text
                await websocket.send_json({"type": "partial", "text": partial_text, "is_final": False})
            if event.__class__.__name__ == "TranscriptionStreamDone":
                await websocket.send_json({"type": "transcription", "text": partial_text.strip(), "is_final": True})
    except WebSocketDisconnect:
        logger.debug("Realtime transcription client disconnected")
    except Exception as exc:
        logger.exception("Mistral realtime transcription failed")
        try:
            await websocket.send_json({"type": "error", "text": "Mistral realtime transcription failed", "is_final": True})
            await websocket.close(code=1011)
        except Exception:
            pass
