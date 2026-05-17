# Testing Guide

Panduan ini digunakan untuk menjalankan testing lokal, membaca CI pipeline, melakukan debugging error, dan menambahkan test baru pada project.

---

# Backend Testing

## Install Dependencies

Masuk ke folder backend:

```bash
cd backend
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Jika terjadi error pada `pip`, gunakan:

```bash
python -m pip install -r requirements.txt
```

---

## Menjalankan Backend Test

Jalankan semua test:

```bash
python -m pytest
```

Output yang diharapkan:

```plaintext
12 passed
```

---

## Menjalankan Test Coverage

Untuk melihat persentase coverage testing:

```bash
python -m pytest --cov=. --cov-report=term-missing
```

Coverage digunakan untuk mengetahui bagian kode mana yang sudah atau belum diuji.

---

# Frontend Testing

## Install Dependencies

Masuk ke folder frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

## Menjalankan Frontend Test

Jalankan semua frontend tests:

```bash
npm test
```

Output yang diharapkan:

```plaintext
7 passed
```

---

## Build Frontend

Pastikan frontend dapat dibuild tanpa error:

```bash
npm run build
```

---

# CI Pipeline

CI (Continuous Integration) berjalan otomatis menggunakan GitHub Actions.

Pipeline akan berjalan saat:
- Push ke branch `main`
- Membuat Pull Request ke `main`

CI melakukan:
1. Backend testing
2. Frontend testing
3. Docker build validation

Workflow file berada di:

```plaintext
.github/workflows/ci.yml
```

---

# Cara Membaca CI Log

Jika CI gagal:

1. Buka repository GitHub
2. Pilih tab **Actions**
3. Klik workflow yang gagal
4. Klik job yang berwarna merah
5. Buka step yang gagal
6. Baca pesan error pada log

Contoh job:
- Test Backend
- Test Frontend
- Build Docker

---

# Cara Debug Test Failure

## 1. ModuleNotFoundError

Contoh:

```plaintext
ModuleNotFoundError: No module named 'pytest'
```

Penyebab:
- Dependency belum diinstall

Solusi:

```bash
pip install -r requirements.txt
```

---

## 2. AssertionError

Contoh:

```plaintext
AssertionError
```

Penyebab:
- Hasil test tidak sesuai expected output

Solusi:
- Periksa endpoint
- Periksa response API
- Periksa assertion pada test

---

## 3. npm ERR

Penyebab:
- Dependency frontend belum lengkap
- package-lock.json belum update

Solusi:

```bash
npm install
```

---

## 4. Docker Build Failed

Penyebab:
- Path file salah
- Dockerfile error
- Dependency belum tersedia

Solusi:
- Periksa Dockerfile
- Periksa file yang di-copy
- Jalankan docker build secara lokal

---

# Cara Menambah Test Baru

## Backend

Simpan file test di:

```plaintext
backend/tests/
```

Gunakan format nama file:

```plaintext
test_*.py
```

Contoh:

```plaintext
test_auth.py
test_items.py
```

Format function test:

```python
def test_example():
    assert True
```

---

## Frontend

Simpan file test di:

```plaintext
frontend/src/components/__tests__/
```

Contoh:

```plaintext
Header.test.jsx
ItemCard.test.jsx
```

Gunakan Vitest dan Testing Library untuk membuat test component React.

---

# Checklist Sebelum Push

Pastikan:

- Backend tests passed
- Frontend tests passed
- Frontend build success
- Docker build success
- Tidak ada error linting
- CI pipeline GitHub Actions berhasil

---

# QA Responsibility

QA bertanggung jawab untuk:
- Menjalankan seluruh testing
- Memastikan CI pipeline berjalan normal
- Membaca dan debugging CI logs
- Memvalidasi hasil testing sebelum merge
- Memastikan kualitas project tetap stabil