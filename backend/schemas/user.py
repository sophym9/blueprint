from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    graduation_year: Optional[int] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    graduation_year: Optional[int] = None
    avatar_url: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    name: str
    graduation_year: Optional[int]
    avatar_url: Optional[str]
    memory_points: int
    zones_unlocked: List[str]
    rank_title: str
    created_at: datetime

    class Config:
        from_attributes = True
