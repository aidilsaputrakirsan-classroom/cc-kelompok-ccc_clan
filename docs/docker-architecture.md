# 🧱 Docker Architecture - SIPILIH System

Dokumen ini menjelaskan arsitektur Docker untuk aplikasi SIPILIH yang terdiri dari 3 container utama: **Frontend, Backend, dan Database**.

## 🏗️ Overview Arsitektur

Sistem menggunakan arsitektur 3-layer container:

- **Frontend (React + Nginx)**
- **Backend (FastAPI)**
- **Database (PostgreSQL 15)**

Semua service berjalan di dalam Docker Compose dan saling terhubung melalui internal Docker network.

## 🌐 Docker Services

### 1. 🗄️ Database (PostgreSQL)

- **Container Name**: `postgres_db`
- **Image**: `postgres:15`
- **Port Mapping**: `5433:5432`
- **Database Name**: `sipilih`
- **User**: `bento`

#### Environment Variables:
- `POSTGRES_USER=bento`
- `POSTGRES_PASSWORD=mariyani1`
- `POSTGRES_DB=sipilih`

#### Volume:
- `postgres_data:/var/lib/postgresql/data`

#### Fungsi:
Menyimpan seluruh data aplikasi secara persisten.

### 2. ⚙️ Backend (FastAPI)

- **Container Name**: `fastapi_backend`
- **Build**: `./backend`
- **Port Mapping**: `8000:8000`

#### Environment File:
- `./backend/.env`

#### Dependencies:
- PostgreSQL (db service)
- SQLAlchemy
- Uvicorn

#### Volume:
- `./backend:/app` (hot reload development support)

#### Dockerfile Highlights:
- Python 3.12 slim
- Non-root user execution
- Healthcheck endpoint: `/health`

#### Fungsi:
Menangani API, business logic, authentication (JWT), dan database operations.

### 3. 🌐 Frontend (React + Nginx)

- **Container Name**: `sipilih_frontend`
- **Image**: `sipilih-frontend:v1`
- **Port Mapping**: `3000:80`

#### Build Stage:
- Node.js 20 (build React app)

#### Production Stage:
- Nginx (serve static files)

#### Environment (build time):
- `VITE_API_URL=http://localhost:8000`

#### Depends On:
- Backend

#### Fungsi:
Menampilkan UI aplikasi dan berkomunikasi dengan backend API.

## 🔗 Network Flow

- Frontend → Backend: `http://backend:8000` (internal / build config)
- Backend → Database: `postgresql://db:5432/sipilih`

Docker Compose automatically creates a default bridge network.

## 💾 Volumes

| Volume Name     | Target Path                              | Purpose                  |
|----------------|------------------------------------------|--------------------------|
| postgres_data   | /var/lib/postgresql/data                 | Persistent DB storage    |
| backend bind    | ./backend:/app                           | Live code sync backend   |

## ⚙️ Environment Variables

### Backend `.env`
```env
DATABASE_URL=postgresql://postgres:cokki@db:5432/cloudapp

SECRET_KEY=
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

```
flowchart LR

    subgraph DEFAULT ["❌ Default Docker Setup (Konsep Terisolasi)"]
        DFE["Frontend (React)"]
        DBE["Backend (FastAPI)"]
        DDB["Database (PostgreSQL)"]

        DFE -.->|"harus expose port manual"| DBE
        DBE -.->|"raw connection risk"| DDB
    end

    subgraph SIPILIH ["✅ SIPILIH Architecture (Docker Compose)"]
        FE["Frontend<br/>React + Nginx<br/>Port: 3000"]
        BE["Backend<br/>FastAPI<br/>Port: 8000"]
        DB["Database<br/>PostgreSQL 15<br/>5432 internal / 5433 host"]
        VOL[(postgres_data volume)]

        FE -->|"HTTP REST API"| BE
        BE -->|"SQL query"| DB
        DB --> VOL
    end

    %% Styling biar beda jelas
    style DEFAULT fill:#FBE5D6,stroke:#C00000,stroke-width:1px
    style SIPILIH fill:#E2EFDA,stroke:#2E7D32,stroke-width:1px

    style FE fill:#E3F2FD,stroke:#1E88E5
    style BE fill:#E8F5E9,stroke:#43A047
    style DB fill:#FFF3E0,stroke:#FB8C00
    style VOL fill:#F3E5F5,stroke:#8E24AA
```