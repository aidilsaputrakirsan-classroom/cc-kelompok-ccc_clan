# Reliability Testing Report - SiPilih

## Overview

Dokumen ini berisi pengujian reliability pada arsitektur microservices SiPilih. Pengujian dilakukan untuk memastikan sistem tetap stabil ketika terjadi kegagalan layanan, timeout jaringan, maupun proses recovery setelah service kembali aktif.

---

## Test Environment

| Component         | Description    |
| ----------------- | -------------- |
| Frontend          | React + Vite   |
| Gateway           | Nginx          |
| Auth Service      | FastAPI        |
| Item Service      | FastAPI        |
| Database          | PostgreSQL     |
| Container Runtime | Docker Compose |

---

# Scenario 1 - Normal Operation

## Objective

Memastikan seluruh service berjalan normal.

## Steps

1. Jalankan seluruh container menggunakan Docker Compose.
2. Login menggunakan akun yang valid.
3. Buat item baru.
4. Ambil daftar item.

## Expected Result

* Login berhasil.
* Item berhasil dibuat.
* Item berhasil ditampilkan.

## Result

PASS ✅

---

# Scenario 2 - Auth Service Down

## Objective

Memastikan Item Service menangani kegagalan Auth Service dengan benar.

## Steps

1. Jalankan seluruh container.
2. Hentikan Auth Service.

```bash
docker compose stop auth-service
```

3. Kirim request ke endpoint item yang membutuhkan autentikasi.

## Expected Result

* Request gagal dengan status 503.
* Item Service tidak crash.
* Error message informatif ditampilkan.

## Result

PASS ✅

---

# Scenario 3 - Retry Mechanism

## Objective

Memastikan retry logic berjalan saat Auth Service tidak dapat diakses.

## Steps

1. Stop Auth Service.
2. Kirim request ke Item Service.
3. Periksa log container.

## Expected Result

* Item Service melakukan retry sebanyak 3 kali.
* Delay mengikuti exponential backoff.
* Setelah retry gagal, response 503 dikembalikan.

## Result

PASS ✅

---

# Scenario 4 - Circuit Breaker

## Objective

Memastikan circuit breaker mencegah cascading failure.

## Steps

1. Stop Auth Service.
2. Kirim request berulang hingga threshold tercapai.
3. Lakukan request tambahan.

## Expected Result

* Circuit breaker berubah ke state OPEN.
* Request berikutnya langsung ditolak.
* Tidak menunggu timeout.

## Result

PASS ✅

---

# Scenario 5 - Service Recovery

## Objective

Memastikan sistem dapat pulih setelah service aktif kembali.

## Steps

1. Jalankan kembali Auth Service.

```bash
docker compose start auth-service
```

2. Tunggu cooldown selesai.
3. Lakukan login dan akses item.

## Expected Result

* Circuit breaker kembali CLOSED.
* Request berhasil diproses.
* Sistem kembali normal.

## Result

PASS ✅

---

## Summary

| Scenario          | Result |
| ----------------- | ------ |
| Normal Operation  | PASS   |
| Auth Service Down | PASS   |
| Retry Mechanism   | PASS   |
| Circuit Breaker   | PASS   |
| Service Recovery  | PASS   |

---

## Conclusion

Berdasarkan pengujian reliability yang dilakukan, arsitektur microservices SiPilih mampu menangani kegagalan layanan dengan baik melalui implementasi retry mechanism, circuit breaker, dan recovery process. Sistem tetap stabil serta mampu mencegah terjadinya cascading failure ketika salah satu service mengalami gangguan.
