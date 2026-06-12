# API Contract

## Authentication

Authorization Header:

Bearer <token>

---

## Auth Service

POST /register
POST /login
GET /verify

---

## Candidate Service

GET /candidates
GET /candidates/{id}
GET /candidates/stats
GET /positions

POST /admin/candidates
PUT /admin/candidates/{id}
DELETE /admin/candidates/{id}

---

## Vote Service

POST /vote
GET /my-votes
GET /vote-results

---

## Common Error Format

{
  "detail": "Error message"
}