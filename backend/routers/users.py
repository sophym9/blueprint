from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.user import UserCreate, UserUpdate, UserResponse
from services.points import get_rank_title

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserResponse)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    """Called on first 'login' — creates user, returns their ID for localStorage."""
    user = User(name=payload.name, graduation_year=payload.graduation_year)
    db.add(user)
    db.commit()
    db.refresh(user)
    return _to_response(user)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return _to_response(user)


@router.patch("/{user_id}", response_model=UserResponse)
def update_user(user_id: str, payload: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return _to_response(user)


def _to_response(user: User) -> dict:
    data = {c.name: getattr(user, c.name) for c in user.__table__.columns}
    data["rank_title"] = get_rank_title(user.memory_points or 0)
    data["zones_unlocked"] = user.zones_unlocked or []
    data["author_name"] = user.name
    return data
