from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class User(Base):
    """Anonymous workspace owner used to preserve local document history."""
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    preferred_language = Column(String, nullable=True, default="en")
    profile_photo = Column(String, nullable=True)
    motivation = Column(Text, nullable=True)
    phone_number = Column(String, nullable=True)
    website = Column(String, nullable=True)
    github = Column(String, nullable=True)
    address = Column(String, nullable=True)
    confidence_meter = Column(Float, nullable=False, default=0.5)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    education = relationship("Education", back_populates="user", cascade="all, delete-orphan")
    interests = relationship("Interest", back_populates="user", cascade="all, delete-orphan")
    skills = relationship("Skill", back_populates="user", cascade="all, delete-orphan")
    experience = relationship("Experience", back_populates="user", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    chats = relationship("Chat", back_populates="user", cascade="all, delete-orphan")
    shared_chats = relationship("ChatShare", back_populates="shared_by_user", cascade="all, delete-orphan")
    feedback = relationship("Feedback", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("ChatComment", back_populates="user", cascade="all, delete-orphan")
    read_statuses = relationship("ChatReadStatus", back_populates="user", cascade="all, delete-orphan")
