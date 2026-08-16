#routes/file_upload.py 
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from app.services.s3_service import s3_service
from app.core.workspace import get_workspace_user
from app.models import User
from app.config import settings  
import os
import logging

file_upload_router = APIRouter()

logger = logging.getLogger(__name__)

def _check_file_size(file: UploadFile) -> bool:
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)
    if file_size > settings.MAX_FILE_SIZE:
        logger.warning(f"File size exceeded for file: {file.filename}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File is too large. Maximum size allowed is {settings.MAX_FILE_SIZE / (1024 * 1024)} MB."
        )
    return True

def _check_file_extension(filename: str) -> bool:
    if '.' not in filename or filename.rsplit('.', 1)[1].lower() not in settings.ALLOWED_EXTENSIONS:
        logger.warning(f"Invalid file extension for file: {filename}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Only {', '.join(settings.ALLOWED_EXTENSIONS)} files are allowed."
        )
    return True

@file_upload_router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_workspace_user)
):
    logger.info(f"File upload initiated by user: {current_user.email[:5]}**** (ID: {current_user.id})")

    try:
        _check_file_size(file)
        _check_file_extension(file.filename)

        file_url = s3_service.upload_file(file.file, file.filename)
        logger.info(f"File uploaded successfully: {file.filename}, URL: {file_url}")
        return {"file_url": file_url}

    except HTTPException as http_exc:
        logger.warning(f"HTTPException during file upload: {http_exc.detail}")
        raise http_exc

    except Exception as e:
        logger.error(f"Unexpected error during file upload: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while uploading the file."
        )