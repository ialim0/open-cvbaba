#app/schemas/degree.py
from pydantic import BaseModel

class Degree(BaseModel):
    degree: str
    institution: str
    year: str
