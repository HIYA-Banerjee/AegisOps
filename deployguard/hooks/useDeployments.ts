import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDeployments, createDeployment } from "@/services/deployments";

export function useDeployments() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["deployments"],
    queryFn: getDeployments,
    refetchInterval: 30000,
  });

  const mutation = useMutation({
    mutationFn: createDeployment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deployments"] });
    },
  });

  return {
    deployments: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createDeployment: mutation.mutateAsync,
    isCreating: mutation.isPending,
  };
}
