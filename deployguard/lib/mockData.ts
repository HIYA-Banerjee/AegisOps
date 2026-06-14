// AegisOps DeployGuard AI — Centralized Synthetic DevOps Datasets
// Provides 50+ deployments, 30+ incidents, infrastructure timelines, team rankings, and integration states.

export interface Deployment {
  id: string;
  version: string;
  env: 'prod' | 'staging' | 'dev';
  status: 'ok' | 'failed' | 'partial';
  msg: string;
  timestamp: string;
  ago: string;
  commitHash: string;
  author: string;
  team: string;
  testCoverage: number; // e.g. 78.5 (%)
  testCoverageDelta: number; // e.g. -34 (%)
  failedBuilds: number; // e.g. 2
  failedBuildsDelta: number; // e.g. +22 (%)
  dependencyChanges: number;
  dependencyChangesDelta: number;
  commitVelocity: number;
  commitVelocityDelta: number;
  buildDuration: number; // in sec
  buildDurationDelta: number;
  riskScore: number; // 0-100
  failureProbability: number; // 0-100
  why: string[];
}

export interface Incident {
  id: string;
  title: string;
  severity: 'P0' | 'P1' | 'P2';
  status: 'active' | 'resolved' | 'investigating';
  service: string;
  cost: number; // Estimated revenue loss
  durationMin: number;
  startedAt: string;
  resolvedAt: string | null;
  rootCause: string;
  blastRadius: string[];
  affectedUsers: number;
  runbookSteps: {
    step: number;
    title: string;
    description: string;
    etaMin: number;
    status: 'pending' | 'running' | 'completed';
  }[];
}

export interface TeamPerformance {
  name: string;
  avatar: string;
  stabilityScore: number; // 0-100
  successRate: number; // 0-100
  riskRanking: number; // 1-5
  commits: number;
  deployments: number;
  failures: number;
  preventedFailures: number;
  leadTimeDays: number;
}

export interface Integration {
  id: string;
  name: string;
  category: 'vcs' | 'cicd' | 'cloud' | 'chat' | 'monitoring' | 'itsm';
  status: 'connected' | 'available' | 'coming_soon';
  logoColor: string;
  description: string;
  webhookUrl?: string;
  connectedAt?: string;
}

// Generate 50+ Deployments
export const mockDeployments: Deployment[] = [
  {
    id: "dep-101",
    version: "v2.5.0",
    env: "prod",
    status: "failed",
    msg: "DB migration timeout · auth-svc down",
    timestamp: new Date(Date.now() - 14 * 60000).toISOString(),
    ago: "14 min ago",
    commitHash: "f1a8c9b",
    author: "Elena Rostova",
    team: "Core Platform",
    testCoverage: 62.4,
    testCoverageDelta: -34,
    failedBuilds: 4,
    failedBuildsDelta: 22,
    dependencyChanges: 18,
    dependencyChangesDelta: 18,
    commitVelocity: 45,
    commitVelocityDelta: 13,
    buildDuration: 620,
    buildDurationDelta: 8,
    riskScore: 87,
    failureProbability: 87,
    why: [
      "Test Coverage Drop: -34%",
      "Failed Builds: +22%",
      "Dependency Changes: +18%",
      "Commit Velocity Spike: +13%",
      "Build Duration Increase: +8%"
    ]
  },
  {
    id: "dep-102",
    version: "v2.4.9",
    env: "staging",
    status: "ok",
    msg: "All tests passed · No anomalies",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    ago: "2 hr ago",
    commitHash: "e4d7c8a",
    author: "Marcus Aurelius",
    team: "Auth & Security",
    testCoverage: 91.2,
    testCoverageDelta: 1.2,
    failedBuilds: 0,
    failedBuildsDelta: -10,
    dependencyChanges: 2,
    dependencyChangesDelta: -5,
    commitVelocity: 14,
    commitVelocityDelta: -4,
    buildDuration: 280,
    buildDurationDelta: -12,
    riskScore: 12,
    failureProbability: 12,
    why: ["Coverage remains high", "No failed CI/CD builds", "Minimal dependency change"]
  },
  {
    id: "dep-103",
    version: "v2.4.8",
    env: "prod",
    status: "partial",
    msg: "Memory spike · Auto-scaled +2 nodes",
    timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
    ago: "6 hr ago",
    commitHash: "d5c8b2f",
    author: "Jane Doe",
    team: "Billing & Subscriptions",
    testCoverage: 84.5,
    testCoverageDelta: -5.4,
    failedBuilds: 1,
    failedBuildsDelta: 15,
    dependencyChanges: 8,
    dependencyChangesDelta: 12,
    commitVelocity: 28,
    commitVelocityDelta: 24,
    buildDuration: 410,
    buildDurationDelta: 25,
    riskScore: 54,
    failureProbability: 54,
    why: [
      "Memory leak potential detected in telemetry package",
      "Dependency count increase +8 packages",
      "CI/CD staging failed once before succeeding"
    ]
  },
  {
    id: "dep-104",
    version: "v2.4.7",
    env: "prod",
    status: "ok",
    msg: "Clean deploy · 0 errors",
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    ago: "1 day ago",
    commitHash: "c3b7a1e",
    author: "Linus T.",
    team: "Core Platform",
    testCoverage: 89.6,
    testCoverageDelta: 0.5,
    failedBuilds: 0,
    failedBuildsDelta: 0,
    dependencyChanges: 0,
    dependencyChangesDelta: 0,
    commitVelocity: 8,
    commitVelocityDelta: -2,
    buildDuration: 305,
    buildDurationDelta: -5,
    riskScore: 8,
    failureProbability: 8,
    why: ["Solid code path verification", "Zero package modifications", "No CI alerts"]
  }
];

