-- AegisOps DeployGuard AI — Database Seed Script

-- Seed teams
INSERT INTO teams (id, name, avatar, stability_score, success_rate, risk_ranking, commits, deployments, failures, prevented_failures, lead_time_days)
VALUES 
  ('team-1', 'Core Platform', 'CP', 94, 98.4, 5, 412, 84, 1, 14, 1.2),
  ('team-2', 'Auth & Security', 'AS', 89, 95.8, 4, 285, 52, 2, 8, 1.8),
  ('team-3', 'API Gateway', 'AG', 87, 94.2, 3, 340, 68, 4, 9, 2.1),
  ('team-4', 'Billing & Subscriptions', 'BS', 78, 91.5, 2, 195, 34, 3, 5, 3.5),
  ('team-5', 'Data Pipelines', 'DP', 65, 84.1, 1, 220, 45, 7, 3, 4.8)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  stability_score = EXCLUDED.stability_score,
  success_rate = EXCLUDED.success_rate;

-- Seed integrations
INSERT INTO integrations (id, name, category, status, logo_color, description, connected_at, webhook_url)
VALUES
  ('git-gh', 'GitHub Enterprise', 'vcs', 'connected', '#24292e', 'Automated PR reviews, commit risk analysis, and webhook events tracking.', '2026-01-15T08:00:00Z', 'https://api.aegisops.ai/webhooks/github/283fa8b'),
  ('git-gl', 'GitLab Self-Hosted', 'vcs', 'available', '#fc6d26', 'Sync merge requests and tag triggers with DeployGuard Risk Predictor.', NULL, NULL),
  ('cicd-jenkins', 'Jenkins Enterprise', 'cicd', 'connected', '#d3383c', 'Inject risk prediction gates directly into pipeline build steps.', '2026-02-10T12:30:00Z', 'https://api.aegisops.ai/webhooks/jenkins/948cc2a'),
  ('cloud-k8s', 'Kubernetes Cluster', 'cloud', 'connected', '#326ce5', 'Telemetry sync and autonomous pod remediation with Digital Twin synchronization.', '2026-01-20T10:15:00Z', 'https://api.aegisops.ai/webhooks/k8s/00a7b4f'),
  ('cloud-docker', 'Docker Registry', 'cloud', 'available', '#2496ed', 'Scan image hash, layers, and CVE definitions on target pushes.', NULL, NULL),
  ('chat-slack', 'Slack Core', 'chat', 'connected', '#4a154b', 'AI Agent interactive alerts, incident channel creation, and command execution.', '2026-01-15T09:00:00Z', NULL),
  ('chat-teams', 'MS Teams Enterprise', 'chat', 'connected', '#6264a7', 'Broadcast incident telemetry and runbook status logs directly into channels.', '2026-03-01T14:00:00Z', NULL),
  ('monitoring-datadog', 'Datadog Cloud', 'monitoring', 'available', '#632ca6', 'Correlate APM latency baselines with real-time risk predictions.', NULL, NULL),
  ('monitoring-prom', 'Prometheus Metric Server', 'monitoring', 'connected', '#e6522c', 'Real-time scraper for cluster memory, CPU, and connection pool bounds.', '2026-02-18T16:45:00Z', NULL),
  ('monitoring-grafana', 'Grafana Cloud', 'monitoring', 'available', '#f46a25', 'Embed DeployGuard risk gauges and predictions directly into existing dashboards.', NULL, NULL),
  ('itsm-pd', 'PagerDuty Core', 'itsm', 'connected', '#06ac38', 'Autonomous alert routing, P0 severity escalation, and on-call paging triggers.', '2026-01-22T11:00:00Z', NULL)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  connected_at = EXCLUDED.connected_at;
