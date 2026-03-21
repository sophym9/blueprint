from fastapi import APIRouter, UploadFile, File, Depends
from models.user import User
from services.auth import get_current_user
from services.storage import save_upload

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("/photo")
async def upload_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    url = await save_upload(file, "photos")
    return {"url": url}


@router.post("/audio")
async def upload_audio(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    url = await save_upload(file, "audio")
    return {"url": url}
