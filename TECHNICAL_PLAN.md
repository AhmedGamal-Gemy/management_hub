# Tutor Ops Dashboard — Technical Execution Plan

## 1. Repository Structure

This is a monorepo with two production services and one proxy:

```
tutor-ops-dashboard/
├── frontend/          ← Next.js app (port 3000)
├── backend/           ← FastAPI app (port 8000)
├── docker-compose.yml
├── .env.example
├── PLAN.md
├── TECHNICAL_PLAN.md
└── README.md
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
- `feat/scaffold-monorepo`
- `feat/auth-login-signup`
- `feat/students-crud`
- `feat/sessions-calendar`
- `feat/ai-session-summarizer`
- `fix/payment-overdue-flag`

### Main branch

`main` is always deployable. No one commits directly to `main`.

### Feature branches

Each day of the 20-day plan ships as a feature branch, named after what it delivers rather than the day number:

```
Day 1:  feat/scaffold-monorepo
Day 2:  feat/auth-login-signup
Day 3:  feat/students-crud
Day 4:  feat/sessions-calendar
Day 5:  feat/payments-schema
Day 6:  feat/payments-ui-status
Day 7:  feat/budget-split-logic
Day 8:  feat/budget-visual-split
Day 9:  feat/expenses-log
Day 10: feat/dashboard-home
Day 11: feat/content-library-upload
Day 12: feat/content-library-browse
Day 13: feat/proposals-schema
Day 14: feat/proposals-kanban
Day 15: feat/auth-polish-routes
Day 16: feat/app-shell-design-system
Day 17: feat/ai-litemm-setup-summarizer
Day 18: feat/ai-financial-insight
Day 19: feat/testing-edge-cases
Day 20: feat/final-polish-verify
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

Tags are created at the end of each **milestone** — a point where a meaningful slice of the product is complete and usable on its own. There are six milestones across the 20 days.

**Tag format:** `v0.1.{N}`

### Milestone definitions and tags

| Tag | Trigger | What's complete |
|---|---|---|
| `v0.1.1` | End of Day 4 — Foundation | Students CRUD, sessions with calendar, auth flow. The core CRUD loop works. This is the minimum viable product. |
| `v0.1.2` | End of Day 9 — Money Matters | Payments, budgeting split logic, visual donut, expenses with live remaining balance. Full money tracking works. |
| `v0.1.3` | End of Day 10 — Mission Control | Dashboard home ships. Tutor can open the app and understand their business in five seconds. |
| `v0.1.4` | End of Day 14 — Library & Growth | File uploads and browse, proposals CRUD, kanban board with drag-and-drop. Non-teaching workspace tools are complete. |
| `v0.1.5` | End of Day 17 — AI Layer | LiteLLM proxy running, session summarizer, financial insight. AI features are live. |
| `v0.1.6` | End of Day 20 — Production Ready | All edge cases handled, mobile verified, final polish, `docker-compose up` runs cleanly. Ready for real use. |

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

### Daily verification (before merging any feature branch)

- [ ] `docker-compose up` starts all three services without errors
- [ ] The new feature works as described
- [ ] Previously shipped features still work (smoke test)
- [ ] Navigation between pages works
- [ ] Sign up → log in → dashboard flow works
- [ ] Log out and back in preserves data
- [ ] Empty states appear on empty list pages
- [ ] Error states are visible (e.g., submit an empty form)

### Day 19 — Full walkthrough

Day 19 has no new feature. Its sole purpose is a complete walkthrough of every feature in the product:
- Create, edit, delete a student
- Add a session, view it on the calendar, mark it taught
- Enter income, verify budget split, log an expense, watch remaining balance update
- Upload a file, find it in browse, filter by subject
- Create a proposal, drag it across every status column
- Trigger AI summarization, verify output saves to session
- Trigger AI financial insight, verify output appears on dashboard
- Test every empty state and every error path
- Resize browser to mobile width, verify every page

### What is not tested

- Load testing or performance benchmarks
- Cross-browser testing beyond Chrome
- Formal accessibility auditing
- Security penetration testing (RLS policies are trusted by design)
- Automated regression tests

---

## 5. Feature Shipping Cadence

### Daily cadence

Each day is a complete mini-sprint:
- Start: branch off `main` with `feat/` branch
- Build: implement the feature, verify it works in isolation
- End: merge to `main`, create milestone tag if this day completes a chapter

