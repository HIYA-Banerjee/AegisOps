import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DeploymentSchema } from "@/lib/validations";

export async function GET() {
  const { data, error } = await supabase
    .from("deployments")
    .select("*")
    .order("timestamp", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = DeploymentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    // Calculate initial risk score
    let calculatedScore = 10;
    if (result.data.testCoverage < 80) calculatedScore += (80 - result.data.testCoverage) * 1.5;
    if (result.data.testCoverage < 50) calculatedScore += 20;
    calculatedScore += result.data.failedBuilds * 15;
    calculatedScore += result.data.dependencyChanges * 3;
    if (result.data.commitVelocity > 30) calculatedScore += (result.data.commitVelocity - 30) * 0.5;
    if (result.data.buildDuration > 400) calculatedScore += (result.data.buildDuration - 400) * 0.1;

    const riskScore = Math.min(Math.max(Math.round(calculatedScore), 0), 100);

    let why: string[] = [];
    if (riskScore > 70) {
      why = ["High deployment build failures", "Substandard test suite coverage bounds"];
    } else if (riskScore > 35) {
      why = ["Moderate dependency variations detected"];
    } else {
      why = ["All core indicators safely within tolerance margins"];
    }

    const newDeployment = {
      ...result.data,
      id: `dep-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ago: "just now",
      riskScore,
      failureProbability: riskScore,
      why,
    };

    const { data, error } = await supabase
      .from("deployments")
      .insert(newDeployment);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ? data[0] : newDeployment, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Invalid payload" }, { status: 500 });
  }
}
