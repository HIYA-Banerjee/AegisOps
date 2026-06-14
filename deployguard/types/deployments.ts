export type DeploymentStatus = 'ok' | 'failed' | 'partial';
export type Environment = 'prod' | 'staging' | 'dev';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Deployment {
  id: string;
  version: string;
  env: Environment;
  status: DeploymentStatus;
  msg: string;
  timestamp: string;
  ago: string;
  commitHash: string;
  author: string;
  team: string;
  testCoverage: number;
  testCoverageDelta: number;
  failedBuilds: number;
  failedBuildsDelta: number;
  dependencyChanges: number;
  dependencyChangesDelta: number;
  commitVelocity: number;
  commitVelocityDelta: number;
  buildDuration: number;
  buildDurationDelta: number;
  riskScore: number;
  failureProbability: number;
  why: string[];
}