There is no "almost done" state carried across days. If a day's feature isn't complete, the day extends and the overall timeline shifts. The 20-day plan is a guide, not a deadline.

### What "shipped" means

A feature is shipped when merged into `main` and tagged. At that point:
- `docker-compose up` produces a working app with that feature present
- The feature is usable by the end user without developer intervention
- All previously shipped features remain intact

### Milestone definitions

**Foundation (tag `v0.1.1`, Day 4):** Students and sessions both work. Calendar is functional. Core CRUD loop is proven.

**Money (tag `v0.1.2`, Day 9):** Payments, budgeting, and expenses all function. Income tracking and category balances are live.

**Mission Control (tag `v0.1.3`, Day 10):** Dashboard home reflects real data from all tables. The tutor gets a five-second read on their business.

**Library & Growth (tag `v0.1.4`, Day 14):** Files and proposals are fully functional. Kanban board with drag-and-drop ships.

**AI Layer (tag `v0.1.5`, Day 17):** LiteLLM proxy is configured, session summarizer works, financial insight appears on dashboard.

**Production Ready (tag `v0.1.6`, Day 20):** Edge cases handled, mobile verified, final polish applied, app is ready for real daily use.

### After Day 20

The plan ends at Day 20 with a working local application. Next steps:
- Deploy frontend to Vercel, backend to a container host
- Set up a production Supabase project
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
| `docker-compose.yml` | Yes — owns all three services | Ignored |
| `docker/frontend.Dockerfile`, `docker/backend.Dockerfile` | Yes — own the runtimes | Ignored |
| `litellm-config.yaml` | Yes — proxy model routing | Ignored (no sidecar can run) |
| `.replit` | Ignored | Yes — run/build/deploy/ports |
| `replit.nix` | Ignored | Yes — Node 20 + Python 3.12 runtimes |
| `.env` (from `.env.example`) | Yes | No — Replit Secrets panel instead |

### Single-port serving model

Replit deployments expose exactly one external port. The contract:

- Next.js runs on port 3000, mapped to external port 80. This is the
  only externally reachable service.
- FastAPI runs on internal port 8000. It is reachable from inside the
  workspace but never from the browser.
- The browser calls AI endpoints same-origin at `/backend/*`. Next.js
  rewrites (`frontend/next.config.js`) forward these server-side to
  FastAPI using `BACKEND_INTERNAL_URL` (`http://backend:8000` in
  docker-compose, `http://localhost:8000` on Replit).
- Both servers must bind to `0.0.0.0`, never `localhost`. The configs
  in this repo already do.

### LiteLLM dual mode

- Local: the LiteLLM proxy sidecar runs at `http://litellm:4000`.
  `LITELLM_PROXY_URL` is set, so the backend calls the proxy with
  logical model names (`tutor-ops`). Model routing lives in
  `litellm-config.yaml` — changing models is config-only.
- Replit: no sidecar container can run (`docker build` fails inside
  workspaces; Dockerfiles are not supported). `LITELLM_PROXY_URL` is
  unset, so the backend calls the `litellm` Python package in-process
  with the provider string from `LITELLM_MODEL`
  (e.g. `groq/llama-3.3-70b-versatile`). The model-switching contract
  is preserved: one env value changes, no code changes.
- See `backend/app/services/litellm_service.py` for the switch.

### CI workflow (GitHub Actions)

`.github/workflows/ci.yml` runs on GitHub runners — not inside Replit —
on every push and every PR targeting `main` or `dev`:

- `frontend` job: `npm install`, `npm run typecheck`, `npm run build`
  (dummy Supabase env values; the scaffold builds without real keys).
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

- Local `.env` (from `.env.example`): `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_JWT_SECRET`,
  `GROQ_API_KEY`, `BACKEND_INTERNAL_URL`, `LITELLM_MODEL`.
- GitHub repo Settings → Secrets and variables → Actions: only what CI
  needs (CI uses dummy Supabase values; add real ones only if tests
  ever need them).
- Replit workspace Secrets panel (dev) plus Deployment secrets
  (production): Supabase URL + anon key, Supabase JWT secret, Groq API
  key, `BACKEND_INTERNAL_URL=http://localhost:8000`, `LITELLM_MODEL`.
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
