import { supabase } from "@/lib/supabase";
import { Integration } from "@/lib/mockData";

export async function getIntegrations(): Promise<Integration[]> {
  const { data, error } = await supabase.from("integrations").select("*");
  if (error) throw new Error(error.message);
  return (data as Integration[]) || [];
}
