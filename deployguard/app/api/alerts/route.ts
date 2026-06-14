import { NextRequest, NextResponse } from "next/server";
import { sendAlert } from "@/services/alerts";
import { authorizeApi } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  const authResult = authorizeApi(req, "alerts:send");
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status });
  }

  try {
    const body = await req.json();
    const alert = await sendAlert({
      channel: body.channel || "slack",
      severity: body.severity || "warning",
      message: body.message || "AegisOps alert",
      triggeredBy: body.triggeredBy || "alert_engine",
      entityType: body.entityType,
      entityId: body.entityId,
    });
    return NextResponse.json({ success: true, alert });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Alert delivery failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { getAlerts } = await import("@/services/alerts");
  const alerts = await getAlerts();
  return NextResponse.json(alerts);
}
