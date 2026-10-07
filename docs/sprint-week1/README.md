# Sprint Week 1 — Card 1: Data model + multi-tenancy (Day 1)

> **HARD RULE: the backend is Python.** All API work for this sprint lands in
> `backend-python/` (FastAPI). The Express server in `backend/` is legacy
> landing-page scaffolding only and is NOT extended for this product.

Source: Trello board `Work Tracker – Week 1 Sprint` / list `In Progress` /
card [1. Data model + multi-tenancy (1.5d) – Day 1](https://trello.com/c/TaQaDNBd/1-1-data-model-multi-tenancy-15d-day-1).

Decision in scope: real `tenants` table + new unified `tasks` model (`type = task | session`).
The legacy `owner_id` tables in `lib/db/` and `backend/` are not reused.

## Diagrams

Render with any Mermaid viewer (GitHub, VS Code Mermaid preview, `mmdc`).

- [01-tenancy-tasks-er.mmd](./01-tenancy-tasks-er.mmd) — proposed ER: tenants, members, courses, groups, students, tasks, time_entries, income_records, curriculum_files.
- [02-tenancy-flow.mmd](./02-tenancy-flow.mmd) — Clerk → `verify_clerk_user` → `resolve_tenant` → `tenant_id` scoping.
- [03-timer-state.mmd](./03-timer-state.mmd) — Begin/Finish state machine + income rule: income = actual tracked time, not scheduled duration.

## Where the code goes (Python)

| Concern | File |
|---|---|
| API entrypoint, router mounting under `/api` | `backend-python/app/main.py` |
| Clerk JWT verification (already exists) | `backend-python/app/middleware/auth.py` |
| New shared tenancy dependency | `backend-python/app/middleware/tenancy.py` |
| Timer endpoints (Card 3) | `backend-python/app/routes/timer.py` |
| Tasks / courses / groups routes | `backend-python/app/routes/` |
| SQLAlchemy models + session | `backend-python/app/db/` |
| Seed script | `backend-python/app/seed.py` |
| Env config (`DATABASE_URL`, `CLERK_JWKS_URL`) | `backend-python/app/config.py` |

Both tracks import `Depends(resolve_tenant)` — this is the shared helper the card requires.

## Current vs proposed

| Aspect | Legacy Express (`backend/`, landing page only) | Proposed (Card 1, FastAPI) |
|---|---|---|
| Tenancy column | `owner_id TEXT DEFAULT 'demo-user'` — `lib/db/src/schema/management.ts:14` | `tenant_id` FK → `tenants.id` |
| Scoping helper | `ownerFor()/withOwner()` — `backend/src/routes/management.ts:82` | `resolve_tenant` dependency — `backend-python/app/middleware/tenancy.py` |
| Auth | `clerkMiddleware` + `getAuth(req)` | `verify_clerk_user` (`Depends`) — already in `app/middleware/auth.py` |
| Tasks | none (separate `students` / `sessions`) | new `tasks` table; session = row with `group_id + start_at/end_at` |
| Timer | none | `POST /api/timer/begin`, `POST /api/timer/finish {task_id}` in `lib/api-spec/openapi.yaml`, regen via Orval |
| Seed | `ensureUserData()` inline in `management.ts:88-366` | `backend-python/app/seed.py`: demo tenant + course(rate) + group + students + tasks |

## Income rule (Card 7 dependency)

Income is derived from **actual tracked time**, not the scheduled `start_at/end_at`.

When a session task is finished, an explicit `income_records` row is created with:
- `task_id` — the finished session
- `amount` — `SUM(time_entries.duration * time_entries.hourly_rate)` for that task
- `currency` — default `USD`

The timer is the source of truth. If a session was scheduled for 90 minutes but only 60 minutes were tracked, income reflects 60 minutes.

## Curriculum files (Card 8)

Each course has a curriculum where files can be uploaded. Uses a dedicated `curriculum_files` table (not a generic `files` + `entity_type` filter) because:
- FK to `courses` enforces referential integrity
- Curriculum-specific fields (version, is_current, sort_order) can be added Week 2 without schema changes
- Queries are simple: `WHERE course_id = X`

## Hourly rate ownership

`hourly_rate` lives in one canonical place: **`courses.hourly_rate`**.
`time_entries.hourly_rate` snapshots the rate at the time of entry so history is preserved even if the course rate changes later.

Removed from: `students`, `tasks`.

## Session example row

```json
{
  "id": 7,
  "tenant_id": "tn_demo",
  "type": "session",
  "title": "Algebra II - Ava",
  "group_id": 2,
  "start_at": "2026-10-07T14:00:00Z",
  "end_at": "2026-10-07T15:30:00Z",
  "estimate": 90,
  "remaining": 0,
  "status": "done"
}
```

This row shows in **All Work** + **Today** automatically. Track 1 and Track 2 build independently from Day 2 with no extra integration work.

## Seed data shape (Day 1 deliverable)

```json
{
  "tenant": { "id": "tn_demo", "name": "Demo tenant" },
  "member": { "tenant_id": "tn_demo", "user_id": "<Clerk userId or demo-user>", "role": "admin" },
  "course":  { "tenant_id": "tn_demo", "name": "IGCSE Mathematics Core", "hourly_rate": "32.00" },
  "group":   { "tenant_id": "tn_demo", "course_id": 1, "name": "Grade 9 - Morning" },
  "students": [
    { "tenant_id": "tn_demo", "name": "Ava Thompson" },
    { "tenant_id": "tn_demo", "name": "Jordan Lee" }
  ],
  "tasks": [
    { "tenant_id": "tn_demo", "type": "task",   "title": "Prepare Algebra worksheet",  "status": "todo" },
    { "tenant_id": "tn_demo", "type": "session", "title": "Algebra II - Ava", "group_id": 1, "start_at": "...", "end_at": "...", "status": "planned" }
  ],
  "curriculum_files": [
    { "tenant_id": "tn_demo", "course_id": 1, "name": "chapter-1-notes.pdf", "object_path": "/objects/tn_demo/ch1.pdf", "size": 248000, "content_type": "application/pdf" }
  ]
}
```

## Day-1 contract (both tracks agree before splitting)

- One `tasks` table, `type = task | session`
- Timer endpoints: `POST /api/timer/begin {task_id}` and `POST /api/timer/finish {task_id}` — work on any task type
- Income on session finish = explicit `income_records` row with `amount = SUM(time_entries.duration * hourly_rate)` (timer is source of truth, not scheduled duration)
- Curriculum files on dedicated `curriculum_files` table with FK to `courses`
- Shared tenancy helper `resolve_tenant` in `backend-python/app/middleware/tenancy.py`, injected via `Depends` in both tracks
- Seed script `backend-python/app/seed.py` with demo tenant + course(rate) + group + students + tasks, runnable independently

## PLAN.md note

`PLAN.md` has been amended: multi-tenancy via `tenants` + `tenant_id` is now in scope for the Work Tracker product, and the FastAPI backend in `backend-python/` is the live backend for this work.