import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { experimentType, targetService, durationSeconds, intensity } = await req.json();

    const mlServiceUrl = process.env.PYTHON_ML_SERVICE_URL;
    if (!mlServiceUrl) {
      console.error("Missing PYTHON_ML_SERVICE_URL environment variable.");
      return NextResponse.json({ error: "ML Service URL is not configured. Real ML simulations are required." }, { status: 500 });
    }

    console.log(`Sending simulation request to Python ML service: ${mlServiceUrl}/simulate`);
    const response = await fetch(`${mlServiceUrl}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experimentType, targetService, intensity }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Python ML simulation returned error status ${response.status}: ${errorText}`);
      return NextResponse.json({ error: `ML Service simulation returned error: ${response.status} - ${errorText}` }, { status: 502 });
    }

    const mlResult = await response.json();
    console.log("Python ML simulation result:", mlResult);

    const failureRisk = mlResult.failureRisk;
    const predictedLatency = mlResult.predictedLatencyMs;

    const simulationResult = {
      success: true,
      blastRadius: mlResult.blastRadius,
      metricsTimeline: Array.from({ length: 6 }, (_, i) => ({
        time: `${i * 10}s`,
        latency: Math.round(50 + (i * intensity * (failureRisk / 5)) * (i < 3 ? 1 : 0.4)),
        errorRate: parseFloat((i * intensity * 0.5 * (i < 3 ? 1 : 0.2) * (failureRisk / 40)).toFixed(2)),
      })),
      recoverySteps: [
        "Enable load balancing circuit-breakers",
        "Scale service replica instances to 3x",
        "Flush cached database session queries",
      ],
      failureRisk,
      predictedLatency,
      predictedMttrMin: mlResult.predictedMttrMin,
      cpuIncrease: mlResult.cpuIncrease,
      memIncrease: mlResult.memIncrease,
      why: mlResult.why,
      warnings: mlResult.warnings,
    };

    return NextResponse.json(simulationResult);
  } catch (e: any) {
    const message = e instanceof Error ? e.message : "Request failed";
    console.error("Simulation API route error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
