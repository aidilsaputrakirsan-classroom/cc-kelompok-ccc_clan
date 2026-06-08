from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from database import Base, engine, get_db
from models import Candidate
from schemas import (
    CandidateCreate,
    CandidateUpdate,
    CandidateResponse,
    CandidateStatsResponse
)

from typing import Optional

from auth_client import (
    verify_token,
    auth_circuit
)

import logging

from logging_config import setup_logging
from logging_middleware import RequestLoggingMiddleware
from metrics import metrics

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Candidate Service")

setup_logging()

logger = logging.getLogger(__name__)

app.add_middleware(
    RequestLoggingMiddleware
)


# ================= HEALTH =================

@app.get("/health")
def health_check():

    db_status = "connected"

    try:

        db = next(get_db())

        db.execute(text("SELECT 1"))

        db.close()

    except Exception:

        db_status = "disconnected"

    auth_status = auth_circuit.get_status()

    overall = "healthy"

    if auth_status["state"] != "CLOSED":
        overall = "degraded"

    if db_status != "connected":
        overall = "unhealthy"

    return {
        "status": overall,
        "service": "candidate-service",
        "dependencies": {
            "auth-service": auth_status,
            "database": {
                "status": db_status
            }
        }
    }

# ================= PUBLIC =================

@app.get(
    "/candidates",
    response_model=list[CandidateResponse]
)
def get_candidates(
    position: Optional[str] = None,
    db: Session = Depends(get_db)
):

    query = db.query(Candidate)

    if position:
        query = query.filter(
            Candidate.posisi == position
        )

    return (
        query
        .order_by(
            Candidate.created_at.desc()
        )
        .all()
    )


# ================= ADMIN =================

@app.post(
    "/admin/candidates",
    response_model=CandidateResponse
)
async def create_candidate(
    data: CandidateCreate,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    if user["role"] not in [
        "admin",
        "superadmin"
    ]:
        raise HTTPException(
            status_code=403,
            detail="Forbidden"
        )

    candidate = Candidate(
        **data.model_dump(),
        status="approved"
    )

    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    return candidate


@app.put(
    "/admin/candidates/{candidate_id}",
    response_model=CandidateResponse
)
async def update_candidate(
    candidate_id: int,
    data: CandidateUpdate,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    if user["role"] not in [
        "admin",
        "superadmin"
    ]:
        raise HTTPException(
            status_code=403,
            detail="Forbidden"
        )

    candidate = (
        db.query(Candidate)
        .filter(
            Candidate.id == candidate_id
        )
        .first()
    )

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Not found"
        )

    for key, value in (
        data.model_dump(
            exclude_unset=True
        ).items()
    ):
        setattr(
            candidate,
            key,
            value
        )

    db.commit()
    db.refresh(candidate)

    return candidate


@app.delete(
    "/admin/candidates/{candidate_id}"
)
async def delete_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    if user["role"] not in [
        "admin",
        "superadmin"
    ]:
        raise HTTPException(
            status_code=403,
            detail="Forbidden"
        )

    candidate = (
        db.query(Candidate)
        .filter(
            Candidate.id == candidate_id
        )
        .first()
    )

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Not found"
        )

    db.delete(candidate)
    db.commit()

    return {
        "message": "Deleted"
    }


@app.get(
    "/admin/candidates",
    response_model=list[CandidateResponse]
)
async def list_candidates(
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    if user["role"] not in [
        "admin",
        "superadmin"
    ]:
        raise HTTPException(
            status_code=403,
            detail="Forbidden"
        )

    return (
        db.query(Candidate)
        .order_by(Candidate.created_at.desc())
        .all()
    )


# ================= STATUS KANDIDAT =================

@app.get(
    "/candidates/stats",
    response_model=CandidateStatsResponse
)
def candidate_stats(
    db: Session = Depends(get_db)
):
    total = db.query(
        Candidate
    ).count()

    approved = (
        db.query(Candidate)
        .filter(
            Candidate.status == "approved"
        )
        .count()
    )

    pending = (
        db.query(Candidate)
        .filter(
            Candidate.status == "pending"
        )
        .count()
    )

    return {
        "total_candidates": total,
        "approved_candidates": approved,
        "pending_candidates": pending
    }


@app.get(
    "/candidates/{candidate_id}",
    response_model=CandidateResponse
)
def get_candidate_detail(
    candidate_id: int,
    db: Session = Depends(get_db)
):
    candidate = (
        db.query(Candidate)
        .filter(
            Candidate.id == candidate_id
        )
        .first()
    )

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    return candidate


# ================= Posisi Kandidat =================

@app.get("/positions")
def get_positions(
    db: Session = Depends(get_db)
):

    positions = (
        db.query(Candidate.posisi)
        .distinct()
        .all()
    )

    return {
        "positions": [
            p[0]
            for p in positions
        ]
    }



# ================= METRICS =================

@app.get("/metrics")
def get_metrics():

    return {
        "service":
            "candidate-service",

        **metrics.get_metrics()
    }