from pydantic import BaseModel
from datetime import datetime


class VoteCreate(BaseModel):
    candidate_id: int


class VoteResponse(BaseModel):
    message: str


class MyVoteResponse(BaseModel):
    position: str
    candidate_id: int


class VoteResultItem(BaseModel):
    candidate_id: int
    total_votes: int
    percentage: float


class VoteResultResponse(BaseModel):
    position: str
    candidates: list[VoteResultItem]