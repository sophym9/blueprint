from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import HealthResponse
from app.routers.notes import router as notes_router
from app.routers.regions import router as regions_router

app = FastAPI(
    title="Duke Interactive Map API",
    description="FastAPI backend for the HackDuke campus map prototype.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    return HealthResponse(status="ok")


app.include_router(regions_router)
app.include_router(notes_router)
