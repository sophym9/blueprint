# hackduke-2026

Full-stack Duke campus map prototype with a React frontend and FastAPI backend.

## Project structure

- `frontend/`: Vite + React + TypeScript interactive map UI
- `backend/`: FastAPI API serving map regions and region details

## Run the backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python -m uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000/api`.

## Run the frontend

```powershell
cd frontend
npm install
npx vite --host 127.0.0.1 --port 5173
```

The app will be available at `http://127.0.0.1:5173`.

## Current prototype features

- Full-screen pixel-art Duke map
- Clickable overlay regions
- Zoom buttons with scroll-based panning
- Click-anywhere note pins backed by FastAPI
- Category filters and a floating detail panel