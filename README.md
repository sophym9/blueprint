# Last Chapter

> *"Every story deserves to be remembered."*

A sentimental memory map for Duke's Class of 2026. Seniors pin memories to a fantasy RPG-themed illustrated map of Duke's campus — tagging moments to real landmarks, attaching photos, audio recordings, and songs. Built for HackDuke 2026.

---

## Features

- **Interactive campus map** — pan/zoom across West, East, and Central Campus zones
- **Memory pins** — drop pins on landmarks with text, photos, audio recordings, and YouTube songs
- **Memory cards** — view memories in a loot-box style modal; download as a shareable image
- **Soundtrack page** — aggregates all pinned songs into a collective playlist
- **Scrapbook profile** — view all your memories in a yearbook-style layout
- **Game layer** — earn Memory Points for contributions, unlock rank titles, track zone progress
- **Leaderboard** — top contributors across the class
- **Auth** — email/password or Google sign-in via Auth0

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite, Axios |
| Backend | FastAPI (Python), SQLAlchemy, SQLite |
| Auth | Custom JWT + Auth0 (PKCE) |
| Storage | Local file system (Docker volume) |
| Infra | Docker Compose, Nginx |

---

## Running Locally

Requires Docker and Docker Compose.

```bash
git clone https://github.com/sophym9/hackduke-2026.git
cd hackduke-2026
docker compose up --build
```

App runs at `http://localhost`.

### Environment

The backend reads from environment variables (set in `docker-compose.yml`):

| Variable | Description |
|---|---|
| `SECRET_KEY` | JWT signing secret |
| `AUTH0_DOMAIN` | Auth0 tenant domain |
| `AUTH0_CLIENT_ID` | Auth0 application client ID |

---

## Project Structure

```
hackduke-2026/
  backend/          FastAPI app, models, routers, services
  frontend/         React + Vite app
    src/
      components/   Map, memory, game, and UI components
      hooks/        useAuth, useMemories, useMapTransform
      pages/        Home, Login, Profile, Soundtrack
      lib/          API client, map config, landmarks registry
  docker-compose.yml
```

---

## AI Usage

This project was built with AI assistance:

- **[Claude](https://claude.ai) by Anthropic** — architecture design, code generation, debugging, and implementation across the full stack
- **[NanoBanana](https://nanobanana.ai)** — AI-assisted development tooling

---

## Team

Built at HackDuke 2026 by Duke Class of 2026.
