from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, Literal
from enum import Enum

class AccessLevel(str, Enum):
    """Access levels for shared chats"""
    VIEW = "view"      # Can only view the chat
    EDIT = "edit"      # Can view and edit (but not share or delete)
    FULL = "full"      # Full access (view, edit, share, delete)

class ChatShareCreate(BaseModel):
    """Schema for creating a chat share"""
    email: EmailStr
    access_level: AccessLevel = Field(default=AccessLevel.VIEW, description="Access level to grant")

class ChatShareUpdate(BaseModel):
    """Schema for updating a chat share's access level"""
    access_level: AccessLevel = Field(description="New access level")

class ChatShareResponse(BaseModel):
    """Schema for chat share response"""
    id: int
    chat_id: int
    shared_with_email: str
    shared_by_user_id: int
    created_at: datetime
    access_level: str
    
    class Config:
        from_attributes = True

class SharedChatAccess(BaseModel):
    """Schema for accessing a shared chat"""
    slug: str
    title: str
    pdf_content: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    shared_by: str  # Email of the person who shared
    access_level: str  # User's access level for this chat
    
    class Config:
        from_attributes = True
