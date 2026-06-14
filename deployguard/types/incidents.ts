export type IncidentSeverity = 'P0' | 'P1' | 'P2';
export type IncidentStatus = 'active' | 'resolved' | 'investigating';

export interface RunbookStep {
  step: number;
  title: string;
  description: string;
  etaMin: number;
  status: 'pending' | 'running' | 'completed';
}

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  service: string;
  cost: number;
  durationMin: number;
  startedAt: string;
  resolvedAt: string | null;
  rootCause: string;
  blastRadius: string[];
  affectedUsers: number;
  runbookSteps: RunbookStep[];
}
