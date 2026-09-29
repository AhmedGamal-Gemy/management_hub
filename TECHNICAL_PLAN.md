# Tutor Ops Dashboard — Technical Execution Plan

## 1. Repository Structure

This is a monorepo with two services:

```
tutor-ops-dashboard/
├── frontend/          ← Vite + React SPA (built product UI)
├── backend-express/   ← Express API, serves /api/* (running stack)
├── lib/               ← api-spec, api-client-react, api-zod, db
├── backend/           ← FastAPI (PARKED until migration starts)
├── docker/            ← Dockerfiles
├── docker-compose.yml ← frontend:5173, express:5000, db:postgres
├── .replit/.nix       ← Replit-native config
├── PLAN.md / TECHNICAL_PLAN.md / README.md / AGENTS.md
└── reference/         ← leftover docs and configs (reference only)
```

The frontend and backend are separate deployable units but live in one repo for development convenience. Each can be split into its own GitHub repo later without changing any code.

---

## 2. Branch Strategy

### Branch names

All branches follow the pattern: `type/short-description`

**Types:**
- `feat/` — a new feature
- `fix/` — a bug fix
- `chore/` — tooling, dependencies, config
- `refactor/` — code changes with no behavior change
- `docs/` — documentation only

**Examples:**
- `feat/backend-students-sessions`
- `feat/backend-overview-activity`
- `feat/ai-session-summarizer`
- `fix/proposal-mark-won`

### Main branch

`main` is always deployable. No one commits directly to `main`.

### Feature branches

The UI is built and the original API runs it. Branches deliver the
migration, one domain at a time, verified by driving the existing pages
against the new backend:

```
feat/backend-migrate-students-sessions ← students + sessions CRUD
feat/backend-migrate-curricula        ← curricula CRUD
feat/backend-migrate-freelance        ← projects, proposals, time entries, expenses
feat/backend-migrate-build            ← ideas, ventures, files
feat/backend-migrate-overview         ← overview + activity aggregates
feat/backend-migrate-storage          ← signed-upload flow
feat/ai-session-summarizer            ← /ai/summarize-session, wired to UI button
feat/ai-financial-insight             ← /ai/financial-insight on the dashboard
feat/testing-edge-cases               ← full walkthrough, no new endpoints
feat/final-polish-verify              ← mobile, titles, deploy verification
```

### Merge rule

A feature branch can only be merged into `main` if:
1. `docker-compose up` runs without errors
2. The feature works as described in the plan
3. No existing feature is broken (smoke test of previously shipped features)

Merges use **squash merge** to keep `main` history linear. Commit message format: `feat: short description`.

---

## 3. Tag Strategy

### Milestone tags only

Tags are created at the end of each **milestone** — a point where a meaningful slice of the product is complete and usable on its own. There are six milestones. Each one is verified by clicking through the built UI against the new backend.

**Tag format:** `v0.1.{N}`

### Milestone definitions and tags

| Tag | Trigger | What's complete |
|---|---|---|
| `v0.1.1` | Original stack running | `docker compose up --build` boots frontend + Express + Postgres; health and students reachable through the proxy. The app works as on Replit. |
| `v0.1.2` | Teaching migrated | Students, sessions, curricula, income rollups served by FastAPI. Teaching pages fully work against it. |
| `v0.1.3` | Freelance + build migrated | Projects, proposals, expenses, ideas, ventures, files served by FastAPI; overview and activity aggregates live. Express retired. |
| `v0.1.4` | Storage uploads migrated | Signed-upload flow works against the new backend's object store; venture attachments persist. |
| `v0.1.5` | AI layer | Session summarizer + financial insight live via litellm, wired to UI buttons with error states. |
| `v0.1.6` | Production ready | Edge cases handled, mobile verified, Replit deploy verified, `docker compose up --build` runs cleanly. Ready for real use. |

### When to tag

A tag is created immediately after the milestone branch is merged into `main`. The tag represents a checkpoint that anyone can check out and run `docker-compose up` against to get a working application at that stage.

