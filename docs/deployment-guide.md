# Deployment Guide

## Railway Setup

Aplikasi Cloud App dideploy menggunakan Railway sebagai platform cloud untuk menjalankan backend, frontend, dan database PostgreSQL.

### Langkah Deployment

1. Login ke Railway menggunakan akun GitHub.
2. Buat project baru pada Railway Dashboard.
3. Tambahkan service PostgreSQL sebagai database utama aplikasi.
4. Deploy backend dengan memilih repository GitHub dan mengarahkan root directory ke folder backend.
5. Deploy frontend dengan memilih repository GitHub dan mengarahkan root directory ke folder frontend.
6. Generate domain untuk backend dan frontend.
7. Konfigurasikan environment variables yang diperlukan.
8. Verifikasi deployment dengan mengakses endpoint health check dan aplikasi frontend.

---

## Environment Variables

### Backend

| Variable     | Deskripsi                                         |
| ------------ | ------------------------------------------------- |
| DATABASE_URL | URL koneksi PostgreSQL Railway                    |
| SECRET_KEY   | Kunci rahasia untuk autentikasi JWT               |
| CORS_ORIGINS | Domain frontend yang diizinkan mengakses API      |
| ENVIRONMENT  | Menentukan mode aplikasi (production/development) |

### Frontend

| Variable     | Deskripsi                           |
| ------------ | ----------------------------------- |
| VITE_API_URL | URL backend yang digunakan frontend |

---

## Troubleshooting

### CORS Error

Pastikan nilai `CORS_ORIGINS` sudah sesuai dengan URL frontend yang digunakan pada environment production.

### 502 Bad Gateway

Periksa deployment logs pada Railway dan pastikan service backend berhasil berjalan tanpa error.

### Database Connection Error

Pastikan `DATABASE_URL` sudah terhubung dengan service PostgreSQL Railway yang aktif.

### Frontend Tidak Dapat Mengakses API

Pastikan `VITE_API_URL` mengarah ke URL backend production yang benar.

### Deployment Gagal

Periksa log deployment pada Railway dan GitHub Actions untuk mengetahui penyebab kegagalan proses build atau deploy.
