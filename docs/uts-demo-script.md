# UTS DEMO SCRIPT – SIPILIH

Dokumen ini berisi urutan demo 10 menit dan code walkthrough 5 menit untuk sistem SIPILIH.

---

# 🟢 URUTAN DEMO (10 MENIT)

| Menit | Aksi | Penanggung Jawab |
|------|------|------------------|
| 0–1 | Menjalankan `docker compose up -d` dan menampilkan `docker compose ps` untuk memastikan semua container aktif | Lead DevOps |
| 1–3 | Membuka frontend, melakukan register akun baru, lalu login ke sistem | Lead Frontend |
| 3–6 | Demo CRUD: create 2 item/kandidat, edit 1 data, lakukan search, lalu delete 1 data | Lead Frontend + Backend |
| 6–7 | Membuka Swagger UI dan menjelaskan dokumentasi endpoint API | Lead Backend |
| 7–8 | Menjalankan `docker compose down` → `up`, login ulang, dan membuktikan data tetap ada (persistensi) | Lead DevOps |
| 8–10 | Menjelaskan isi `docker-compose.yml` dan `Dockerfile` | Lead DevOps |

---

# 🟣 CODE WALKTHROUGH (5 MENIT)

| Menit | Topik | Penanggung Jawab |
|------|------|------------------|
| 0–2 | Penjelasan `docker-compose.yml` (services, network, healthcheck, database setup) | Lead DevOps |
| 2–3 | Backend Dockerfile + alur auth (JWT, login, register, middleware) | Lead Backend |
| 3–4 | Frontend Dockerfile (multi-stage build + build React app) | Lead Frontend / CI-CD |
| 4–5 | Struktur project + README + penjelasan arsitektur sistem | Lead QA & Docs |

---

# 🚀 CATATAN DEMO

- Semua service harus sudah running sebelum demo dimulai
- Pastikan database sudah terhubung ke backend
- Gunakan Swagger untuk validasi endpoint backend
- Gunakan frontend untuk menunjukkan UX & flow user
- Fokus demo: **integrasi fullstack + Docker + authentication + CRUD**

---