Tags are never deleted, never moved, and never reused.

### What tags mean

Checking out a tag gives you the exact state of the product at that milestone. This is useful for:
- Demonstrating progress to the user at the end of each chapter
- Rolling back to a known-good state if a later milestone introduces problems
- Preserving the state of the product at each meaningful checkpoint

---

## 4. Testing Strategy

### Scope

Testing is manual and lightweight. There is no automated test suite. Testing means running through the shipped feature and adjacent features to confirm nothing is broken.

### Verification (before merging any feature branch)

- [ ] `docker compose up --build` starts frontend, backend, and db without errors
- [ ] The new endpoints work as described, driven through the real UI pages
- [ ] Previously shipped pages still work (smoke test)
- [ ] Sign up → log in → dashboard flow works; log out and back in preserves data
- [ ] Empty states appear on empty list pages
- [ ] Error states are visible (e.g., stop the backend, watch the UI degrade cleanly)

### Full walkthrough (before the production-ready tag)

A complete pass over every page in the product:
- Create, edit, delete a student; search filters the list
- Plan a session, mark it taught, check the income rollups move
- Add and review-flag curriculum entries
- Create, advance, and delete freelance projects, proposals, expenses
- Capture, advance, and delete ideas and ventures; attach a file to a venture
- Trigger AI summarization and financial insight; force a failure and retry
- Test every empty state and every error path
- Resize browser to mobile width, verify every page

### What is not tested

- Load testing or performance benchmarks
- Cross-browser testing beyond Chrome
- Formal accessibility auditing
- Security penetration testing (Clerk sessions verified server-side on every call)
- Automated regression tests

---

## 5. Feature Shipping Cadence

### Cadence

Each branch is a complete mini-sprint:
- Start: branch off `main` with a `feat/` branch
- Build: implement the backend domain, verify it through the real UI pages
- End: merge to `main`, create the milestone tag when a milestone completes

There is no "almost done" state carried across branches. If a domain isn't complete, the branch stays open and the timeline shifts.

### What "shipped" means

A feature is shipped when merged into `main` (and tagged at milestones). At that point:
- `docker compose up --build` produces a working app with that backend domain live
- The existing UI pages covering that domain work end to end without developer intervention
- All previously shipped domains remain intact

### Milestone definitions

**DB + owner scope (tag `v0.1.1`):** Schema ported, FastAPI on Postgres, Clerk session → owner id enforced. Students page loads real rows.

**Teaching backend (tag `v0.1.2`):** Students, sessions, curricula, income rollups served. Teaching pages fully work.

**Freelance + build backend (tag `v0.1.3`):** Projects, proposals, expenses, ideas, ventures, files served; overview and activity aggregates live. Whole app works end to end.

**Storage uploads (tag `v0.1.4`):** Signed-upload flow works against the backend's object store; venture attachments persist.

**AI layer (tag `v0.1.5`):** Session summarizer + financial insight live via litellm, wired to UI buttons with error states.

**Production ready (tag `v0.1.6`):** Edge cases handled, mobile verified, Replit deploy verified, app is ready for real daily use.

### After the build

The plan ends with a working local application. Next steps:
- Verify the Replit deployment and publish
- Add custom domain
- Share live URL with the user
- Collect feedback and plan v1.1 based on real usage

---

## 6. Replit Deployment (Dual Config)

Local Docker dev and Replit are two ways to run the same code. Each
environment reads its own config and ignores the other's. No code changes
are needed to switch between them.

### Which file each environment reads

| File | Local `docker-compose up` | Replit workspace / deploy |
|---|---|---|
| `docker-compose.yml` | Yes — frontend, express, db | Ignored |
| `docker/frontend.Dockerfile`, `docker/backend-express.Dockerfile` | Yes — own the runtimes | Ignored |
| `.replit` | Ignored | Yes — run/build/deploy/ports |
| `replit.nix` | Ignored | Yes — Node 20 + Python 3.12 runtimes |
| `.env` (from `.env.example`) | Yes | No — Replit Secrets panel instead |