// Add 46 more mock deployments to reach 50+ records
const authors = ["Elena Rostova", "Marcus Aurelius", "Jane Doe", "Linus T.", "Satoshi N.", "Ada Lovelace", "Alan Turing", "Grace Hopper"];
const teams = ["Core Platform", "Auth & Security", "Billing & Subscriptions", "API gateway", "Data Pipelines"];
const statusList: ('ok' | 'failed' | 'partial')[] = ['ok', 'ok', 'ok', 'ok', 'partial', 'ok', 'failed', 'ok'];

for (let i = 5; i <= 55; i++) {
  const isFailed = i % 12 === 0;
  const isPartial = i % 7 === 0 && !isFailed;
  const status = isFailed ? 'failed' : (isPartial ? 'partial' : 'ok');
  
  const riskVal = isFailed 
    ? Math.floor(Math.random() * 25) + 70 
    : (isPartial ? Math.floor(Math.random() * 30) + 40 : Math.floor(Math.random() * 25));

  const buildDur = 250 + Math.floor(Math.random() * 400);

  mockDeployments.push({
    id: `dep-${100 + i}`,
    version: `v2.4.${50 - i}`,
    env: i % 5 === 0 ? 'staging' : (i % 9 === 0 ? 'dev' : 'prod'),
    status: status,
    msg: status === 'failed' 
      ? "Out of memory in node process · container crash" 
      : (status === 'partial' ? "Transient DB connection failures · self healed" : "Automatic checkouts completed successfully"),
    timestamp: new Date(Date.now() - i * 1.5 * 3600000).toISOString(),
    ago: `${Math.floor(i * 1.5)} hr ago`,
    commitHash: Math.random().toString(16).substring(2, 9),
    author: authors[i % authors.length],
    team: teams[i % teams.length],
    testCoverage: 75 + Math.floor(Math.random() * 20),
    testCoverageDelta: Math.floor(Math.random() * 10) - 5,
    failedBuilds: status === 'failed' ? 3 : (status === 'partial' ? 1 : 0),
    failedBuildsDelta: Math.floor(Math.random() * 15) - 5,
    dependencyChanges: Math.floor(Math.random() * 10),
    dependencyChangesDelta: Math.floor(Math.random() * 15) - 5,
    commitVelocity: 10 + Math.floor(Math.random() * 30),
    commitVelocityDelta: Math.floor(Math.random() * 20) - 10,
    buildDuration: buildDur,
    buildDurationDelta: Math.floor(Math.random() * 30) - 15,
    riskScore: riskVal,
    failureProbability: riskVal,
    why: status === 'failed' 
      ? ["High dependency drift", "Reduced coverage in telemetry", "Severe memory leak potential"] 
      : ["Normal parameter bounds", "CI pipeline successfully verified", "Coverage baseline healthy"]
  });
}

