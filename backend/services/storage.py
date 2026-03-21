import os
import uuid
import aiofiles
from fastapi import UploadFile
from config import settings


async def save_upload(file: UploadFile, subfolder: str) -> str:
    """Save an uploaded file to disk and return its public URL path."""
    folder = os.path.join(settings.uploads_dir, subfolder)
    os.makedirs(folder, exist_ok=True)

    ext = os.path.splitext(file.filename)[1] if file.filename else ""
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(folder, filename)

    async with aiofiles.open(filepath, "wb") as f:
        content = await file.read()
        await f.write(content)

    return f"/uploads/{subfolder}/{filename}"
