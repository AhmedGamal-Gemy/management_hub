# Agents

## Source of truth

- `PLAN.md` is the product and architecture contract. Do not contradict it.
- `TECHNICAL_PLAN.md` defines branches (`feat/<feature-name>`),
  milestone tags (`v0.1.1`–`v0.1.6`), manual testing, and shipping cadence.

## Repo map

- `frontend/` — Vite + React SPA (the built product UI). Clerk auth,
  Wouter routing, React Query + generated client (`lib/api-client-react`)
  calling same-origin `/api/*` (Vite dev proxies to FastAPI).
- `lib/` — `api-spec/openapi.yaml` (the REST contract),
  `api-client-react` (generated hooks), `api-zod` (generated schemas),
  `db` (legacy Drizzle schema + `schema.sql` port, unused by new work).
- `backend-python/` — **THE BACKEND (Python/FastAPI)**. Serves all
  `/api/*`. Clerk session → `verify_clerk_user`; `resolve_tenant` →
  `tenant_id`; every query tenant-scoped. This is where all API work goes.
- `backend/` — legacy Express. Landing-page scaffolding only. DO NOT
  extend it, DO NOT add endpoints for new features.
- `docker-compose.yml` — frontend:5173, fastapi:5000 (internal),
  db:postgres. This is the running stack.
- `docs/sprint-week1/` — current sprint design docs (Mermaid).
- `.replit` + `replit.nix` — Replit-native config (single external port).
  Docker files are ignored on Replit and vice versa.

## Rules

- **THE BACKEND IS PYTHON.** All API code goes in `backend-python/`
  (FastAPI). Never write Express endpoints in `backend/`.
- Tenancy is mandatory: every new table has `tenant_id` FK, and every
  route takes `Depends(resolve_tenant)`.
- `lib/api-spec/openapi.yaml` is the contract. Change the spec, then
  regenerate the client. Never hand-edit `lib/api-client-react` or
  `lib/api-zod`.
- One feature branch per day of the plan, squash-merged to `main`.
- `main` is always deployable: `docker-compose up` must run clean.
- Tag only at milestones (see TECHNICAL_PLAN.md).
- Never commit secrets. Copy `.env.example` to `.env` locally.
