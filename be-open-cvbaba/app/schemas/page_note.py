from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class PageNoteBase(BaseModel):
    title: Optional[str] = None
    content: str # HTML or text content
    style_metadata: Optional[Dict[str, Any]] = None # JSON styling info

class PageNoteCreate(PageNoteBase):
    pass

class PageNoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    style_metadata: Optional[Dict[str, Any]] = None

class PageNoteResponse(PageNoteBase):
    id: int
    chat_id: int
    page_number: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
