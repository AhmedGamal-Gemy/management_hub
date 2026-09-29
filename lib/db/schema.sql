-- Postgres schema ported 1:1 from lib/db/src/schema/management.ts (Drizzle).
-- Applied with: psql $DATABASE_URL -f db/schema.sql
-- (drizzle-kit push does not run on this machine; this file is the
-- equivalent. Regenerate from the Drizzle schema if it changes.)
-- Nullable unless marked NOT NULL: the app inserts NULL into hourly_rate
-- and project_id, matching columns without .notNull() in Drizzle.

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  teacher_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  freelancer_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  entrepreneur_enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  owner_id TEXT NOT NULL DEFAULT 'demo-user',
  name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  age INTEGER NOT NULL,
  grade TEXT NOT NULL,
  subjects TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT NOT NULL DEFAULT '',
  curriculum TEXT NOT NULL DEFAULT '',
  hourly_rate NUMERIC(10, 2),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  owner_id TEXT NOT NULL DEFAULT 'demo-user',
  student_id INTEGER NOT NULL,
  class_name TEXT NOT NULL,
  session_date DATE NOT NULL,
  duration NUMERIC(8, 2) NOT NULL,
  hourly_rate NUMERIC(10, 2) NOT NULL,
  calculated_cost NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS curricula (
  id SERIAL PRIMARY KEY,
  owner_id TEXT NOT NULL DEFAULT 'demo-user',
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  description TEXT NOT NULL,
  publisher TEXT NOT NULL DEFAULT '',
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'current',
  date_added DATE NOT NULL,
  last_updated DATE NOT NULL,
  review_date DATE NOT NULL,
  notes TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS freelancer_projects (
  id SERIAL PRIMARY KEY,
  owner_id TEXT NOT NULL DEFAULT 'demo-user',
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  description TEXT NOT NULL,
  date_created DATE NOT NULL,
  deadline DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'idea',
  hourly_rate NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS time_entries (
  id SERIAL PRIMARY KEY,
  owner_id TEXT NOT NULL DEFAULT 'demo-user',
  project_id INTEGER NOT NULL,
  entry_date DATE NOT NULL,
  duration NUMERIC(8, 2) NOT NULL,
  description TEXT NOT NULL,
  hourly_rate NUMERIC(10, 2) NOT NULL,
  calculated_cost NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS proposals (
  id SERIAL PRIMARY KEY,
  owner_id TEXT NOT NULL DEFAULT 'demo-user',
  project_id INTEGER,
  opportunity_name TEXT NOT NULL,
  client_type TEXT NOT NULL,
  version TEXT NOT NULL,
  content TEXT NOT NULL,
  approach TEXT NOT NULL,
  proposal_date DATE NOT NULL,
  result TEXT NOT NULL,
  won BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT NOT NULL DEFAULT '',
  what_worked TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  owner_id TEXT NOT NULL DEFAULT 'demo-user',
  expense_date DATE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT NOT NULL,
  project_id INTEGER,
  payment_method TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS venture_projects (
  id SERIAL PRIMARY KEY,
  owner_id TEXT NOT NULL DEFAULT 'demo-user',
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date_created DATE NOT NULL,
  stage TEXT NOT NULL DEFAULT 'idea',
  status TEXT NOT NULL DEFAULT 'active',
  goal TEXT NOT NULL,
  deadline DATE NOT NULL,
  next_step TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS ideas (
  id SERIAL PRIMARY KEY,
  owner_id TEXT NOT NULL DEFAULT 'demo-user',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at DATE NOT NULL,
  stage TEXT NOT NULL DEFAULT 'new',
  priority TEXT NOT NULL DEFAULT 'medium',
  notes TEXT NOT NULL DEFAULT '',
  development_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  owner_id TEXT NOT NULL DEFAULT 'demo-user',
  name TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  object_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  size INTEGER NOT NULL,
  content_type TEXT NOT NULL
);
