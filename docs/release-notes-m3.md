# Release Notes — Milestone 3 (Final)

## Version: 3.0.0

**Release Date:** 15 Juni 2026
**Tag:** v3.0.0

---

## 🆕 Fitur Baru

### Hybrid Architecture

Pada Milestone 3, SIPILIH mulai mengadopsi pendekatan service decomposition sebagai transisi dari arsitektur monolith menuju microservices.

Perubahan yang diterapkan:

* Auth Service untuk autentikasi dan JWT
* Candidate Service untuk manajemen kandidat
* API Gateway (Nginx) sebagai entry point
* Database terpisah untuk Auth Service dan Candidate Service
* Inter-service communication melalui REST API

Backend utama (Monolith) tetap dipertahankan untuk fitur yang belum sepenuhnya dipisahkan.

---

### Reliability Engineering

Peningkatan reliability sistem:

* Retry Mechanism dengan exponential backoff
* Circuit Breaker Pattern
* Graceful Recovery
* Service Health Checks

---

### Monitoring & Observability

Fitur monitoring yang ditambahkan:

* Structured Logging
* Request Logging Middleware
* Metrics Endpoint
* Health Check Endpoint
* Service Monitoring Support

---

### Security Improvements

Peningkatan keamanan sistem:

* JWT Authentication
* Password Hashing (bcrypt)
* Input Validation
* Environment Variable Management
* Protected Admin Endpoints

---

## 📊 Statistik Proyek

| Metric              | Value               |
| ------------------- | ------------------- |
| Architecture Style  | Hybrid Architecture |
| Total Services      | 5                   |
| Databases           | 3                   |
| API Gateway         | Nginx               |
| CI/CD Platform      | GitHub Actions      |
| Deployment Platform | Railway             |

---

## 🐛 Known Issues

* Sistem masih berada pada tahap transisi menuju pemisahan service yang lebih lengkap.
* Beberapa fitur masih dijalankan melalui Main Backend (Monolith).

---

## 🌐 Production URL

Frontend

https://frontendcc-kelompok-cccclan-production.up.railway.app

Backend

https://backendcc-kelompok-cccclan-production.up.railway.app

---

## 👥 Team Contributions

| Role                    | Area                           |
| ----------------------- | ------------------------------ |
| Lead Backend            | Backend Development & Services |
| Lead Frontend           | Frontend Development & UI      |
| Lead DevOps             | Docker, CI/CD, Deployment      |
| Lead QA & Documentation | Testing & Documentation        |

---

## 🚀 Next Phase

* Final UAS Presentation
* Documentation Refinement
* Production Optimization
* Future Service Decomposition
