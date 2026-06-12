# Release Notes - Milestone 2 (v2.0)

## Release Overview

Milestone 2 menandai selesainya fase Continuous Integration dan Continuous Deployment (CI/CD) pada proyek Cloud App. Pada versi ini aplikasi telah berhasil diintegrasikan dengan automated testing, GitHub Actions, Docker, serta deployment ke Railway Cloud Platform.

---

## Features Completed

### Authentication Module

* User Registration
* User Login
* JWT Authentication

### Item Management Module

* Create Item
* Read Item
* Update Item
* Delete Item
* Search Item

### CI/CD Implementation

* GitHub Flow dengan Pull Request dan Code Review
* Automated Backend Testing menggunakan Pytest
* Automated Frontend Testing menggunakan Vitest
* Docker Image Build Automation
* Continuous Integration menggunakan GitHub Actions
* Continuous Deployment ke Railway

### Cloud Deployment

* Backend berhasil dideploy ke Railway
* Frontend berhasil dideploy ke Railway
* PostgreSQL Database berjalan di Railway
* HTTPS aktif pada seluruh service

---

## Technology Stack

### Backend

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL

### Frontend

* React
* Vite
* JavaScript

### DevOps & Cloud

* Docker
* GitHub Actions
* Railway
* GitHub

---

## Production URLs

| Service           | URL                            |
| ----------------- | ------------------------------ |
| Frontend          |   https://frontendcc-kelompok-cccclan-production.up.railway.app/   |
| Backend API       | https://backendcc-kelompok-cccclan-production.up.railway.app      |
| API Documentation | https://backendcc-kelompok-cccclan-production.up.railway.app/docs |

---

## Known Issues

* Belum tersedia monitoring dan logging terpusat.
* Belum tersedia fitur notifikasi otomatis ketika deployment gagal.
* Optimasi performa frontend masih dapat ditingkatkan pada milestone berikutnya.

---

## Next Milestone

Pada milestone berikutnya aplikasi akan memasuki fase Microservices dengan memisahkan layanan menjadi beberapa service independen, seperti Auth Service dan Item Service, guna meningkatkan skalabilitas dan maintainability sistem.

---

## Version Information

Version: v2.0

Status: Stable Release

Release Phase: CI/CD & Cloud Deployment Completed
