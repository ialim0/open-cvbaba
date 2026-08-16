"""Small exception helpers for the document API."""
from functools import wraps
from fastapi import HTTPException

def handle_http_exception(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(status_code=500, detail="An unexpected error occurred") from exc
    return wrapper
