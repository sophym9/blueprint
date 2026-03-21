from pydantic import BaseModel


class ReactionCreate(BaseModel):
    memory_id: str
    emoji: str


class ReactionResponse(BaseModel):
    id: str
    memory_id: str
    user_id: str
    emoji: str

    class Config:
        from_attributes = True
