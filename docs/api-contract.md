# API Contract — SIPILIH

## Base URLs

| Environment       | URL                                                          |
| ----------------- | ------------------------------------------------------------ |
| Local Development | http://localhost                                             |
| Production        | https://backendcc-kelompok-cccclan-production.up.railway.app |

---

## Authentication

Endpoint yang dilindungi memerlukan JWT Token pada header:

```http
Authorization: Bearer <access_token>
```

Token diperoleh melalui endpoint login.

---

## Error Response Format

Semua error menggunakan format berikut:

```json
{
  "detail": "Error message"
}
```

| Status Code | Meaning               |
| ----------- | --------------------- |
| 200         | Success               |
| 400         | Bad Request           |
| 401         | Unauthorized          |
| 403         | Forbidden             |
| 404         | Resource Not Found    |
| 422         | Validation Error      |
| 500         | Internal Server Error |

---

# Auth Service

Base Path:

```http
/
```

## Register User

### Endpoint

```http
POST /register
```

### Request Body

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

### Response

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}
```

---

## Login User

### Endpoint

```http
POST /login
```

### Request Body

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Response

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

## Verify Token

### Endpoint

```http
GET /verify
```

### Header

```http
Authorization: Bearer <access_token>
```

### Response

```json
{
  "user_id": 1,
  "role": "user"
}
```

---

## Health Check

```http
GET /health
```

---

## Metrics

```http
GET /metrics
```

---

# Candidate Service

## Get All Candidates

### Endpoint

```http
GET /candidates
```

### Optional Query

```http
?position=Ketua BEM
```

### Response

```json
[
  {
    "id": 1,
    "nama": "Candidate A",
    "posisi": "Ketua BEM",
    "status": "approved"
  }
]
```

---

## Get Candidate Detail

### Endpoint

```http
GET /candidates/{candidate_id}
```

---

## Candidate Statistics

### Endpoint

```http
GET /candidates/stats
```

### Response

```json
{
  "total_candidates": 10,
  "approved_candidates": 8,
  "pending_candidates": 2
}
```

---

## Get Available Positions

### Endpoint

```http
GET /positions
```

### Response

```json
{
  "positions": [
    "Ketua BEM",
    "Wakil Ketua BEM"
  ]
}
```

---

# Candidate Management (Admin Only)

Endpoint berikut memerlukan role:

```text
admin / superadmin
```

---

## Create Candidate

```http
POST /admin/candidates
```

---

## Update Candidate

```http
PUT /admin/candidates/{candidate_id}
```

---

## Delete Candidate

```http
DELETE /admin/candidates/{candidate_id}
```

---

## List All Candidates

```http
GET /admin/candidates
```

---

## Health Check

```http
GET /health
```

---

## Metrics

```http
GET /metrics
```

---

# Authentication Flow

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
