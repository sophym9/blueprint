from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    graduation_year: Optional[int] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserUpdate(BaseModel):
    name: Optional[str] = None
    graduation_year: Optional[int] = None
    graduation_date: Optional[str] = None
    avatar_url: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: Optional[str]
    name: str
    graduation_year: Optional[int]
    graduation_date: Optional[str] = None
    avatar_url: Optional[str]
    memory_points: int
    zones_unlocked: List[str]
    rank_title: str
    created_at: datetime

    class Config:
        from_attributes = True


TokenResponse.model_rebuild()
