import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const isConnected = await supabase.checkConnection();
  return NextResponse.json({
    status: isConnected ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    services: {
      database: isConnected ? "connected" : "disconnected",
      predictionEngine: "ready",
      remediationEngine: "ready",
    },
  });
}
