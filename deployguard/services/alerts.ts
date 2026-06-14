import { supabase } from "@/lib/supabase";
import { Alert } from "@/types/platform";

export async function sendAlert(payload: {
  channel: Alert["channel"];
  severity: string;
  message: string;
  triggeredBy?: string;
  entityType?: string;
  entityId?: string;
}): Promise<Alert> {
  const record: {
    id: string;
    channel: Alert["channel"];
    severity: string;
    message: string;
    status: Alert["status"];
    triggered_by: string;
    entity_type: string | null;
    entity_id: string | null;
    metadata: Record<string, unknown>;
  } = {
    id: `alert-${Date.now()}`,
    channel: payload.channel,
    severity: payload.severity,
    message: payload.message,
    status: "pending" as const,
    triggered_by: payload.triggeredBy || "system",
    entity_type: payload.entityType || null,
    entity_id: payload.entityId || null,
    metadata: {},
  };

  const slackUrl = process.env.SLACK_WEBHOOK_URL;
  if (slackUrl && payload.channel === "slack") {
    try {
      await fetch(slackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `[${payload.severity}] ${payload.message}` }),
      });
      record.status = "delivered";
    } catch {
      record.status = "failed";
    }
  } else {
    record.status = "delivered";
  }

  const { data, error } = await supabase.from("alerts").insert(record);
  if (error) throw new Error(error.message);

  return {
    id: record.id,
    channel: record.channel,
    severity: record.severity,
    message: record.message,
    status: record.status,
    triggeredBy: record.triggered_by,
    entityType: record.entity_type,
    entityId: record.entity_id,
    metadata: {},
    createdAt: new Date().toISOString(),
  };
}

export async function getAlerts(limit = 20): Promise<Alert[]> {
  const { data, error } = await supabase.from("alerts").select("*").order("created_at", { ascending: false }).limit(limit);
  if (error || !data?.length) return [];
  return (data as Record<string, unknown>[]).map((r) => ({
    id: String(r.id),
    channel: r.channel as Alert["channel"],
    severity: String(r.severity),
    message: String(r.message),
    status: r.status as Alert["status"],
    triggeredBy: r.triggered_by ? String(r.triggered_by) : null,
    entityType: r.entity_type ? String(r.entity_type) : null,
    entityId: r.entity_id ? String(r.entity_id) : null,
    metadata: (r.metadata as Record<string, unknown>) || {},
    createdAt: String(r.created_at),
  }));
}
