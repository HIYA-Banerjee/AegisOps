export interface MetricPoint {
  timestamp: string;
  value: number;
}

export interface ServiceMetrics {
  serviceId: string;
  cpu: MetricPoint[];
  memory: MetricPoint[];
  latency: MetricPoint[];
  requestRate: MetricPoint[];
  errorRate: MetricPoint[];
}

export interface DORAMetrics {
  deploymentFrequency: number;
  leadTimeHours: number;
  meanTimeToRestoreMinutes: number;
  changeFailureRatePercent: number;
  tier: 'Elite' | 'High' | 'Medium' | 'Low';
}

export interface SLOMetrics {
  sloId: string;
  name: string;
  targetPercent: number;
  currentPercent: number;
  errorBudgetPercent: number;
  status: 'healthy' | 'warning' | 'breached';
}

export interface CostMetrics {
  serviceName: string;
  provider: 'aws' | 'azure' | 'gcp' | 'digitalocean';
  currentCost: number;
  previousCost: number;
  forecastCost: number;
  anomalyDetected: boolean;
}
