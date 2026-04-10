import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base, User
from schemas import (
    ItemCreate, ItemUpdate, ItemResponse, ItemListResponse,
    UserCreate, UserResponse, LoginRequest, TokenResponse,
    CandidateCreate
)
from auth import create_access_token, get_current_user
import crud

load_dotenv()

# ================= INIT =================
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cloud App API",
    version="1.0.0"
)

# ================= CORS =================
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
origins_list = [i.strip() for i in allowed_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= ROLE CHECK =================
def require_role(roles: list):
    def checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(status_code=403, detail="Akses ditolak")
        return current_user
    return checker

# ================= HEALTH =================
@app.get("/health")
def health():
    return {"status": "ok"}

# ================= AUTH =================

@app.post("/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    new_user = crud.create_user(db, user)
    if not new_user:
        raise HTTPException(status_code=400, detail="Email sudah digunakan")
    return new_user


@app.post("/auth/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, data.email, data.password)

    if not user:
        raise HTTPException(status_code=401, detail="Email / password salah")

    token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


@app.get("/auth/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user


# ================= ITEM =================

@app.post("/items", response_model=ItemResponse)
def create_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return crud.create_item(db, item)


@app.get("/items", response_model=ItemListResponse)
def get_items(
    skip: int = Query(0),
    limit: int = Query(20),
    search: str = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return crud.get_items(db, skip, limit, search)


@app.get("/items/{id}", response_model=ItemResponse)
def get_item(
    id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    item = crud.get_item(db, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item tidak ditemukan")
    return item


@app.put("/items/{id}", response_model=ItemResponse)
def update_item(
    id: int,
    item: ItemUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    updated = crud.update_item(db, id, item)
    if not updated:
        raise HTTPException(status_code=404, detail="Item tidak ditemukan")
    return updated


@app.delete("/items/{id}")
def delete_item(
    id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    success = crud.delete_item(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Item tidak ditemukan")
    return {"message": "Deleted"}


# ================= CANDIDATE =================

@app.post("/candidates")
def register_candidate(
    data: CandidateCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return crud.register_candidate(db, user.id, data)


# ================= ADMIN =================

@app.get("/admin/candidates")
def list_candidates(
    db: Session = Depends(get_db),
    user: User = Depends(require_role(["admin", "superadmin"]))
):
    return crud.get_candidates(db)


@app.post("/admin/candidates/{id}/approve")
def approve_candidate(
    id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(["admin", "superadmin"]))
):
    result = crud.approve_candidate(db, id)
    if not result:
        raise HTTPException(status_code=404, detail="Not found")
    return result


@app.post("/admin/candidates/{id}/reject")
def reject_candidate(
    id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(["admin", "superadmin"]))
):
    result = crud.reject_candidate(db, id)
    if not result:
        raise HTTPException(status_code=404, detail="Not found")
    return result


# ================= TEAM =================

@app.get("/team")
def team():
    return {
        "team": "CCC_Clan",
        "members": [
            {"name": "Dzakwan Fatih Fadhilah", "nim": "10231034", "role": "Lead Backend"},
            {"name": "Risky Nur Fatimah Bahar", "nim": "10231084", "role": "Lead Frontend"},
            {"name": "Muhammad Dani", "nim": "10231062", "role": "Lead Devops"},
            {"name": "Ade Ayu Kholifah Putri", "nim": "10231004", "role": "Lead QA & Docs"}
        ],
    }