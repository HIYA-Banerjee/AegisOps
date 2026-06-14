-- Phase 1: Extended schema — missing tables, relationships, indexes

-- Services seed FK target (ensure services exist before logs/vulns)
-- logs
CREATE TABLE IF NOT EXISTS logs (
  id TEXT PRIMARY KEY DEFAULT 'log-' || uuid_generate_v4()::text,
  service_id TEXT REFERENCES services(id) ON DELETE SET NULL,
  level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error', 'critical')),
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- root_causes (separate RCA records linked to incidents)
CREATE TABLE IF NOT EXISTS root_causes (
  id TEXT PRIMARY KEY DEFAULT 'rc-' || uuid_generate_v4()::text,
  incident_id TEXT REFERENCES incidents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  confidence NUMERIC DEFAULT 0.0 CHECK (confidence >= 0 AND confidence <= 100),
  ranked_causes JSONB DEFAULT '[]',
  impact_analysis JSONB DEFAULT '{}',
  dependency_trace JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- alerts
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY DEFAULT 'alert-' || uuid_generate_v4()::text,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'slack', 'teams', 'pagerduty')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical', 'P0', 'P1', 'P2')),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'failed')),
  triggered_by TEXT,
  entity_type TEXT,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- vulnerabilities
CREATE TABLE IF NOT EXISTS vulnerabilities (
  id TEXT PRIMARY KEY DEFAULT 'vuln-' || uuid_generate_v4()::text,
  service_id TEXT REFERENCES services(id) ON DELETE CASCADE,
  cve_id TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  package_name TEXT NOT NULL,
  installed_version TEXT,
  fixed_version TEXT,
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- simulations (digital twin, chaos, deployment what-if)
CREATE TABLE IF NOT EXISTS simulations (
  id TEXT PRIMARY KEY DEFAULT 'sim-' || uuid_generate_v4()::text,
  simulation_type TEXT NOT NULL CHECK (simulation_type IN (
    'traffic_spike', 'node_failure', 'db_failure', 'memory_leak',
    'cpu_saturation', 'chaos', 'deployment_whatif', 'network_failure', 'latency_injection'
  )),
  target_service TEXT NOT NULL,
  parameters JSONB DEFAULT '{}',
  results JSONB DEFAULT '{}',
  risk_score INTEGER,
  failure_probability INTEGER,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- dora_metrics (historical team DORA snapshots)
CREATE TABLE IF NOT EXISTS dora_metrics (
  id SERIAL PRIMARY KEY,
  team_id TEXT REFERENCES teams(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  deployment_frequency NUMERIC NOT NULL DEFAULT 0,
  lead_time_hours NUMERIC NOT NULL DEFAULT 0,
  mttr_minutes NUMERIC NOT NULL DEFAULT 0,
  change_failure_rate NUMERIC NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'Medium' CHECK (tier IN ('Elite', 'High', 'Medium', 'Low')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- slo_metrics (SLO snapshots)
CREATE TABLE IF NOT EXISTS slo_metrics (
  id TEXT PRIMARY KEY DEFAULT 'slo-' || uuid_generate_v4()::text,
  service_id TEXT REFERENCES services(id) ON DELETE SET NULL,
  slo_id TEXT NOT NULL,
  name TEXT NOT NULL,
  target_percent NUMERIC NOT NULL,
  current_percent NUMERIC NOT NULL,
  error_budget_percent NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'healthy' CHECK (status IN ('healthy', 'warning', 'breached')),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- cost_metrics (cloud spend snapshots)
CREATE TABLE IF NOT EXISTS cost_metrics (
  id TEXT PRIMARY KEY DEFAULT 'cost-' || uuid_generate_v4()::text,
  service_name TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('aws', 'azure', 'gcp', 'digitalocean')),
  current_cost NUMERIC NOT NULL DEFAULT 0,
  previous_cost NUMERIC NOT NULL DEFAULT 0,
  forecast_cost NUMERIC NOT NULL DEFAULT 0,
  anomaly_detected BOOLEAN DEFAULT false,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY DEFAULT 'aud-' || uuid_generate_v4()::text,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Extend predictions with confidence score
ALTER TABLE predictions ADD COLUMN IF NOT EXISTS confidence_score NUMERIC DEFAULT 0.0;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_deployments_timestamp ON deployments (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_deployments_env_status ON deployments (env, status);
CREATE INDEX IF NOT EXISTS idx_deployments_team ON deployments (team);
CREATE INDEX IF NOT EXISTS idx_incidents_started_at ON incidents (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_severity_status ON incidents (severity, status);
CREATE INDEX IF NOT EXISTS idx_incidents_service ON incidents (service);
CREATE INDEX IF NOT EXISTS idx_metrics_service_time ON metrics (service_id, metric_name, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_service_time ON logs (service_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_level ON logs (level);
CREATE INDEX IF NOT EXISTS idx_predictions_deployment ON predictions (deployment_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_root_causes_incident ON root_causes (incident_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts (status);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_service ON vulnerabilities (service_id);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON vulnerabilities (severity);
CREATE INDEX IF NOT EXISTS idx_simulations_type ON simulations (simulation_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dora_metrics_team ON dora_metrics (team_id, period_end DESC);
CREATE INDEX IF NOT EXISTS idx_slo_metrics_service ON slo_metrics (service_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_cost_metrics_provider ON cost_metrics (provider, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs (entity_type, entity_id);
