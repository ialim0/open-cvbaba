from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, UniqueConstraint, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class PageNote(Base):
    __tablename__ = "page_notes"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id", ondelete="CASCADE"), nullable=False, index=True)
    page_number = Column(Integer, nullable=False, index=True)
    
    # Rich Note Fields
    title = Column(String, nullable=True)
    content = Column(Text, nullable=False) # HTML or JSON rich text
    style_metadata = Column(JSON, nullable=True) # Background color, theme, etc.
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to Chat
    chat = relationship("Chat", back_populates="notes")

    # Ensure one note per page per chat
    __table_args__ = (
        UniqueConstraint('chat_id', 'page_number', name='unique_chat_page_note'),
    )
