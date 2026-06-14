export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export interface LogEntry {
  id: string;
  serviceId: string | null;
  level: LogLevel;
  message: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export interface RootCause {
  id: string;
  incidentId: string;
  title: string;
  description: string | null;
  confidence: number;
  rankedCauses: { rank: number; cause: string; score: number }[];
  impactAnalysis: Record<string, unknown>;
  dependencyTrace: string[];
  createdAt: string;
}

export interface Alert {
  id: string;
  channel: 'email' | 'slack' | 'teams' | 'pagerduty';
  severity: string;
  message: string;
  status: 'pending' | 'delivered' | 'failed';
  triggeredBy: string | null;
  entityType: string | null;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface Vulnerability {
  id: string;
  serviceId: string;
  cveId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  packageName: string;
  installedVersion: string | null;
  fixedVersion: string | null;
  riskScore: number;
  scannedAt: string;
}

export interface Simulation {
  id: string;
  simulationType: string;
  targetService: string;
  parameters: Record<string, unknown>;
  results: Record<string, unknown>;
  riskScore: number | null;
  failureProbability: number | null;
  createdBy: string | null;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown>;
  ipAddress: string | null;
  createdAt: string;
}

export interface TelemetryMetric {
  id?: number;
  serviceId: string;
  metricName: string;
  value: number;
  timestamp: string;
}
