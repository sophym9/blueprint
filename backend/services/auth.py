from fastapi import Header, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.user import User


def get_current_user(x_user_id: str = Header(...), db: Session = Depends(get_db)) -> User:
    """
    Simple header-based auth: frontend sends X-User-Id header with the UUID
    stored in localStorage after 'login' (name + class year form).
    """
    user = db.query(User).filter(User.id == x_user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found. Please log in.")
    return user
