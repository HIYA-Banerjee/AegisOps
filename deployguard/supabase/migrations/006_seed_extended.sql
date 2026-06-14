-- Phase 1: Extended seed data (services, metrics, DORA/SLO/cost, logs, vulns, sample deployments/incidents)

-- Services
INSERT INTO services (id, name, description, owner_team, repository) VALUES
  ('svc-auth', 'auth-service', 'Authentication and session management', 'Auth & Security', 'github.com/aegisops/auth-service'),
  ('svc-payment', 'payment-service', 'Payment processing and billing', 'Billing & Subscriptions', 'github.com/aegisops/payment-service'),
  ('svc-order', 'order-service', 'Order lifecycle and checkout', 'Core Platform', 'github.com/aegisops/order-service'),
  ('svc-gateway', 'gateway-service', 'API gateway and routing', 'API Gateway', 'github.com/aegisops/gateway-service'),
  ('svc-data', 'data-pipeline', 'ETL and analytics pipeline', 'Data Pipelines', 'github.com/aegisops/data-pipeline'),
  ('svc-notify', 'notification-service', 'Email, SMS, push notifications', 'Core Platform', 'github.com/aegisops/notification-service')
ON CONFLICT (id) DO NOTHING;

-- Sample deployments
INSERT INTO deployments (id, version, env, status, msg, timestamp, commit_hash, author, team, test_coverage, failed_builds, dependency_changes, commit_velocity, build_duration, risk_score, failure_probability, why) VALUES
  ('dep-101', 'v2.5.0', 'prod', 'failed', 'DB migration timeout · auth-svc down', NOW() - INTERVAL '14 minutes', 'f1a8c9b', 'Elena Rostova', 'Core Platform', 62.4, 4, 18, 45, 620, 87, 87, ARRAY['Test Coverage Drop: -34%', 'Failed Builds: +22%', 'Dependency Changes: +18%']),
  ('dep-102', 'v2.4.9', 'staging', 'ok', 'All tests passed · No anomalies', NOW() - INTERVAL '2 hours', 'e4d7c8a', 'Marcus Aurelius', 'Auth & Security', 91.2, 0, 2, 12, 340, 18, 12, ARRAY['Clean build', 'High test coverage']),
  ('dep-103', 'v2.4.8', 'prod', 'partial', 'Memory spike · Auto-scaled +2 nodes', NOW() - INTERVAL '6 hours', 'd3c6b7f', 'Sarah Chen', 'API Gateway', 84.0, 1, 5, 22, 410, 45, 38, ARRAY['Memory spike detected', 'Auto-scaled successfully']),
  ('dep-104', 'v2.4.7', 'prod', 'ok', 'Clean deploy · 0 errors', NOW() - INTERVAL '1 day', 'c2b5a6e', 'James Okonkwo', 'Core Platform', 88.5, 0, 1, 8, 380, 12, 8, ARRAY['Stable release'])
ON CONFLICT (id) DO NOTHING;

