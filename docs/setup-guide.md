# Panduan Setup Lengkap

## Prasyarat Sistem

Sebelum memulai, pastikan sistem Anda memiliki:

- **Python 3.10 atau lebih baru** - Untuk menjalankan backend
- **Node.js 18 atau lebih baru** - Untuk menjalankan frontend
- **Git** - Untuk cloning repository
- **PostgreSQL** (opsional) - Untuk production database. Untuk development, kita akan menggunakan SQLite

### Cara Mengecek Versi

Buka terminal/command prompt dan jalankan:

```bash
# Cek Python
python --version
# atau
python3 --version

# Cek Node.js
node --version

# Cek npm (biasanya ikut terinstall dengan Node.js)
npm --version

# Cek Git
git --version
```

Jika salah satu tidak terinstall, download dari:
- Python: https://python.org
- Node.js: https://nodejs.org
- Git: https://git-scm.com

## Langkah 1: Clone Repository

1. Buka terminal/command prompt
2. Pilih folder tempat Anda ingin menyimpan proyek
3. Clone repository:

```bash
git clone <URL_REPOSITORY>
cd <NAMA_FOLDER_PROYEK>
```

Contoh:
```bash
git clone https://github.com/username/cloud-app-inventory.git
cd cloud-app-inventory
```

## Langkah 2: Setup Backend

### 2.1 Install Dependencies Python

1. Masuk ke folder backend:
```bash
cd backend
```

2. Buat virtual environment (direkomendasikan):
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python -m venv .venv
source .venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

### 2.2 Konfigurasi Environment Variables

1. Buat file `.env` di folder `backend/`:
```bash
# Windows
type nul > .env

# macOS/Linux
touch .env
```

2. Buka file `.env` dengan text editor dan isi dengan konfigurasi berikut:

```env
# Database Configuration
# Untuk development, gunakan SQLite
DATABASE_URL=sqlite:///./inventory.db

# Atau jika menggunakan PostgreSQL:
# DATABASE_URL=postgresql://username:password@localhost:5432/inventory_db

# JWT Authentication
SECRET_KEY=your-super-secret-key-here-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

**Catatan:**
- Ganti `your-super-secret-key-here-change-this-in-production` dengan key yang aman
- Untuk production, gunakan key yang random dan panjang
- Jika menggunakan PostgreSQL, pastikan database sudah dibuat dan kredensial benar

### 2.3 Setup Database

Database akan otomatis dibuat saat pertama kali menjalankan aplikasi. Tabel akan dibuat berdasarkan model SQLAlchemy.

Jika menggunakan PostgreSQL:
1. Install PostgreSQL di sistem Anda
2. Buat database baru:
```sql
CREATE DATABASE inventory_db;
```
3. Update `DATABASE_URL` di `.env` dengan kredensial yang benar

## Langkah 3: Setup Frontend

### 3.1 Install Dependencies Node.js

1. Masuk ke folder frontend:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

### 3.2 Konfigurasi 

Frontend menggunakan Vite dan biasanya tidak memerlukan konfigurasi tambahan untuk development. Jika ada konfigurasi khusus, periksa file `vite.config.js`.

## Langkah 4: Menjalankan Aplikasi

### 4.1 Jalankan Backend

1. Masuk ke folder backend:
```bash
cd ../backend
```

2. Aktivasi virtual environment (jika belum aktif):
```bash
# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate
```

3. Jalankan server:
```bash
uvicorn main:app --reload --port 8000
```

Backend akan berjalan di `http://localhost:8000`

### 4.2 Jalankan Frontend

1. Buka terminal baru, masuk ke folder frontend:
```bash
cd frontend
```

2. Jalankan development server:
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173` (port default Vite)

## Langkah 5: Verifikasi Setup

### 5.1 Test Backend

1. Buka browser dan akses: `http://localhost:8000/health`
2. Anda harus melihat response JSON: `{"status": "healthy", "version": "0.2.0"}`

2. Akses dokumentasi API: `http://localhost:8000/docs`
   - Ini akan membuka Swagger UI untuk testing API endpoints

### 5.2 Test Frontend

1. Buka browser dan akses: `http://localhost:5173`
2. Anda harus melihat halaman web React yang berjalan

## Troubleshooting

### Masalah Umum

1. **Port sudah digunakan**
   - Ganti port backend: `uvicorn main:app --reload --port 8001`
   - Ganti port frontend: edit `vite.config.js` atau gunakan `--port` flag

2. **Database connection error**
   - Pastikan DATABASE_URL di `.env` benar
   - Untuk SQLite, pastikan folder backend memiliki permission write
   - Untuk PostgreSQL, pastikan service PostgreSQL running

3. **Module not found**
   - Pastikan virtual environment aktif
   - Jalankan `pip install -r requirements.txt` lagi

4. **CORS error**
   - Backend sudah dikonfigurasi untuk allow CORS dari semua origin
   - Jika masih error, periksa console browser

### Logs dan Debugging

- Backend logs akan muncul di terminal tempat `uvicorn` dijalankan
- Frontend logs di terminal tempat `npm run dev` dijalankan
- Gunakan browser developer tools (F12) untuk debug frontend

## Struktur Proyek

```
cloud-app-inventory/
├── backend/
│   ├── main.py          # Entry point FastAPI
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   ├── crud.py          # Database operations
│   ├── database.py      # Database configuration
│   ├── auth.py          # Authentication logic
│   ├── requirements.txt # Python dependencies
│   └── .env             # Environment variables (buat sendiri)
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── components/  # React components
│   ├── package.json
│   └── vite.config.js
├── docs/
│   └── setup-guide.md   # File ini
└── README.md
```

## Next Steps

Setelah setup berhasil:
1. Pelajari API endpoints di `http://localhost:8000/docs`
2. Explore kode frontend untuk memahami struktur
3. Mulai development fitur baru atau modifikasi existing

## Support

Jika mengalami masalah:
1. Periksa logs di terminal
2. Pastikan semua prasyarat terpenuhi
3. Cek dokumentasi FastAPI dan React
4. Hubungi tim development jika diperlukan