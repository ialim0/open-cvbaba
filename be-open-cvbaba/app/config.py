# app/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional
from pydantic import EmailStr

class Settings(BaseSettings):

    SECRET_KEY: str = ""
    DATABASE_URL: str = "postgresql://open-cvbaba:open-cvbaba@localhost:5432/open-cvbaba"
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    CORS_ALLOW_CREDENTIALS: bool = False
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    # Local Object Storage (MinIO / S3 compatible)
    MINIO_ENDPOINT: str = "http://localhost:9000"
    MINIO_PUBLIC_URL: str = "http://localhost:9000"
    MINIO_ROOT_USER: str = "minioadmin"
    MINIO_ROOT_PASSWORD: str = "minioadmin"
    MINIO_BUCKET_NAME: str = "open-cvbaba"
    MINIO_REGION: str = "us-east-1"
    MINIO_SECURE: bool = False

    # S3 compatibility aliases / overrides
    S3_ENDPOINT_URL: Optional[str] = None
    S3_PUBLIC_URL: Optional[str] = None
    S3_ACCESS_KEY: Optional[str] = None
    S3_SECRET_KEY: Optional[str] = None
    S3_BUCKET_NAME: Optional[str] = None

    FRONTEND_BASE_URL: str = "http://localhost:3000"
    BACKEND_BASE_URL: str = "http://localhost:8000"
    REDIS_URL: str = "redis://localhost:6379/0"
    ALLOWED_EXTENSIONS_EXTRACT: List[str] = ["pdf", "png", "jpg", "jpeg"]
    ALLOWED_EXTENSIONS: List[str] = ['png', 'jpg', 'jpeg', 'gif', 'pdf']
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    MISTRAL_API_KEY: str = ""
    MISTRAL_MODEL: str = "mistral-large-latest"
    MISTRAL_PLANNING_MODEL: str = "mistral-large-latest"
    MISTRAL_CODE_MODEL: str = "codestral-latest"
    MISTRAL_OCR_MODEL: str = "mistral-ocr-latest"
    MISTRAL_TRANSCRIPTION_MODEL: str = "voxtral-mini-latest"
    MISTRAL_REALTIME_MODEL: str = "voxtral-mini-transcribe-realtime-2602"
    MISTRAL_BASE_URL: str = "https://api.mistral.ai/v1"
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"  # Allow extra fields in .env
    )

settings = Settings()