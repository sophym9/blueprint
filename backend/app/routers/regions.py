from fastapi import APIRouter, HTTPException

from app.data.regions import REGION_BY_ID, REGION_DETAILS
from app.models import RegionDetail, RegionSummary

router = APIRouter(prefix="/api/regions", tags=["regions"])


@router.get("", response_model=list[RegionSummary])
def list_regions() -> list[RegionSummary]:
    return [
        RegionSummary(**region.model_dump(exclude={"longDescription", "highlights", "tags"}))
        for region in REGION_DETAILS
    ]


@router.get("/{region_id}", response_model=RegionDetail)
def get_region(region_id: str) -> RegionDetail:
    region = REGION_BY_ID.get(region_id)

    if region is None:
        raise HTTPException(status_code=404, detail="Region not found")

    return region
