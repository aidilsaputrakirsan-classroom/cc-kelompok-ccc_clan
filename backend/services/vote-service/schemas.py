from pydantic import BaseModel, Field


class VoteCreate(BaseModel):

    candidate_id: int = Field(
        ...,
        gt=0
    )


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