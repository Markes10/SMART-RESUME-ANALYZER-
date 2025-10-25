"""
Authentication schemas and data models
"""
from typing import Optional
from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str
    user_id: int
    username: str
    role: str

class UserBase(BaseModel):
    """Base user schema"""
    username: str
    email: EmailStr
    role: Optional[str] = "employee"

class UserCreate(UserBase):
    """User creation schema"""
    password: str

class UserUpdate(BaseModel):
    """User update schema"""
    username: Optional[str] = None
    email: Optional[EmailStr] = None

class UserResponse(UserBase):
    """User response schema"""
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class ChangePasswordRequest(BaseModel):
    """Password change request schema"""
    current_password: str
    new_password: str
