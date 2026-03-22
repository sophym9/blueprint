from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os

load_dotenv()

from database import engine, Base, run_migrations
import models.user  # noqa: F401 — register models
import models.memory  # noqa: F401
import models.reaction  # noqa: F401

from routers import users, memories, reactions, leaderboard, upload, auth
from config import settings

# Create tables, then migrate (add new columns to existing tables)
Base.metadata.create_all(bind=engine)
run_migrations()

# Create uploads directory
os.makedirs(settings.uploads_dir, exist_ok=True)

app = FastAPI(title="Blueprint API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Serve uploaded files as static
app.mount("/uploads", StaticFiles(directory=settings.uploads_dir), name="uploads")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(memories.router)
app.include_router(reactions.router)
app.include_router(leaderboard.router)
app.include_router(upload.router)


@app.get("/health")
def health():
    return {"status": "ok"}
