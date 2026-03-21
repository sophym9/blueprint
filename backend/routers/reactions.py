from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.reaction import Reaction
from models.user import User
from schemas.reaction import ReactionCreate, ReactionResponse
from services.auth import get_current_user
from services.points import POINTS

router = APIRouter(prefix="/reactions", tags=["reactions"])


@router.post("/", response_model=ReactionResponse)
def add_reaction(
    payload: ReactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(Reaction).filter(
        Reaction.memory_id == payload.memory_id,
        Reaction.user_id == current_user.id,
        Reaction.emoji == payload.emoji,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Already reacted")

    reaction = Reaction(memory_id=payload.memory_id, user_id=current_user.id, emoji=payload.emoji)
    db.add(reaction)

    # Award points to memory author
    from models.memory import Memory
    memory = db.query(Memory).filter(Memory.id == payload.memory_id).first()
    if memory and memory.user_id != current_user.id:
        author = db.query(User).filter(User.id == memory.user_id).first()
        if author:
            author.memory_points = (author.memory_points or 0) + POINTS["receive_reaction"]

    db.commit()
    db.refresh(reaction)
    return reaction


@router.delete("/{reaction_id}", status_code=204)
def remove_reaction(
    reaction_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reaction = db.query(Reaction).filter(Reaction.id == reaction_id).first()
    if not reaction:
        raise HTTPException(status_code=404, detail="Reaction not found")
    if reaction.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your reaction")
    db.delete(reaction)
    db.commit()
