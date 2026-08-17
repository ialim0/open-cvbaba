"""Add pgvector-backed brand DNA chunks."""
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
    bind = op.get_bind()
    if not sa.inspect(bind).has_table("brand_dna_chunks"):
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
    op.execute("CREATE INDEX IF NOT EXISTS ix_brand_dna_chunks_owner_user_id ON brand_dna_chunks (owner_user_id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_brand_dna_chunks_owner_brand ON brand_dna_chunks (owner_user_id, brand_id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_brand_dna_chunks_embedding_hnsw ON brand_dna_chunks USING hnsw (embedding vector_cosine_ops)")


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_brand_dna_chunks_embedding_hnsw")
    op.execute("DROP INDEX IF EXISTS ix_brand_dna_chunks_owner_brand")
    op.execute("DROP INDEX IF EXISTS ix_brand_dna_chunks_owner_user_id")
    op.drop_table("brand_dna_chunks", if_exists=True)
