import { useQuery } from "@tanstack/react-query";
import { getDORAMetrics, getSLOMetrics, getCostMetrics } from "@/services/metrics";
import { DORAMetrics, SLOMetrics, CostMetrics } from "@/types";

export function useDORAMetrics(teamId?: string) {
  return useQuery<DORAMetrics>({
    queryKey: ["metrics", "dora", teamId],
    queryFn: () => getDORAMetrics(teamId),
    refetchInterval: 60000,
  });
}

export function useSLOMetrics() {
  return useQuery<SLOMetrics[]>({
    queryKey: ["metrics", "slo"],
    queryFn: getSLOMetrics,
    refetchInterval: 30000,
  });
}

export function useCostMetrics() {
  return useQuery<CostMetrics[]>({
    queryKey: ["metrics", "cost"],
    queryFn: getCostMetrics,
    refetchInterval: 300000,
  });
}