-- Sample incidents
INSERT INTO incidents (id, title, severity, status, service, cost, duration_min, started_at, resolved_at, root_cause, blast_radius, affected_users, runbook_steps) VALUES
  ('inc-201', 'PostgreSQL connection pool exhaustion on auth-service', 'P0', 'active', 'auth-service', 12500, 47, NOW() - INTERVAL '47 minutes', NULL,
   'Connection pool max_connections (100) reached due to unreleased transactions after v2.5.0 deploy',
   ARRAY['auth-service', 'gateway-service', 'payment-service'],
   8400,
   '[{"step":1,"title":"Scale read replicas","description":"Add 2 read replicas","etaMin":5,"status":"completed"},{"step":2,"title":"Kill idle connections","description":"Terminate idle > 30s","etaMin":3,"status":"running"},{"step":3,"title":"Rollback deploy","description":"Revert to v2.4.7","etaMin":10,"status":"pending"}]'::jsonb),
  ('inc-202', 'Memory leak causing OOM on payment-service pods', 'P1', 'investigating', 'payment-service', 4200, 22, NOW() - INTERVAL '22 minutes', NULL,
   'Gradual heap growth in payment-processor v3.2 — suspected unclosed HTTP client connections',
   ARRAY['payment-service', 'order-service'],
   2100,
   '[{"step":1,"title":"Heap dump analysis","description":"Capture and analyze heap","etaMin":15,"status":"running"},{"step":2,"title":"Restart pods","description":"Rolling restart","etaMin":5,"status":"pending"}]'::jsonb),
  ('inc-203', 'Elevated API latency on gateway-service', 'P2', 'resolved', 'gateway-service', 800, 35, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '35 minutes',
   'Upstream auth-service latency propagated through gateway rate limiter',
   ARRAY['gateway-service'],
   450,
   '[{"step":1,"title":"Enable circuit breaker","description":"Trip breaker on auth","etaMin":2,"status":"completed"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Root causes linked to incidents
INSERT INTO root_causes (id, incident_id, title, description, confidence, ranked_causes, impact_analysis) VALUES
  ('rc-001', 'inc-201', 'DB Connection Pool Exhaustion', 'Unreleased transactions after migration script change', 92.5,
   '[{"rank":1,"cause":"Migration script held connections","score":0.92},{"rank":2,"cause":"Traffic spike +25%","score":0.45}]'::jsonb,
   '{"affectedServices":3,"estimatedDowntimeMin":47,"revenueImpact":12500}'::jsonb),
  ('rc-002', 'inc-202', 'HTTP Client Connection Leak', 'Unclosed connections in payment-processor module', 78.0,
   '[{"rank":1,"cause":"Missing connection.close() in retry loop","score":0.78}]'::jsonb,
   '{"affectedServices":2,"estimatedDowntimeMin":22,"revenueImpact":4200}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Telemetry metrics (Prometheus-style samples)
INSERT INTO metrics (service_id, metric_name, value, timestamp) VALUES
  ('svc-auth', 'cpu_percent', 92, NOW() - INTERVAL '5 minutes'),
  ('svc-auth', 'memory_percent', 81, NOW() - INTERVAL '5 minutes'),
  ('svc-auth', 'error_rate', 3.2, NOW() - INTERVAL '5 minutes'),
  ('svc-auth', 'latency_p99_ms', 450, NOW() - INTERVAL '5 minutes'),
  ('svc-payment', 'cpu_percent', 67, NOW() - INTERVAL '5 minutes'),
  ('svc-payment', 'memory_percent', 74, NOW() - INTERVAL '5 minutes'),
  ('svc-gateway', 'cpu_percent', 45, NOW() - INTERVAL '5 minutes'),
  ('svc-gateway', 'throughput_rps', 1250, NOW() - INTERVAL '5 minutes'),
  ('svc-data', 'cpu_percent', 88, NOW() - INTERVAL '5 minutes'),
  ('svc-data', 'memory_percent', 91, NOW() - INTERVAL '5 minutes');

-- Logs
INSERT INTO logs (id, service_id, level, message, timestamp) VALUES
  ('log-001', 'svc-auth', 'error', 'FATAL: remaining connection slots reserved for non-replication superuser connections', NOW() - INTERVAL '45 minutes'),
  ('log-002', 'svc-auth', 'warn', 'Connection pool at 98/100 — approaching limit', NOW() - INTERVAL '46 minutes'),
  ('log-003', 'svc-payment', 'error', 'java.lang.OutOfMemoryError: Java heap space', NOW() - INTERVAL '20 minutes'),
  ('log-004', 'svc-gateway', 'info', 'Circuit breaker OPEN for auth-service upstream', NOW() - INTERVAL '44 minutes'),
  ('log-005', 'svc-data', 'warn', 'BigQuery slot contention detected — query queue depth: 47', NOW() - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;

-- DORA metrics per team
INSERT INTO dora_metrics (team_id, period_start, period_end, deployment_frequency, lead_time_hours, mttr_minutes, change_failure_rate, tier) VALUES
  ('team-1', '2026-05-01', '2026-05-31', 4.2, 11, 47, 5.0, 'Elite'),
  ('team-2', '2026-05-01', '2026-05-31', 2.8, 18, 52, 8.0, 'High'),
  ('team-3', '2026-05-01', '2026-05-31', 3.5, 14, 43, 6.5, 'High'),
  ('team-4', '2026-05-01', '2026-05-31', 1.2, 28, 78, 12.0, 'Medium'),
  ('team-5', '2026-05-01', '2026-05-31', 0.8, 42, 95, 18.0, 'Low');

-- SLO metrics
INSERT INTO slo_metrics (id, service_id, slo_id, name, target_percent, current_percent, error_budget_percent, status) VALUES
  ('slo-rec-1', 'svc-gateway', 'slo-api-latency', 'API Latency < 200ms', 99.5, 99.78, 56, 'healthy'),
  ('slo-rec-2', 'svc-auth', 'slo-success-rate', 'API Success Rate > 99.9%', 99.9, 99.92, 20, 'healthy'),
  ('slo-rec-3', 'svc-order', 'slo-uptime', 'Core Platform Uptime > 99.99%', 99.99, 99.95, -45, 'breached')
ON CONFLICT (id) DO NOTHING;

-- Cost metrics
INSERT INTO cost_metrics (id, service_name, provider, current_cost, previous_cost, forecast_cost, anomaly_detected) VALUES
  ('cost-1', 'auth-service', 'aws', 1250, 1200, 1300, false),
  ('cost-2', 'payment-service', 'aws', 3400, 3100, 4200, true),
  ('cost-3', 'order-service', 'gcp', 2800, 2900, 2750, false),
  ('cost-4', 'data-pipeline', 'gcp', 8900, 6500, 11200, true)
ON CONFLICT (id) DO NOTHING;

-- Vulnerabilities
INSERT INTO vulnerabilities (id, service_id, cve_id, severity, package_name, installed_version, fixed_version, risk_score) VALUES
  ('vuln-1', 'svc-auth', 'CVE-2024-38819', 'critical', 'spring-web', '5.3.20', '5.3.32', 95),
  ('vuln-2', 'svc-payment', 'CVE-2024-21703', 'high', 'log4j-core', '2.17.0', '2.17.2', 78),
  ('vuln-3', 'svc-gateway', 'CVE-2023-44487', 'medium', 'nginx', '1.24.0', '1.25.2', 45)
ON CONFLICT (id) DO NOTHING;

-- Sample predictions
INSERT INTO predictions (id, deployment_id, risk_score, failure_probability, confidence_score, why, shap_values) VALUES
  ('pred-001', 'dep-101', 87, 87, 94.2, ARRAY['Test coverage drop', 'Failed builds spike'],
   '[{"feature":"Test Coverage Variance","impact":34.8},{"feature":"CI Build Failure Rate","impact":30.5}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Sample alerts
INSERT INTO alerts (id, channel, severity, message, status, triggered_by, entity_type, entity_id) VALUES
  ('alert-001', 'slack', 'P0', 'Outage probability 81% — auth-service connection pool critical', 'delivered', 'prediction_engine', 'incident', 'inc-201'),
  ('alert-002', 'pagerduty', 'P0', 'P0 incident: PostgreSQL connection pool exhaustion', 'delivered', 'incident_engine', 'incident', 'inc-201'),
  ('alert-003', 'teams', 'P1', 'Memory leak detected on payment-service — investigation started', 'delivered', 'anomaly_detector', 'incident', 'inc-202')
ON CONFLICT (id) DO NOTHING;
