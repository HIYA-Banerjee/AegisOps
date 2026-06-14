import { NextRequest, NextResponse } from "next/server";
import { getLatestMetrics } from "@/services/observability";

export async function GET(req: NextRequest) {
  const serviceId = req.nextUrl.searchParams.get("serviceId") || "svc-auth";
  const snapshot = await getLatestMetrics(serviceId);
  return NextResponse.json(snapshot);
}
