# ☁️ Cloud App - SIPILIH (Sistem Informasi Pemilihan Digital)

Deskripsi : SIPILIH (Sistem Informasi Pemilihan Digital) merupakan platform berbasis web yang dirancang untuk mendukung proses pemilihan elektronik (_e-voting_) di lingkungan kampus, seperti pemilihan Ketua BEM, Himpunan Mahasiswa, maupung organisasi kampus lainnya. Sistem ini menyediakan mekanisme pemungutan suara yang aman, transparan, dan terstruktur melalui autentikasi akun mahasiswa, serta dilengkapi dengan fitur pengelolaan kandidat, pengaturan periode pemilihan, dan dashboard hasil perhitungan suara secara real-time dalam bentuk grafik presentase, sehingga proses demokrasi kampus menjadi lebih efisien, terdokumentasi secara digital, dan terintegrasi.

## 👥 Tim

| Nama | NIM | Peran |
|------|-----|-------|
| ...  | ... | Lead Backend |
| ...  | ... | Lead Frontend |
| ...  | ... | Lead DevOps |
| ...  | ... | Lead QA & Docs |

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

```
[React Frontend] <--HTTP--> [FastAPI Backend] <--SQL--> [PostgreSQL Database]
```

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

## 📅 Roadmap

| Minggu | Target | Status |
|--------|--------|--------|
| 1 | Setup & Hello World | ✅ |
| 2 | REST API + Database | ⬜ |
| 3 | React Frontend | ⬜ |
| 4 | Full-Stack Integration | ⬜ |
| 5-7 | Docker & Compose | ⬜ |
| 8 | UTS Demo | ⬜ |
| 9-11 | CI/CD Pipeline | ⬜ |
| 12-14 | Microservices | ⬜ |
| 15-16 | Final & UAS | ⬜ |