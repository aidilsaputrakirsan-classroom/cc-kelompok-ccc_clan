from pydantic import BaseModel, Field, field_validator, EmailStr
from typing import Optional
from datetime import datetime
import re


# ==================== CANDIDATE ====================
class CandidateBase(BaseModel):

    nama: str = Field(
        ...,
        min_length=3,
        max_length=100
    )

    nim: str

    email: EmailStr

    prodi: str = Field(
        ...,
        max_length=100
    )

    jurusan: str = Field(
        ...,
        max_length=100
    )

    fakultas: str = Field(
        ...,
        max_length=100
    )

    posisi: str = Field(
        ...,
        max_length=100
    )

    visi: str = Field(
        ...,
        min_length=10,
        max_length=1000
    )

    misi: str = Field(
        ...,
        min_length=10,
        max_length=3000
    )

    inovasi: str = Field(
        ...,
        min_length=10,
        max_length=3000
    )


    @field_validator("nim")
    @classmethod
    def validate_nim(cls, v):

        if not v.isdigit():
            raise ValueError("NIM hanya boleh angka")

        return v
    
    @field_validator("nama")
    @classmethod
    def validate_nama(cls, v):

        if not re.match(
            r"^[A-Za-z\s.,'-]+$",
            v
        ):
            raise ValueError("Nama tidak valid")

        return v



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