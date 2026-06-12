# Reliability Testing Report - SiPilih

## Overview

Dokumen ini menjelaskan proses pengujian reliability pada sistem SiPilih. Pengujian dilakukan untuk memastikan aplikasi tetap stabil ketika terjadi kegagalan service, gangguan komunikasi antar service, maupun proses pemulihan setelah service kembali aktif.

Pengujian difokuskan pada komponen yang telah dipisahkan menjadi service tersendiri serta backend utama yang masih digunakan dalam arsitektur hybrid.

---

## Services Tested

| Service              | Description                    |
| -------------------- | ------------------------------ |
| Main Backend         | Core Application Features      |
| Auth Service         | Authentication & Authorization |
| Candidate Service    | Candidate Management           |
| Gateway              | Request Routing                |
| PostgreSQL Databases | Data Storage                   |

---

## Scenario 1 - Normal Operation

### Objective

Memastikan seluruh service berjalan normal.

### Steps

1. Jalankan seluruh container menggunakan Docker Compose.
2. Login menggunakan akun yang valid.
3. Akses data kandidat.
4. Akses fitur utama aplikasi.

### Expected Result

* Login berhasil.
* Data kandidat berhasil ditampilkan.
* Seluruh service berada dalam status healthy.

### Result

PASS ✅

---

## Scenario 2 - Auth Service Failure

### Objective

Memastikan sistem menangani kegagalan Auth Service.

### Steps

```bash
docker compose stop auth-service
```

Kemudian lakukan login dan akses endpoint yang membutuhkan autentikasi.

### Expected Result

* Login gagal.
* Endpoint yang memerlukan autentikasi mengembalikan error yang sesuai.
* Gateway tetap berjalan.
* Candidate Service mendeteksi kegagalan dependency.

### Result

PASS ✅

---

## Scenario 3 - Candidate Service Failure

### Objective

Memastikan sistem menangani kegagalan Candidate Service.

### Steps

```bash
docker compose stop candidate-service
```

### Expected Result

* Data kandidat tidak dapat diakses.
* Auth Service tetap berjalan normal.
* Main Backend tetap dapat diakses.

### Result

PASS ✅

---

## Scenario 4 - Main Backend Failure

### Objective

Memastikan sistem tetap mampu menjalankan service yang telah dipisahkan ketika backend utama mengalami gangguan.

### Steps

```bash
docker compose stop backend
```

### Expected Result

* Endpoint backend utama tidak dapat diakses.
* Auth Service tetap berjalan.
* Candidate Service tetap berjalan.
* Gateway tetap aktif.

### Result

PASS ✅

---

## Scenario 5 - Circuit Breaker Verification

### Objective

Memastikan circuit breaker bekerja ketika dependency tidak tersedia.

### Steps

1. Hentikan Auth Service.
2. Lakukan request dari Candidate Service yang membutuhkan verifikasi token.

### Expected Result

* Candidate Service mendeteksi kegagalan dependency.
* Circuit breaker berubah ke state OPEN.
* Request berikutnya ditolak lebih cepat tanpa menunggu timeout.

### Result

PASS ✅

---

## Scenario 6 - Service Recovery

### Objective

Memastikan sistem kembali normal setelah service yang gagal dijalankan kembali.

### Steps

```bash
docker compose start auth-service
docker compose start candidate-service
docker compose start backend
```

### Expected Result

* Service kembali menerima request.
* Circuit breaker kembali ke state CLOSED.
* Seluruh service kembali berstatus healthy.

### Result

PASS ✅

---

## Scenario 7 - Database Availability Test

### Objective

Memastikan service mampu mendeteksi gangguan database.

### Steps

```bash
docker compose stop auth-db
```

### Expected Result

* Auth Service mendeteksi kegagalan koneksi database.
* Health check menunjukkan status yang sesuai.
* Service lain tetap berjalan normal.

### Result

PASS ✅

---

## Conclusion

Berdasarkan pengujian yang dilakukan, sistem SiPilih menunjukkan kemampuan untuk menangani berbagai kondisi kegagalan layanan melalui mekanisme health check, retry mechanism, circuit breaker, monitoring, dan proses recovery.

Pendekatan hybrid architecture yang digunakan memungkinkan service yang telah dipisahkan tetap berjalan secara independen ketika terjadi gangguan pada komponen lain, sehingga membantu meningkatkan reliability dan mengurangi dampak kegagalan terhadap keseluruhan sistem.