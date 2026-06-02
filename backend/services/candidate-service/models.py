from sqlalchemy import Text, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base


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
