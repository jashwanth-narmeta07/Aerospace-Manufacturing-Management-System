# AeroTrack — MERN

Full MERN port of the AeroTrack aerospace manufacturing app.

```
aerotrack-mern/
├── backend/    # Node + Express + MongoDB (Mongoose), JWT auth, separate controllers
└── frontend/   # React + Vite + Tailwind CSS, React Router
```

## Run

### 1. Backend (port 5000)
```bash
cd backend
cp .env.example .env       # set MONGO_URI + JWT_SECRET
npm install
npm run dev
```
Default seeded admin: `admin@aerotrack.com` / `admin123`

### 2. Frontend (port 5173)
```bash
cd frontend
npm install
npm run dev
```

## Roles
- **admin** — creates managers/employees, manages inventory & personnel
- **manager** — inspects submitted work (pass/fail), views reports
- **employee** — logs production runs, submits for inspection
