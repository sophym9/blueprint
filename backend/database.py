from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False},  # needed for SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def run_migrations():
    """Add new columns / adjust nullability for existing tables."""
    add_column_stmts = [
        "ALTER TABLE users ADD COLUMN email VARCHAR",
        "ALTER TABLE users ADD COLUMN password_hash VARCHAR",
        "ALTER TABLE users ADD COLUMN graduation_date VARCHAR",
        "ALTER TABLE memories ADD COLUMN song_url VARCHAR",
        "ALTER TABLE memories ADD COLUMN sfx_url VARCHAR",
    ]
    with engine.connect() as conn:
        for stmt in add_column_stmts:
            try:
                conn.execute(text(stmt))
                conn.commit()
            except Exception:
                pass

        _make_memories_landmark_nullable(conn)


def _make_memories_landmark_nullable(conn):
    """SQLite can't ALTER COLUMN, so rename → recreate → copy → drop."""
    try:
        info = conn.execute(text("PRAGMA table_info(memories)")).fetchall()
    except Exception:
        return
    landmark_col = next((r for r in info if r[1] == "landmark_id"), None)
    if landmark_col is None or landmark_col[3] == 0:
        return  # column missing or already nullable

    conn.execute(text("ALTER TABLE memories RENAME TO _memories_old"))
    conn.execute(text("""
        CREATE TABLE memories (
            id VARCHAR PRIMARY KEY,
            user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            landmark_id VARCHAR,
            region VARCHAR,
            pin_x FLOAT NOT NULL,
            pin_y FLOAT NOT NULL,
            memory_text TEXT,
            photo_url VARCHAR,
            audio_url VARCHAR,
            song_url VARCHAR,
            year_tag VARCHAR,
            is_public BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """))
    conn.execute(text("""
        INSERT INTO memories
            (id, user_id, landmark_id, region, pin_x, pin_y,
             memory_text, photo_url, audio_url, song_url,
             year_tag, is_public, created_at)
        SELECT id, user_id, landmark_id, region, pin_x, pin_y,
               memory_text, photo_url, audio_url, song_url,
               year_tag, is_public, created_at
        FROM _memories_old
    """))
    conn.execute(text("DROP TABLE _memories_old"))
    conn.commit()
