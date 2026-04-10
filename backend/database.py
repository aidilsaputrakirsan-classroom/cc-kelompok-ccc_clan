import os
import time
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.exc import OperationalError

# Load environment variables dari .env
load_dotenv()

# Ambil DATABASE_URL dari environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL tidak ditemukan di .env!")

# ============================================================
# Retry koneksi database (anti gagal saat docker baru start)
# ============================================================
MAX_RETRIES = 10
RETRY_DELAY = 3  # detik

engine = None

for attempt in range(MAX_RETRIES):
    try:
        print(f"🔄 Mencoba koneksi ke database... ({attempt+1}/{MAX_RETRIES})")
        
        engine = create_engine(DATABASE_URL)
        conn = engine.connect()
        conn.close()

        print("✅ Berhasil konek ke database!")
        break

    except OperationalError as e:
        print(f"❌ Gagal konek: {e}")
        time.sleep(RETRY_DELAY)

else:
    raise Exception("🚨 Tidak bisa konek ke database setelah beberapa percobaan")

# ============================================================
# Session & Base
# ============================================================
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# ============================================================
# Dependency untuk FastAPI
# ============================================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()