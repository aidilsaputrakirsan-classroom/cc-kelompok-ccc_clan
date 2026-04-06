from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
import re


# ==================== ITEM SCHEMAS ====================

class ItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    quantity: int = Field(0, ge=0)


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=0)


class ItemResponse(ItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ItemListResponse(BaseModel):
    total: int
    items: list[ItemResponse]


# ==================== USER SCHEMAS ====================

class UserCreate(BaseModel):
    email: str
    name: str
    password: str = Field(..., min_length=8)

    # DATA MAHASISWA
    nim: str
    prodi: str
    jurusan: str
    fakultas: str
    angkatan: int

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, v):
            raise ValueError('Format email tidak valid')
        return v.lower()

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password minimal 8 karakter')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Harus ada huruf besar')
        if not re.search(r'[a-z]', v):
            raise ValueError('Harus ada huruf kecil')
        if not re.search(r'[0-9]', v):
            raise ValueError('Harus ada angka')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Harus ada karakter spesial')
        return v


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    nim: str
    prodi: str
    jurusan: str
    fakultas: str
    angkatan: int
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# ==================== CANDIDATE SCHEMAS ====================

class CandidateCreate(BaseModel):
    posisi: str
    visi: str
    misi: str
    inovasi: str


class CandidateResponse(BaseModel):
    id: int
    user_id: int
    posisi: str
    visi: str
    misi: str
    inovasi: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True