from sqlalchemy.orm import Session
from models.memory import Memory

POINTS = {
    "drop_pin": 10,
    "add_photo": 5,
    "add_audio": 5,
    "receive_reaction": 2,
    "first_in_zone": 25,
}

RANK_TITLES = [
    (0,   "Lost Freshman"),
    (50,  "Chapel Regular"),
    (150, "Quad Wanderer"),
    (300, "Cameron Faithful"),
    (500, "West Campus Elder"),
    (750, "Blue Devil Legend"),
    (999, "Blueprint Author"),
]


def get_rank_title(points: int) -> str:
    title = RANK_TITLES[0][1]
    for threshold, name in RANK_TITLES:
        if points >= threshold:
            title = name
    return title


def calculate_points(memory_text: str, photo_url: str, audio_url: str, region: str, db: Session, user_id: str) -> int:
    earned = POINTS["drop_pin"]
    if photo_url:
        earned += POINTS["add_photo"]
    if audio_url:
        earned += POINTS["add_audio"]

    if region:
        existing = db.query(Memory).filter(
            Memory.region == region,
            Memory.user_id != user_id
        ).first()
        if existing is None:
            earned += POINTS["first_in_zone"]

    return earned


def award_points(user, earned: int, region: str, db: Session):
    user.memory_points = (user.memory_points or 0) + earned
    if region:
        zones = list(user.zones_unlocked or [])
        if region not in zones:
            zones.append(region)
            user.zones_unlocked = zones
    db.commit()
    db.refresh(user)
