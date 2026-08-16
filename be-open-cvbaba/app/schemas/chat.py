from pydantic import BaseModel, Field, ConfigDict, field_validator, model_validator
from datetime import datetime
from typing import Optional, List

class ChatInput(BaseModel):
    user_input: str = Field(
        ..., 
        min_length=1,
        max_length=15000,
        description="The user's input prompt for generating AI response"
    )
    template_id: Optional[str] = Field(
        None,
        description="Optional template ID to use for formatting the response"
    )
    num_pages: Optional[int] = Field(
        None,
        ge=1,
        le=70,
        description="Optional desired number of pages (1-70). If not specified, AI determines optimal length."
    )
    
    @field_validator('user_input')
    @classmethod
    def validate_user_input(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("User input cannot be empty or only whitespace")
        return v.strip()
    
    @field_validator('template_id')
    @classmethod
    def validate_template_id(cls, v: Optional[str]) -> Optional[str]:
        # Convert empty strings to None to allow omitting templates
        if v is None or not v.strip():
            return None
        return v.strip()

class AddPagesInput(BaseModel):
    """Input schema for adding new pages to an existing document."""
    user_input: str = Field(
        ..., 
        min_length=1,
        max_length=5000,
        description="Prompt describing what content to add to the document"
    )
    num_pages: Optional[int] = Field(
        1,
        ge=1,
        le=2,
        description="Number of pages to add (default 1, max 2)."
    )
    current_page: Optional[int] = Field(
        None,
        ge=1,
        description="Reference page number for insertion. If omitted, appends at end."
    )
    insert_after: bool = Field(
        True,
        description="If true, insert after current_page. If false, insert before current_page."
    )
    
    @field_validator('user_input')
    @classmethod
    def validate_user_input(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("User input cannot be empty or only whitespace")
        return v.strip()

class EditPageInput(BaseModel):
    """Input schema for editing a single page in an existing document."""
    user_input: str = Field(
        ..., 
        min_length=1,
        max_length=5000,
        description="Instructions for how to edit the page"
    )
    page_number: int = Field(
        ...,
        ge=1,
        description="Page number to edit (1-based)"
    )
    
    @field_validator('user_input')
    @classmethod
    def validate_user_input(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("User input cannot be empty or only whitespace")
        return v.strip()

class ChatUpdate(BaseModel):
    user_input: Optional[str] = Field(
        None,
        min_length=1,
        max_length=12000,
        description="Updated prompt for generating new AI response"
    )
    title: Optional[str] = Field(
        None,
        min_length=1,
        max_length=255,
        description="Custom title for the chat"
    )
    pdf_content: Optional[str] = Field(
        None,
        min_length=1,
        description="Updated AI-generated response content"
    )
    
    @field_validator('user_input', 'title', 'pdf_content')
    @classmethod
    def validate_fields(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("Field cannot be empty or only whitespace")
        return v.strip() if v is not None else v

class ChatResponse(BaseModel):
    slug: str = Field(..., description="Unique identifier for the chat")
    title: str = Field(..., description="Chat title")
    user_input: str = Field(..., description="User's input prompt")
    pdf_content: str = Field(..., description="Generated AI response")
    created_at: datetime = Field(..., description="Timestamp of chat creation")
    updated_at: Optional[datetime] = Field(None, description="Timestamp of last update")
    is_public: bool = Field(default=False, description="Whether the chat is publicly accessible")
    is_public: bool = Field(default=False, description="Whether the chat is publicly accessible")
    access_level: Optional[str] = Field(default="full", description="User's access level for this chat")
    unread_count: int = Field(default=0, description="Number of unread comments for the current user")
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "slug": "abc123-xyz789",
                "title": "Discussion about Python",
                "user_input": "What are the key features of Python?",
                "pdf_content": "Python is a high-level programming language...",
                "created_at": "2024-01-01T12:00:00Z",
                "updated_at": "2024-01-01T12:30:00Z"
            }
        }
    )

class ChatListResponse(BaseModel):
    slug: str = Field(..., description="Unique identifier for the chat")
    title: str = Field(..., description="Chat title")
    created_at: datetime = Field(..., description="Timestamp of chat creation")
    title: str = Field(..., description="Chat title")
    created_at: datetime = Field(..., description="Timestamp of chat creation")
    updated_at: Optional[datetime] = Field(None, description="Timestamp of last update")
    unread_count: int = Field(default=0, description="Number of unread comments for the current user")
    
    model_config = ConfigDict(from_attributes=True)

class ChatPaginationParams(BaseModel):
    skip: int = Field(
        default=0,
        ge=0,
        description="Number of records to skip"
    )
    limit: int = Field(
        default=20,
        ge=1,
        le=100,
        description="Maximum number of records to return"
    )

class ChatPaginationMeta(BaseModel):
    skip: int = Field(..., ge=0, description="Number of records skipped")
    limit: int = Field(..., ge=1, le=100, description="Requested page size")
    total: int = Field(..., ge=0, description="Total number of chats available")
    has_more: bool = Field(..., description="Indicates if more chats are available beyond this page")
    next_skip: Optional[int] = Field(None, description="Skip value for the next page if available")

class ChatHistoryResponse(BaseModel):
    items: List[ChatListResponse]
    meta: ChatPaginationMeta

class TogglePublicRequest(BaseModel):
    is_public: bool = Field(..., description="Set to true to make chat public, false to make it private")

class PublicChatAccess(BaseModel):
    slug: str
    title: str
    pdf_content: str
    created_at: datetime
    updated_at: Optional[datetime]
    owner: str
    
    model_config = ConfigDict(from_attributes=True)

class CommentCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)
    page_number: Optional[int] = Field(None, ge=1, description="Page number for page-specific comments")

class CommentResponse(BaseModel):
    id: int
    content: str
    user_name: str
    page_number: Optional[int] = None
    created_at: datetime
    is_own_comment: bool = False

    model_config = ConfigDict(from_attributes=True)

class ChatStructureResponse(BaseModel):
    slug: str
    title: str
    total_pages: int
    global_styles: Optional[str] = None
    page_numbers: List[int]

class ChatPageResponse(BaseModel):
    page_number: int
    content: str