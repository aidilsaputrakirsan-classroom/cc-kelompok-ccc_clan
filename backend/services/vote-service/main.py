from collections import defaultdict
from fastapi import (
    FastAPI,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session
from database import (
    Base,
    engine,
    get_db
)

from models import Vote
from schemas import (
    VoteCreate,
    VoteResponse,
    MyVoteResponse,
    VoteResultResponse
)

from auth_client import verify_token
from candidate_client import get_candidate

import logging

from logging_config import setup_logging
from logging_middleware import RequestLoggingMiddleware
from metrics import metrics

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Vote Service"
)

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
        "service": "vote-service"
    }


# ================= VOTE =================

@app.post(
    "/vote",
    response_model=VoteResponse
)
async def create_vote(
    data: VoteCreate,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):

    candidate = await get_candidate(
        data.candidate_id
    )

    if not candidate:

        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    position = candidate["posisi"]

    existing_vote = (
        db.query(Vote)
        .filter(
            Vote.user_id == user["user_id"],
            Vote.position == position
        )
        .first()
    )

    if existing_vote:

        raise HTTPException(
            status_code=400,
            detail=f"Anda sudah memilih untuk posisi {position}"
        )

    vote = Vote(
        user_id=user["user_id"],
        candidate_id=data.candidate_id,
        position=position
    )

    db.add(vote)
    db.commit()

    return {
        "message": "Vote berhasil disimpan"
    }


# ================= MY VOTES =================

@app.get("/my-votes", response_model=list[MyVoteResponse])
async def my_votes(
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):

    votes = (
        db.query(Vote)
        .filter(
            Vote.user_id == user["user_id"]
        )
        .all()
    )

    return [
        {
            "position": vote.position,
            "candidate_id": vote.candidate_id
        }
        for vote in votes
    ]


# ================= RESULTS =================

@app.get("/vote-results", response_model=list[VoteResultResponse])
def vote_results(
    db: Session = Depends(get_db)
):

    votes = db.query(Vote).all()

    grouped = defaultdict(list)

    for vote in votes:

        grouped[
            vote.position
        ].append(vote)

    results = []

    for position, vote_list in grouped.items():

        total_votes = len(vote_list)

        candidate_counter = {}

        for vote in vote_list:

            candidate_counter[
                vote.candidate_id
            ] = (
                candidate_counter.get(
                    vote.candidate_id,
                    0
                )
                + 1
            )

        candidates = []

        for candidate_id, count in (
            candidate_counter.items()
        ):

            percentage = round(
                (
                    count
                    / total_votes
                ) * 100,
                2
            )

            candidates.append(
                {
                    "candidate_id":
                        candidate_id,

                    "total_votes":
                        count,

                    "percentage":
                        percentage
                }
            )

        results.append(
            {
                "position":
                    position,

                "candidates":
                    candidates
            }
        )

    return results


# ================= METRICS =================

@app.get("/metrics")
def get_metrics():

    return {
        "service": "vote-service",
        **metrics.get_metrics()
    }