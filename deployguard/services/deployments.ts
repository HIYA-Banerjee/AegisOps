import { supabase } from "@/lib/supabase";
import { Deployment } from "@/types";

export async function getDeployments(): Promise<Deployment[]> {
  const { data, error } = await supabase
    .from("deployments")
    .select("*")
    .order("timestamp", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as any) || [];
}

export async function getDeploymentById(id: string): Promise<Deployment | null> {
  const { data, error } = await supabase
    .from("deployments")
    .select("*")
    .eq("id", id);
  if (error) throw new Error(error.message);
  return data && data.length > 0 ? (data[0] as any) : null;
}

export async function createDeployment(deployment: Omit<Deployment, "id" | "timestamp" | "ago">): Promise<Deployment> {
  const newDeployment = {
    ...deployment,
    id: `dep-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ago: "just now",
  };
  const { data, error } = await supabase
    .from("deployments")
    .insert(newDeployment);
  if (error) throw new Error(error.message);
  return (data as any)[0] as Deployment;
}
