# Tutor Ops Dashboard — Technical Plan

## 1. Product Vision

A single-owner command center for a tutoring business. One person logs in, sees their entire teaching operation — students, sessions, money, curriculum, content, proposals — in one calm, fast interface. No team features, no multi-tenant complexity. Every feature in the 20-day plan is built for exactly this use case.

---

## 2. Architecture Contract

The contract between all three layers is:

**Frontend has two data paths:**

- **CRUD path:** The Next.js frontend talks directly to Supabase (PostgreSQL + Auth + Storage). Row Level Security policies in the database enforce that every row belongs to its authenticated user. No custom auth middleware needed on any backend service.
- **AI path:** The Next.js frontend sends AI requests to the FastAPI backend, which forwards them to the LiteLLM Proxy, which routes them to Groq's free-tier API. The user's identity is verified on the backend by validating the Supabase JWT token against the JWT secret.

**Backend has exactly two responsibilities:** verify the user's identity on AI requests, and proxy AI calls through LiteLLM. It does not handle CRUD, file storage, or any data operations.

**LiteLLM Proxy is the AI contract boundary.** The frontend never knows which model is being used. The backend never knows either — they both call a single model name (e.g., `tutor-ops`) and LiteLLM routes to whatever provider is configured. Switching from Groq to Mistral to a local model requires one config change in one file and a container restart. No frontend or backend code changes.

**The database schema is the single source of truth for data shape.** The frontend infers types from it. The existing `openapi.yaml` in the repo is retained as a reference document for the data shapes the original app used, but is not actively maintained as a source of truth for this new product.

---

## 3. Behavioral Contracts

### User lifecycle

A user lands on a public homepage. They can sign up with email and password via Supabase Auth. After signup they are automatically logged in and land on the dashboard. They never see another user's data — Supabase RLS guarantees this at the database level. They can log out from the sidebar. Password reset is handled by Supabase Auth's built-in flow.

### Navigation contract

The sidebar has five sections — Overview, Teaching, Freelance, Build, and Settings — matching the plan's workspace concept simplified to one user. The sidebar is persistent on desktop and slide-out on mobile. Every sidebar link highlights its active page. Settings allows toggling which sections appear in the sidebar.

### CRUD behavior

All data operations go through Supabase from the frontend. Creating a record invalidates the relevant React Query cache so the UI refreshes. Editing opens a modal form pre-filled with current values. Deleting shows a confirmation dialog. Every list page has a loading state (skeleton), an empty state (icon, heading, copy, optional action button), and an error state (message, retry button). Search inputs filter results in real time via React Query's `queryKey` dependency.

### AI behavior

Two AI features exist: session note summarization and monthly financial insight. Both are triggered by an explicit button — AI never runs automatically. When triggered, the frontend sends a POST to the FastAPI backend with the user's Supabase JWT in the Authorization header. The backend validates the token, forwards the request to LiteLLM Proxy, and returns the result. The frontend displays the result in a distinctively styled card with a subtle AI badge. If the AI call fails (rate limit, network error, model unavailable), a clear error message is shown and the user can retry. Groq's free tier has rate limits — the financial insight is fetched once per page load and cached in React Query, not re-fetched on every render.

### Calendar behavior (Day 4)

The sessions page uses FullCalendar as the primary view. Sessions appear as events on the calendar. Clicking an empty slot opens the "new session" modal pre-filled with that date. Clicking an existing event opens the session detail view. The calendar switches between month and week views.

### Budget behavior (Day 7–9)

Creating a new month requires entering total income. The system immediately calculates each category's allocation (income × percentage) and shows a live preview with a donut chart before the user confirms. Once saved, the month and its category snapshots are created. Logging an expense selects a category, enters an amount and description, and immediately reduces that category's remaining balance. The UI updates in real time as the user types the expense amount.

### Proposals behavior (Day 13–14)

Proposals flow through five statuses: idea, drafting, sent, won, lost. Each proposal has an "advance status" action that cycles it forward. The kanban board renders one column per status. Drag-and-drop moves a proposal between columns and updates its status in the database. Cards show the proposal title, client type, version, and last updated date.

### File behavior (Day 11–12)

Uploading a file requests a signed upload URL from Supabase Storage, uploads directly to Storage from the browser, then saves a metadata record to the database. Files are tagged with subject and level. The browse page filters by subject chip and searches by file name. Maximum file size is 10MB.

---

## 4. Deployment Strategy

**Current phase: local development only.** No production hosting is set up. Everything runs through Docker Compose on the developer's machine.

