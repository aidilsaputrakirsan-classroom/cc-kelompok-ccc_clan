from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Cloud App API",
    description="API untuk mata kuliah Komputasi Awan",
    version="0.1.0"
)

# CORS - agar frontend bisa akses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Untuk development saja
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Hello from Cloud App API!",
        "status": "running",
        "version": "0.1.0"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/team")
def team_info():
    return {
        "team": "CCC Clan",
        "members": [
            # TODO: Isi dengan data tim Anda
            {"name": "Dzakwan Fatih Fadhilah", "nim": "10231034", "role": "Lead Backend"},
            {"name": "Risky Nur Fatimah Bahar", "nim": "10231084", "role": "Lead Frontend"},
            {"name": "Muhammad Dani", "nim": "10231062", "role": "Lead DevOps"},
            {"name": "Ade Ayu Kholifah Putri", "nim": "10231004", "role": "Lead QA & Docs"},
        ]
    }