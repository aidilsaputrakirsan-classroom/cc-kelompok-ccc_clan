import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from dotenv import load_dotenv
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database import get_db
from models import User

load_dotenv()

# Konfigurasi dari environment variables
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key-for-development")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme — FastAPI akan mencari header "Authorization: Bearer <token>"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# ==================== PASSWORD ====================

def hash_password(password: str) -> str:
    """Hash password menggunakan bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifikasi password terhadap hash."""
    return pwd_context.verify(plain_password, hashed_password)


# ==================== JWT TOKEN ====================

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Buat JWT access token."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    print(f" [DEBUG] Token created for user: {to_encode.get('sub')}")
    print(f" [DEBUG] Token: {token[:50]}...")
    return token


def decode_token(token: str) -> dict:
    """Decode dan verifikasi JWT token."""
    try:
        print(f" [DEBUG] Token received: {token[:30]}...")
        print(f" [DEBUG] SECRET_KEY being used: {SECRET_KEY[:30]}...")
        print(f" [DEBUG] ALGORITHM: {ALGORITHM}")
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f" [SUCCESS] Token decoded! User ID: {payload.get('sub')}")
        return payload
        
    except JWTError as e:
        print(f" [ERROR] JWT Decode Failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid atau sudah expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

# ==================== DEPENDENCY ====================

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    print(f" [DEBUG] get_current_user called with token: {token[:30]}...")
    payload = decode_token(token)
    user_id: int = int(payload.get("sub"))  # ← Konvert string ke int
    
    print(f" [DEBUG] Extracted user_id: {user_id}")
    # ... rest of function

    if user_id is None:
        print(f" [ERROR] user_id is None!")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid",
        )

    user = db.query(User).filter(User.id == user_id).first()
    print(f" [DEBUG] User from DB: {user.email if user else 'NOT FOUND'}")

    if user is None:
        print(f" [ERROR] User not found in database!")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User tidak ditemukan",
        )

    if not user.is_active:
        print(f" [ERROR] User is not active!")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun tidak aktif",
        )

    print(f" [SUCCESS] User authenticated: {user.email}")
    return user