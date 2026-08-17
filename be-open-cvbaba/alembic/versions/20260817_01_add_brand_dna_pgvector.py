"""Add pgvector-backed brand DNA chunks.

Revision ID: 20260817_brand_dna
Revises:
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from pgvector.sqlalchemy import Vector

revision = "20260817_brand_dna"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.create_table(
        "brand_dna_chunks",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("owner_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("brand_id", sa.String(length=120), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("source", sa.String(length=255), nullable=False, server_default="manual"),
        sa.Column("metadata_json", postgresql.JSONB(), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column("embedding", Vector(1024), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_brand_dna_chunks_owner_user_id", "brand_dna_chunks", ["owner_user_id"])
    op.create_index("ix_brand_dna_chunks_owner_brand", "brand_dna_chunks", ["owner_user_id", "brand_id"])
    op.execute("CREATE INDEX ix_brand_dna_chunks_embedding_hnsw ON brand_dna_chunks USING hnsw (embedding vector_cosine_ops)")


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_brand_dna_chunks_embedding_hnsw")
    op.drop_index("ix_brand_dna_chunks_owner_brand", table_name="brand_dna_chunks")
    op.drop_index("ix_brand_dna_chunks_owner_user_id", table_name="brand_dna_chunks")
    op.drop_table("brand_dna_chunks")
