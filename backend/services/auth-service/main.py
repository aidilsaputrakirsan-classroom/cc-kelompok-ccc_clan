from fastapi import FastAPI, Depends, HTTPException, Header, Request
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import User
from schemas import (
    UserCreate,
    UserResponse,
    LoginRequest,
    TokenResponse,
    VerifyResponse
)
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token
)

import logging

from logging_config import setup_logging
from logging_middleware import RequestLoggingMiddleware
from metrics import metrics

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Auth Service")

setup_logging()

logger = logging.getLogger(__name__)

app.add_middleware(
    RequestLoggingMiddleware
)

# ================= HEALTH =================

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "auth-service"
    }


# ================= REGISTER =================

@app.post("/register", response_model=UserResponse)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email sudah digunakan"
        )

    user = User(
        email=user_data.email,
        name=user_data.name,
        nim=user_data.nim,
        prodi=user_data.prodi,
        jurusan=user_data.jurusan,
        fakultas=user_data.fakultas,
        angkatan=user_data.angkatan,
        hashed_password=hash_password(
            user_data.password
        ),
        role="user"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


# ================= LOGIN =================

@app.post("/login", response_model=TokenResponse)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == login_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Email / password salah"
        )

    if not verify_password(
        login_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Email / password salah"
        )

    token = create_access_token(
        {
            "sub": str(user.id),
            "role": user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


# ================= VERIFY TOKEN =================

@app.get(
    "/verify",
    response_model=VerifyResponse
)
def verify_token(
    request: Request,
    authorization: str = Header(...)
):
    if not authorization.startswith(
        "Bearer "
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    token = authorization.replace(
        "Bearer ",
        ""
    )

    payload = decode_token(token)

    return {
        "user_id": int(payload["sub"]),
        "role": payload["role"]
    }


# ================= METRICS =================

@app.get("/metrics")
def get_metrics():

    return {
        "service": "auth-service",

        "service":
            "auth-service",

        **metrics.get_metrics()
    }