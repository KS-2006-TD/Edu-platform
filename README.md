# Edu Platform (Tile-based UI)

This repository contains a full-stack education platform scaffold:
- **Frontend**: React (Vite) with a modern tile-based UI (client/)
- **Backend**: Node.js + Express + MongoDB (server/)

## Features implemented
- User registration & login (Student/Teacher) — JWT auth.
- Teacher: create courses.
- Students: view courses.
- Enrollment model (backend).
- Assignment creation, submission, grading.
- File uploads (course materials, submissions) stored in `/server/uploads`.
- Discussion forum and notifications (simple DB-backed).
- Tile-based responsive UI.

## Quickstart (local)
1. Install and run MongoDB (or use MongoDB Atlas).
2. In `server/`:
   - Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
   - `npm install`
   - `npm run dev` (or `npm start`)
3. In `client/`:
   - `npm install`
   - `npm run dev`
4. Open `http://localhost:3000`.

## Deploy
- Backend: Render/Railway/Heroku - set environment variables and enable file persistence or use external storage for uploads.
- Frontend: Vercel/Netlify - build and deploy the `client` folder.
- Push code to your GitHub repository and connect to your hosting provider.

## Notes
- This is a scaffold and is ready for further hardening (input validation, production setup, CORS policies, cloud file storage, SSL).
- Replace `JWT_SECRET` and configure CORS/hosts for production.

