-- AegisOps DeployGuard AI — Initial Schema Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY DEFAULT 'team-' || uuid_generate_v4()::text,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  stability_score INTEGER DEFAULT 100,
  success_rate NUMERIC DEFAULT 100.0,
  risk_ranking INTEGER DEFAULT 5,
  commits INTEGER DEFAULT 0,
  deployments INTEGER DEFAULT 0,
  failures INTEGER DEFAULT 0,
  prevented_failures INTEGER DEFAULT 0,
  lead_time_days NUMERIC DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'sre', 'developer', 'executive')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members mapping
CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY DEFAULT 'tm-' || uuid_generate_v4()::text,
  team_id TEXT REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('leader', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY DEFAULT 'svc-' || uuid_generate_v4()::text,
  name TEXT NOT NULL,
  description TEXT,
  owner_team TEXT,
  repository TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deployments table
CREATE TABLE IF NOT EXISTS deployments (
  id TEXT PRIMARY KEY DEFAULT 'dep-' || uuid_generate_v4()::text,
  version TEXT NOT NULL,
  env TEXT NOT NULL CHECK (env IN ('prod', 'staging', 'dev')),
  status TEXT NOT NULL CHECK (status IN ('ok', 'failed', 'partial')),
  msg TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  commit_hash TEXT NOT NULL,
  author TEXT NOT NULL,
  team TEXT NOT NULL,
  test_coverage NUMERIC DEFAULT 0.0,
  failed_builds INTEGER DEFAULT 0,
  dependency_changes INTEGER DEFAULT 0,
  commit_velocity INTEGER DEFAULT 0,
  build_duration INTEGER DEFAULT 0,
  risk_score INTEGER DEFAULT 0,
  failure_probability INTEGER DEFAULT 0,
  why TEXT[] DEFAULT '{}'
);

-- Incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id TEXT PRIMARY KEY DEFAULT 'inc-' || uuid_generate_v4()::text,
  title TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('P0', 'P1', 'P2')),
  status TEXT NOT NULL CHECK (status IN ('active', 'resolved', 'investigating')),
  service TEXT NOT NULL,
  cost NUMERIC DEFAULT 0.0,
  duration_min INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  root_cause TEXT,
  blast_radius TEXT[] DEFAULT '{}',
  affected_users INTEGER DEFAULT 0,
  runbook_steps JSONB DEFAULT '[]'
);

-- Metrics table (for raw ts telemetry)
CREATE TABLE IF NOT EXISTS metrics (
  id SERIAL PRIMARY KEY,
  service_id TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id TEXT PRIMARY KEY DEFAULT 'pred-' || uuid_generate_v4()::text,
  deployment_id TEXT REFERENCES deployments(id) ON DELETE CASCADE,
  risk_score INTEGER NOT NULL,
  failure_probability INTEGER NOT NULL,
  why TEXT[] DEFAULT '{}',
  shap_values JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('vcs', 'cicd', 'cloud', 'chat', 'monitoring', 'itsm')),
  status TEXT NOT NULL CHECK (status IN ('connected', 'available', 'coming_soon')),
  logo_color TEXT NOT NULL,
  description TEXT NOT NULL,
  webhook_url TEXT,
  connected_at TIMESTAMPTZ
);
