# Operations Guide - SiPilih

## Overview

Dokumen ini digunakan sebagai panduan operasional untuk memantau, memeriksa, dan melakukan troubleshooting pada sistem microservices SiPilih.

Arsitektur sistem terdiri dari:

* Gateway Service
* Auth Service
* Candidate Service
* Vote Service
* PostgreSQL Databases

---

# Health Check

Health check digunakan untuk memastikan service berjalan dengan normal.

## Gateway

```bash
curl http://localhost/health
```

## Auth Service

```bash
curl http://localhost/auth/health
```

## Candidate Service

```bash
curl http://localhost/candidates/health
```

## Vote Service

```bash
curl http://localhost/votes/health
```

Expected Response:

```json
{
  "status": "healthy"
}
```

---

# Viewing Logs

Untuk melihat log seluruh service:

```bash
docker compose logs -f
```

Melihat log Auth Service:

```bash
docker compose logs auth-service
```

Melihat log Candidate Service:

```bash
docker compose logs candidate-service
```

Melihat log Vote Service:

```bash
docker compose logs vote-service
```

Melihat log Gateway:

```bash
docker compose logs gateway
```

---

# Correlation ID Tracing

Sistem menggunakan Correlation ID untuk melacak satu request yang melewati beberapa service.

Header:

```http
X-Correlation-ID
```

Contoh pencarian log berdasarkan Correlation ID:

```bash
docker compose logs auth-service candidate-service vote-service | grep abc123
```

Dengan Correlation ID yang sama, perjalanan request dapat ditelusuri dari Gateway hingga service tujuan.

---

# Metrics Monitoring

Setiap service menyediakan endpoint metrics.

## Auth Service

```bash
curl http://localhost/auth/metrics
```

## Candidate Service

```bash
curl http://localhost/candidates/metrics
```

## Vote Service

```bash
curl http://localhost/votes/metrics
```

Metrics yang tersedia:

* Total Requests
* Error Count
* Error Rate
* Average Latency
* P50 Latency
* P95 Latency
* P99 Latency
* Endpoint Statistics

---

# Common Troubleshooting

## Auth Service Unavailable

Gejala:

* Login gagal
* Response 503

Pemeriksaan:

```bash
docker compose logs auth-service
docker compose ps
```

Solusi:

```bash
docker compose restart auth-service
```

---

## Candidate Service Unavailable

Gejala:

* Daftar kandidat tidak muncul

Pemeriksaan:

```bash
docker compose logs candidate-service
```

Solusi:

```bash
docker compose restart candidate-service
```

---

## Vote Service Unavailable

Gejala:

* Voting gagal dilakukan

Pemeriksaan:

```bash
docker compose logs vote-service
```

Solusi:

```bash
docker compose restart vote-service
```

---

## Database Connection Error

Gejala:

* Service gagal startup
* Error database connection

Pemeriksaan:

```bash
docker compose logs
```

Pastikan container database berjalan dengan normal.

---

## Circuit Breaker Open

Gejala:

* Service mengembalikan status 503

Pemeriksaan:

Periksa log service terkait dan tunggu masa cooldown circuit breaker selesai.

---

# Escalation Path

Jika terjadi masalah:

Level 1:

* Periksa health endpoint
* Periksa metrics endpoint
* Periksa logs

Level 2:

* Restart service yang bermasalah

```bash
docker compose restart <service-name>
```

Level 3:

* Restart seluruh stack

```bash
docker compose down
docker compose up -d
```

Level 4:

* Eskalasi ke tim backend atau DevOps untuk investigasi lebih lanjut.

---

# Monitoring Checklist

Checklist harian yang direkomendasikan:

* Semua health endpoint status healthy
* Error rate < 5%
* Service latency normal
* Tidak ada ERROR berulang pada logs
* Semua container running
* Metrics endpoint dapat diakses

Jika seluruh checklist terpenuhi, sistem SiPilih dianggap berjalan normal.
