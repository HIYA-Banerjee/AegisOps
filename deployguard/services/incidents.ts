import { supabase } from "@/lib/supabase";
import { Incident } from "@/types";

export async function getIncidents(): Promise<Incident[]> {
  const { data, error } = await supabase
    .from("incidents")
    .select("*")
    .order("startedAt", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as any) || [];
}

export async function createIncident(incident: Omit<Incident, "id" | "startedAt" | "resolvedAt" | "durationMin">): Promise<Incident> {
  const newIncident = {
    ...incident,
    id: `inc-${Date.now()}`,
    startedAt: new Date().toISOString(),
    resolvedAt: null,
    durationMin: 0,
  };
  const { data, error } = await supabase
    .from("incidents")
    .insert(newIncident);
  if (error) throw new Error(error.message);
  return (data as any)[0] as Incident;
}

export async function resolveIncident(id: string): Promise<Incident> {
  const resolvedAt = new Date().toISOString();
  const { data: fetchResult } = await supabase.from("incidents").select("*").eq("id", id);
  const incidentObj = fetchResult && fetchResult.length > 0 ? fetchResult[0] : null;
  const startedAt = incidentObj ? new Date(incidentObj.startedAt) : new Date();
  const durationMin = Math.round((new Date(resolvedAt).getTime() - startedAt.getTime()) / 60000);

  const { data, error } = await supabase
    .from("incidents")
    .update({ status: "resolved" as const, resolvedAt, durationMin, id });
  if (error) throw new Error(error.message);
  return (data as any)[0] as Incident;
}
