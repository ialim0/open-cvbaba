import io
import pytest
from fastapi import HTTPException
from app.services.s3_service import StorageService, S3Service


def test_storage_service_init():
    service = StorageService()
    assert service.bucket_name == "open-cvbaba"
    assert service.endpoint_url is not None
    assert service.local_fallback_dir.exists()


def test_unique_filename_generation():
    service = StorageService()
    fname1 = service._generate_unique_file_name("profile.png")
    fname2 = service._generate_unique_file_name("profile.png")
    assert fname1.endswith(".png")
    assert fname2.endswith(".png")
    assert fname1 != fname2


def test_url_generation():
    service = StorageService()
    url = service._generate_file_url("test_file.png")
    assert "open-cvbaba" in url
    assert "test_file.png" in url


def test_local_fallback_upload(tmp_path, monkeypatch):
    service = StorageService()
    service.s3_client = None  # Force local fallback
    service.local_fallback_dir = tmp_path

    content = b"fake image content"
    file_obj = io.BytesIO(content)

    url = service.upload_file(file_obj, "avatar.jpg", content_type="image/jpeg")
    assert url.endswith(".jpg")
    assert "/uploads/" in url

    # Verify file was written
    saved_files = list(tmp_path.glob("*.jpg"))
    assert len(saved_files) == 1
    assert saved_files[0].read_bytes() == content


def test_file_size_limit():
    service = StorageService()
    service.max_file_size = 100  # 100 bytes max

    large_content = b"x" * 200
    file_obj = io.BytesIO(large_content)

    with pytest.raises(HTTPException) as exc_info:
        service.upload_file(file_obj, "large.pdf", content_type="application/pdf")
    assert exc_info.value.status_code == 413
