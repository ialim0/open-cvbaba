
from pydantic import BaseModel, EmailStr, Field, condecimal
from typing import Optional, List, ClassVar
from .project import Project
from .degree import Degree
from .experience import Experience




class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=0, max_length=100)
    phone_number: Optional[str] = None
    cv_email: Optional[EmailStr] = None
    website: Optional[str] = None 
    github: Optional[str] = None  
    address: Optional[str] = None
    profile_photo: Optional[str] = None  
    preferred_language: Optional[str] = "En" 
    confidence_meter: Optional[condecimal(gt=0, lt=1)] = Field(0.5, description="Confidence meter between 0 and 1") # type: ignore
    education: Optional[List[Degree]] = None
    motivation: Optional[str] = Field(None, max_length=500)
    interests: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    experience: Optional[List[Experience]] = None
    projects: Optional[List[Project]] = None 

class UserProfileResponse(BaseModel):
    full_name: Optional[str] = None
    email: EmailStr
    cv_email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    website: Optional[str] = None  
    github: Optional[str] = None  
    address: Optional[str] = None
    profile_photo: Optional[str] = None 
    preferred_language: Optional[str] = "En"  
    confidence_meter: float = 0.5  
    education: Optional[List[Degree]] = []
    motivation: Optional[str] = None
    interests: Optional[List[str]] = []
    skills: Optional[List[str]] = []
    experience: Optional[List[Experience]] = []
    projects: Optional[List[Project]] = []  
    config: ClassVar[dict] = {"from_attributes": True}
