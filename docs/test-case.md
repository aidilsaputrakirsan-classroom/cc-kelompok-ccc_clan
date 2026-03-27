## 1. Register User

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "email": "qatest@gmail.com",
  "name": "lead qa",
  "password": "Testing123!"
}
```

**Expected Result:**

* Status: `201 Created`
* User berhasil dibuat

**Status:** ✅ berhasil

---

## 2. Login User

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "qatest@gmail.com",
  "password": "Testing123!"
}
```

**Expected Result:**

* Status: `200`
* Mendapatkan `access_token`

**Contoh Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzc0MjA0MDA5fQ.3lOVVsakaBKWzUv1ZLT_zQLv7G8mG6xIcWngKMhXA3s",
  "token_type": "bearer",
  "user": {
    "id": 2,
    "email": "qatest@gmail.com",
    "name": "lead qa",
    "is_active": true,
    "created_at": "2026-03-23T01:25:54.286166+08:00"
  }
}
```

**Status:** ✅ berhasil

---

## 3. Authorize di Swagger (BUG)

**Expected Flow:**

1. Klik tombol **Authorize 🔒**
2. Input token:

```
Bearer <access_token>
```

3. Klik Authorize

**Actual Result:**

* Tidak ada field untuk input token
* Muncul error:

```
Auth error: Unprocessable Entity
```

**Status:** ❌ Gagal

---

## 4. Get Current User

**Endpoint:** `GET /auth/me`

**Expected Result:**

* Status: `200`
* Mengembalikan data user

**Actual Result:**

* Tidak bisa karena token tidak bisa di-set

**Status:** ❌ gagal

---

## 5. CRUD Items (Protected)

Semua endpoint berikut membutuhkan token:

* `POST /items`
* `GET /items`
* `PUT /items/{id}`
* `DELETE /items/{id}`

**Expected Result:**

* Bisa akses setelah login

**Actual Result:**

* Selalu error `401 Unauthorized`

**Status:** ❌ gagal

---