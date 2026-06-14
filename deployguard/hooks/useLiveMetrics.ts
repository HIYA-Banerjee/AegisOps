import { useQuery } from "@tanstack/react-query";
import { getLatestMetrics, LiveMetricsSnapshot } from "@/services/observability";

async function fetchLiveMetrics(serviceId: string): Promise<LiveMetricsSnapshot> {
  const res = await fetch(`/api/metrics/live?serviceId=${serviceId}`);
  if (!res.ok) throw new Error("Failed to fetch live metrics");
  return res.json();
}

export function useLiveMetrics(serviceId = "svc-auth", refetchInterval = 10000) {
  return useQuery({
    queryKey: ["metrics", "live", serviceId],
    queryFn: () => fetchLiveMetrics(serviceId),
    refetchInterval,
  });
}
