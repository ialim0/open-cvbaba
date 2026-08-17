"""Brand DNA ingestion and semantic retrieval endpoints."""
import ipaddress
import socket
from urllib.parse import urlparse
import httpx
from bs4 import BeautifulSoup
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from app.core.workspace import get_workspace_user
from app.models import User
from app.db import get_db
from sqlalchemy.orm import Session
from app.services.brand_dna import BrandDNAStore

router = APIRouter(prefix="/brand-dna")

@router.post("/ingest")
async def ingest_brand_source(
    brand_id: str = Form(..., min_length=1, max_length=120),
    text: str | None = Form(None),
    url: str | None = Form(None),
    source: str = Form("manual"),
    file: UploadFile | None = File(None),
    current_user: User = Depends(get_workspace_user),
    db: Session = Depends(get_db),
):
    """Ingest brand guidelines or extracted source text into a brand collection."""
    store = BrandDNAStore(db)
    content = text or ""
    if url and not content:
        parsed = urlparse(url)
        if parsed.scheme not in {"http", "https"} or not parsed.hostname:
            raise HTTPException(400, "URL must use http or https")
        try:
            addresses = await __import__("asyncio").to_thread(socket.getaddrinfo, parsed.hostname, None)
            if any(ipaddress.ip_address(item[4][0]).is_private for item in addresses):
                raise HTTPException(400, "Private network URLs are not allowed")
            async with httpx.AsyncClient(timeout=10, follow_redirects=True, limits=httpx.Limits(max_connections=4)) as client:
                response = await client.get(url, headers={"User-Agent": "open-cvbaba-brand-ingest/1.0"})
                response.raise_for_status()
            if len(response.content) > 10 * 1024 * 1024:
                raise HTTPException(413, "Website source is too large")
            content = BeautifulSoup(response.text, "html.parser").get_text("\n", strip=True)
            source = url[:255]
        except HTTPException:
            raise
        except (httpx.HTTPError, OSError, ValueError) as exc:
            raise HTTPException(502, "Unable to fetch website source") from exc
    if file:
        raw = await file.read()
        if len(raw) > 10 * 1024 * 1024:
            raise HTTPException(413, "Brand source is too large")
        if (file.content_type or "").startswith("text/") or (file.filename or "").endswith((".txt", ".md", ".css", ".html")):
            content = raw.decode("utf-8", errors="ignore")
        elif (file.filename or "").lower().endswith(".pdf"):
            from PyPDF2 import PdfReader
            import io
            content = "\n\n".join(page.extract_text() or "" for page in PdfReader(io.BytesIO(raw)).pages)
        else:
            raise HTTPException(415, "Use text, markdown, CSS, HTML, or PDF brand sources")
    if not content.strip(): raise HTTPException(400, "A non-empty text or supported file is required")
    count = await store.add(current_user.id, brand_id, content, {"source": source, "filename": file.filename if file else None})
    return {"brand_id": brand_id, "chunks_indexed": count}

@router.post("/search")
async def search_brand_source(
    brand_id: str = Form(...), query: str = Form(...), limit: int = Form(8, ge=1, le=20), current_user: User = Depends(get_workspace_user), db: Session = Depends(get_db)
):
    store = BrandDNAStore(db)
    hits = await store.search(current_user.id, brand_id, query, limit)
    return {"brand_id": brand_id, "results": [{"text": h.text, "metadata": h.metadata} for h in hits]}
