# HRMS FullStack Project (Scaffold)

This folder contains a complete scaffold for the HRMS FullStack assignment:

- backend/ : Node.js + Express backend (PostgreSQL-ready)
- frontend/: React frontend (minimal)
- schema.sql : Database schema (Postgres)

## Running locally (recommended)

1. Install PostgreSQL and create a database, e.g. `hrms_db`.
2. In backend folder: copy `.env.example` to `.env` and set `DATABASE_URL` (postgres://user:pass@localhost:5432/hrms_db) and `JWT_SECRET`.
3. `cd backend && npm install && npm run dev`
4. `cd frontend && npm install && npm start`
5. Use the frontend to Signup (create organisation + admin) then Login and manage Employees and Teams.

## Notes

- The backend `initDB()` will attempt to run `schema.sql` on startup to create tables automatically.
- Logging is recorded to the `logs` table for audit trail.

Good luck with your assignment — this scaffold covers the required features and gives a strong base to expand and harden for production.
