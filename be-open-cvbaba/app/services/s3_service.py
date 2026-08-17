# app/services/s3_service.py
"""
Local-first S3 / MinIO Object Storage Service.

Supports:
1. MinIO / S3-compatible local object storage (Docker / Local).
2. Automatic bucket creation and public read policy configuration.
3. Path-style addressing required for local MinIO deployments.
4. Resilient local fallback when MinIO is not running.
"""
import json
import logging
import os
import uuid
from pathlib import Path
from typing import BinaryIO, Optional

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError, EndpointConnectionError, NoCredentialsError
from fastapi import HTTPException, status

from app.config import settings

logger = logging.getLogger(__name__)


class StorageService:
    """Object storage service supporting MinIO and S3-compatible backends."""

    def __init__(self):
        self.endpoint_url = settings.S3_ENDPOINT_URL or settings.MINIO_ENDPOINT or "http://minio:9000"
        self.public_url = settings.S3_PUBLIC_URL or settings.MINIO_PUBLIC_URL or self.endpoint_url
        self.access_key = settings.S3_ACCESS_KEY or settings.MINIO_ROOT_USER or "minioadmin"
        self.secret_key = settings.S3_SECRET_KEY or settings.MINIO_ROOT_PASSWORD or "minioadmin"
        self.bucket_name = settings.S3_BUCKET_NAME or settings.MINIO_BUCKET_NAME or "open-cvbaba"
        self.region_name = settings.MINIO_REGION or "us-east-1"
        self.max_file_size = settings.MAX_FILE_SIZE

        # Local fallback directory when MinIO is not available
        self.local_fallback_dir = Path("uploads")
        self.local_fallback_dir.mkdir(parents=True, exist_ok=True)

        self.s3_client = None
        self._bucket_checked = False
        self._init_client()

    def _init_client(self):
        """Initialize boto3 S3 client with path-style addressing for MinIO."""
        try:
            config = Config(
                s3={"addressing_style": "path"},
                retries={"max_attempts": 2, "mode": "standard"},
                read_timeout=5,
                connect_timeout=2,
            )

            self.s3_client = boto3.client(
                "s3",
                endpoint_url=self.endpoint_url,
                aws_access_key_id=self.access_key,
                aws_secret_access_key=self.secret_key,
                region_name=self.region_name,
                config=config,
            )
        except Exception as e:
            logger.warning(f"MinIO/S3 client initialization notice: {e}. Fallback to local storage enabled.")
            self.s3_client = None

    def _ensure_bucket_exists(self):
        """Ensure the target bucket exists and has public read access for assets."""
        if not self.s3_client or self._bucket_checked:
            return

        try:
            self.s3_client.head_bucket(Bucket=self.bucket_name)
            self._bucket_checked = True
            logger.info(f"MinIO bucket '{self.bucket_name}' verified")
        except ClientError as e:
            error_code = e.response.get("Error", {}).get("Code", "")
            if error_code in ("404", "NoSuchBucket"):
                try:
                    self.s3_client.create_bucket(Bucket=self.bucket_name)
                    self._bucket_checked = True
                    logger.info(f"MinIO bucket '{self.bucket_name}' created successfully")
                    self._set_bucket_public_policy()
                except Exception as create_err:
                    logger.warning(f"Failed to auto-create bucket '{self.bucket_name}': {create_err}")
            else:
                logger.debug(f"Bucket check returned status: {error_code}")
        except Exception as e:
            logger.debug(f"MinIO bucket check skipped/failed: {e}")

    def _set_bucket_public_policy(self):
        """Set read-only anonymous access policy for uploaded document assets."""
        if not self.s3_client:
            return

        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "PublicReadGetObject",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": ["s3:GetObject"],
                    "Resource": [f"arn:aws:s3:::{self.bucket_name}/*"],
                }
            ],
        }
        try:
            self.s3_client.put_bucket_policy(
                Bucket=self.bucket_name,
                Policy=json.dumps(policy),
            )
            logger.info(f"Set public read policy on bucket '{self.bucket_name}'")
        except Exception as e:
            logger.debug(f"Bucket policy set skipped/failed: {e}")

    def upload_file(
        self,
        file: BinaryIO,
        original_file_name: str,
        content_type: Optional[str] = None,
    ) -> str:
        """Upload a file to MinIO / S3 object storage with fallback to local disk."""
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)

        if file_size > self.max_file_size:
            max_size_mb = self.max_file_size / (1024 * 1024)
            raise HTTPException(
                status_code=getattr(status, "HTTP_413_CONTENT_TOO_LARGE", 413),
                detail=f"File size exceeds maximum limit of {max_size_mb:.1f}MB",
            )

        unique_file_name = self._generate_unique_file_name(original_file_name)
        extra_args = {}
        if content_type:
            extra_args["ContentType"] = content_type

        # Try MinIO / S3 upload first
        if self.s3_client:
            try:
                self._ensure_bucket_exists()
                self.s3_client.upload_fileobj(
                    file,
                    self.bucket_name,
                    unique_file_name,
                    ExtraArgs=extra_args if extra_args else None,
                )
                file_url = self._generate_file_url(unique_file_name)
                logger.info(f"Uploaded {original_file_name} to MinIO as {unique_file_name}")
                return file_url
            except (EndpointConnectionError, NoCredentialsError) as conn_err:
                logger.warning(f"MinIO connection unreachable ({conn_err}), using local disk fallback")
            except Exception as e:
                logger.warning(f"MinIO upload error ({e}), using local disk fallback")

        # Local filesystem fallback
        return self._save_locally(file, unique_file_name)

    def _save_locally(self, file: BinaryIO, file_name: str) -> str:
        """Save file to local uploads directory when object storage is offline."""
        try:
            file.seek(0)
            local_path = self.local_fallback_dir / file_name
            with open(local_path, "wb") as f:
                f.write(file.read())
            logger.info(f"Saved {file_name} to local storage at {local_path}")
            base_url = settings.BACKEND_BASE_URL.rstrip("/")
            return f"{base_url}/uploads/{file_name}"
        except Exception as e:
            logger.error(f"Local file write failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"File upload failed: {str(e)}",
            )

    def _generate_file_url(self, key: str) -> str:
        """Generate public URL for the uploaded object in MinIO."""
        base = self.public_url.rstrip("/")
        return f"{base}/{self.bucket_name}/{key}"

    def _generate_unique_file_name(self, original_file_name: str) -> str:
        """Generate a random UUID-based unique filename while preserving extension."""
        file_extension = os.path.splitext(original_file_name)[1].lower()
        return f"{uuid.uuid4().hex}{file_extension}"


# Compatibility aliases
S3Service = StorageService
s3_service = StorageService()
storage_service = s3_service