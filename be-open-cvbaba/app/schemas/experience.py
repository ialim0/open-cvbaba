# app/schemas/experience.py
from pydantic import BaseModel

class Experience(BaseModel):
    title: str
    company: str
    duration: str
    description: str
