import uuid
from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class Memory(Base):
    __tablename__ = "memories"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    landmark_id = Column(String, nullable=False)
    region = Column(String, nullable=False)  # west | east | central
    pin_x = Column(Float, nullable=False)   # 0–100 %
    pin_y = Column(Float, nullable=False)   # 0–100 %
    memory_text = Column(Text, nullable=True)
    photo_url = Column(String, nullable=True)
    audio_url = Column(String, nullable=True)
    song_url = Column(String, nullable=True)
    year_tag = Column(String, nullable=True)  # freshman|sophomore|junior|senior
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="memories")
    reactions = relationship("Reaction", back_populates="memory", cascade="all, delete-orphan")
