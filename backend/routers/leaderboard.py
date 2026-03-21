from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.user import User
from services.points import get_rank_title

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


@router.get("/")
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.memory_points.desc()).limit(10).all()
    return [
        {
            "rank": i + 1,
            "id": u.id,
            "name": u.name,
            "graduation_year": u.graduation_year,
            "avatar_url": u.avatar_url,
            "memory_points": u.memory_points or 0,
            "rank_title": get_rank_title(u.memory_points or 0),
            "zones_unlocked": u.zones_unlocked or [],
        }
        for i, u in enumerate(users)
    ]
