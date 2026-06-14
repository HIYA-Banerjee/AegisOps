import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deploymentId, testCoverage, failedBuilds, dependencyChanges, commitVelocity, buildDuration, cpuPercent, memoryPercent, errorRate } = body;

    const mlServiceUrl = process.env.PYTHON_ML_SERVICE_URL;
    let result: Record<string, unknown>;

    if (mlServiceUrl) {
      try {
        const response = await fetch(`${mlServiceUrl}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (response.ok) {
          result = await response.json();
        } else {
          throw new Error("ML service error");
        }
      } catch {
        console.warn("Python ML Service unavailable, falling back to mock predictions");
        result = mockPredict(deploymentId, { testCoverage, failedBuilds, dependencyChanges, commitVelocity, buildDuration, cpuPercent, memoryPercent, errorRate });
      }
    } else {
      result = mockPredict(deploymentId, { testCoverage, failedBuilds, dependencyChanges, commitVelocity, buildDuration, cpuPercent, memoryPercent, errorRate });
    }

    if (deploymentId) {
      await supabase.from("predictions").insert({
        id: `pred-${Date.now()}`,
        deployment_id: deploymentId,
        risk_score: result.riskScore,
        failure_probability: result.failureProbability,
        confidence_score: result.confidenceScore ?? 0,
        why: result.why,
        shap_values: result.shapValues,
      });
    }

    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Invalid request body";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

function mockPredict(
  deploymentId?: string,
  inputs: Record<string, number | undefined> = {}
) {
  const seed = deploymentId ? parseInt(deploymentId.replace(/\D/g, "")) || 45 : 45;
  let score = (seed % 65) + 20;
  if (inputs.testCoverage !== undefined && inputs.testCoverage < 70) score += 15;
  if (inputs.failedBuilds !== undefined) score += inputs.failedBuilds * 5;
  if (inputs.cpuPercent !== undefined && inputs.cpuPercent > 85) score += 10;
  score = Math.min(Math.max(score, 5), 98);

  return {
    riskScore: score,
    failureProbability: score,
    confidenceScore: Math.min(99, 70 + (100 - score) * 0.25),
    why: [
      "Unusually high commit frequency spike",
      "Significant dependency version alterations",
      "Reduction in overall unit testing code coverage",
    ],
    shapValues: [
      { feature: "Test Coverage Variance", impact: score * 0.4 },
      { feature: "CI Build Failure Rate", impact: score * 0.35 },
      { feature: "Dependency Drift", impact: score * 0.15 },
      { feature: "Commit Velocity Spike", impact: score * 0.1 },
    ],
    model: "mock-ensemble",
  };
}
