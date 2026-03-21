"""
Seed 10 example memories across all 3 regions so judges see a populated map.
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
]

SEED_MEMORIES = [
    {
        "user_idx": 0, "landmark_id": "chapel", "region": "west",
        "pin_x": 45, "pin_y": 35,
        "memory_text": "Freshman convocation. I had no idea what four years would hold.",
        "year_tag": "freshman",
    },
    {
        "user_idx": 1, "landmark_id": "cameron", "region": "west",
        "pin_x": 55, "pin_y": 60,
        "memory_text": "Camping out for 3 days for K-Ville. Worth every second.",
        "year_tag": "sophomore",
    },
    {
        "user_idx": 2, "landmark_id": "quad", "region": "west",
        "pin_x": 50, "pin_y": 50,
        "memory_text": "Late night frisbee when we should have been studying for orgo.",
        "year_tag": "junior",
    },
    {
        "user_idx": 0, "landmark_id": "perkins", "region": "west",
        "pin_x": 30, "pin_y": 70,
        "memory_text": "The all-nighter before finals that somehow turned into a 4.0.",
        "year_tag": "senior",
    },
    {
        "user_idx": 1, "landmark_id": "marketplace", "region": "west",
        "pin_x": 60, "pin_y": 55,
        "memory_text": "Every Tuesday pasta night. Never got old.",
        "year_tag": "freshman",
    },
    {
        "user_idx": 2, "landmark_id": "eastdorms", "region": "east",
        "pin_x": 40, "pin_y": 45,
        "memory_text": "Move-in day freshman year. The beginning of everything.",
        "year_tag": "freshman",
    },
    {
        "user_idx": 0, "landmark_id": "baldwin", "region": "east",
        "pin_x": 65, "pin_y": 55,
        "memory_text": "My first Duke concert. Fell in love with this school right here.",
        "year_tag": "sophomore",
    },
    {
        "user_idx": 1, "landmark_id": "bryan", "region": "central",
        "pin_x": 35, "pin_y": 50,
        "memory_text": "The student org fair where everything changed. I said yes to too many clubs.",
        "year_tag": "freshman",
    },
    {
        "user_idx": 2, "landmark_id": "brodhead", "region": "central",
        "pin_x": 65, "pin_y": 50,
        "memory_text": "Endless dining hall debates about everything and nothing.",
        "year_tag": "junior",
    },
    {
        "user_idx": 0, "landmark_id": "chapel", "region": "west",
        "pin_x": 55, "pin_y": 65,
        "memory_text": "Senior sunrise. Couldn't believe four years had passed.",
        "year_tag": "senior",
    },
]

SEED_REACTIONS = [
    {"memory_idx": 0, "user_idx": 1, "emoji": "❤️"},
    {"memory_idx": 0, "user_idx": 2, "emoji": "😭"},
    {"memory_idx": 1, "user_idx": 0, "emoji": "🔥"},
    {"memory_idx": 1, "user_idx": 2, "emoji": "💙"},
    {"memory_idx": 2, "user_idx": 1, "emoji": "😂"},
    {"memory_idx": 5, "user_idx": 0, "emoji": "❤️"},
    {"memory_idx": 5, "user_idx": 1, "emoji": "😭"},
    {"memory_idx": 9, "user_idx": 1, "emoji": "🎓"},
    {"memory_idx": 9, "user_idx": 2, "emoji": "❤️"},
]


def seed():
    # Clear existing seed data (users with seed names)
    for u_data in SEED_USERS:
        existing = db.query(User).filter(User.name == u_data["name"]).first()
        if existing:
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
            # Award points to author
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
