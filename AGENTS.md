# Agents

## Source of truth

- `PLAN.md` is the product and architecture contract. Do not contradict it.
- `TECHNICAL_PLAN.md` defines branches (`feat/<feature-name>`),
  milestone tags (`v0.1.1`–`v0.1.6`), manual testing, and shipping cadence.

## Repo map

- `frontend/` — Vite + React SPA (the built product UI). Clerk auth,
  Wouter routing, React Query + generated client (`lib/api-client-react`)
  calling same-origin `/api/*`.
- `lib/` — `api-spec/openapi.yaml` (the REST contract both sides honor),
  `api-client-react` (generated hooks), `api-zod` (generated schemas).
- `backend/` — FastAPI. Implements `/api/*` per `openapi.yaml`, plus
  `/ai/*` and `/healthz`. Verifies the Clerk session (cookie or Bearer)
  and scopes every query by owner id. Serves the built SPA when
  `FRONTEND_DIST` is set (single-port deploys).
- `docker-compose.yml` — frontend:5173 (vite dev, proxies /api),
  backend:8000 (internal), db:postgres (data home for backend build-out).
- `.replit` + `replit.nix` — Replit-native config (single external port).
  Docker files are ignored on Replit and vice versa.
- `reference/` — old Replit project (Express api-server, Drizzle schema,
  pnpm workspace). Reference only. Do not build on it.

## Rules

- One feature branch per day of the 20-day plan, squash-merged to `main`.
- `main` is always deployable: `docker-compose up` must run clean.
- Tag only at milestones (see TECHNICAL_PLAN.md).
- Never commit secrets. Copy `.env.example` to `.env` locally.
