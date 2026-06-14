import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { IncidentSchema } from "@/lib/validations";

export async function GET() {
  const { data, error } = await supabase
    .from("incidents")
    .select("*")
    .order("startedAt", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = IncidentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const newIncident = {
      ...result.data,
      id: `inc-${Date.now()}`,
      startedAt: new Date().toISOString(),
      resolvedAt: null,
      durationMin: 0,
      blastRadius: [`${result.data.service} (Primary degraded)`],
      runbookSteps: [
        { step: 1, title: "Audit metrics log streams", description: "Collect memory bounds and thread stack dumps", etaMin: 5, status: "completed" as const },
        { step: 2, title: "Isolate target resources", description: "Drain connections from target pod containers", etaMin: 10, status: "running" as const },
      ],
    };

    const { data, error } = await supabase
      .from("incidents")
      .insert(newIncident);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ? data[0] : newIncident, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Invalid payload" }, { status: 500 });
  }
}
