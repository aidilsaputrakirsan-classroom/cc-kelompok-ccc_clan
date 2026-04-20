# ☁️ Cloud App - SIPILIH (Sistem Informasi Pemilihan Digital)

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

```
[React Frontend] <--HTTP--> [FastAPI Backend] <--SQL--> [PostgreSQL Database]
      |                            |
  Vite + JSX               REST API Endpoints
  (Port 5173)               (Port 8000)
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

### Access
- API : http://localhost:8000
- API Docs : http://localhost:8000/docs
- Frontend : http://localhost:5173

## 📅 Roadmap

| Minggu | Target | Status |
|--------|--------|--------|
| 1 | Setup & Hello World | ✅ |
| 2 | REST API + Database | ✅ |
| 3 | React Frontend | ✅ |
| 4 | Full-Stack Integration | ✅ |
| 5-7 | Docker & Compose | ✅ |
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

http://localhost:8000


### AUTHENTICATION

Sistem menggunakan JWT Authentication (Bearer Token).

Token didapatkan dari login dan wajib digunakan untuk endpoint yang dilindungi.


#### 1. Register User

Method
```
POST
```

Endpoint
```
/auth/register
```

Request Body
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

Response Example
```
{
  "id": 1,
  "email": "user@example.com",
  "role": "user"
}
```

#### 2. Login User

Method
```
POST
```
Endpoint
```
/auth/login
```
Request Body
```
{
  "email": "user@example.com",
  "password": "123456"
}
```
Response Example
```
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user"
  }
}
```
#### 3. Get Current User (Protected)

Method
```
GET
```
Endpoint
```
/auth/me
```
Headers
```
Authorization: Bearer <access_token>
```
Response Example
```
{
  "id": 1,
  "email": "user@example.com",
  "role": "user"
}
```

#### 4. Create Item

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

#### 5. Get Items (Pagination + Search)

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
/items?skip=0&limit=20&search=laptop
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
    }
  ]
}
```
#### 6. Get Item by ID

Method
```
GET
```
Endpoint
```
/items/{id}
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
Error Response
```
{
  "detail": "Item tidak ditemukan"
}
```
#### 7. Update Item

Method
```
PUT
```
Endpoint
```
/items/{id}
```
Request Body
```
{
  "name": "Laptop Updated",
  "price": 16000000,
  "quantity": 3
}
```
Response Example
```
{
  "id": 1,
  "name": "Laptop Updated",
  "price": 16000000,
  "description": "Laptop gaming",
  "quantity": 3
}
```
#### 8. Delete Item

Method
```
DELETE
```
Endpoint
```
/items/{id}
```
Response
```
{
  "message": "Deleted"
}
```
#### 9. Get Candidates (Public)

Method
```
GET
```
Endpoint
```
/candidates
```
Response Example
```
[
  {
    "id": 1,
    "name": "Candidate A",
    "description": "Example candidate"
  }
]
```
#### 10. Create Candidate (ADMIN ONLY)

Method
```
POST
```
Endpoint
```
/admin/candidates
```
Authorization Role
```
admin / superadmin
```
Request Body
```
{
  "name": "Candidate A",
  "description": "Example"
}
```
#### 11. Update Candidate (ADMIN ONLY)

Method
```
PUT
```
Endpoint
```
/admin/candidates/{id}
```
#### 12. Delete Candidate (ADMIN ONLY)

Method
```
DELETE
```
Endpoint
```
/admin/candidates/{id}
```
#### 13. List Candidates (ADMIN ONLY)

Method
```
GET
```
Endpoint
```
/admin/candidates
```
#### 14. Health Check

Method
```
GET
```
Endpoint
```
/health
```
Response Example
```
{
  "status": "ok"
}
```
#### 15. Team Information

Method
'''
GET
'''
Endpoint
'''
/team
'''
Response Example
'''
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
  ]}
```


