# ☁️ Cloud App - SIPILIH (Sistem Informasi Pemilihan Digital)

![CI Pipeline](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-ccc_clan/actions/workflows/ci.yml)

Deskripsi : 
SIPILIH (Sistem Informasi Pemilihan Digital) merupakan platform berbasis web yang dirancang untuk mendukung proses pemilihan elektronik (_e-voting_) di lingkungan kampus, seperti pemilihan Ketua BEM, Himpunan Mahasiswa, maupun organisasi kemahasiswaan lainnya. Sistem ini bertujuan untuk menghadirkan proses pemungutan suara yang aman, transparan, dan terstruktur melalui mekanisme autentikasi akun mahasiswa. SIPILIH menyediakan berbagai fitur Utama seperti manajemen kandidat, pengaturan periode pemilihan, serta monitoring partisipasi pemilih. Selainn itu, sistem ini juga dilengkapi dengan dashboard hasil perolehan suara secara real-time yang disajikan dalam bentuk grafik persentase, sehingga memudahkan dalam proses evaluasi dan pengambilan keputusan. 

Dalam implementasinya, SIPILIH membagi hak akses pengguna ke dalam beberapa peran, yaitu Super Admin, Admin, dan Peserta, yang dimana masing-masing peran tersebut memiliki fungsi dan tanggung jawab berbeda untuk menjaga kelancaran proses pemilihan. Dengan adanya SIPILIH, proses demokrasi di lingkungan kampus dapat lebih terdokumentasi secara digital, terintegrasi dalam satu sistem terpusat, serta meminimalkan potensi kecurangan dalam pemungutan suara.

## 👥 Tim

| Nama | NIM | Peran |
|------|-----|-------|
| Dzakwan Fatih Fadhilah  | 10231034 | Lead Backend |
| Risky Nur Fatimah Bahar  | 10231084 | Lead Frontend |
| Muhammad Dani  | 10231062 | Lead DevOps |
| Ade Ayu Kholifah Putri | 10231004 | Lead QA & Docs |

## 🛠️ Tech Stack

| Teknologi | Fungsi |
|-----------|--------|
| FastAPI   | Backend REST API |
| React     | Frontend SPA |
| PostgreSQL | Database |
| Docker    | Containerization |
| GitHub Actions | CI/CD |
| Railway/Render | Cloud Deployment |

## 🏗️ Architecture

flowchart TD

    USER["User Browser"]

    USER --> FE["Frontend"]

    FE --> GW["API Gateway (Nginx)"]

    GW --> AUTH["Auth Service"]
    GW --> CAND["Candidate Service"]
    GW --> BACKEND["Main Backend (Monolith)"]

    AUTH --> AUTHDB[("Auth Database")]
    CAND --> CANDDB[("Candidate Database")]
    BACKEND --> MAINDB[("Main Database")]

    CAND -.->|"Verify Token"| AUTH

  SIPILIH saat ini berada pada tahap transisi dari arsitektur monolith menuju microservices. Transisi ini ditunjukkan dengan adanya pemisahan beberapa domain bisnis menjadi service tersendiri, seperti Auth Service dan Candidate Service, yang memiliki tanggung jawab serta database masing-masing.

Selain itu, komunikasi antar service telah dilakukan melalui API, misalnya Candidate Service yang melakukan verifikasi token melalui Auth Service. Sistem juga telah menggunakan API Gateway sebagai entry point untuk melakukan routing request ke service yang sesuai.

Meskipun demikian, aplikasi masih mempertahankan Main Backend (Monolith) untuk beberapa fitur yang belum sepenuhnya dipisahkan. Oleh karena itu, arsitektur yang digunakan saat ini lebih tepat disebut sebagai hybrid architecture, yaitu kombinasi antara monolith dan microservices sebagai tahap transisi menuju sistem yang lebih terdistribusi.

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://frontendcc-kelompok-cccclan-production.up.railway.app/ |
| Backend API | https://backendcc-kelompok-cccclan-production.up.railway.app |
| API Docs | https://backendcc-kelompok-cccclan-production.up.railway.app/docs |


