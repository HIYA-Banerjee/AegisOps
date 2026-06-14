import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIncidents, createIncident, resolveIncident } from "@/services/incidents";

export function useIncidents() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["incidents"],
    queryFn: getIncidents,
    refetchInterval: 10000,
  });

  const createMutation = useMutation({
    mutationFn: createIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });

  const resolveMutation = useMutation({
    mutationFn: resolveIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });

  return {
    incidents: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createIncident: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    resolveIncident: resolveMutation.mutateAsync,
    isResolving: resolveMutation.isPending,
  };
}