## Test Case Auth dan CRUD
### 1. Register User

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "email": "qatest@gmail.com",
  "name": "lead qa",
  "password": "Testing123!"
}
```

**Expected Result:**

* Status: `201 Created`
* User berhasil dibuat

**Status:** ✅ berhasil

### 2. Login User

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "qatest@gmail.com",
  "password": "Testing123!"
}
```

**Expected Result:**

* Status: `200`
* Mendapatkan `access_token`

**Contoh Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzc0MjA0MDA5fQ.3lOVVsakaBKWzUv1ZLT_zQLv7G8mG6xIcWngKMhXA3s",
  "token_type": "bearer",
  "user": {
    "id": 2,
    "email": "qatest@gmail.com",
    "name": "lead qa",
    "is_active": true,
    "created_at": "2026-03-23T01:25:54.286166+08:00"
  }
}
```

**Status:** ✅ berhasil

### 3. Authorize di Swagger (BUG)

**Expected Flow:**

1. Klik tombol **Authorize 🔒**
2. Input token:

```
Bearer <access_token>
```

3. Klik Authorize

**Actual Result:**

* Tidak ada field untuk input token
* Muncul error:

```
Auth error: Unprocessable Entity
```

**Status:** ❌ Gagal

### 4. Get Current User

**Endpoint:** `GET /auth/me`

**Expected Result:**

* Status: `200`
* Mengembalikan data user

**Actual Result:**

* Tidak bisa karena token tidak bisa di-set

**Status:** ❌ gagal

### 5. CRUD Items (Protected)

Semua endpoint berikut membutuhkan token:

* `POST /items`
* `GET /items`
* `PUT /items/{id}`
* `DELETE /items/{id}`

**Expected Result:**

* Bisa akses setelah login

**Actual Result:**

* Selalu error `401 Unauthorized`

**Status:** ❌ gagal

---

## 🔐 Authentication

### 🔑 Cara Kerja

1. User register
2. User login → mendapatkan JWT token
3. Token dikirim ke header:

```
Authorization: Bearer <token>
```

4. Backend memverifikasi token

## ⚠️ BUG AUTH

### ❌ Masalah:

Swagger tidak menyediakan input token saat klik **Authorize**

### 💥 Penyebab:

Di file `auth.py`:

```python
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
```

Masalah:

* Swagger default menganggap login menggunakan **form-data (username & password)**
* Namun pada API memakai **JSON body**
* Akibatnya Swagger gagal generate form token → muncul error `422 Unprocessable Entity`

---

## 📦 API Endpoint List

### 🔓 Public Endpoints

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| GET    | `/health`        | Cek server      |
| POST   | `/auth/register` | Registrasi user |
| POST   | `/auth/login`    | Login user      |


### 🔒 Protected Endpoints

| Method | Endpoint      | Description |
| ------ | ------------- | ----------- |
| GET    | `/auth/me`    | Data user   |
| POST   | `/items`      | Create item |
| GET    | `/items`      | List items  |
| GET    | `/items/{id}` | Get item    |
| PUT    | `/items/{id}` | Update item |
| DELETE | `/items/{id}` | Delete item |

## 🐞 Bug Report

### 1. Swagger Authorize Error

* Error: `422 Unprocessable Entity`
* Penyebab: OAuth2PasswordBearer tidak cocok dengan JSON login
* Impact: Tidak bisa testing protected endpoint di Swagger

### 2. Protected Endpoint Tidak Bisa Diakses

* Error: `401 Unauthorized`
* Penyebab: Token tidak pernah dikirim
* Root cause: Swagger auth gagal

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
docker build -t cloudapp-backend:v1 .  
```
Verifikasi bahwa image berhasil dibuat:
```
docker images  
```
Pastikan terdapat image dengan nama 
```
`cloudapp-backend:v1`.
```

## Run Container

Jalankan container menggunakan perintah berikut:
```
docker run -p 8000:8000 --env-file .env cloudapp-backend:v1  
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