## 🚀 Getting Started

### Prasyarat
- Python 3.10+
- Node.js 18+
- Git

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Access
- API : http://localhost:8000
- API Docs : http://localhost:8000/docs
- Frontend : http://localhost:5173

## Docker Setup

Pastikan Docker sudah terinstall di sistem:
```
docker --version  
docker compose version  
```
Lakukan pengujian awal Docker:
```
docker run hello-world  
```
Jika berhasil, akan muncul pesan: 
```
"Hello from Docker!"
```
Login ke Docker Hub:
```
docker login  
```

## Build Image

Masuk ke folder backend dan build Docker image:
```
cd backend  
docker build -t sipilih-backend:v1 .  
```
Verifikasi bahwa image berhasil dibuat:
```
docker images  
```
Pastikan terdapat image dengan nama 
```
`sipilih-backend:v1`.
```

## Run Container

Jalankan container menggunakan perintah berikut:
```
docker run -p 8000:8000 --env-file .env sipilih-backend:v1  
```
Jika terjadi error koneksi database, periksa konfigurasi `DATABASE_URL` pada file `.env`:

- Untuk Windows / Mac:
```
  host.docker.internal  
```
- Untuk Linux:  
```
  172.17.0.1  
```

## API Testing

Setelah container berjalan, buka browser dan akses:
```
http://localhost:8000/docs  
```
Lakukan pengujian endpoint berikut:

- GET /health → memastikan service berjalan dengan baik  
- POST /auth/register → membuat user baru  
- POST /auth/login → autentikasi user  

Jika semua endpoint berjalan dengan baik, maka backend berhasil dijalankan menggunakan Docker.

## 🔄 CI/CD

Proyek ini menerapkan praktik Continuous Integration dan Continuous Deployment (CI/CD) untuk memastikan kualitas kode serta otomatisasi proses build dan deployment.

### Continuous Integration (CI)

Pipeline CI dijalankan secara otomatis setiap terdapat push atau pull request dan mencakup:

* ✅ Backend Testing menggunakan Pytest
* ✅ Frontend Testing menggunakan Vitest
* ✅ Automated Build menggunakan Docker
* ✅ Validasi Pull Request sebelum merge

### Continuous Deployment (CD)

Setelah seluruh proses CI berhasil dan perubahan di-merge ke branch `main`, aplikasi akan otomatis dideploy ke Railway melalui GitHub Actions.

### Tools & Technologies

* GitHub Actions
* Pytest
* Vitest
* Docker
* Railway
* PostgreSQL

---

### Deployment Flow

```text
Developer Push
       ↓
Pull Request
       ↓
Automated Testing
       ↓
Docker Build
       ↓
Merge to Main
       ↓
Automatic Deployment
       ↓
Railway Production
```

## 📊 Monitoring & Observability

SiPilih menerapkan konsep observability untuk membantu proses monitoring, debugging, dan troubleshooting pada lingkungan hybrid architecture yang terdiri dari backend utama serta beberapa service terpisah.

### Structured Logging

Setiap service menghasilkan structured logs dalam format JSON yang berisi:

* Timestamp
* Log Level
* Service Name
* Correlation ID
* Request Path
* Response Status
* Request Duration

Structured logging mempermudah proses pencarian dan analisis log pada lingkungan production.

### Correlation ID Tracing

Setiap request yang melewati Gateway, Auth Service, Candidate Service, dan Vote Service akan membawa Correlation ID yang sama.

Dengan mekanisme ini, perjalanan request dapat ditelusuri secara end-to-end untuk kebutuhan debugging dan investigasi masalah.

### Metrics Endpoint

Setiap service menyediakan endpoint metrics untuk memantau performa aplikasi.

Metrics yang dikumpulkan meliputi:

* Request Count
* Error Count
* Error Rate
* Average Latency
* P50 Latency
* P95 Latency
* P99 Latency

### Health Monitoring

