# Git Workflow Guide — ccc_clan

## Deskripsi

Dokumen ini menjelaskan standar Git workflow yang digunakan oleh tim **ccc_clan** dalam mengembangkan aplikasi. Tujuannya adalah agar proses pengembangan berjalan rapi, terstruktur, dan mudah dikelola oleh seluruh anggota tim.

---

## Daftar Isi

1. [Branch Naming](#1-branch-naming)
2. [Commit Convention](#2-commit-convention)
3. [Pull Request Process](#3-pull-request-process)
4. [Code Review Guidelines](#4-code-review-guidelines)
5. [Jenis Review Comment](#5-jenis-review-comment)
6. [CODEOWNERS](#6-codeowners)
7. [Aturan Tambahan](#7-aturan-tambahan)

---

## 1. Branch Naming

Setiap anggota **wajib** membuat branch baru dari `main` sebelum mengerjakan tugas apapun. Branch digunakan agar perubahan tidak langsung masuk ke branch utama.

### Format Penamaan

```
tipe/deskripsi-singkat
```

- Semua huruf **kecil**
- Gunakan **tanda hubung (-)** sebagai pemisah kata
- Deskripsi singkat, jelas, dan relevan

### Tabel Jenis Branch

| Jenis Branch | Kapan Digunakan | Contoh |
|---|---|---|
| `feature/` | Menambahkan fitur baru | `feature/login-page` |
| `fix/` | Memperbaiki bug atau error | `fix/api-token-error` |
| `docs/` | Menambah atau mengubah dokumentasi | `docs/update-readme` |
| `refactor/` | Merapikan kode tanpa mengubah fungsi | `refactor/cleanup-auth-logic` |
| `chore/` | Konfigurasi, maintenance, atau dependency | `chore/update-dependencies` |
| `test/` | Menambah atau memperbarui pengujian | `test/add-unit-tests-auth` |

### Contoh Benar

```
feature/user-profile-page
fix/login-token-expired
docs/git-workflow-guide
refactor/split-crud-service
chore/update-requirements
```

### Contoh Salah

```
Feature/UserProfile      ← huruf besar, tanpa tanda hubung
fixit                    ← tidak ada prefix tipe
update                   ← tidak deskriptif
my-branch                ← tanpa tipe
```

---

## 2. Commit Convention

Commit message menggunakan format **Conventional Commits** agar riwayat perubahan lebih mudah dibaca, di-*tracking*, dan dipahami oleh seluruh tim.

### Format

```
type: deskripsi singkat
```

- Gunakan **huruf kecil semua**
- Deskripsi **ringkas dan jelas** (maks. 72 karakter)
- Gunakan **bahasa Inggris** untuk konsistensi

### Tabel Jenis Commit

| Tipe | Kapan Digunakan | Contoh |
|---|---|---|
| `feat` | Menambahkan fitur baru | `feat: add user profile page` |
| `fix` | Memperbaiki bug atau error | `fix: resolve JWT token expiry issue` |
| `docs` | Menambah atau memperbarui dokumentasi | `docs: update API endpoint list in README` |
| `refactor` | Merapikan struktur kode tanpa mengubah fungsi | `refactor: extract auth logic to separate module` |
| `chore` | Konfigurasi, maintenance, atau dependency | `chore: update python dependencies` |
| `test` | Menambah atau memperbarui testing | `test: add unit tests for CRUD operations` |
| `style` | Perbaikan format penulisan kode (spasi, indentasi) | `style: fix indentation in docker-compose.yml` |

### Tujuan Commit Convention

- Mempermudah membaca *history* perubahan
- Mempermudah *tracking* siapa mengerjakan apa
- Menjaga konsistensi dan profesionalisme tim

### Contoh Benar

```
feat: add qr menu scanning feature
fix: handle null response in queue endpoint
docs: add installation guide to README
chore: upgrade node version to 20
```

### Contoh Salah

```
Update file                ← tidak deskriptif, tidak ada tipe
fix bug                    ← tidak jelas bug mana
FEAT: Add Login            ← huruf besar
perubahan kecil            ← tidak informatif
```

---

## 3. Pull Request Process

Pull Request (PR) adalah **satu-satunya cara** untuk menggabungkan perubahan ke branch `main`. Tidak ada yang boleh push langsung ke `main`.

### Alur Kerja (Wajib Diikuti)

#### Langkah 1 — Update branch `main`

Sebelum mulai bekerja, pastikan kamu memiliki versi terbaru:

```bash
git checkout main
git pull origin main
```

#### Langkah 2 — Buat branch baru

```bash
git checkout -b tipe/deskripsi-singkat
```

Contoh:

```bash
git checkout -b feature/qr-menu-scanner
```

#### Langkah 3 — Kerjakan perubahan

Tambahkan atau ubah file sesuai tugas yang ditentukan. Pastikan kode atau dokumentasi sesuai standar tim.

#### Langkah 4 — Commit perubahan

```bash
git add .
git commit -m "feat: add qr menu scanner feature"
```

> Boleh melakukan beberapa commit dalam satu branch. Pastikan setiap commit message jelas dan relevan.

#### Langkah 5 — Push branch ke GitHub

```bash
git push origin tipe/deskripsi-singkat
```

Contoh:

```bash
git push origin feature/qr-menu-scanner
```

#### Langkah 6 — Buka Pull Request di GitHub

1. Buka repository di GitHub
2. Klik **Compare & pull request**
3. Lengkapi informasi PR:

| Field | Isi |
|---|---|
| **Title** | Ikuti format commit — contoh: `feat: add qr menu scanner feature` |
| **Description** | Jelaskan perubahan yang dibuat, alasannya, dan cara mengetes |
| **Assignees** | Nama kamu sebagai pembuat PR |
| **Reviewers** | Minimal **1 anggota lain** sesuai pasangan review |
| **Labels** | Tambahkan label yang sesuai (opsional) |

4. Klik **Create pull request**

#### Langkah 7 — Proses Review

- Reviewer mengecek perubahan dan memberikan komentar
- Jika ada feedback → **perbaiki di branch yang sama**, lalu push ulang
- Setelah PR disetujui oleh reviewer → lakukan **Squash and Merge**

#### Langkah 8 — Setelah Merge

Update kembali branch `main` lokal kamu:

```bash
git checkout main
git pull origin main
```

---

## 4. Code Review Guidelines

Review dilakukan untuk memastikan perubahan yang masuk ke `main` sudah **sesuai, aman, dan mudah dipahami**. Reviewer bertanggung jawab penuh atas kode yang di-approve.

### Aspek yang Wajib Dicek

#### Kesesuaian Tugas

- Apakah perubahan sudah sesuai dengan tugas yang dikerjakan?
- Apakah file yang diubah memang relevan dengan tugas tersebut?

#### Fungsionalitas

- Apakah fitur berjalan dengan benar?
- Apakah output sudah sesuai dengan yang diharapkan?
- Apakah ada edge case yang tidak ditangani?

#### Readability

- Apakah kode mudah dibaca dan dipahami?
- Apakah penamaan variabel, fungsi, dan file sudah jelas?
- Apakah ada komentar yang perlu ditambahkan untuk bagian yang kompleks?

#### Best Practices

- Apakah kode mengikuti standar dan konvensi tim?
- Apakah struktur kode sudah rapi dan terorganisir?
- Apakah ada duplikasi kode yang bisa di-*refactor*?

#### Error Handling

- Apakah sudah menangani error dengan baik?
- Apakah ada kemungkinan runtime error atau bug tersembunyi?
- Apakah response error sudah informatif?

#### Security

- Tidak ada **hardcoded password, API key, atau token** di dalam kode
- Menggunakan **environment variable** untuk data sensitif
- Tidak ada file `.env` atau file rahasia yang ter-commit

#### Dampak ke Bagian Lain

- Apakah perubahan ini merusak fitur atau konfigurasi lain yang sudah ada?
- Apakah ada dependensi yang perlu diperbarui?

---

## 5. Jenis Review Comment

Reviewer **wajib** memberikan komentar yang konstruktif dan jelas. Gunakan tiga jenis komentar berikut:

| Jenis | Prefix | Kapan Digunakan |
|---|---|---|
| **Praise** | `[praise]` | Mengapresiasi bagian yang sudah baik atau kreatif |
| **Suggestion** | `[suggestion]` | Memberikan saran perbaikan (tidak harus diikuti) |
| **Question** | `[question]` | Meminta klarifikasi atau penjelasan |
| **Issue** | `[issue]` | Menandai masalah yang **wajib** diperbaiki sebelum merge |

### Contoh Komentar

```
[praise] Struktur kodenya rapi dan mudah dipahami, bagus!

[suggestion] Mungkin bisa diextract ke fungsi terpisah agar lebih reusable.

[question] Kenapa menggunakan pendekatan ini? Ada alasan tertentu?

[issue] Variabel `apiKey` tidak boleh di-hardcode di sini, pindahkan ke .env.
```

> **Dilarang memberikan komentar hanya "LGTM"** tanpa penjelasan apapun.  
> Minimal berikan **1 komentar bermakna** sebelum approve.

---

## 6. CODEOWNERS

File `.github/CODEOWNERS` digunakan untuk **menentukan reviewer otomatis** berdasarkan area file yang diubah. Selain itu, tim menggunakan aturan **pasangan review** agar setiap PR dicek oleh anggota yang tepat.

### Pasangan Review Tim

| PR Dibuat Oleh | Reviewer Wajib |
|---|---|
| Lead Backend | Lead Frontend |
| Lead Frontend | Lead Backend |
| Lead DevOps | Lead QA & Docs |
| Lead QA & Docs | Lead DevOps |

### Area File dan Reviewer

| Area File | Reviewer Bertanggung Jawab |
|---|---|
| `backend/` | Lead Backend |
| `frontend/` | Lead Frontend |
| `docker-compose.yml` | Lead DevOps |
| `backend/Dockerfile` | Lead DevOps |
| `frontend/Dockerfile` | Lead DevOps |
| `Makefile` | Lead DevOps |
| `README.md` | Lead QA & Docs |
| `docs/` | Lead QA & Docs |
| `.github/` | Lead DevOps |

### Cara Kerja CODEOWNERS

PR tidak hanya diperiksa berdasarkan siapa pembuatnya, tetapi juga berdasarkan **area file yang diubah**. Misalnya:

- PR dari **Lead QA & Docs** → direview oleh **Lead DevOps** (pasangan review)
- Tapi jika PR tersebut mengubah folder `docs/` → **Lead QA & Docs** tetap di-tag sebagai reviewer berdasarkan CODEOWNERS
- Jika satu PR mengubah file di beberapa area → **semua reviewer terkait** akan di-tag otomatis

---

## 7. Aturan Tambahan

Aturan-aturan berikut bersifat **mutlak** dan wajib dipatuhi oleh seluruh anggota tim:

| No. | Aturan |
|---|---|
| 1 | **Dilarang push langsung ke branch `main`** — semua perubahan harus melalui Pull Request |
| 2 | **Minimal 1 approval** dari reviewer sebelum boleh merge |
| 3 | Gunakan **Squash and Merge** untuk menjaga history `main` tetap bersih dan rapi |
| 4 | Selalu **pull `main` terbaru** sebelum membuat branch baru |
| 5 | **Jangan commit file sensitif** seperti `.env`, password, API key, atau token |
| 6 | Gunakan **commit message yang jelas** sesuai Conventional Commits |
| 7 | Reviewer **wajib merespons PR dalam 1x24 jam** setelah di-assign |

---

## Referensi Cepat

### Skenario: Mulai mengerjakan fitur baru

```bash
git checkout main
git pull origin main
git checkout -b feature/nama-fitur
# ... kerjakan perubahan ...
git add .
git commit -m "feat: add nama fitur"
git push origin feature/nama-fitur
# → Buat Pull Request di GitHub
```

### Skenario: Ada konflik saat push

```bash
git checkout main
git pull origin main
git checkout feature/nama-fitur
git merge main
# → Selesaikan konflik
git add .
git commit -m "chore: resolve merge conflict"
git push origin feature/nama-fitur
```
