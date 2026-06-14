import { supabase } from "@/lib/supabase";
import { DORAMetrics, SLOMetrics, CostMetrics } from "@/types";
import { mockDORAMetrics, mockSLOMetrics, mockCostMetrics } from "@/lib/mockExtended";

function mapDORARow(row: Record<string, unknown>): DORAMetrics {
  return {
    deploymentFrequency: Number(row.deployment_frequency),
    leadTimeHours: Number(row.lead_time_hours),
    meanTimeToRestoreMinutes: Number(row.mttr_minutes),
    changeFailureRatePercent: Number(row.change_failure_rate),
    tier: row.tier as DORAMetrics["tier"],
  };
}

function mapSLORow(row: Record<string, unknown>): SLOMetrics {
  return {
    sloId: String(row.slo_id),
    name: String(row.name),
    targetPercent: Number(row.target_percent),
    currentPercent: Number(row.current_percent),
    errorBudgetPercent: Number(row.error_budget_percent),
    status: row.status as SLOMetrics["status"],
  };
}

function mapCostRow(row: Record<string, unknown>): CostMetrics {
  return {
    serviceName: String(row.service_name),
    provider: row.provider as CostMetrics["provider"],
    currentCost: Number(row.current_cost),
    previousCost: Number(row.previous_cost),
    forecastCost: Number(row.forecast_cost),
    anomalyDetected: Boolean(row.anomaly_detected),
  };
}

export async function getDORAMetrics(teamId?: string): Promise<DORAMetrics> {
  let query = supabase.from("dora_metrics").select("*").order("period_end", { ascending: false }).limit(1);
  if (teamId) {
    query = query.eq("team_id", teamId);
  }
  const { data, error } = await query;
  if (error || !data?.length) return mockDORAMetrics;
  return mapDORARow(data[0] as Record<string, unknown>);
}

export async function getSLOMetrics(): Promise<SLOMetrics[]> {
  const { data, error } = await supabase
    .from("slo_metrics")
    .select("*")
    .order("recorded_at", { ascending: false })
    .limit(20);
  if (error || !data?.length) return mockSLOMetrics;
  return (data as Record<string, unknown>[]).map(mapSLORow);
}

export async function getCostMetrics(): Promise<CostMetrics[]> {
  const { data, error } = await supabase
    .from("cost_metrics")
    .select("*")
    .order("recorded_at", { ascending: false })
    .limit(20);
  if (error || !data?.length) return mockCostMetrics;
  return (data as Record<string, unknown>[]).map(mapCostRow);
}
