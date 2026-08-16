from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware

from app.api.routes.chat import chat_router
from app.api.routes.file_upload import file_upload_router
from app.api.routes.feedback import feedback_router
from app.api.routes.chat_comment import chat_comment_router
from app.api.routes.page_notes import router as page_notes_router
from app.api.routes.mistral_media import router as mistral_media_router


from app.config import settings
from app.db import init_db
from mangum import Mangum

from fastapi.responses import ORJSONResponse

app = FastAPI(
    title="open-cvbaba API",
    description="API Integration",
    version="1.0.0",
    docs_url="/cb/doc-cb",
    redoc_url="/cb/redoc-cb",
    openapi_url="/cb/openapi-cb.json",
    default_response_class=ORJSONResponse
)

# Middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

# Routers
app.include_router(chat_router, prefix="/api", tags=["Chat"])
app.include_router(file_upload_router, prefix="/api/file", tags=["File Upload"])
app.include_router(feedback_router, prefix="/api/feedback", tags=["Feedback"])
app.include_router(chat_comment_router, prefix="/api/chat", tags=["Chat Comments"])
app.include_router(page_notes_router, prefix="/api", tags=["Page Notes"])
app.include_router(mistral_media_router, prefix="/api/file", tags=["Mistral OCR"])
app.include_router(mistral_media_router, prefix="/api", tags=["Mistral Voxtral"])

# Health check endpoint
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis
import logging

logger = logging.getLogger(__name__)

# AWS Lambda handler
handler = Mangum(app)

@app.on_event("startup")
async def startup():
    await init_db()
    try:
        redis = aioredis.from_url(settings.REDIS_URL, encoding="utf8", decode_responses=True)
        FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
        logger.info("FastAPICache initialized with Redis backend")
    except Exception as e:
        logger.warning(f"Failed to initialize Redis cache: {e}")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

# AWS Lambda handler
handler = Mangum(app)