# Tutor Ops Dashboard

Single-owner command center for a tutoring business. See `PLAN.md` for the
architecture contract and behavioral contracts, and `TECHNICAL_PLAN.md` for
branches, tags, testing, and shipping cadence.

## Layout

- `frontend/` — Next.js 14 App Router app (port 3000)
- `backend/` — FastAPI app, AI endpoints only (port 8000)
- `docker/` — Dockerfiles for frontend and backend
- `docker-compose.yml` — local orchestration (frontend + backend + LiteLLM proxy)
- `litellm-config.yaml` — AI model routing (Groq free tier)
- `reference/` — old Replit project (artifacts + lib + pnpm workspace).
  Not part of the new product; kept for data-shape and UI-pattern reference.

## Data flow

- CRUD: frontend talks directly to Supabase (RLS enforces per-user access)
- AI: frontend → FastAPI backend → LiteLLM proxy → Groq

## Local development

1. Copy `.env.example` to `.env` and fill in the four values.
2. Run `docker-compose up`.
3. Open `http://localhost:3000`.

## Docs

- `PLAN.md` — vision, contracts, deployment, tools, roadmap, scope
- `TECHNICAL_PLAN.md` — branches, tags, testing, shipping cadence
- `reference/SOURCE_README.md` — notes on the reference implementation
