from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)

    nim = Column(String(20), unique=True, nullable=False)
    prodi = Column(String(250), nullable=False)
    jurusan = Column(String(250), nullable=False)
    fakultas = Column(String(250), nullable=False)
    angkatan = Column(Integer, nullable=False)

    role = Column(String(20), default="user")
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())