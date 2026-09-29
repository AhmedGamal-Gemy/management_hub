# Agents

## Source of truth

- `PLAN.md` is the product and architecture contract. Do not contradict it.
- `TECHNICAL_PLAN.md` defines branches (`feat/<feature-name>`),
  milestone tags (`v0.1.1`–`v0.1.6`), manual testing, and shipping cadence.

## Repo map

- `frontend/` — Vite + React SPA (the built product UI). Clerk auth,
  Wouter routing, React Query + generated client (`lib/api-client-react`)
  calling same-origin `/api/*` (Vite dev proxies to Express).
- `lib/` — `api-spec/openapi.yaml` (the REST contract),
  `api-client-react` (generated hooks), `api-zod` (generated schemas),
  `db` (Drizzle schema + `schema.sql` port + `db:push` script).
- `backend-express/` — original Express API. Serves `/api/*` exactly as
  on Replit. Clerk session → owner id; every query owner-scoped.
- `backend/` — FastAPI. PARKED until the feature-by-feature migration
  starts. Do not wire it into compose until then.
- `docker-compose.yml` — frontend:5173, express:5000 (internal),
  db:postgres. This is the running stack.
- `.replit` + `replit.nix` — Replit-native config (single external port).
  Docker files are ignored on Replit and vice versa.
- `reference/` — leftover docs and configs from the old Replit project.
  Reference only. Do not build on it.

## Rules

- One feature branch per day of the 20-day plan, squash-merged to `main`.
- `main` is always deployable: `docker-compose up` must run clean.
- Tag only at milestones (see TECHNICAL_PLAN.md).
- Never commit secrets. Copy `.env.example` to `.env` locally.
