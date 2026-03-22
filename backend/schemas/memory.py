from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from schemas.reaction import ReactionResponse


class MemoryUpdate(BaseModel):
    memory_text: Optional[str] = None
    photo_url: Optional[str] = None
    audio_url: Optional[str] = None
    song_url: Optional[str] = None
    year_tag: Optional[str] = None


class MemoryCreate(BaseModel):
    landmark_id: Optional[str] = None
    region: Optional[str] = None
    pin_x: float
    pin_y: float
    memory_text: Optional[str] = None
    photo_url: Optional[str] = None
    audio_url: Optional[str] = None
    song_url: Optional[str] = None
    year_tag: Optional[str] = None
    is_public: bool = True


class MemoryResponse(BaseModel):
    id: str
    user_id: str
    author_name: str
    author_avatar_url: Optional[str] = None
    landmark_id: Optional[str] = None
    region: Optional[str] = None
    pin_x: float
    pin_y: float
    memory_text: Optional[str] = None
    photo_url: Optional[str] = None
    audio_url: Optional[str] = None
    song_url: Optional[str] = None
    year_tag: Optional[str] = None
    is_public: bool
    created_at: datetime
    reactions: List[ReactionResponse] = []
    points_earned: int = 0

    class Config:
        from_attributes = True
