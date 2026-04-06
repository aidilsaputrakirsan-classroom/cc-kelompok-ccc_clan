from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.sql import func
from database import Base


class Item(Base):
    """Model untuk tabel 'items'."""
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class User(Base):
    """Model untuk tabel 'users'."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)

    # DATA MAHASISWA
    nim = Column(String(20), unique=True, nullable=False)  # ⚠️ ubah ke string (lebih aman)
    prodi = Column(String(250), nullable=False)
    jurusan = Column(String(250), nullable=False)
    fakultas = Column(String(250), nullable=False)
    angkatan = Column(Integer, nullable=False)

    # ROLE SYSTEM
    role = Column(String(20), default="user")  # user / admin / superadmin

    # STATUS AKUN
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Candidate(Base):
    """Model untuk tabel 'candidates'."""
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # RELASI KE USER
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    posisi = Column(String(100), nullable=False)
    visi = Column(Text, nullable=False)
    misi = Column(Text, nullable=False)
    inovasi = Column(Text, nullable=False)

    status = Column(String(50), default="pending")  # pending / approved / rejected

    created_at = Column(DateTime(timezone=True), server_default=func.now())