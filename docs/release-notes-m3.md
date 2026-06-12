# Release Notes — Milestone 3

## Version 3.0.0

### New Features

#### Hybrid Architecture Implementation

Pada Milestone 3, SIPILIH mulai mengadopsi pendekatan service decomposition sebagai langkah menuju arsitektur microservices.

Komponen yang ditambahkan:

* Auth Service
* Candidate Service
* API Gateway
* Dedicated Service Databases

Selain itu, backend utama tetap dipertahankan untuk menangani fitur yang belum sepenuhnya dipisahkan ke service tersendiri.

---

#### Reliability Engineering

Peningkatan reliability sistem meliputi:

* Retry Mechanism
* Circuit Breaker Pattern
* Service Health Checks
* Graceful Recovery Process

---

#### Monitoring & Observability

Fitur monitoring yang ditambahkan:

* Structured Logging
* Request Logging Middleware
* Metrics Collection
* Health Check Endpoints
* Service Monitoring Support

---

#### Security Improvements

Peningkatan keamanan sistem:

* JWT Authentication
* Password Hashing (bcrypt)
* Input Validation
* Environment Variable Management
* Protected Admin Endpoints

---

## Technology Stack

### Backend

* FastAPI
* SQLAlchemy
* PostgreSQL

### Frontend

* React
* Vite

### DevOps & Infrastructure

* Docker
* Docker Compose
* Nginx Gateway
* GitHub Actions
* Railway

---

## Production URL

Frontend

```text
https://frontendcc-kelompok-cccclan-production.up.railway.app
```

Backend

```text
https://backendcc-kelompok-cccclan-production.up.railway.app
```

---

## Known Issues

* Arsitektur sistem masih berada pada tahap transisi menuju pemisahan service yang lebih lengkap.
* Beberapa fitur masih dijalankan melalui backend utama untuk menjaga kompatibilitas dengan implementasi sebelumnya.

---

## Next Milestone

* Final UAS Presentation
* Repository Finalization
* Production Optimization
* Documentation Review
