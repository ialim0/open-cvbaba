from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class ChatReadStatus(Base):
    __tablename__ = "chat_read_statuses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    chat_id = Column(Integer, ForeignKey('chats.id', ondelete='CASCADE'), nullable=False, index=True)
    last_read_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    is_muted = Column(Boolean, default=False, nullable=False, server_default='false')

    user = relationship("User", back_populates="read_statuses")
    chat = relationship("Chat", back_populates="read_statuses")

    __table_args__ = (
        UniqueConstraint('user_id', 'chat_id', name='uq_chat_read_status_user_chat'),
    )
