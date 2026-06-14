import { NextResponse } from "next/server";
import { ingestMetrics } from "@/services/observability";

/** Pull latest Prometheus instant queries and ingest into metrics table. */
export async function GET() {
  const prometheusUrl = process.env.PROMETHEUS_URL;
  if (!prometheusUrl) {
    return NextResponse.json({ error: "PROMETHEUS_URL not configured" }, { status: 503 });
  }

  const queries = [
    { serviceId: "svc-auth", metricName: "cpu_percent", query: '100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)' },
    { serviceId: "svc-auth", metricName: "memory_percent", query: '(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100' },
    { serviceId: "svc-auth", metricName: "error_rate", query: 'sum(rate(http_requests_total{status=~"5.."}[5m]))' },
  ];

  const ingested: { serviceId: string; metricName: string; value: number }[] = [];

  for (const q of queries) {
    try {
      const url = `${prometheusUrl}/api/v1/query?query=${encodeURIComponent(q.query)}`;
      const res = await fetch(url, { next: { revalidate: 0 } });
      if (!res.ok) continue;
      const json = await res.json();
      const value = parseFloat(json?.data?.result?.[0]?.value?.[1] ?? "0");
      if (!Number.isNaN(value)) {
        ingested.push({ serviceId: q.serviceId, metricName: q.metricName, value: Math.round(value * 100) / 100 });
      }
    } catch {
      // skip failed query
    }
  }

  if (ingested.length) {
    await ingestMetrics(ingested);
  }

  return NextResponse.json({ success: true, ingested: ingested.length, metrics: ingested });
}
