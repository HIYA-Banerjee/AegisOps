import { useQuery } from "@tanstack/react-query";
import { getIntegrations } from "@/services/integrations";

export function useIntegrations() {
  const query = useQuery({
    queryKey: ["integrations"],
    queryFn: getIntegrations,
    refetchInterval: 60000,
  });

  return {
    integrations: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
