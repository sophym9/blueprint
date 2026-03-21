from app.models import RegionDetail


REGION_DETAILS: list[RegionDetail] = [
    RegionDetail(
        id="west-campus-quad",
        name="West Campus Quad",
        category="academic",
        shortDescription="Central academic core anchored by the quad buildings.",
        color="#78d286",
        polygon={
            "points": [
                {"x": 27.8, "y": 28.0},
                {"x": 58.8, "y": 28.0},
                {"x": 58.8, "y": 52.0},
                {"x": 27.8, "y": 52.0},
            ]
        },
        longDescription=(
            "A central academic zone covering the main quad and surrounding buildings. "
            "This is a good default anchor for class navigation, orientation, and event wayfinding."
        ),
        highlights=[
            "Strong central landmark for wayfinding",
            "Dense cluster of classroom and administrative buildings",
            "Works well as the primary default selected map region",
        ],
        tags=["Academic", "Main quad", "High traffic"],
    ),
    RegionDetail(
        id="chapel",
        name="Chapel",
        category="landmark",
        shortDescription="Landmark region around the chapel label and adjacent paths.",
        color="#ffd85d",
        polygon={
            "points": [
                {"x": 44.8, "y": 15.0},
                {"x": 53.2, "y": 18.5},
                {"x": 49.7, "y": 29.8},
                {"x": 42.8, "y": 26.0},
            ]
        },
        longDescription=(
            "A landmark-focused region that can surface historic context, tour content, "
            "and navigation details for one of the campus focal points."
        ),
        highlights=[
            "Strong visual anchor on the illustrated map",
            "Ideal for tour storytelling and orientation prompts",
            "Can later link to schedules or accessibility data",
        ],
        tags=["Landmark", "Historic", "Tour stop"],
    ),
    RegionDetail(
        id="workshop",
        name="Workshop",
        category="event",
        shortDescription="Upper-right activity area suited for event overlays.",
        color="#9f7aea",
        polygon={
            "points": [
                {"x": 56.5, "y": 16.0},
                {"x": 68.0, "y": 18.0},
                {"x": 66.0, "y": 26.5},
                {"x": 55.2, "y": 24.5},
            ]
        },
        longDescription=(
            "A flexible event region useful for hackathon workshops, venue assignments, "
            "and temporary schedule overlays without changing the base illustration."
        ),
        highlights=[
            "Good fit for event programming overlays",
            "Compact region with clear click target",
            "Useful for time-based schedule integration later",
        ],
        tags=["Event", "Workshop", "HackDuke"],
    ),
    RegionDetail(
        id="dorms",
        name="Dorms",
        category="housing",
        shortDescription="Residential area south of the quad.",
        color="#78aefb",
        polygon={
            "points": [
                {"x": 42.2, "y": 49.8},
                {"x": 55.1, "y": 53.8},
                {"x": 52.8, "y": 62.5},
                {"x": 40.0, "y": 59.0},
            ]
        },
        longDescription=(
            "A housing-focused region where resident information, check-in instructions, "
            "and student support links could be surfaced during an event."
        ),
        highlights=[
            "Natural home for housing and arrival details",
            "Can later expand into multiple residential subregions",
            "Useful target for attendee logistics",
        ],
        tags=["Housing", "Residential", "Logistics"],
    ),
    RegionDetail(
        id="gardens",
        name="Gardens",
        category="recreation",
        shortDescription="Large lower-right green and water feature area.",
        color="#6dc8ff",
        polygon={
            "points": [
                {"x": 56.0, "y": 43.0},
                {"x": 82.8, "y": 43.0},
                {"x": 84.2, "y": 76.0},
                {"x": 61.0, "y": 79.5},
                {"x": 54.0, "y": 59.0},
            ]
        },
        longDescription=(
            "An outdoor recreation and gathering area that can support scenic points, "
            "rest areas, or informal meetup locations in the interface."
        ),
        highlights=[
            "Large region with strong visual contrast",
            "Useful for outdoor meetup and recreation content",
            "Can later carry accessibility or pathing information",
        ],
        tags=["Outdoor", "Recreation", "Meetup"],
    ),
    RegionDetail(
        id="game-night",
        name="Game Night",
        category="event",
        shortDescription="Top-left event banner region on the illustrated map.",
        color="#f26b6b",
        polygon={
            "points": [
                {"x": 28.5, "y": 9.2},
                {"x": 39.0, "y": 6.8},
                {"x": 45.0, "y": 15.5},
                {"x": 34.0, "y": 19.8},
                {"x": 27.0, "y": 14.0},
            ]
        },
        longDescription=(
            "A sample event hotspot that shows how temporary programming can sit on top "
            "of the map alongside permanent campus regions."
        ),
        highlights=[
            "Demonstrates event-specific overlays",
            "Can be reused for pop-up activities or sponsor locations",
            "Useful example for dynamic backend-managed content",
        ],
        tags=["Event", "Temporary", "Overlay"],
    ),
    RegionDetail(
        id="science-drive-parking",
        name="Science Drive Parking",
        category="parking",
        shortDescription="Parking access zone on the west side of the map.",
        color="#7cb2ff",
        polygon={
            "points": [
                {"x": 17.0, "y": 24.0},
                {"x": 24.5, "y": 24.0},
                {"x": 24.5, "y": 41.5},
                {"x": 17.0, "y": 41.5},
            ]
        },
        longDescription=(
            "A parking-oriented region that can later expose permits, arrival instructions, "
            "or transportation guidance for visitors and attendees."
        ),
        highlights=[
            "Useful for visitor arrival guidance",
            "Can connect to parking availability later",
            "Supports transportation-focused filters",
        ],
        tags=["Parking", "Arrival", "Transit"],
    ),
]

REGION_BY_ID = {region.id: region for region in REGION_DETAILS}
