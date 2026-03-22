import uuid
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=True, index=True)
    password_hash = Column(String, nullable=True)
    name = Column(String, nullable=False)
    graduation_year = Column(Integer, nullable=True)
    graduation_date = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    memory_points = Column(Integer, default=0)
    zones_unlocked = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
