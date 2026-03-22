"""
Seed memories across all landmarks so judges see a populated map.
Run with: python seed.py   (from backend/ with venv active)
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
import models.user, models.memory, models.reaction  # noqa

Base.metadata.create_all(bind=engine)

from models.user import User
from models.memory import Memory
from models.reaction import Reaction
from services.points import POINTS

db = SessionLocal()

SEED_USERS = [
    {"name": "Alex Chen", "graduation_year": 2026},
    {"name": "Jordan Williams", "graduation_year": 2026},
    {"name": "Sam Park", "graduation_year": 2026},
    {"name": "Maya Patel", "graduation_year": 2026},
]

SEED_MEMORIES = [
    # chapel (mapX:52, mapY:32.6) — pins within ±8
    {
        "user_idx": 0, "landmark_id": "chapel", "region": "west",
        "pin_x": 49, "pin_y": 35,
        "memory_text": "Freshman convocation. I had no idea what four years would hold.",
        "year_tag": "freshman",
    },
    {
        "user_idx": 3, "landmark_id": "chapel", "region": "west",
        "pin_x": 54, "pin_y": 30,
        "memory_text": "Senior sunrise. Couldn't believe four years had passed.",
        "year_tag": "senior",
    },
    # cameron (mapX:15, mapY:41) — pins within ±8
    {
        "user_idx": 1, "landmark_id": "cameron", "region": "west",
        "pin_x": 13, "pin_y": 44,
        "memory_text": "Camping out for 3 days for K-Ville. Worth every second.",
        "year_tag": "sophomore",
    },
    {
        "user_idx": 2, "landmark_id": "cameron", "region": "west",
        "pin_x": 18, "pin_y": 38,
        "memory_text": "The game-winner at the buzzer. The whole student section stormed the court.",
        "year_tag": "junior",
    },
    # quad (mapX:41, mapY:48) — pins within ±8
    {
        "user_idx": 2, "landmark_id": "quad", "region": "west",
        "pin_x": 38, "pin_y": 51,
        "memory_text": "Late night frisbee when we should have been studying for orgo.",
        "year_tag": "junior",
    },
    {
        "user_idx": 0, "landmark_id": "quad", "region": "west",
        "pin_x": 44, "pin_y": 45,
        "memory_text": "First snowfall sophomore year. Everyone came outside at 2am.",
        "year_tag": "sophomore",
    },
    # libraries (mapX:60, mapY:39) — pins within ±8
    {
        "user_idx": 0, "landmark_id": "libraries", "region": "west",
        "pin_x": 57, "pin_y": 42,
        "memory_text": "The all-nighter before finals that somehow turned into a 4.0.",
        "year_tag": "senior",
    },
    {
        "user_idx": 3, "landmark_id": "libraries", "region": "west",
        "pin_x": 63, "pin_y": 36,
        "memory_text": "Found my favorite study spot on the 3rd floor. Never told anyone.",
        "year_tag": "freshman",
    },
    # westunion (mapX:46, mapY:38) — pins within ±8
    {
        "user_idx": 1, "landmark_id": "westunion", "region": "west",
        "pin_x": 43, "pin_y": 41,
        "memory_text": "Every Tuesday pasta night. Never got old.",
        "year_tag": "freshman",
    },
    {
        "user_idx": 2, "landmark_id": "westunion", "region": "west",
        "pin_x": 49, "pin_y": 35,
        "memory_text": "The table where our friend group first all sat together.",
        "year_tag": "freshman",
    },
    # bryan (mapX:43, mapY:29.5) — pins within ±8
    {
        "user_idx": 1, "landmark_id": "bryan", "region": "west",
        "pin_x": 40, "pin_y": 32,
        "memory_text": "The student org fair where everything changed. I said yes to too many clubs.",
        "year_tag": "freshman",
    },
    # backyard (mapX:35, mapY:75) — pins within ±8
    {
        "user_idx": 3, "landmark_id": "backyard", "region": "west",
        "pin_x": 32, "pin_y": 72,
        "memory_text": "The unofficial senior hangout. Nobody talked about it, everyone knew about it.",
        "year_tag": "senior",
    },
    {
        "user_idx": 0, "landmark_id": "backyard", "region": "west",
        "pin_x": 38, "pin_y": 78,
        "memory_text": "Cookouts every spring. This place felt like ours.",
        "year_tag": "junior",
    },
    # sciencedr (mapX:52, mapY:21) — pins within ±8
    {
        "user_idx": 2, "landmark_id": "sciencedr", "region": "west",
        "pin_x": 49, "pin_y": 23,
        "memory_text": "Biked down this road every morning for three years. My commute, my ritual.",
        "year_tag": "sophomore",
    },
    {
        "user_idx": 1, "landmark_id": "sciencedr", "region": "west",
        "pin_x": 55, "pin_y": 19,
        "memory_text": "Late lab nights walking back alone. Somehow peaceful.",
        "year_tag": "junior",
    },
    # gardens (mapX:63, mapY:65) — pins within ±8
    {
        "user_idx": 3, "landmark_id": "gardens", "region": "central",
        "pin_x": 60, "pin_y": 68,
        "memory_text": "Picnic with my roommates the last week of senior year. We all cried a little.",
        "year_tag": "senior",
    },
    {
        "user_idx": 0, "landmark_id": "gardens", "region": "central",
        "pin_x": 66, "pin_y": 62,
        "memory_text": "Cherry blossoms sophomore spring. Felt like a movie.",
        "year_tag": "sophomore",
    },
    # centralcampus (mapX:81, mapY:75) — pins within ±8
    {
        "user_idx": 1, "landmark_id": "centralcampus", "region": "central",
        "pin_x": 78, "pin_y": 78,
        "memory_text": "Junior year apartment. The first place that felt like home.",
        "year_tag": "junior",
    },
    {
        "user_idx": 2, "landmark_id": "centralcampus", "region": "central",
        "pin_x": 84, "pin_y": 72,
        "memory_text": "Midnight pizza runs to the gas station. Peak college experience.",
        "year_tag": "senior",
    },
]

SEED_REACTIONS = [
    {"memory_idx": 0, "user_idx": 1, "emoji": "❤️"},
    {"memory_idx": 0, "user_idx": 2, "emoji": "😭"},
    {"memory_idx": 1, "user_idx": 2, "emoji": "🎓"},
    {"memory_idx": 1, "user_idx": 3, "emoji": "❤️"},
    {"memory_idx": 2, "user_idx": 0, "emoji": "🔥"},
    {"memory_idx": 2, "user_idx": 3, "emoji": "💙"},
    {"memory_idx": 4, "user_idx": 1, "emoji": "😂"},
    {"memory_idx": 6, "user_idx": 1, "emoji": "😭"},
    {"memory_idx": 8, "user_idx": 2, "emoji": "❤️"},
    {"memory_idx": 11, "user_idx": 0, "emoji": "🔥"},
    {"memory_idx": 15, "user_idx": 1, "emoji": "😭"},
    {"memory_idx": 15, "user_idx": 2, "emoji": "❤️"},
    {"memory_idx": 17, "user_idx": 3, "emoji": "🏠"},
]


def seed():
    # Clear existing seed data (memories first to avoid FK null violation)
    for u_data in SEED_USERS:
        existing = db.query(User).filter(User.name == u_data["name"]).first()
        if existing:
            for m in db.query(Memory).filter(Memory.user_id == existing.id).all():
                db.query(Reaction).filter(Reaction.memory_id == m.id).delete()
                db.delete(m)
            db.query(Reaction).filter(Reaction.user_id == existing.id).delete()
            db.delete(existing)
    db.commit()

    # Create users
    users = []
    for u_data in SEED_USERS:
        u = User(name=u_data["name"], graduation_year=u_data["graduation_year"], memory_points=0, zones_unlocked=[])
        db.add(u)
        users.append(u)
    db.flush()

    # Create memories
    memories = []
    for m_data in SEED_MEMORIES:
        u = users[m_data["user_idx"]]
        m = Memory(
            user_id=u.id,
            landmark_id=m_data["landmark_id"],
            region=m_data["region"],
            pin_x=m_data["pin_x"],
            pin_y=m_data["pin_y"],
            memory_text=m_data["memory_text"],
            year_tag=m_data["year_tag"],
            is_public=True,
        )
        db.add(m)
        u.memory_points = (u.memory_points or 0) + POINTS["drop_pin"]
        zones = list(u.zones_unlocked or [])
        if m_data["region"] not in zones:
            zones.append(m_data["region"])
            u.zones_unlocked = zones
        memories.append(m)
    db.flush()

    # Create reactions
    for r_data in SEED_REACTIONS:
        m = memories[r_data["memory_idx"]]
        u = users[r_data["user_idx"]]
        if m.user_id != u.id:
            r = Reaction(memory_id=m.id, user_id=u.id, emoji=r_data["emoji"])
            db.add(r)
            author = next((x for x in users if x.id == m.user_id), None)
            if author:
                author.memory_points = (author.memory_points or 0) + POINTS["receive_reaction"]

    db.commit()

    for u in users:
        db.refresh(u)
        print(f"  {u.name}: {u.memory_points} pts, zones: {u.zones_unlocked}")

    print(f"\nSeeded {len(users)} users, {len(memories)} memories, {len(SEED_REACTIONS)} reactions.")


if __name__ == "__main__":
    print("Seeding database...")
    seed()
    print("Done!")
    db.close()
