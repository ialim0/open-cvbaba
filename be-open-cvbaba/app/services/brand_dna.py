"""PostgreSQL/pgvector repository for brand design-system retrieval."""
from __future__ import annotations
import asyncio
import re
import uuid
from dataclasses import dataclass
from typing import Any
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.config import settings
from app.models.brand_dna import BrandDNAChunk
from app.services.chat.mistral_client import MistralClient

@dataclass(frozen=True)
class BrandChunk:
    id: str
    brand_id: str
    text: str
    metadata: dict[str, Any]
    vector: list[float] | None = None

class BrandDNAStore:
    """Repository that owns embedding and pgvector persistence.

    A Session is supplied per request; no mutable process-global state is used.
    Mistral embeddings are required so stored vectors always have 1024 dimensions.
    """
    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def _split(text: str) -> list[str]:
        return [chunk.strip() for chunk in re.split(r"\n\s*\n", text) if chunk.strip()]

    async def _embed(self, texts: list[str]) -> list[list[float]]:
        if not settings.MISTRAL_API_KEY:
            raise RuntimeError("MISTRAL_API_KEY is required to index brand DNA")
        client = MistralClient(settings.MISTRAL_API_KEY, settings.MISTRAL_BASE_URL)
        response = await client.embeddings.create(model=settings.MISTRAL_EMBEDDING_MODEL, inputs=texts)
        vectors = [list(item.embedding) for item in response.data]
        if any(len(vector) != 1024 for vector in vectors):
            raise ValueError("MISTRAL_EMBEDDING_MODEL must return 1024-dimensional vectors")
        return vectors

    async def add(self, owner_user_id: int, brand_id: str, text: str, metadata: dict[str, Any] | None = None) -> int:
        chunks = self._split(text)
        if not chunks:
            return 0
        vectors = await self._embed(chunks)
        source = str((metadata or {}).get("source", "manual"))[:255]
        rows = [BrandDNAChunk(owner_user_id=owner_user_id, brand_id=brand_id[:120], content=chunk,
                              source=source, metadata_json=metadata or {}, embedding=vector)
                for chunk, vector in zip(chunks, vectors)]
        self.db.add_all(rows)
        self.db.commit()
        return len(rows)

    async def search(self, owner_user_id: int, brand_id: str, query: str, limit: int = 8) -> list[BrandChunk]:
        vector = (await self._embed([query]))[0]
        stmt = (select(BrandDNAChunk)
                .where(BrandDNAChunk.owner_user_id == owner_user_id, BrandDNAChunk.brand_id == brand_id)
                .order_by(BrandDNAChunk.embedding.cosine_distance(vector))
                .limit(limit))
        rows = self.db.execute(stmt).scalars().all()
        return [BrandChunk(str(row.id), row.brand_id, row.content, row.metadata_json or {}) for row in rows]

    async def context(self, owner_user_id: int, brand_id: str | None, query: str, limit: int = 8) -> str:
        if not brand_id:
            return ""
        hits = await self.search(owner_user_id, brand_id, query, limit)
        return "\n\n".join(f"[{item.metadata.get('source', 'brand guideline')}] {item.text}" for item in hits)
