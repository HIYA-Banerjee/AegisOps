export type ServiceType = 'database' | 'service' | 'gateway';
export type ServiceHealthStatus = 'healthy' | 'warning' | 'critical' | 'degraded';

export interface ServiceImpact {
  servicesAffected: number;
  sessionsBlocked: number;
  revenueLossHr: number;
}

export interface ServiceNode {
  id: string;
  name: string;
  type: ServiceType;
  status: ServiceHealthStatus;
  cpu: number;
  mem: number;
  latency: number;
  errors: number;
  connections: number;
  version: string;
  impactIfFailed: ServiceImpact;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  ownerTeam: string;
  repository: string;
  createdAt: string;
}

export interface DependencyEdge {
  id: string;
  source: string;
  target: string;
  type: 'sync' | 'async';
  latency: number;
  trafficRate: number;
}

export interface ServiceHealth {
  serviceId: string;
  status: ServiceHealthStatus;
  score: number;
  uptimePercent: number;
  activeIncidents: number;
}
