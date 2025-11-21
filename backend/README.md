# HRMS Backend

## Overview
This is a Node.js + Express backend for the HRMS assignment. It uses PostgreSQL (set DATABASE_URL in .env).

## Quick start
1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
2. Install dependencies: `npm install`
3. Start server: `npm run dev` (requires nodemon) or `npm start`
4. Server will attempt to initialize DB using `schema.sql` on startup.

## Important endpoints
- `POST /api/auth/signup` - create organisation admin (body: organisation_name, email, password)
- `POST /api/auth/login` - login (body: email, password) -> returns JWT
- Protected endpoints require `Authorization: Bearer <token>`
- `GET /api/employees` - list employees
- `POST /api/employees` - add employee
- `PUT /api/employees/:id` - update employee
- `DELETE /api/employees/:id` - delete employee
- `POST /api/employees/assign` - assign employee to teams { employeeId, teamIds: [] }
- `GET /api/teams` - list teams
- `POST /api/teams` - add team
- `PUT /api/teams/:id` - update team
- `DELETE /api/teams/:id` - delete team
- `GET /api/logs` - list audit logs
