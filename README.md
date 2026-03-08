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

## 📁 Project Structure

```
cc-kelompok-ccc_clan/
│
├── 📁 backend/                    # Backend Applications
│   ├── 📁 v.env/
│   │   ├── 📁 Include/
│   │   ├── 📁 Lib/
│   │   ├── 📁 Scripts/
│   │   └── pyvenv.cfg
│   ├── .env.example
│   ├── .gitkeep
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   └── schemas.py
│
├── 📁 docs/
│   ├── 📁 img/                       # Documentations
│   ├── api-test-result.md
│   ├── database-schema.md
│   ├── member-Ade.md
│   ├── member-Dani.md
│   ├── member-dzakwan.md
│   └── member-risky.md
│
├── 📁 frontend/                   # Frontend Applications
│   ├── 📁 public/
│   │   └── vite.svg
│   │
│   ├── 📁 src/
│   │   ├── 📁 assets/
│   │   │   └── react.svg
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
│
├── .gitignore
├── README.md
└── setup.sh
```

## API Documentation
Base URL saat development
```
http://localhost:8000
```

### 1. Health Check
Digunakan untuk memastikan API berjalan normal.

Method
```
GET
```

Endpoint
```
/health
```

Request Body
```
Tidak ada 
```

Response Example
```
{
  "status": "healthy",
  "version": "0.2.0"
}
```

### 2. Create Item
Membuat item baru di dalam database inventory.

Method
```
POST
```

Endpoint
```
/items
```

Request Body
 ```
 {
  "name": "Laptop",
  "price": 15000000,
  "description": "Laptop gaming",
  "quantity": 2
}
```

Response Example
```
{
  "id": 1,
  "name": "Laptop",
  "price": 15000000,
  "description": "Laptop gaming",
  "quantity": 2
}
```

### 3. Get Items
Mengambil semua item dari database dengan menggunakan fitur pagination dan search.

Method
```
GET
```

Endpoint
```
/items
```

Query Parameters
| Parameter | Tipe    | Deskripsi                                 |
| --------- | ------- | ----------------------------------------- |
| skip      | integer | jumlah data yang dilewati                 |
| limit     | integer | jumlah item per halaman                   |
| search    | string  | pencarian berdasarkan nama atau deskripsi |

Example Request
```
/items?skip=0&limit=20
```

Response Example
```
{
  "total": 2,
  "items": [
    {
      "id": 1,
      "name": "Laptop",
      "price": 15000000,
      "description": "Laptop gaming",
      "quantity": 2
    },
    {
      "id": 2,
      "name": "Mouse",
      "price": 100000,
      "description": "Mouse wireless",
      "quantity": 5
    }
  ]
}
```

### 3. Item Statistics
Menampilkan statistik inventory. yang dimana statistik yang ditampilkan yaitu :
- total jumlah item
- total nilai inventory
- item termahal
- item termurah

Method
```
GET
```

Endpoint
```
/items/stats
```
Request Body
```
TIdak ada
```

Response Example
```
{
  "total_items": 2,
  "total_value": 30500000,
  "most_expensive": {
    "name": "Laptop",
    "price": 15000000
  },
  "cheapest": {
    "name": "Mouse",
    "price": 100000
  }
}
```

### 5. Get item by ID
Mengambil satu item berdasarkan ID.

Method
```
GET
```

Endpoint
```
/items/{item_id}
```

Example Request
```
/items/1
```

Response Example
```
{
  "id": 1,
  "name": "Laptop",
  "price": 15000000,
  "description": "Laptop gaming",
  "quantity": 2
}
```

Error response
```
{
  "detail": "Item dengan id=1 tidak ditemukan"
}
```

### 6. Update item
Memperbarui data berdasarkan ID. Endpoin ini menggunakan partial update, sehingga hanya field yang dikirim saja yang akan diubah.

Method
```
PUT
```

Endpoint
```
/items/{item_id}
```

Request Body Example
```
{
  "name": "Laptop Gaming Updated",
  "price": 16000000,
  "quantity": 3
}
```

Response Example
```
{
  "id": 1,
  "name": "Laptop Gaming Updated",
  "price": 16000000,
  "description": "Laptop gaming",
  "quantity": 3
}
```

Error response
```
{
  "detail": "Item dengan id=1 tidak ditemukan"
}
```

### 7. Delete Item
Menghapus item dari database.

Method
```
DELETE
```

Endpoint
```
/items/{item_id}
```

Example Request
```
DELETE /items/1
```

Response
```
204 No Content
```

Error response
```
{
  "detail": "Item dengan id=1 tidak ditemukan"
}
```

### 8. Team Information
Menampilkan informasi tim pengembang.

Method
```
GET
```

Endpoint
```
/team
```

Request Body
```
Tidak ada 
```

Response Example
```
{
  "team": "CCC_Clan",
  "members": [
    {
      "name": "Dzakwan Fatih Fadhilah",
      "nim": "10231034",
      "role": "Lead Backend"
    },
    {
      "name": "Risky Nur Fatimah Bahar",
      "nim": "10231084",
      "role": "Lead Frontend"
    },
    {
      "name": "Muhammad Dani",
      "nim": "10231062",
      "role": "Lead DevOps"
    },
    {
      "name": "Ade Ayu Kholifah Putri",
      "nim": "10231004",
      "role": "Lead QA & Docs"
    }
  ]
}
```