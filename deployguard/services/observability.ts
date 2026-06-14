import { supabase } from "@/lib/supabase";
import { TelemetryMetric } from "@/types/platform";
import { mockTelemetryMetrics } from "@/lib/mockExtended";

export interface LiveMetricsSnapshot {
  cpu: number;
  memory: number;
  latency: number;
  errorRate: number;
  throughput: number;
  availability: number;
  dbConnections: number;
  diskIo: number;
  network: number;
  updatedAt: string;
}

const METRIC_MAP: Record<string, keyof Omit<LiveMetricsSnapshot, "updatedAt">> = {
  cpu_percent: "cpu",
  memory_percent: "memory",
  latency_p99_ms: "latency",
  error_rate: "errorRate",
  throughput_rps: "throughput",
  availability_percent: "availability",
  db_connections_percent: "dbConnections",
  disk_io_percent: "diskIo",
  network_percent: "network",
};

function buildSnapshot(rows: TelemetryMetric[]): LiveMetricsSnapshot {
  const snap: LiveMetricsSnapshot = {
    cpu: 45, memory: 58, latency: 124, errorRate: 0.3,
    throughput: 890, availability: 99.9, dbConnections: 72,
    diskIo: 43, network: 37, updatedAt: new Date().toISOString(),
  };

  for (const row of rows) {
    const key = METRIC_MAP[row.metricName];
    if (key) {
      if (key === "latency") {
        snap[key] = Math.min(100, row.value / 5);
      } else if (key === "errorRate") {
        snap[key] = row.value;
      } else {
        snap[key] = row.value;
      }
    }
  }
  return snap;
}

export async function getLatestMetrics(serviceId = "svc-auth"): Promise<LiveMetricsSnapshot> {
  const { data, error } = await supabase
    .from("metrics")
    .select("*")
    .eq("service_id", serviceId)
    .order("timestamp", { ascending: false })
    .limit(20);

  if (error || !data?.length) {
    const mockRows = mockTelemetryMetrics.filter((m) => m.serviceId === serviceId);
    return buildSnapshot(mockRows.length ? mockRows : mockTelemetryMetrics);
  }

  const rows: TelemetryMetric[] = (data as Record<string, unknown>[]).map((r) => ({
    serviceId: String(r.service_id),
    metricName: String(r.metric_name),
    value: Number(r.value),
    timestamp: String(r.timestamp),
  }));

  return buildSnapshot(rows);
}

export async function ingestMetrics(
  metrics: { serviceId: string; metricName: string; value: number }[]
): Promise<number> {
  const rows = metrics.map((m) => ({
    service_id: m.serviceId,
    metric_name: m.metricName,
    value: m.value,
    timestamp: new Date().toISOString(),
  }));

  const { data, error } = await supabase.from("metrics").insert(rows);
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data.length : metrics.length;
}
