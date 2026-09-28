# Tutor Ops Dashboard

Single-owner command center for a tutoring business. See `PLAN.md` for the
architecture contract and behavioral contracts, and `TECHNICAL_PLAN.md` for
branches, tags, testing, and shipping cadence.

## Layout

- `frontend/` — Vite + React SPA (port 5173 in dev, proxies `/api`)
- `lib/` — `api-spec/openapi.yaml` (REST contract) + generated
  React Query client (`api-client-react`) and Zod schemas (`api-zod`)
- `backend/` — FastAPI app (port 8000): `/api/*` per the contract,
  `/ai/*`, `/healthz`; serves the built SPA when `FRONTEND_DIST` is set
- `docker/` — Dockerfiles for frontend and backend
- `docker-compose.yml` — local orchestration (frontend + backend + postgres)
- `reference/` — old Replit project (Express api-server, Drizzle schema).
  Not part of the new product; kept as the shape/behavior reference.

## Data flow

- App: browser → Vite SPA → same-origin `/api/*` → FastAPI → Postgres
- Auth: Clerk (session cookie, verified by the backend via JWKS;
  every query scoped by owner id, mirroring the original app)
- AI: frontend → FastAPI backend → Groq (via the litellm package)

## Local development

1. Copy `.env.example` to `.env` and fill in the values
   (Clerk key and Postgres password at minimum).
2. Run `docker compose up --build`.
3. Open `http://localhost:5173` and sign in.

## Docs

- `PLAN.md` — vision, contracts, deployment, tools, roadmap, scope
- `TECHNICAL_PLAN.md` — branches, tags, testing, shipping cadence
- `reference/SOURCE_README.md` — notes on the reference implementation
