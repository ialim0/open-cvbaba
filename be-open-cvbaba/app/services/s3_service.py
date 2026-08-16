# app/services/s3_service.py
import logging
import os
from typing import BinaryIO, Optional
import boto3
from botocore.config import Config
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from fastapi import HTTPException, status
from app.config import settings
import uuid

logger = logging.getLogger(__name__)

class S3Service:
    def __init__(self):
        config = Config(
            retries={'max_attempts': 3, 'mode': 'adaptive'},
            max_pool_connections=settings.AWS_S3_MAX_POOL_CONNECTIONS,
            read_timeout=60,
            connect_timeout=60,
            tcp_keepalive=True
        )
        
        self.session = boto3.Session(
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        
        self.s3_client = self.session.client('s3', config=config)
        self.bucket_name = settings.AWS_S3_BUCKET_NAME
        
        self.multipart_threshold = settings.AWS_S3_MULTIPART_THRESHOLD
        self.multipart_chunksize = settings.AWS_S3_MULTIPART_CHUNKSIZE
        self.max_file_size = settings.MAX_FILE_SIZE

    def upload_file(self, file: BinaryIO, original_file_name: str, content_type: Optional[str] = None) -> str:
   
        file.seek(0, 2)  
        file_size = file.tell()
        file.seek(0) 

        if file_size > self.max_file_size:
            max_size_mb = self.max_file_size / (1024 * 1024)
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File size exceeds maximum limit of {max_size_mb}MB"
            )

        unique_file_name = self._generate_unique_file_name(original_file_name)
        extra_args = {
            'ContentType': content_type,
            'CacheControl': 'max-age=31536000',  
        } if content_type else {}

        try:
            if file_size > self.multipart_threshold:
                return self._multipart_upload(file, unique_file_name, extra_args)
            else:
                return self._regular_upload(file, unique_file_name, extra_args)

        except Exception as e:
            logger.error(f"Upload error for file {original_file_name}: {str(e)}", exc_info=True)
            self._handle_upload_error(e)

    def _multipart_upload(self, file: BinaryIO, key: str, extra_args: dict) -> str:
     
        try:
            response = self.s3_client.create_multipart_upload(
                Bucket=self.bucket_name,
                Key=key,
                **extra_args
            )
            upload_id = response['UploadId']

            parts = []
            part_number = 1

            while True:
                data = file.read(self.multipart_chunksize)
                if not data:
                    break

                response = self.s3_client.upload_part(
                    Bucket=self.bucket_name,
                    Key=key,
                    PartNumber=part_number,
                    UploadId=upload_id,
                    Body=data
                )

                parts.append({
                    'PartNumber': part_number,
                    'ETag': response['ETag']
                })
                part_number += 1

            self.s3_client.complete_multipart_upload(
                Bucket=self.bucket_name,
                Key=key,
                UploadId=upload_id,
                MultipartUpload={'Parts': parts}
            )

            return self._generate_file_url(key)

        except Exception as e:
            logger.error(f"Multipart upload failed: {str(e)}", exc_info=True)
            try:
                self.s3_client.abort_multipart_upload(
                    Bucket=self.bucket_name,
                    Key=key,
                    UploadId=upload_id
                )
            except Exception:
                pass
            self._handle_upload_error(e)

    def _regular_upload(self, file: BinaryIO, key: str, extra_args: dict) -> str:
        """
        Handle regular upload for smaller files.
        """
        try:
            self.s3_client.upload_fileobj(
                file,
                self.bucket_name,
                key,
                ExtraArgs=extra_args
            )
            return self._generate_file_url(key)
        except Exception as e:
            logger.error(f"Regular upload failed: {str(e)}", exc_info=True)
            self._handle_upload_error(e)

    def _generate_file_url(self, key: str) -> str:
       
        return f"https://{self.bucket_name}.s3.amazonaws.com/{key}"

    def _generate_unique_file_name(self, original_file_name: str) -> str:
      
        file_extension = os.path.splitext(original_file_name)[1].lower()
        timestamp = uuid.uuid4().hex
        return f"{timestamp}{file_extension}"

    def _handle_upload_error(self, error: Exception):
    
        if isinstance(error, NoCredentialsError):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="AWS credentials not available"
            )
        elif isinstance(error, PartialCredentialsError):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Incomplete AWS credentials provided"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Upload failed: {str(error)}"
            )

s3_service = S3Service()