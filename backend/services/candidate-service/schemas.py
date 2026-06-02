from pydantic import BaseModel, Field, field_validator, EmailStr
from typing import Optional
from datetime import datetime
import re


# ==================== CANDIDATE ====================
class CandidateBase(BaseModel):
    nama: str
    nim: str
    email: EmailStr
    prodi: str
    jurusan: str
    fakultas: str

    posisi: str
    visi: str
    misi: str
    inovasi: str


class CandidateCreate(CandidateBase):
    pass


class CandidateUpdate(BaseModel):
    nama: Optional[str] = None
    nim: Optional[str] = None
    email: Optional[EmailStr] = None
    prodi: Optional[str] = None
    jurusan: Optional[str] = None
    fakultas: Optional[str] = None

    posisi: Optional[str] = None
    visi: Optional[str] = None
    misi: Optional[str] = None
    inovasi: Optional[str] = None


class CandidateResponse(CandidateBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class CandidateStatsResponse(BaseModel):
    total_candidates: int
    approved_candidates: int
    pending_candidates: int