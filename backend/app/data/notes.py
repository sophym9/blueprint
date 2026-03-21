from datetime import UTC, datetime
from threading import Lock
from uuid import uuid4

from app.models import CreateMapNoteRequest, MapNote

_notes_lock = Lock()
_notes: list[MapNote] = [
    MapNote(
        id="welcome-note",
        x=52.5,
        y=49.5,
        message="Tap the map to drop your own pin and leave a note.",
        createdAt=datetime.now(UTC).isoformat(),
    )
]


def list_notes() -> list[MapNote]:
    with _notes_lock:
        return list(_notes)


def create_note(payload: CreateMapNoteRequest) -> MapNote:
    note = MapNote(
        id=str(uuid4()),
        x=payload.x,
        y=payload.y,
        message=payload.message.strip(),
        createdAt=datetime.now(UTC).isoformat(),
    )

    with _notes_lock:
        _notes.append(note)

    return note
