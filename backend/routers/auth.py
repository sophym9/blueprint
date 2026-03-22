from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import httpx
from database import get_db
from models.user import User
from schemas.user import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from services.auth import hash_password, verify_password, create_access_token, get_current_user
from services.points import get_rank_title
from config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


def _user_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        graduation_year=user.graduation_year,
        avatar_url=user.avatar_url,
        memory_points=user.memory_points or 0,
        zones_unlocked=user.zones_unlocked or [],
        rank_title=get_rank_title(user.memory_points or 0),
        created_at=user.created_at,
    )


@router.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with that email already exists.")

    user = User(
        name=payload.name,
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        graduation_year=payload.graduation_year,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=_user_response(user))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")

    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=_user_response(user))


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return _user_response(current_user)


class Auth0Payload(BaseModel):
    code: str
    verifier: str
    redirect_uri: str


@router.post("/auth0", response_model=TokenResponse)
def auth0_login(payload: Auth0Payload, db: Session = Depends(get_db)):
    domain = settings.auth0_domain
    client_id = settings.auth0_client_id

    # Exchange authorization code for tokens
    token_resp = httpx.post(
        f"https://{domain}/oauth/token",
        json={
            "grant_type": "authorization_code",
            "client_id": client_id,
            "code": payload.code,
            "redirect_uri": payload.redirect_uri,
            "code_verifier": payload.verifier,
        },
        timeout=10,
    )
    if token_resp.status_code != 200:
        raise HTTPException(status_code=401, detail=f"Token exchange failed: {token_resp.text}")

    access_token = token_resp.json().get("access_token")

    # Get user info
    userinfo_resp = httpx.get(
        f"https://{domain}/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=10,
    )
    if userinfo_resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Could not fetch user info.")

    info = userinfo_resp.json()
    email = info.get("email", "").lower()
    name = info.get("name") or info.get("nickname") or email.split("@")[0]
    avatar_url = info.get("picture") or None

    if not email:
        raise HTTPException(status_code=400, detail="No email returned from Auth0.")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(name=name, email=email, avatar_url=avatar_url)
        db.add(user)
        db.commit()
        db.refresh(user)
    elif avatar_url and not user.avatar_url:
        user.avatar_url = avatar_url
        db.commit()
        db.refresh(user)

    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=_user_response(user))