// Generate 30+ Incident Logs
export const mockIncidents: Incident[] = [
  {
    id: "inc-301",
    title: "Database connection spike & auth microservice timeout",
    severity: "P0",
    status: "active",
    service: "auth-service",
    cost: 8400,
    durationMin: 14,
    startedAt: new Date(Date.now() - 14 * 60000).toISOString(),
    resolvedAt: null,
    rootCause: "Unindexed query in user session validator leading to connection pool exhaustion",
    blastRadius: ["auth-service (100% fail)", "gateway-service (30% lat)", "payment-service (dependent)"],
    affectedUsers: 14200,
    runbookSteps: [
      { step: 1, title: "Redirect auth traffic", description: "Route 30% of incoming auth traffic to backup node-pool-B", etaMin: 2, status: "completed" },
      { step: 2, title: "Scale replica set", description: "Spin up +3 auth-service replicas to cushion resource bounds", etaMin: 3, status: "completed" },
      { step: 3, title: "Apply database hot-patch index", description: "Inject missing index on `users.last_session_token` via migration console", etaMin: 8, status: "running" },
      { step: 4, title: "Flush Redis session cache", description: "Clear invalid tokens to prevent cache stampede upon recovery", etaMin: 5, status: "pending" }
    ]
  },
  {
    id: "inc-302",
    title: "Memory leak & auto-scaling instability",
    severity: "P1",
    status: "investigating",
    service: "billing-service",
    cost: 3500,
    durationMin: 45,
    startedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    resolvedAt: null,
    rootCause: "Unclosed file handles in webhook telemetry logger causing pod failures",
    blastRadius: ["billing-service (Memory usage 98%)", "notification-service (delayed)"],
    affectedUsers: 4500,
    runbookSteps: [
      { step: 1, title: "Identify leaking pods", description: "Filter container list by memory derivative > 5MB/s", etaMin: 5, status: "completed" },
      { step: 2, title: "Perform progressive pod restart", description: "Kill pods one-by-one to release OS handles", etaMin: 10, status: "running" },
      { step: 3, title: "Deploy telemetry code rollback", description: "Rollback billing module to v2.4.6 stable build", etaMin: 15, status: "pending" }
    ]
  },
  {
    id: "inc-303",
    title: "Gateway latency spike and connection drops",
    severity: "P1",
    status: "resolved",
    service: "api-gateway",
    cost: 12000,
    durationMin: 22,
    startedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    resolvedAt: new Date(Date.now() - (4 * 3600000 - 22 * 60000)).toISOString(),
    rootCause: "Improper Nginx keepalive configuration during high socket utilization",
    blastRadius: ["api-gateway (Latency +450ms)", "All public APIs (intermittent drops)"],
    affectedUsers: 34000,
    runbookSteps: [
      { step: 1, title: "Apply socket limits tweak", description: "Increase max open files limit to 65536 in config", etaMin: 5, status: "completed" },
      { step: 2, title: "Reload gateway config", description: "Perform zero-downtime Nginx reload", etaMin: 2, status: "completed" }
    ]
  }
];

// Populate 27 more mock incidents to reach 30+
const services = ["auth-service", "billing-service", "api-gateway", "payment-service", "data-ingester", "notification-svc", "recommendation-engine"];
const causes = [
  "Stray thread loop in telemetry exporter",
  "Incorrect DNS mapping during cluster upgrade",
  "S3 rate-limiting threshold exceeded in raw uploads",
  "Third-party webhook timeout without retry boundary",
  "Out-of-disk condition on log rotation partition",
  "Deadlock on SQL table updates during concurrent batch runs"
];

for (let i = 4; i <= 32; i++) {
  const activeState = i === 10 ? 'investigating' : 'resolved';
  const hoursAgo = i * 6;
  const dur = 10 + Math.floor(Math.random() * 110);
  const costEst = dur * (Math.floor(Math.random() * 150) + 50);
  
  mockIncidents.push({
    id: `inc-${300 + i}`,
    title: `Simulated anomaly in ${services[i % services.length]}`,
    severity: i % 8 === 0 ? 'P0' : (i % 3 === 0 ? 'P1' : 'P2'),
    status: activeState,
    service: services[i % services.length],
    cost: costEst,
    durationMin: dur,
    startedAt: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
    resolvedAt: activeState === 'resolved' 
      ? new Date(Date.now() - (hoursAgo * 3600000 - dur * 60000)).toISOString() 
      : null,
    rootCause: causes[i % causes.length],
    blastRadius: [`${services[i % services.length]} (Degraded)`, `dependent services (${i % 3} affected)`],
    affectedUsers: Math.floor(Math.random() * 8000) + 500,
    runbookSteps: [
      { step: 1, title: "Audit metrics", description: "Collect heap and active connections snapshots", etaMin: 5, status: "completed" },
      { step: 2, title: "Drain target replica node", description: "Safely evict all requests from the suspected node", etaMin: 10, status: "completed" }
    ]
  });
}

