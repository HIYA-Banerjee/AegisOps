import { NextRequest, NextResponse } from "next/server";
import { ingestMetrics } from "@/services/observability";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const metrics = body.metrics as { serviceId: string; metricName: string; value: number }[];

    if (!Array.isArray(metrics) || metrics.length === 0) {
      return NextResponse.json({ error: "metrics array required" }, { status: 400 });
    }

    const count = await ingestMetrics(metrics);
    return NextResponse.json({ success: true, ingested: count });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Ingest failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