### Single-port serving model

Replit deployments expose exactly one external port. The contract:

- Dev: Vite runs on port 5173 (external 80) and forwards same-origin
  `/api/*` to Express on internal port 5000 (see `server.proxy` in
  `frontend/vite.config.ts`, driven by `API_PROXY_TARGET`).
- Deploy: Express runs on port 5000 (internal) and `vite preview`
  serves the built SPA on port 5173 (external 80), so the browser keeps
  calling same-origin `/api/*` with zero config change.
- Both servers bind to `0.0.0.0`, never `localhost`. The configs in this
  repo already do.

### AI via the litellm package (no sidecar)

There is no proxy container. In every environment the backend calls the
`litellm` Python package in-process, with the provider model string from
`LITELLM_MODEL` (e.g. `groq/llama-3.3-70b-versatile`). Switching models is
still config-only: one env value changes, no code changes.
See `backend/app/services/litellm_service.py`.

### CI workflow (GitHub Actions)

`.github/workflows/ci.yml` runs on GitHub runners — not inside Replit —
on every push and every PR targeting `main` or `dev`:

- `frontend` job: `pnpm install`, typecheck and `vite build` the app
  (dummy `PORT`/`BASE_PATH`; the build needs no real keys).
- `backend` job: `pip install -r requirements.txt`,
  import-check `app.main`, and TOML validation of `.replit`.

Recommended branch protection (set once on GitHub, Settings → Branches):
require the CI checks to pass before merging into `main`. Since Replit
syncs from `main`, only green code reaches the workspace.

### Replit sync and publishing flow

1. Work happens on `feat/*` branches, merged to `main` after CI passes.
2. The Replit workspace has GitHub auto-sync on: merges to `main`
   pull into the workspace automatically.
3. Code sync is not a redeploy. After verifying in the workspace,
   publish manually from the Deployments tab (Redeploy button).
4. There is no supported API for GitHub Actions to trigger a Replit
   redeploy. Fully automatic deploy-on-merge is out of scope unless a
   DIY deploy webhook is added later.

### Secrets checklist

Secrets never sync between environments. All three lists must be
maintained by hand:

- Local `.env` (from `.env.example`): Postgres credentials +
  `DATABASE_URL`, `PORT`, `BASE_PATH`, `API_PROXY_TARGET`,
  `VITE_CLERK_PUBLISHABLE_KEY` (shared by UI and API),
  `CLERK_SECRET_KEY`.
- GitHub repo Settings → Secrets and variables → Actions: only what CI
  needs (CI builds with dummy values; add real ones only if tests
  ever need them).
- Replit workspace Secrets panel (dev) plus Deployment secrets
  (production): Clerk publishable key, Clerk secret key, Postgres
  `DATABASE_URL`, plus `PORT=5173` and `BASE_PATH=/` for dev runs.
  (Groq key, `LITELLM_MODEL`, and `CLERK_JWKS_URL` belong to the parked
  FastAPI backend — not needed until migration.)
  Deployment secrets are separate from workspace secrets — an app that
  works on Run but fails on Deploy is almost always a missing
  deployment secret.

### Free-trial notes (2026)

- Workspace development (editing, running, previewing) is the free
  surface. Use it for the full 20-day build.
- Publishing (Autoscale, Reserved VM, Static deployments) is a paid
  surface billed on usage. Before publishing anything, check remaining
  trial credits in the workspace and current pricing — do not assume
  the trial covers deployments.
- Recommended first publish target is Autoscale (scales to zero when
  idle). Reserved VM is only justified if the app ever needs
  always-on behavior (background jobs, persistent connections),
  which this product does not.
- If credits run out mid-build, nothing is lost: the GitHub repo
  remains the source of truth and local `docker-compose up` keeps
  working. Publishing can wait until Day 20 or later.
