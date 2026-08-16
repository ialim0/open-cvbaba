# models/feedback.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base


class Feedback(Base):
    """YC-style feedback: simple, one metric, talk to users."""
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True, index=True)
    chat_slug = Column(String, nullable=True, index=True)
    is_helpful = Column(Boolean, nullable=False)
    why_unhelpful = Column(String, nullable=True)  # "confusing" | "incorrect" | "too_slow"
    comment = Column(Text, nullable=True)
    contact_ok = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="feedback")
