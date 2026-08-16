# models/chat.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base
import uuid

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    user_input = Column(Text, nullable=False)
    title = Column(String, nullable=False)
    pdf_content = Column(Text, nullable=False)
    global_styles = Column(Text, nullable=True)  # Global CSS for consistent styling
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    slug = Column(String, unique=True, default=lambda: str(uuid.uuid4()), nullable=False)
    is_public = Column(Boolean, default=False, nullable=False)
    pdf_downloads = Column(Integer, default=0, nullable=False)
    docx_downloads = Column(Integer, default=0, nullable=False)
    copy_count = Column(Integer, default=0, nullable=False)

    user = relationship("User", back_populates="chats")
    versions = relationship(
            "ChatVersion",
            back_populates="chat",
            cascade="all, delete-orphan",
            passive_deletes=True,  
            order_by="ChatVersion.created_at.desc()"
        )
    shares = relationship("ChatShare", back_populates="chat", cascade="all, delete-orphan")
    comments = relationship("ChatComment", back_populates="chat", cascade="all, delete-orphan")
    pages = relationship("ChatPage", back_populates="chat", cascade="all, delete-orphan", order_by="ChatPage.page_number")
    read_statuses = relationship("ChatReadStatus", back_populates="chat", cascade="all, delete-orphan")
    notes = relationship("PageNote", back_populates="chat", cascade="all, delete-orphan")
