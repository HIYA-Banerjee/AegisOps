import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { experimentType, targetService, durationSeconds, intensity } = await req.json();

    const simulationResult = {
      success: true,
      blastRadius: [
        `${targetService} (Direct degradation)`,
        ...(intensity > 5 ? ["gateway-service (30% latency increase)", "billing-service (20% errors)"] : []),
      ],
      metricsTimeline: Array.from({ length: 6 }, (_, i) => ({
        time: `${i * 10}s`,
        latency: Math.round(50 + (i * intensity * 15) * (i < 3 ? 1 : 0.4)),
        errorRate: parseFloat((i * intensity * 0.5 * (i < 3 ? 1 : 0.2)).toFixed(2)),
      })),
      recoverySteps: [
        "Enable load balancing circuit-breakers",
        "Scale service replica instances to 3x",
        "Flush cached database session queries",
      ],
    };

    return NextResponse.json(simulationResult);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Invalid request body" }, { status: 400 });
  }
}