**Local environment:** One command — `docker-compose up` — starts the frontend (port 3000), the FastAPI backend (port 8000), and the LiteLLM Proxy (port 4000). Supabase runs as a cloud project (not self-hosted). The developer only needs a `.env` file with four values: Supabase URL, Supabase anon key, Groq API key, and Supabase JWT secret.

**Environment variables (4 values total):**
- `NEXT_PUBLIC_SUPABASE_URL` — the Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase public anon key
- `SUPABASE_JWT_SECRET` — from Supabase dashboard, used by backend to verify tokens
- `GROQ_API_KEY` — Groq API key, passed to LiteLLM Proxy via environment

**Future production deployment (not now, but the architecture supports it without changes):**
- Frontend deploys to Vercel with three environment variables
- Backend deploys to any container host (Render, Fly, Railway) with two environment variables
- LiteLLM Proxy deploys to the same host or stays as a separate container
- Supabase project is promoted from development to production with RLS policies already in place
- No code changes required — the same Docker Compose file scales to production services

---

## 5. Tools

| Tool | Purpose | Why this one |
|---|---|---|
| **Supabase** | PostgreSQL database, authentication, file storage | Plan calls for Supabase; RLS replaces custom auth middleware; built-in storage replaces custom upload logic |
| **Next.js 14** | Frontend framework | Plan calls for Next.js; App Router gives SSR, file-system routing, and a clean project structure |
| **shadcn/ui** | UI component library | Accessible, composable, Tailwind-native; no runtime overhead since components are copied into the project |
| **Tailwind CSS v4** | Styling | Plan calls for Tailwind; v4 has a simpler config and better performance |
| **FastAPI** | Backend framework | Async-native, Pydantic validation, auto-generated OpenAPI spec, lightweight — only the AI endpoints live here |
| **LiteLLM Proxy** | AI model router | Single config file, OpenAI-compatible API, supports 100+ providers, zero code changes when switching models |
| **Groq** | AI inference provider | Free tier, very fast inference, good quality for structured tasks like summarization and insight generation |
| **Docker Compose** | Local orchestration | One command starts all three services; mirrors production architecture; no local Node.js or Python installation needed |
| **TanStack React Query** | Frontend data fetching and caching | Already used in the existing codebase; handles loading, error, and cache states declaratively |
| **FullCalendar** | Calendar view on sessions page | Plan explicitly calls for it; React component available |
| **Recharts** | Charts for budget and dashboard | Plan calls for visualizations; React-native, composable |
| **dnd-kit** | Drag-and-drop for kanban board | Plan explicitly calls for it; accessible, composable, lightweight |
| **lucide-react** | Icon set | Already in the existing codebase; tree-shakeable, consistent with plan's design direction |
| **date-fns** | Date formatting and manipulation | Lightweight, modular, already in the existing codebase |
| **Pydantic** | Request/response validation on FastAPI | Enforces the contract between frontend and backend at the API boundary |
| **PyJWT** | Supabase JWT verification on backend | Decodes and validates the Supabase access token using the JWT secret |
| **httpx** | Async HTTP client for backend → LiteLLM calls | Async-native, works cleanly inside FastAPI's async route handlers |

---

## 6. 20-Day Execution Rhythm

The build follows the plan's structure exactly — five chapters, one feature per day, one design pass per day.

**Days 1–4 — Foundation:** Scaffold the monorepo, configure Supabase and Docker, build auth, students CRUD, sessions with calendar.

**Days 5–9 — Money Matters:** Payments, status colors, budgeting split logic, visual donut chart, expenses with live remaining balance.

**Day 10 — Mission Control:** Dashboard home page composing all data into a five-second-read card grid.

**Days 11–14 — Library and Growth:** File uploads to Supabase Storage, browse with filters, proposals CRUD and kanban board with drag-and-drop.

**Days 15–20 — Lock, Polish, Launch:** Auth polish, cohesive app shell with locked design tokens, LiteLLM proxy setup, AI session summarizer, AI financial insight, full edge-case testing, final polish and local verification.

Each day has a concrete deliverable that can be verified independently. Days with no design work (backend schema days) are explicitly marked so the designer/developer doesn't skip the design half on later days.

---

## 7. What Is Explicitly Out of Scope

- Multi-user / multi-tenant support (one owner per Supabase project)
- Team invitations, roles, or permissions beyond a single login
- Payment processing with real payment providers (Stripe, PayPal)
- Mobile native apps (responsive web only)
- Email notifications
- Data export / import
- Third-party integrations beyond Groq via LiteLLM
- Self-hosted Supabase (cloud Supabase only)
- Production hosting (local dev only until Day 20 verification is complete)
