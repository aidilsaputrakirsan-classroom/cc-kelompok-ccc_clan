# Reliability Testing Report - SiPilih

## Overview

Dokumen ini menjelaskan proses pengujian reliability pada sistem microservices SiPilih. Pengujian dilakukan untuk memastikan layanan tetap stabil ketika terjadi kegagalan service, gangguan komunikasi antar service, maupun proses pemulihan setelah service aktif kembali.

---

## Services Tested

| Service           | Description                      |
| ----------------- | -------------------------------- |
| Auth Service      | Authentication dan Authorization |
| Candidate Service | Manajemen data kandidat          |
| Vote Service      | Manajemen proses voting          |
| Gateway           | API Gateway dan routing          |

---

## Scenario 1 - Normal Operation

### Objective

Memastikan seluruh service berjalan normal.

### Steps

1. Jalankan seluruh container menggunakan Docker Compose.
2. Login menggunakan akun yang valid.
3. Lihat daftar kandidat.
4. Lakukan voting.

### Expected Result

* Login berhasil.
* Data kandidat berhasil ditampilkan.
* Voting berhasil disimpan.

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
* Endpoint yang memerlukan token mengembalikan error yang sesuai.
* Gateway tetap berjalan.

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
* Auth Service tetap berjalan.
* Vote Service tetap berjalan.

### Result

PASS ✅

---

## Scenario 4 - Vote Service Failure

### Objective

Memastikan sistem menangani kegagalan Vote Service.

### Steps

```bash
docker compose stop vote-service
```

### Expected Result

* Voting tidak dapat dilakukan.
* Data kandidat masih dapat diakses.
* Login tetap berfungsi.

### Result

PASS ✅

---

## Scenario 5 - Circuit Breaker Verification

### Objective

Memastikan circuit breaker bekerja ketika dependency tidak tersedia.

### Expected Result

* Service mendeteksi kegagalan dependency.
* Circuit breaker berubah ke state OPEN.
* Request berikutnya langsung ditolak tanpa menunggu timeout.

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
docker compose start vote-service
```

### Expected Result

* Service kembali menerima request.
* Circuit breaker kembali CLOSED.
* Sistem beroperasi normal.

### Result

PASS ✅

---

## Conclusion

Berdasarkan pengujian yang dilakukan, arsitektur microservices SiPilih mampu menangani kegagalan layanan dengan baik melalui mekanisme retry, circuit breaker, serta proses recovery. Sistem tetap stabil dan mampu mencegah cascading failure ketika salah satu service mengalami gangguan.
