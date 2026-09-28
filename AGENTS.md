# Agents

## Source of truth

- `PLAN.md` is the product and architecture contract. Do not contradict it.
- `TECHNICAL_PLAN.md` defines branches (`feat/<feature-name>`),
  milestone tags (`v0.1.1`–`v0.1.6`), manual testing, and shipping cadence.

## Repo map

- `frontend/` — Next.js App Router. CRUD goes direct to Supabase.
  AI calls go to the backend via `NEXT_PUBLIC_API_URL`.
- `backend/` — FastAPI. AI endpoints only (`/ai/*`) plus `/healthz`.
  Verifies the Supabase JWT on protected routes.
- `docker-compose.yml` — frontend:3000, backend:8000, litellm:4000.
- `litellm-config.yaml` — model routing. Changing models is config-only.
- `artifacts/` + `lib/` — reference only. Do not build on it.

## Rules

- One feature branch per day of the 20-day plan, squash-merged to `main`.
- `main` is always deployable: `docker-compose up` must run clean.
- Tag only at milestones (see TECHNICAL_PLAN.md).
- Never commit secrets. Copy `.env.example` to `.env` locally.