Setiap service menyediakan endpoint health check yang dapat digunakan untuk memverifikasi kondisi layanan secara real-time.

### Status Dashboard

Frontend menyediakan halaman monitoring yang menampilkan:

* Status seluruh service
* Error Rate
* Request Count
* Latency Metrics
* Uptime Information

Dashboard diperbarui secara otomatis untuk membantu monitoring operasional sistem.

## 📚 API Documentation

### Base URL

Development Environment

```text
http://localhost
```

Production Environment

```text
https://backendcc-kelompok-cccclan-production.up.railway.app
```

---

# 🔐 Auth Service

Auth Service bertanggung jawab untuk registrasi pengguna, login, validasi JWT, serta monitoring service.

### Register User

**Method**

```http
POST
```

**Endpoint**

```http
/register
```

**Request Body**

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "nim": "10231000",
  "prodi": "Informatika",
  "jurusan": "Teknik Informatika",
  "fakultas": "Teknik",
  "angkatan": "2023",
  "password": "Password123!"
}
```

---

### Login User

**Method**

```http
POST
```

**Endpoint**

```http
/login
```

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response Example**

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

---

### Verify Token

**Method**

```http
GET
```

**Endpoint**

```http
/verify
```

**Headers**

```http
Authorization: Bearer <access_token>
```

---

### Health Check

**Method**

```http
GET
```

**Endpoint**

```http
/health
```

---

### Metrics

**Method**

```http
GET
```

**Endpoint**

```http
/metrics
```

---

# 🗳️ Candidate Service

Candidate Service bertanggung jawab untuk pengelolaan data kandidat pemilihan.

### Get All Candidates

**Method**

```http
GET
```

**Endpoint**

```http
/candidates
```

**Optional Query Parameter**

```http
?position=Ketua HIMA
```

---

### Get Candidate Detail

**Method**

```http
GET
```

**Endpoint**

```http
/candidates/{candidate_id}
```

---

### Candidate Statistics

**Method**

```http
GET
```

**Endpoint**

```http
/candidates/stats
```

**Response Example**

```json
{
  "total_candidates": 10,
  "approved_candidates": 8,
  "pending_candidates": 2
}
```

---

### Get Positions

**Method**

```http
GET
```

**Endpoint**

```http
/positions
```

---

## Candidate Management (Admin Only)

Endpoint berikut memerlukan role:

```text
admin / superadmin
```

### Create Candidate

```http
POST /admin/candidates
```

### Update Candidate

```http
PUT /admin/candidates/{candidate_id}
```

### Delete Candidate

```http
DELETE /admin/candidates/{candidate_id}
```

### List All Candidates

```http
GET /admin/candidates
```

---

### Health Check

```http
GET /health
```

---

### Metrics

```http
GET /metrics
```

---

# 🗳️ Vote Service

Vote Service bertanggung jawab untuk proses pemungutan dan rekapitulasi suara.

### Submit Vote

**Method**

```http
POST
```

**Endpoint**

```http
/vote
```

**Headers**

```http
Authorization: Bearer <access_token>
```

**Request Body**

```json
{
  "candidate_id": 1
}
```

**Response Example**

```json
{
  "message": "Vote berhasil disimpan"
}
```

---

### Get My Votes

**Method**

```http
GET
```

**Endpoint**

```http
/my-votes
```

---

### Get Vote Results

**Method**

```http
GET
```

**Endpoint**

```http
/vote-results
```

---

### Health Check

```http
GET /health
```

---

### Metrics

```http
GET /metrics
```

---

# 🔑 Authentication Flow

```text
User Register
      ↓
User Login
      ↓
JWT Token Generated
      ↓
Authorization: Bearer <token>
      ↓
Verify Token
      ↓
