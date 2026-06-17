import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deploymentId, testCoverage, failedBuilds, dependencyChanges, commitVelocity, buildDuration, cpuPercent, memoryPercent, errorRate } = body;

    const mlServiceUrl = process.env.PYTHON_ML_SERVICE_URL;
    if (!mlServiceUrl) {
      console.error("Missing PYTHON_ML_SERVICE_URL environment variable.");
      return NextResponse.json({ error: "ML Service URL is not configured. Real ML predictions are required." }, { status: 500 });
    }

    console.log(`Sending prediction request to Python ML service: ${mlServiceUrl}/predict`);
    console.log("Payload:", JSON.stringify(body));
    
    const response = await fetch(`${mlServiceUrl}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Python ML service returned error status ${response.status}: ${errorText}`);
      return NextResponse.json({ error: `ML Service returned error: ${response.status} - ${errorText}` }, { status: 502 });
    }

    const result = await response.json();
    console.log("Python ML service returned success response:", result);

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
    const message = e instanceof Error ? e.message : "Request failed";
    console.error("Prediction API route error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
