# Tutor Ops Dashboard

Single-owner command center for a tutoring business. See `PLAN.md` for the
architecture contract and behavioral contracts, and `TECHNICAL_PLAN.md` for
branches, tags, testing, and shipping cadence.

## Layout

- `frontend/` — Vite + React SPA (port 5173 in dev, proxies `/api`)
- `backend/` — original Express API (port 5000): `/api/*` exactly as on Replit
- `backend-python/` — FastAPI, parked until migration day
- `lib/` — `api-spec/openapi.yaml` (REST contract) + generated
  React Query client (`api-client-react`), Zod schemas (`api-zod`),
  Drizzle schema + `schema.sql` (`db`)

## Data flow

- App: browser → Vite SPA → same-origin `/api/*` → Express → Postgres
- Auth: Clerk (session cookie, `getAuth().userId` → owner id on every query)
- AI: not wired yet (FastAPI + litellm parked in `backend-python/`)

## Local development

1. Copy `.env.example` to `.env` and fill in the values
   (Clerk key and Postgres password at minimum).
2. Run `docker compose up --build`.
3. Open `http://localhost:5173` and sign in.

## Docs

- `PLAN.md` — vision, contracts, deployment, tools, roadmap, scope
- `TECHNICAL_PLAN.md` — branches, tags, testing, shipping cadence
