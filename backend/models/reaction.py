import uuid
from sqlalchemy import Column, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base


class Reaction(Base):
    __tablename__ = "reactions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    memory_id = Column(String, ForeignKey("memories.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    emoji = Column(String, nullable=False)

    memory = relationship("Memory", back_populates="reactions")

    __table_args__ = (
        UniqueConstraint("memory_id", "user_id", "emoji", name="uq_reaction"),
    )
