import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base, User
from schemas import (
    ItemCreate, ItemUpdate, ItemResponse, ItemListResponse,
    UserCreate, UserResponse, LoginRequest, TokenResponse,
    CandidateCreate, CandidateUpdate, CandidateResponse
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
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint — cek status semua komponen."""
    health = {
        "status": "healthy",
        "service": "backend",
        "version": "1.0.0",
    }
    
    # Cek database connection
    try:
        db.execute(text("SELECT 1"))
        health["database"] = "connected"
    except Exception as e:
        health["status"] = "unhealthy"
        health["database"] = f"error: {str(e)}"
    
    status_code = 200 if health["status"] == "healthy" else 503
    return JSONResponse(content=health, status_code=status_code)

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


# ================= CANDIDATE PUBLIC =================
@app.get("/candidates", response_model=list[CandidateResponse])
def get_candidates(db: Session = Depends(get_db)):
    return crud.get_candidates(db)


# ================= CANDIDATE ADMIN =================
@app.post("/admin/candidates", response_model=CandidateResponse)
def create_candidate(
    data: CandidateCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(["admin", "superadmin"]))
):
    return crud.create_candidate(db, data)


@app.put("/admin/candidates/{id}", response_model=CandidateResponse)
def update_candidate(
    id: int,
    data: CandidateUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(["admin", "superadmin"]))
):
    result = crud.update_candidate(db, id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Not found")
    return result


@app.delete("/admin/candidates/{id}")
def delete_candidate(
    id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(["admin", "superadmin"]))
):
    success = crud.delete_candidate(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"message": "Deleted"}


@app.get("/admin/candidates", response_model=list[CandidateResponse])
def list_candidates(
    db: Session = Depends(get_db),
    user: User = Depends(require_role(["admin", "superadmin"]))
):
    return crud.get_candidates(db)


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