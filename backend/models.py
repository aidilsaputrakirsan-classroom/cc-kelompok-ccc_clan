from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.sql import func
from database import Base


# ============================================================
#  CLASS ITEM
# ============================================================
class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


# ============================================================
# CLASS USER LOGIN
# ============================================================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)

    # DATA MAHASISWA
    nim = Column(String(20), unique=True, nullable=False)
    prodi = Column(String(250), nullable=False)
    jurusan = Column(String(250), nullable=False)
    fakultas = Column(String(250), nullable=False)
    angkatan = Column(Integer, nullable=False)

    # ROLE SYSTEM
    role = Column(String(20), default="user")  # user / admin / superadmin

    # STATUS AKUN
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ============================================================
# CLASS CANDIDATE - ADMIN INPUT
# ============================================================
class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # =========================
    # DATA DIRI
    # =========================
    nama = Column(String(100), nullable=False)
    nim = Column(String(20), nullable=False, index=True)
    email = Column(String(255), nullable=False, index=True)
    prodi = Column(String(250), nullable=False, index=True)
    jurusan = Column(String(250), nullable=False, index=True)
    fakultas = Column(String(250), nullable=False, index=True)

    # =========================
    # DATA KAMPANYE
    # =========================
    posisi = Column(String(100), nullable=False, index=True)
    visi = Column(Text, nullable=False)
    misi = Column(Text, nullable=False)
    inovasi = Column(Text, nullable=False)

    # =========================
    # FILE UPLOAD
    # SIMPAN PATH FILE
    # =========================

    # FILE PNG 
    foto = Column(String(255), nullable=True)
    ktp = Column(String(255), nullable=True)
    ktm = Column(String(255), nullable=True)

    # FILE PDF
    cv_ats = Column(String(255), nullable=True)
    transkrip = Column(String(255), nullable=True)
    surat_kesehatan = Column(String(255), nullable=True)
    surat_pernyataan = Column(String(255), nullable=True)
    surat_aktif_kuliah = Column(String(255), nullable=True)
    tsk = Column(String(255), nullable=True)
    surat_mengikuti_kegiatan = Column(String(255), nullable=True)
    dokumen_swot = Column(String(255), nullable=True)

    # =========================
    # STATUS
    # =========================
    status = Column(String(50), default="approved")  

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())