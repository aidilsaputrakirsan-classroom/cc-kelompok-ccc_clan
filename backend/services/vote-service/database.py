import os
import time

from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.orm import (
    declarative_base,
    sessionmaker
)

from sqlalchemy.exc import OperationalError

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL"
)

if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL tidak ditemukan!"
    )

MAX_RETRIES = 10
RETRY_DELAY = 3

engine = None

for attempt in range(MAX_RETRIES):

    try:

        print(
            f"Connecting DB ({attempt+1}/{MAX_RETRIES})"
        )

        engine = create_engine(
            DATABASE_URL
        )

        conn = engine.connect()
        conn.close()

        print("Database Connected")
        break

    except OperationalError:

        time.sleep(RETRY_DELAY)

else:

    raise Exception(
        "Database connection failed"
    )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()