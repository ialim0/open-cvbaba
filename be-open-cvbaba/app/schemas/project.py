from pydantic import BaseModel
from typing import Optional, List

class Project(BaseModel):
    title: str  
    description: str  
    technologies: Optional[List[str]] = None 
    link: Optional[str] = None 
