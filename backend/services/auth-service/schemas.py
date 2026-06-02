from pydantic import BaseModel, Field, field_validator, EmailStr
from typing import Optional
from datetime import datetime
import re


# ==================== USER ====================
class UserCreate(BaseModel):
    email: str
    name: str
    password: str = Field(..., min_length=8)

    nim: str
    prodi: str
    jurusan: str
    fakultas: str
    angkatan: int

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
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

class VerifyResponse(BaseModel):
    user_id: int
    role: str