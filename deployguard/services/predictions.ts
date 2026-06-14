export interface PredictionResult {
  riskScore: number;
  failureProbability: number;
  confidenceScore?: number;
  why: string[];
  shapValues: { feature: string; impact: number }[];
  model?: string;
}

export interface PredictParams {
  deploymentId?: string;
  testCoverage?: number;
  failedBuilds?: number;
  dependencyChanges?: number;
  commitVelocity?: number;
  buildDuration?: number;
  cpuPercent?: number;
  memoryPercent?: number;
  errorRate?: number;
}

export async function getPrediction(params: PredictParams): Promise<PredictionResult> {
  const response = await fetch("/api/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!response.ok) throw new Error("Failed to get prediction");
  return response.json();
}

export interface SimulationParams {
  experimentType: string;
  targetService: string;
  durationSeconds: number;
  intensity: number;
}

export interface SimulationResult {
  success: boolean;
  blastRadius: string[];
  metricsTimeline: { time: string; latency: number; errorRate: number }[];
  recoverySteps: string[];
}

export async function runSimulation(params: SimulationParams): Promise<SimulationResult> {
  const response = await fetch("/api/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!response.ok) throw new Error("Failed to run simulation");
  return response.json();
}
