#app/models/education.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base

class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    degree = Column(String, nullable=False)
    institution = Column(String, nullable=False)
    year = Column(String, nullable=False)

    user = relationship("User", back_populates="education")
