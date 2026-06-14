import { useMutation, useQuery } from "@tanstack/react-query";
import { getPrediction, runSimulation, SimulationParams, PredictParams } from "@/services/predictions";

export function usePrediction(deploymentId?: string, params?: Omit<PredictParams, "deploymentId">) {
  return useQuery({
    queryKey: ["prediction", deploymentId, params],
    queryFn: () => getPrediction({ deploymentId, ...params }),
    enabled: !!deploymentId,
  });
}

export function usePredictMutation() {
  return useMutation({
    mutationFn: (params: PredictParams) => getPrediction(params),
  });
}

export function useSimulation() {
  const mutation = useMutation({
    mutationFn: (params: SimulationParams) => runSimulation(params),
  });

  return {
    runSimulation: mutation.mutateAsync,
    result: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