Access Protected Resources
```

## 🧪 TEST CASE – SIPILIH MICROSERVICES

Dokumentasi pengujian fitur Authentication, Candidate Management, Voting, Monitoring, dan Reliability pada sistem SiPilih menggunakan FastAPI, JWT Authentication, dan Microservices Architecture.

---

### 1. Register User

**Endpoint**

```http
POST /register
```

**Request Body**

```json
{
  "email": "qatest@gmail.com",
  "name": "Lead QA",
  "password": "Testing123!",
  "nim": "10231000",
  "prodi": "Informatika",
  "jurusan": "Teknik Informatika",
  "fakultas": "Teknik",
  "angkatan": "2023"
}
```

**Expected Result**

* Status `200 OK`
* User berhasil tersimpan pada Auth Service Database

**Status**

✅ PASS

---

### 2. Login User

**Endpoint**

```http
POST /login
```

**Request Body**

```json
{
  "email": "qatest@gmail.com",
  "password": "Testing123!"
}
```

**Expected Result**

* Status `200 OK`
* JWT Access Token berhasil dibuat

**Status**

✅ PASS

---

### 3. Verify JWT Token

**Endpoint**

```http
GET /verify
```

**Headers**

```http
Authorization: Bearer <access_token>
```

**Expected Result**

* Status `200 OK`
* User ID dan Role berhasil dikembalikan

**Status**

✅ PASS

---

### 4. Get Candidate List

**Endpoint**

```http
GET /candidates
```

**Expected Result**

* Status `200 OK`
* Daftar kandidat berhasil ditampilkan

**Status**

✅ PASS

---

### 5. Get Candidate Detail

**Endpoint**

```http
GET /candidates/{candidate_id}
```

**Expected Result**

* Status `200 OK`
* Detail kandidat berhasil ditampilkan

**Status**

✅ PASS

---

### 6. Candidate Statistics

**Endpoint**

```http
GET /candidates/stats
```

**Expected Result**

* Status `200 OK`
* Statistik kandidat berhasil ditampilkan

**Status**

✅ PASS

---

### 7. Create Candidate (Admin)

**Endpoint**

```http
POST /admin/candidates
```

**Authorization**

```text
admin / superadmin
```

**Expected Result**

* Status `200 OK`
* Kandidat baru berhasil dibuat

**Status**

✅ PASS

---

### 8. Update Candidate (Admin)

**Endpoint**

```http
PUT /admin/candidates/{candidate_id}
```

**Expected Result**

* Status `200 OK`
* Data kandidat berhasil diperbarui

**Status**

✅ PASS

---

### 9. Delete Candidate (Admin)

**Endpoint**

```http
DELETE /admin/candidates/{candidate_id}
```

**Expected Result**

* Status `200 OK`
* Kandidat berhasil dihapus

**Status**

✅ PASS

---

### 10. Submit Vote

**Endpoint**

```http
POST /vote
```

**Headers**

```http
Authorization: Bearer <access_token>
```

**Request Body**

```json
{
  "candidate_id": 1
}
```

**Expected Result**

* Status `200 OK`
* Vote berhasil disimpan

**Status**

✅ PASS

---

### 11. Prevent Duplicate Vote

**Scenario**

User mencoba melakukan voting dua kali pada posisi yang sama.

**Expected Result**

```json
{
  "detail": "Anda sudah memilih untuk posisi ..."
}
```

**Status**

✅ PASS

---

### 12. My Votes

**Endpoint**

```http
GET /my-votes
```

**Expected Result**

* Status `200 OK`
* Riwayat voting user berhasil ditampilkan

**Status**

✅ PASS

---

### 13. Vote Results

**Endpoint**

```http
GET /vote-results
```

**Expected Result**

* Status `200 OK`
* Rekapitulasi hasil voting berhasil ditampilkan

**Status**

✅ PASS

---

### 14. Health Check Services

**Endpoints**

```http
GET /health
```

(Auth Service, Candidate Service, Vote Service)

**Expected Result**

```json
{
  "status": "healthy"
}
```

**Status**

✅ PASS

---

### 15. Metrics Endpoint

**Endpoint**

```http
GET /metrics
```

**Expected Result**

* Metrics berhasil ditampilkan
* Request Count tersedia
* Error Rate tersedia
* Latency tersedia

**Status**

✅ PASS

---

### 16. Reliability Test – Service Recovery

**Scenario**

Candidate Service atau Auth Service dihentikan sementara kemudian dijalankan kembali.

**Expected Result**

* Service kembali menerima request
* Circuit Breaker kembali CLOSED
* Sistem beroperasi normal

**Status**

✅ PASS

---

## Test Summary

| Category            | Result |
| ------------------- | ------ |
| Authentication      | PASS   |
| Candidate Service   | PASS   |
| Vote Service        | PASS   |
| Health Check        | PASS   |
| Metrics Monitoring  | PASS   |
| Reliability Testing | PASS   |

### Final Result

✅ All core features of SiPilih successfully passed functional, monitoring, and reliability testing.

## 🚀 Development Journey

Proyek SiPilih dikembangkan secara bertahap melalui beberapa milestone:

| Week    | Milestone                    | Status |
| ------- | ---------------------------- | ------ |
| Week 9  | Git Workflow & Collaboration | ✅      |
| Week 10 | Continuous Integration (CI)  | ✅      |
| Week 11 | Continuous Deployment (CD)   | ✅      |
| Week 12 | Microservices Architecture   | ✅      |
| Week 13 | Reliability Engineering      | ✅      |
| Week 14 | Monitoring & Observability   | ✅      |

### Technologies Used

#### Backend

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL

#### Frontend

* React
* Vite

#### DevOps

* Docker
* Docker Compose
* GitHub Actions
* Railway

#### Reliability & Monitoring

* Circuit Breaker
* Retry Mechanism
* Structured Logging
* Correlation ID Tracing
* Metrics Collection
* Health Monitoring


## 📅 Roadmap

| Minggu | Target | Status |
|--------|--------|--------|
| 1 | Setup & Hello World | ✅ |
| 2 | REST API + Database | ✅ |
| 3 | React Frontend | ✅ |
| 4 | Full-Stack Integration | ✅ |
| 5-7 | Docker & Compose | ✅ |
| 8 | UTS Demo | ✅ |
| 9-11 | CI/CD Pipeline | ✅ |
| 12-14 | Microservices | ✅ |
| 15-16 | Final & UAS | ✅ |


## 📁 Project Structure

```text
cc-kelompok-ccc_clan/
│
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── crud.py
│   ├── models.py
│   ├── database.py
│   │
│   ├── services/
│   │   ├── auth-service/
│   │   │   ├── main.py
│   │   │   ├── auth.py
│   │   │   ├── models.py
│   │   │   └── database.py
│   │   │
│   │   ├── candidate-service/
│   │   │   ├── main.py
│   │   │   ├── auth_client.py
│   │   │   ├── circuit_breaker.py
│   │   │   └── models.py
│   │   │
│   │   ├── vote-service/
│   │   │   ├── main.py
│   │   │   ├── auth_client.py
│   │   │   ├── candidate_client.py
│   │   │   └── models.py
│   │   │
│   │   └── gateway/
│   │
│   └── tests/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   ├── deployment-guide.md
│   ├── operations-guide.md
│   ├── production-test.md
│   ├── reliability-testing.md
│   ├── api-contract.md
│   └── release-notes-m3.md
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

## AUTH MECHANISM
User Login
     ↓
Auth Service
     ↓
JWT Generated
     ↓
Frontend Stores Token
     ↓
Gateway
     ↓
Candidate Service / Vote Service
     ↓
Auth Service Verification
     ↓
Response Returned

---

## TECHNICAL ANALYSIS

auth.py (JWT System)
- JWT dibuat menggunakan `python-jose`
- Password hashing menggunakan `bcrypt`

Token Payload:
```json
{
  "sub": "user_id",
  "role": "user/admin"
}
```

Role Check:
```python
require_role(["admin", "superadmin"])
```

---
## Database Layer

Handle:
- User Management
- Candidate Management
- Vote Management
- Authentication Data
---