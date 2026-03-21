from typing import Literal

from pydantic import BaseModel, Field

RegionCategory = Literal["academic", "housing", "landmark", "recreation", "event", "parking"]


class MapPoint(BaseModel):
    x: float = Field(ge=0, le=100)
    y: float = Field(ge=0, le=100)


class RegionPolygon(BaseModel):
    points: list[MapPoint]


class RegionSummary(BaseModel):
    id: str
    name: str
    category: RegionCategory
    shortDescription: str
    color: str
    polygon: RegionPolygon


class RegionDetail(RegionSummary):
    longDescription: str
    highlights: list[str]
    tags: list[str]


class HealthResponse(BaseModel):
    status: str


class MapNote(BaseModel):
    id: str
    x: float = Field(ge=0, le=100)
    y: float = Field(ge=0, le=100)
    message: str = Field(min_length=1, max_length=280)
    createdAt: str


class CreateMapNoteRequest(BaseModel):
    x: float = Field(ge=0, le=100)
    y: float = Field(ge=0, le=100)
    message: str = Field(min_length=1, max_length=280)
