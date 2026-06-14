import { supabase } from "@/lib/supabase";
import { LogEntry } from "@/types/platform";
import { mockLogs } from "@/lib/mockExtended";

function mapLog(row: Record<string, unknown>): LogEntry {
  return {
    id: String(row.id),
    serviceId: row.service_id ? String(row.service_id) : null,
    level: row.level as LogEntry["level"],
    message: String(row.message),
    metadata: (row.metadata as Record<string, unknown>) || {},
    timestamp: String(row.timestamp),
  };
}

export async function getLogs(limit = 50): Promise<LogEntry[]> {
  const { data, error } = await supabase
    .from("logs")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(limit);
  if (error || !data?.length) return mockLogs;
  return (data as Record<string, unknown>[]).map(mapLog);
}

export async function getLogAnomalies(): Promise<{ id: string; type: string; msg: string; severity: string; score: number; time: string }[]> {
  const logs = await getLogs(20);
  return logs
    .filter((l) => l.level === "error" || l.level === "warn")
    .map((l, i) => ({
      id: `ANO-${String(i + 1).padStart(3, "0")}`,
      type: l.level,
      msg: l.message,
      severity: l.level === "error" ? "critical" : "high",
      score: l.level === "error" ? 90 + (i % 8) : 70 + (i % 15),
      time: "recent",
    }));
}
