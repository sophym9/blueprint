# Last Chapter

> *"Every story deserves to be remembered."*

A sentimental memory map for Duke's Class of 2026. Seniors pin memories to a fantasy RPG-themed illustrated map of Duke's campus, tagging moments to real landmarks, attaching photos, audio recordings, and songs. Built for HackDuke 2026.

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
git clone https://github.com/sophym9/blueprint.git
cd blueprint
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
blueprint/
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

## Auth0 Integration

Blueprint uses [Auth0](https://auth0.com) for Google OAuth, implemented via a manual **PKCE (Proof Key for Code Exchange)** flow — no SDK dependency. Users can sign in with their Google account in addition to email/password.

**Flow:**
1. Frontend generates a PKCE verifier + SHA-256 challenge
2. Redirects to Auth0's `/authorize` endpoint
3. Auth0 handles Google OAuth and redirects back with an authorization code
4. Backend exchanges the code for tokens via Auth0's `/oauth/token`, then calls `/userinfo` to get the user's email and profile
5. Backend finds or creates the user in the local DB and returns a standard app JWT — session is identical to email/password login from that point

---

## AI Usage

This project was built with AI assistance:

- **[Claude](https://claude.ai) by Anthropic** — architecture design, code generation, debugging, and implementation across the full stack
- **[NanoBanana](https://nanobanana.ai)** — AI-assisted image generation

---

## Team

Built at HackDuke 2026 by Sophie Mansoor and Meeraa Ramakrishnan
