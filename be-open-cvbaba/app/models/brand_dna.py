"""Persistent brand DNA chunks stored in PostgreSQL + pgvector."""
from __future__ import annotations
import uuid
from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.db import Base

try:
    from pgvector.sqlalchemy import Vector
except ImportError:  # Allows non-database unit tests before dependencies are installed.
    Vector = Text  # type: ignore[misc,assignment]

class BrandDNAChunk(Base):
    __tablename__ = "brand_dna_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    brand_id = Column(String(120), nullable=False)
    content = Column(Text, nullable=False)
    source = Column(String(255), nullable=False, default="manual")
    metadata_json = Column(JSONB, nullable=False, default=dict)
    embedding = Column(Vector(1024), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_brand_dna_chunks_owner_brand", "owner_user_id", "brand_id"),
    )
