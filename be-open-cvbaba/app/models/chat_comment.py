from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class ChatComment(Base):
    __tablename__ = "chat_comments"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey('chats.id', ondelete='CASCADE'), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    user_name = Column(String, nullable=False)  # Storing name at comment time for quick access
    content = Column(Text, nullable=False)
    page_number = Column(Integer, nullable=True, index=True)  # Page-specific comments
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    chat = relationship("Chat", back_populates="comments")
    user = relationship("User", back_populates="comments")
