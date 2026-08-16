from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from databases import Database
from app.config import settings

DATABASE_URL = settings.DATABASE_URL

# Use a resilient engine configuration to avoid stale connections
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,           # test connections before using them
    pool_recycle=1800,            # recycle connections every 30 minutes
    # Optional: tune pool sizes if needed
    # pool_size=5,
    # max_overflow=10,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
)

class Base(DeclarativeBase):
    """Declarative base class for SQLAlchemy models."""
    pass

database = Database(DATABASE_URL)

def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception:
        # Ensure any failed transaction is rolled back to keep the session clean
        db.rollback()
        raise
    finally:
        db.close()

async def init_db():  
    from app.models import user
    Base.metadata.create_all(bind=engine)