## 📚 API Documentation

### Base URL

Development Environment

```text
http://localhost
```

Production Environment

```text
https://backendcc-kelompok-cccclan-production.up.railway.app
```

---

# 🔐 Auth Service

Auth Service bertanggung jawab untuk registrasi pengguna, login, validasi JWT, serta monitoring service.

### Register User

**Method**

```http
POST
```

**Endpoint**

```http
/register
```

**Request Body**

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "nim": "10231000",
  "prodi": "Informatika",
  "jurusan": "Teknik Informatika",
  "fakultas": "Teknik",
  "angkatan": "2023",
  "password": "Password123!"
}
```

---

### Login User

**Method**

```http
POST
```

**Endpoint**

```http
/login
```

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response Example**

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

---

### Verify Token

**Method**

```http
GET
```

**Endpoint**

```http
/verify
```

**Headers**

```http
Authorization: Bearer <access_token>
```

---

### Health Check

**Method**

```http
GET
```

**Endpoint**

```http
/health
```

---

### Metrics

**Method**

```http
GET
```

**Endpoint**

```http
/metrics
```

---

# 🗳️ Candidate Service

Candidate Service bertanggung jawab untuk pengelolaan data kandidat pemilihan.

### Get All Candidates

**Method**

```http
GET
```

**Endpoint**

```http
/candidates
```

**Optional Query Parameter**

```http
?position=Ketua HIMA
```

---

### Get Candidate Detail

**Method**

```http
GET
```

**Endpoint**

```http
/candidates/{candidate_id}
```

---

### Candidate Statistics

**Method**

```http
GET
```

**Endpoint**

```http
/candidates/stats
```

**Response Example**

```json
{
  "total_candidates": 10,
  "approved_candidates": 8,
  "pending_candidates": 2
}
```

---

### Get Positions

**Method**

```http
GET
```

**Endpoint**

```http
/positions
```

---

## Candidate Management (Admin Only)

Endpoint berikut memerlukan role:

```text
admin / superadmin
```

### Create Candidate

```http
POST /admin/candidates
```

### Update Candidate

```http
PUT /admin/candidates/{candidate_id}
```

### Delete Candidate

```http
DELETE /admin/candidates/{candidate_id}
```

### List All Candidates

```http
GET /admin/candidates
```

---

### Health Check

```http
GET /health
```

---

### Metrics

```http
GET /metrics
```

---

# 🗳️ Vote Service

Vote Service bertanggung jawab untuk proses pemungutan dan rekapitulasi suara.

### Submit Vote

**Method**

```http
POST
```

**Endpoint**

```http
/vote
```

**Headers**

```http
Authorization: Bearer <access_token>
```

**Request Body**

```json
{
  "candidate_id": 1
}
```

**Response Example**

```json
{
  "message": "Vote berhasil disimpan"
}
```

---

### Get My Votes

**Method**

```http
GET
```

**Endpoint**

```http
/my-votes
```

---

### Get Vote Results

**Method**

```http
GET
```

**Endpoint**

```http
/vote-results
```

---

### Health Check

```http
GET /health
```

---

### Metrics

```http
GET /metrics
```

---

# 🔑 Authentication Flow

```text
User Register
      ↓
User Login
      ↓
JWT Token Generated
      ↓
Authorization: Bearer <token>
      ↓
Verify Token
      ↓
Access Protected Resources
```
