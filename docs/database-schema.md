# Database Schema
## SIPILIH (E-Voting System)

Dokumen ini menjelaskan struktur database untuk sistem **Pemilihan Umum Kampus berbasis web** yang memungkinkan mahasiswa melakukan voting secara online dengan sistem yang aman dan transparan.

---

# 1. Table: users

Menyimpan data akun pengguna sistem.

| Column | Type | Constraint | Description |
|------|------|------|------|
| id | BIGINT | PRIMARY KEY | ID pengguna |
| name | VARCHAR(150) | NOT NULL | Nama lengkap |
| nim | VARCHAR(20) | UNIQUE | Nomor induk mahasiswa |
| email | VARCHAR(150) | UNIQUE | Email pengguna |
| password_hash | VARCHAR(255) | NOT NULL | Password terenkripsi |
| role | ENUM(admin, committee, voter) | NOT NULL | Peran pengguna |
| faculty_id | BIGINT | FOREIGN KEY | Fakultas pengguna |
| study_program_id | BIGINT | FOREIGN KEY | Program studi |
| is_active | BOOLEAN | DEFAULT TRUE | Status akun |
| created_at | TIMESTAMP | | Waktu pembuatan akun |
| updated_at | TIMESTAMP | | Waktu update |

---

# 2. Table: faculties

Menyimpan data fakultas.

| Column | Type | Constraint | Description |
|------|------|------|------|
| id | BIGINT | PRIMARY KEY | ID fakultas |
| name | VARCHAR(150) | NOT NULL | Nama fakultas |
| created_at | TIMESTAMP | | Waktu dibuat |

---

# 3. Table: study_programs

Menyimpan data program studi.

| Column | Type | Constraint | Description |
|------|------|------|------|
| id | BIGINT | PRIMARY KEY | ID program studi |
| faculty_id | BIGINT | FOREIGN KEY | Relasi ke fakultas |
| name | VARCHAR(150) | NOT NULL | Nama program studi |
| created_at | TIMESTAMP | | Waktu dibuat |

---

# 4. Table: elections

Menyimpan data pemilu yang diadakan.

| Column | Type | Constraint | Description |
|------|------|------|------|
| id | BIGINT | PRIMARY KEY | ID pemilu |
| title | VARCHAR(200) | NOT NULL | Judul pemilu |
| description | TEXT | | Deskripsi pemilu |
| election_type | ENUM(bem, himpunan, senat) | | Jenis pemilu |
| start_time | TIMESTAMP | NOT NULL | Waktu mulai pemilu |
| end_time | TIMESTAMP | NOT NULL | Waktu selesai pemilu |
| status | ENUM(upcoming, active, finished) | | Status pemilu |
| created_by | BIGINT | FOREIGN KEY | Admin pembuat |
| created_at | TIMESTAMP | | Waktu dibuat |

---

# 5. Table: candidates

Menyimpan kandidat pemilu.

| Column | Type | Constraint | Description |
|------|------|------|------|
| id | BIGINT | PRIMARY KEY | ID kandidat |
| election_id | BIGINT | FOREIGN KEY | Relasi pemilu |
| candidate_number | INTEGER | | Nomor urut kandidat |
| name | VARCHAR(150) | NOT NULL | Nama kandidat |
| vice_name | VARCHAR(150) | | Nama wakil kandidat |
| faculty_id | BIGINT | FOREIGN KEY | Fakultas kandidat |
| study_program_id | BIGINT | FOREIGN KEY | Program studi |
| photo_url | VARCHAR(255) | | Foto kandidat |
| created_at | TIMESTAMP | | Waktu dibuat |

---

# 6. Table: candidate_profiles

Menyimpan detail visi dan misi kandidat.

| Column | Type | Constraint | Description |
|------|------|------|------|
| id | BIGINT | PRIMARY KEY | ID profil |
| candidate_id | BIGINT | FOREIGN KEY | Relasi kandidat |
| vision | TEXT | NOT NULL | Visi kandidat |
| mission | TEXT | NOT NULL | Misi kandidat |
| work_program | TEXT | | Program kerja |

---

# 7. Table: voters

Menyimpan data pemilih yang berhak memilih.

| Column | Type | Constraint | Description |
|------|------|------|------|
| id | BIGINT | PRIMARY KEY | ID pemilih |
| user_id | BIGINT | FOREIGN KEY | Relasi user |
| election_id | BIGINT | FOREIGN KEY | Pemilu yang diikuti |
| is_verified | BOOLEAN | DEFAULT FALSE | Status verifikasi |
| has_voted | BOOLEAN | DEFAULT FALSE | Status sudah memilih |
| verification_time | TIMESTAMP | | Waktu verifikasi |

---

# 8. Table: votes

Menyimpan suara pemilih.

| Column | Type | Constraint | Description |
|------|------|------|------|
| id | BIGINT | PRIMARY KEY | ID vote |
| election_id | BIGINT | FOREIGN KEY | Relasi pemilu |
| voter_id | BIGINT | FOREIGN KEY | Relasi pemilih |
| candidate_id | BIGINT | FOREIGN KEY | Kandidat yang dipilih |
| vote_token | VARCHAR(255) | UNIQUE | Token unik voting |
| voted_at | TIMESTAMP | | Waktu voting |

---

# 9. Table: vote_results

Menyimpan hasil perhitungan suara.

| Column | Type | Constraint | Description |
|------|------|------|------|
| id | BIGINT | PRIMARY KEY | ID hasil |
| election_id | BIGINT | FOREIGN KEY | Relasi pemilu |
| candidate_id | BIGINT | FOREIGN KEY | Kandidat |
| total_votes | INTEGER | | Jumlah suara |

---

# 10. Table: audit_logs

Mencatat aktivitas penting dalam sistem.

| Column | Type | Constraint | Description |
|------|------|------|------|
| id | BIGINT | PRIMARY KEY | ID log |
| user_id | BIGINT | FOREIGN KEY | Pengguna |
| action | VARCHAR(255) | | Jenis aksi |
| description | TEXT | | Detail aktivitas |
| ip_address | VARCHAR(45) | | IP address pengguna |
| created_at | TIMESTAMP | | Waktu kejadian |

---

# 11. Table: sessions

Menyimpan session login pengguna.

| Column | Type | Constraint | Description |
|------|------|------|------|
| id | VARCHAR(255) | PRIMARY KEY | Session ID |
| user_id | BIGINT | FOREIGN KEY | Pengguna |
| ip_address | VARCHAR(45) | | IP address |
| user_agent | TEXT | | Browser pengguna |
| created_at | TIMESTAMP | | Waktu login |
| expired_at | TIMESTAMP | | Waktu kadaluarsa |

---

# Database Relationship Overview

faculties
 └── study_programs

users
 └── voters
      └── votes

elections
 ├── candidates
 │     └── candidate_profiles
 ├── voters
 ├── votes
 └── vote_results

---
