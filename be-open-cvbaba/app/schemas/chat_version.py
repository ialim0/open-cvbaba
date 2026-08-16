# schemas/chat_version.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ChatVersionResponse(BaseModel):
    id: int
    chat_id: int
    pdf_content: str
    created_at: datetime
    version_number: int
    
    class Config:
        from_attributes = True