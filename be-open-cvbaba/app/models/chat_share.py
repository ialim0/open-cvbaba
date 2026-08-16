from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class ChatShare(Base):
    __tablename__ = "chat_shares"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey('chats.id'), nullable=False, index=True)
    shared_with_email = Column(String, nullable=False, index=True)
    shared_by_user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    accessed_at = Column(DateTime(timezone=True), nullable=True)  # Track when shared user first accessed
    access_level = Column(String, nullable=False, server_default='view')  # Access level: view, edit, full

    chat = relationship("Chat", back_populates="shares")
    shared_by_user = relationship("User", back_populates="shared_chats")
