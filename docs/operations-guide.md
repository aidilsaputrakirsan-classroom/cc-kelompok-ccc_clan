# Operations Guide - SiPilih

## Overview

Dokumen ini digunakan sebagai panduan operasional untuk memantau, memeriksa, dan melakukan troubleshooting pada sistem SiPilih.

Saat ini SiPilih menggunakan pendekatan hybrid architecture, yaitu kombinasi backend utama (monolith) dengan beberapa service yang telah dipisahkan, seperti Auth Service dan Candidate Service.

Komponen utama sistem:

* Frontend
* API Gateway
* Main Backend
* Auth Service
* Candidate Service
* PostgreSQL Databases

---

# Health Check

Health check digunakan untuk memastikan setiap service berjalan dengan normal.

## Main Backend

```bash
curl http://localhost:8000/health
```

## Auth Service

```bash
curl http://localhost:8001/health
```

## Candidate Service

```bash
curl http://localhost:8002/health
```

Expected Response:

```json
{
  "status": "healthy"
}
```

---

# Viewing Logs

Melihat seluruh log:

```bash
docker compose logs -f
```

Melihat log Main Backend:

```bash
docker compose logs backend
```

Melihat log Auth Service:

```bash
docker compose logs auth-service
```

Melihat log Candidate Service:

```bash
docker compose logs candidate-service
```

Melihat log Gateway:

```bash
docker compose logs gateway
```

---

# Metrics Monitoring

Service menyediakan endpoint metrics untuk membantu monitoring performa aplikasi.

## Auth Service

```bash
curl http://localhost:8001/metrics
```

## Candidate Service

```bash
curl http://localhost:8002/metrics
```

Metrics yang tersedia:

* Total Requests
* Error Count
* Error Rate
* Average Latency
* Endpoint Statistics

---

# Common Troubleshooting

## Backend Service Unavailable

Gejala:

* API tidak dapat diakses
* Error 500 atau 502

Pemeriksaan:

```bash
docker compose logs backend
docker compose ps
```

Solusi:

```bash
docker compose restart backend
```

---

## Auth Service Unavailable

Gejala:

* Login gagal
* Verifikasi token gagal

Pemeriksaan:

```bash
docker compose logs auth-service
```

Solusi:

```bash
docker compose restart auth-service
```

---

## Candidate Service Unavailable

Gejala:

* Data kandidat tidak dapat ditampilkan
* Statistik kandidat tidak dapat diakses

Pemeriksaan:

```bash
docker compose logs candidate-service
```

Solusi:

```bash
docker compose restart candidate-service
```

---

## Database Connection Error

Gejala:

* Service gagal startup
* Error koneksi database

Pemeriksaan:

```bash
docker compose logs db
docker compose logs auth-db
docker compose logs candidate-db
```

Pastikan seluruh container database berjalan normal.

---

## Gateway Error

Gejala:

* Request gagal diteruskan ke service
* Error 502 Bad Gateway

Pemeriksaan:

```bash
docker compose logs gateway
```

Pastikan service tujuan dalam kondisi healthy.

---

## Circuit Breaker Open

Gejala:

* Candidate Service mengembalikan status error ketika Auth Service tidak tersedia

Pemeriksaan:

```bash
docker compose logs candidate-service
```

Tunggu masa cooldown circuit breaker selesai atau pastikan Auth Service kembali aktif.

---

# Escalation Path

Jika terjadi masalah:

### Level 1

* Periksa health endpoint
* Periksa metrics endpoint
* Periksa logs

### Level 2

Restart service yang bermasalah

```bash
docker compose restart <service-name>
```

### Level 3

Restart seluruh stack

```bash
docker compose down
docker compose up -d
```

### Level 4

Eskalasi ke tim Backend atau DevOps untuk investigasi lebih lanjut.

---

# Monitoring Checklist

Checklist yang direkomendasikan:

* Semua service berstatus healthy
* Semua container running
* Error rate dalam batas normal
* Tidak terdapat error berulang pada logs
* Metrics endpoint dapat diakses
* Database dapat menerima koneksi

Jika seluruh checklist terpenuhi, sistem SiPilih dianggap berjalan normal.