// Generate Team Performance Data
export const mockTeams: TeamPerformance[] = [
  {
    name: "Core Platform",
    avatar: "CP",
    stabilityScore: 94,
    successRate: 98.4,
    riskRanking: 5, // 5 is most stable (least risk)
    commits: 412,
    deployments: 84,
    failures: 1,
    preventedFailures: 14,
    leadTimeDays: 1.2
  },
  {
    name: "Auth & Security",
    avatar: "AS",
    stabilityScore: 89,
    successRate: 95.8,
    riskRanking: 4,
    commits: 285,
    deployments: 52,
    failures: 2,
    preventedFailures: 8,
    leadTimeDays: 1.8
  },
  {
    name: "API Gateway",
    avatar: "AG",
    stabilityScore: 87,
    successRate: 94.2,
    riskRanking: 3,
    commits: 340,
    deployments: 68,
    failures: 4,
    preventedFailures: 9,
    leadTimeDays: 2.1
  },
  {
    name: "Billing & Subscriptions",
    avatar: "BS",
    stabilityScore: 78,
    successRate: 91.5,
    riskRanking: 2,
    commits: 195,
    deployments: 34,
    failures: 3,
    preventedFailures: 5,
    leadTimeDays: 3.5
  },
  {
    name: "Data Pipelines",
    avatar: "DP",
    stabilityScore: 65,
    successRate: 84.1,
    riskRanking: 1, // Highest Risk Repository
    commits: 220,
    deployments: 45,
    failures: 7,
    preventedFailures: 3,
    leadTimeDays: 4.8
  }
];

// Generate Enterprise Integration List
export const mockIntegrations: Integration[] = [
  { id: "git-gh", name: "GitHub Enterprise", category: "vcs", status: "connected", logoColor: "#24292e", description: "Automated PR reviews, commit risk analysis, and webhook events tracking.", connectedAt: "2026-01-15T08:00:00Z", webhookUrl: "https://api.aegisops.ai/webhooks/github/283fa8b" },
  { id: "git-gl", name: "GitLab Self-Hosted", category: "vcs", status: "available", logoColor: "#fc6d26", description: "Sync merge requests and tag triggers with DeployGuard Risk Predictor." },
  { id: "cicd-jenkins", name: "Jenkins Enterprise", category: "cicd", status: "connected", logoColor: "#d3383c", description: "Inject risk prediction gates directly into pipeline build steps.", connectedAt: "2026-02-10T12:30:00Z", webhookUrl: "https://api.aegisops.ai/webhooks/jenkins/948cc2a" },
  { id: "cloud-k8s", name: "Kubernetes Cluster", category: "cloud", status: "connected", logoColor: "#326ce5", description: "Telemetry sync and autonomous pod remediation with Digital Twin synchronization.", connectedAt: "2026-01-20T10:15:00Z", webhookUrl: "https://api.aegisops.ai/webhooks/k8s/00a7b4f" },
  { id: "cloud-docker", name: "Docker Registry", category: "cloud", status: "available", logoColor: "#2496ed", description: "Scan image hash, layers, and CVE definitions on target pushes." },
  { id: "chat-slack", name: "Slack Core", category: "chat", status: "connected", logoColor: "#4a154b", description: "AI Agent interactive alerts, incident channel creation, and command execution.", connectedAt: "2026-01-15T09:00:00Z" },
  { id: "chat-teams", name: "MS Teams Enterprise", category: "chat", status: "connected", logoColor: "#6264a7", description: "Broadcast incident telemetry and runbook status logs directly into channels.", connectedAt: "2026-03-01T14:00:00Z" },
  { id: "monitoring-datadog", name: "Datadog Cloud", category: "monitoring", status: "available", logoColor: "#632ca6", description: "Correlate APM latency baselines with real-time risk predictions." },
  { id: "monitoring-prom", name: "Prometheus Metric Server", category: "monitoring", status: "connected", logoColor: "#e6522c", description: "Real-time scraper for cluster memory, CPU, and connection pool bounds.", connectedAt: "2026-02-18T16:45:00Z" },
  { id: "monitoring-grafana", name: "Grafana Cloud", category: "monitoring", status: "available", logoColor: "#f46a25", description: "Embed DeployGuard risk gauges and predictions directly into existing dashboards." },
  { id: "itsm-pd", name: "PagerDuty Core", category: "itsm", status: "connected", logoColor: "#06ac38", description: "Autonomous alert routing, P0 severity escalation, and on-call paging triggers.", connectedAt: "2026-01-22T11:00:00Z" },
  { id: "itsm-jira", name: "Jira Service Desk", category: "itsm", status: "coming_soon", logoColor: "#0052cc", description: "Auto-create incident tracker tickets with full root-cause runbooks and SHAP context." }
];

// Integration Logs
export const mockWebhookEvents = [
  { time: "21:46:12", integration: "GitHub", event: "push", msg: "Commit by Elena R. on master - v2.5.0", status: "success" },
  { time: "21:46:25", integration: "Jenkins", event: "build_start", msg: "Pipeline #142 triggered for v2.5.0", status: "success" },
  { time: "21:47:48", integration: "Jenkins", event: "build_fail", msg: "Staging deployment test suite failed (4 errors)", status: "warn" },
  { time: "21:48:02", integration: "Slack", event: "notify", msg: "Incident alert channel #inc-auth-service-timeout created", status: "success" },
  { time: "21:48:15", integration: "PagerDuty", event: "trigger", msg: "P0 page sent to Elena R. (Primary On-Call)", status: "success" }
];
