import { DORAMetrics, SLOMetrics, CostMetrics } from "@/types";
import { LogEntry, Vulnerability, TelemetryMetric } from "@/types/platform";

export const mockDORAMetrics: DORAMetrics = {
  deploymentFrequency: 4.2,
  leadTimeHours: 11,
  meanTimeToRestoreMinutes: 47,
  changeFailureRatePercent: 8,
  tier: "Elite",
};

export const mockSLOMetrics: SLOMetrics[] = [
  { sloId: "slo-api-latency", name: "API Latency < 200ms", targetPercent: 99.5, currentPercent: 99.78, errorBudgetPercent: 56, status: "healthy" },
  { sloId: "slo-success-rate", name: "API Success Rate > 99.9%", targetPercent: 99.9, currentPercent: 99.92, errorBudgetPercent: 20, status: "healthy" },
  { sloId: "slo-uptime", name: "Core Platform Uptime > 99.99%", targetPercent: 99.99, currentPercent: 99.95, errorBudgetPercent: -45, status: "breached" },
];

export const mockCostMetrics: CostMetrics[] = [
  { serviceName: "auth-service", provider: "aws", currentCost: 1250, previousCost: 1200, forecastCost: 1300, anomalyDetected: false },
  { serviceName: "payment-service", provider: "aws", currentCost: 3400, previousCost: 3100, forecastCost: 4200, anomalyDetected: true },
  { serviceName: "order-service", provider: "gcp", currentCost: 2800, previousCost: 2900, forecastCost: 2750, anomalyDetected: false },
  { serviceName: "data-pipeline", provider: "gcp", currentCost: 8900, previousCost: 6500, forecastCost: 11200, anomalyDetected: true },
];

export const mockLogs: LogEntry[] = [
  { id: "log-001", serviceId: "svc-auth", level: "error", message: "FATAL: remaining connection slots reserved for non-replication superuser connections", metadata: {}, timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: "log-002", serviceId: "svc-auth", level: "warn", message: "Connection pool at 98/100 — approaching limit", metadata: {}, timestamp: new Date(Date.now() - 46 * 60000).toISOString() },
  { id: "log-003", serviceId: "svc-payment", level: "error", message: "java.lang.OutOfMemoryError: Java heap space", metadata: {}, timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
  { id: "log-004", serviceId: "svc-gateway", level: "info", message: "Circuit breaker OPEN for auth-service upstream", metadata: {}, timestamp: new Date(Date.now() - 44 * 60000).toISOString() },
  { id: "log-005", serviceId: "svc-data", level: "warn", message: "BigQuery slot contention detected — query queue depth: 47", metadata: {}, timestamp: new Date(Date.now() - 60 * 60000).toISOString() },
];

export const mockVulnerabilities: Vulnerability[] = [
  { id: "vuln-1", serviceId: "svc-auth", cveId: "CVE-2024-38819", severity: "critical", packageName: "spring-web", installedVersion: "5.3.20", fixedVersion: "5.3.32", riskScore: 95, scannedAt: new Date().toISOString() },
  { id: "vuln-2", serviceId: "svc-payment", cveId: "CVE-2024-21703", severity: "high", packageName: "log4j-core", installedVersion: "2.17.0", fixedVersion: "2.17.2", riskScore: 78, scannedAt: new Date().toISOString() },
  { id: "vuln-3", serviceId: "svc-gateway", cveId: "CVE-2023-44487", severity: "medium", packageName: "nginx", installedVersion: "1.24.0", fixedVersion: "1.25.2", riskScore: 45, scannedAt: new Date().toISOString() },
];

export const mockTelemetryMetrics: TelemetryMetric[] = [
  { serviceId: "svc-auth", metricName: "cpu_percent", value: 92, timestamp: new Date().toISOString() },
  { serviceId: "svc-auth", metricName: "memory_percent", value: 81, timestamp: new Date().toISOString() },
  { serviceId: "svc-auth", metricName: "error_rate", value: 3.2, timestamp: new Date().toISOString() },
  { serviceId: "svc-auth", metricName: "latency_p99_ms", value: 450, timestamp: new Date().toISOString() },
  { serviceId: "svc-auth", metricName: "throughput_rps", value: 890, timestamp: new Date().toISOString() },
  { serviceId: "svc-auth", metricName: "availability_percent", value: 99.2, timestamp: new Date().toISOString() },
  { serviceId: "svc-payment", metricName: "cpu_percent", value: 67, timestamp: new Date().toISOString() },
  { serviceId: "svc-payment", metricName: "memory_percent", value: 74, timestamp: new Date().toISOString() },
  { serviceId: "svc-gateway", metricName: "cpu_percent", value: 45, timestamp: new Date().toISOString() },
];
