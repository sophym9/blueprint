from fastapi import APIRouter, status

from app.data.notes import create_note, list_notes
from app.models import CreateMapNoteRequest, MapNote

router = APIRouter(prefix="/api/notes", tags=["notes"])


@router.get("", response_model=list[MapNote])
def get_notes() -> list[MapNote]:
    return list_notes()


@router.post("", response_model=MapNote, status_code=status.HTTP_201_CREATED)
def post_note(payload: CreateMapNoteRequest) -> MapNote:
    return create_note(payload)
