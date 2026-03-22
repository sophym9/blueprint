from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List
from database import get_db
from models.memory import Memory
from models.user import User
from schemas.memory import MemoryCreate, MemoryUpdate, MemoryResponse
from services.auth import get_current_user, get_current_user_optional
from services.points import calculate_points, award_points

router = APIRouter(prefix="/memories", tags=["memories"])


def _serialize(memory: Memory) -> dict:
    data = {c.name: getattr(memory, c.name) for c in memory.__table__.columns}
    data["author_name"] = memory.user.name if memory.user else "Unknown"
    data["author_avatar_url"] = memory.user.avatar_url if memory.user else None
    data["reactions"] = [
        {"id": r.id, "memory_id": r.memory_id, "user_id": r.user_id, "emoji": r.emoji}
        for r in memory.reactions
    ]
    data["points_earned"] = 0
    return data


@router.post("/", response_model=MemoryResponse)
def create_memory(
    payload: MemoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    earned = calculate_points(
        payload.memory_text, payload.photo_url, payload.audio_url,
        payload.region, db, current_user.id
    )
    memory = Memory(**payload.model_dump(), user_id=current_user.id)
    db.add(memory)
    db.flush()  # get the ID before committing

    award_points(current_user, earned, payload.region, db)
    db.commit()
    db.refresh(memory)

    result = _serialize(memory)
    result["points_earned"] = earned
    return result


@router.get("/", response_model=List[MemoryResponse])
def list_memories(
    landmark_id: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    visibility: str = Query("all"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    q = db.query(Memory)

    if current_user:
        q = q.filter(or_(Memory.is_public == True, Memory.user_id == current_user.id))
    else:
        q = q.filter(Memory.is_public == True)

    if visibility == "public":
        q = q.filter(Memory.is_public == True)
    elif visibility == "private":
        if not current_user:
            return []
        q = q.filter(Memory.user_id == current_user.id, Memory.is_public == False)
    elif visibility == "mine":
        if not current_user:
            return []
        q = q.filter(Memory.user_id == current_user.id)
    elif visibility != "all":
        raise HTTPException(status_code=400, detail="Invalid visibility filter")

    if landmark_id:
        q = q.filter(Memory.landmark_id == landmark_id)
    if region:
        q = q.filter(Memory.region == region)
    memories = q.order_by(Memory.created_at.desc()).all()
    return [_serialize(m) for m in memories]


@router.get("/{memory_id}", response_model=MemoryResponse)
def get_memory(
    memory_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    memory = db.query(Memory).filter(Memory.id == memory_id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")
    if not memory.is_public and (not current_user or current_user.id != memory.user_id):
        raise HTTPException(status_code=404, detail="Memory not found")
    return _serialize(memory)


@router.patch("/{memory_id}", response_model=MemoryResponse)
def update_memory(
    memory_id: str,
    payload: MemoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    memory = db.query(Memory).filter(Memory.id == memory_id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")
    if memory.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your memory")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(memory, field, value)
    db.commit()
    db.refresh(memory)
    return _serialize(memory)


@router.delete("/{memory_id}", status_code=204)
def delete_memory(
    memory_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    memory = db.query(Memory).filter(Memory.id == memory_id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")
    if memory.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your memory")
    db.delete(memory)
    db.commit()
