# ☁️ Cloud App - SIPILIH (Sistem Informasi Pemilihan Digital)

Deskripsi : SIPILIH (Sistem Informasi Pemilihan Digital) merupakan platform berbasis web yang dirancang untuk mendukung proses pemilihan elektronik (_e-voting_) di lingkungan kampus, seperti pemilihan Ketua BEM, Himpunan Mahasiswa, maupun organisasi kemahasiswaan lainnya. Sistem ini dirancang untuk menyediakan proses pemungutan suara yang aman, transparan, dan terstruktur melalui autentikasi akun mahasiswa. Selain itu, SIPILIH juga dilengkapi dengan fitur manajemen kandidat, pengaturan periode pemilihan, serta dashboard hasil perolehan suara yang ditampilkan secara real-time dalam bentuk grafik persentase. Dengan demikian, proses demokrasi di lingkungan kampus dapat berlangsung dengan lebih efisien, terdokumentasi secara digital, dan terintegrasi dalam satu sistem yang terpusat.

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