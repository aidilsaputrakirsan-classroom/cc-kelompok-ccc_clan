# Retrospective — Milestone 1

## Tujuan Milestone 1
Milestone 1 berfokus pada pembangunan aplikasi full-stack berbasis cloud yang dapat dijalankan menggunakan Docker Compose, serta memastikan seluruh komponen (backend, frontend, database) terintegrasi dengan baik.

## Apa yang Berjalan Baik?
- Setup Docker Compose berhasil dan aplikasi dapat dijalankan secara end-to-end
- Struktur project backend dan frontend sudah terpisah dengan jelas
- Setiap anggota tim sudah memiliki akses ke repository dan dapat melakukan push
- Beberapa fitur utama (CRUD dasar) sudah berhasil diimplementasikan
- Penggunaan Git sebagai version control sudah mulai diterapkan

## Apa yang Perlu Diperbaiki?
- Koordinasi tim masih kurang efektif (beberapa task tidak berjalan paralel)
- Belum menggunakan Git workflow yang proper (masih push langsung ke main)
- Kurangnya komunikasi terkait progress masing-masing anggota
- Dokumentasi masih belum lengkap dan kurang rapi
- Testing belum dilakukan secara terstruktur

## Action Items untuk Milestone 2

- Menerapkan GitHub Flow (feature branch + pull request + code review)
- Menetapkan aturan commit message menggunakan Conventional Commits
- Menggunakan PR template untuk standarisasi
- Meningkatkan komunikasi tim (update progress secara berkala)
- Menambahkan dokumentasi teknis yang lebih lengkap
- Mulai menerapkan CI/CD pipeline

## QA & Testing Plan (Milestone 2)

### Backend
- [ ] Endpoint `/health` mengembalikan status service
- [ ] Endpoint CRUD berjalan dengan benar
- [ ] Error handling berfungsi dengan baik

### Frontend
- [ ] Halaman About dapat diakses
- [ ] Navigasi antar halaman berjalan normal
- [ ] Tampilan responsif

### DevOps
- [ ] Docker Compose profile dev & prod berjalan
- [ ] Environment variable terbaca dengan benar

## Kontribusi Tim 
| Anggota | Kontribusi Utama | Jumlah Commit | 
|---------|-----------------|---------------| 
| Dzakwan Fatih Fadhillah | Pengembangan API | 17 |
| Rizky Nur Fatimah Bahar | UI & halaman utama | 22 |
| Muhammad Dani | Setup Docker | 18 |
| Ade Ayu Kholifah Putri | Dokumentasi & QA | 22 |