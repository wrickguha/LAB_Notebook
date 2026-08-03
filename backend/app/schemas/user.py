from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Optional[str] = "Principal Investigator"
    institution: Optional[str] = None
    lab: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    email: Optional[EmailStr] = None
    institution: Optional[str] = None
    lab: Optional[str] = None
    avatar: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    full_name: str
    role: str
    institution: Optional[str] = None
    lab: Optional[str] = None
    avatar: Optional[str] = None

    class Config:
        from_attributes = True
