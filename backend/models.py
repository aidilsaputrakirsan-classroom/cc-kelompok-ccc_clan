from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.sql import func
from database import Base

# ================= ITEM =================
class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


# ================= USER =================
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


# ================= CANDIDATE =================
class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    nama = Column(String(100), nullable=False)
    nim = Column(String(20), nullable=False, index=True)
    email = Column(String(255), nullable=False, index=True)
    prodi = Column(String(250), nullable=False)
    jurusan = Column(String(250), nullable=False)
    fakultas = Column(String(250), nullable=False)

    posisi = Column(String(100), nullable=False)
    visi = Column(Text, nullable=False)
    misi = Column(Text, nullable=False)
    inovasi = Column(Text, nullable=False)

    # file path (opsional)
    foto = Column(String(255))
    ktp = Column(String(255))
    ktm = Column(String(255))

    cv_ats = Column(String(255))
    transkrip = Column(String(255))
    surat_kesehatan = Column(String(255))
    surat_pernyataan = Column(String(255))
    surat_aktif_kuliah = Column(String(255))
    tsk = Column(String(255))
    surat_mengikuti_kegiatan = Column(String(255))
    dokumen_swot = Column(String(255))

    status = Column(String(50), default="approved")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())