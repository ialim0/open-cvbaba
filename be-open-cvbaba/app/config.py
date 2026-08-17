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
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = ""
    AWS_S3_BUCKET_NAME: str = ""
    AWS_SECRET_ACCESS_KEY_AI: str = ""
    AWS_ACCESS_KEY_ID_AI: str = ""
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = ""
    MAIL_SERVER: str = ""
    MAIL_PORT: int = 0
    MAIL_STARTTLS: bool = False
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = False
    VALIDATE_CERTS: bool = False

    FRONTEND_BASE_URL: str = "http://localhost:3000"
    BACKEND_BASE_URL: str = "http://localhost:8000"
    REDIS_URL: str = "redis://localhost:6379/0"
    ALLOWED_EXTENSIONS_EXTRACT: List[str] = ["pdf", "png", "jpg", "jpeg"]
    ALLOWED_EXTENSIONS: List[str] = ['png', 'jpg', 'jpeg', 'gif']
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  
    AWS_S3_MULTIPART_THRESHOLD: int = 0
    AWS_S3_MULTIPART_CHUNKSIZE: int = 0
    AWS_S3_MAX_POOL_CONNECTIONS: int = 0
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