import { supabase } from "@/lib/supabase";
import { Vulnerability } from "@/types/platform";
import { mockVulnerabilities } from "@/lib/mockExtended";

function mapVuln(row: Record<string, unknown>): Vulnerability {
  return {
    id: String(row.id),
    serviceId: String(row.service_id),
    cveId: String(row.cve_id),
    severity: row.severity as Vulnerability["severity"],
    packageName: String(row.package_name),
    installedVersion: row.installed_version ? String(row.installed_version) : null,
    fixedVersion: row.fixed_version ? String(row.fixed_version) : null,
    riskScore: Number(row.risk_score),
    scannedAt: String(row.scanned_at),
  };
}

export async function getVulnerabilities(): Promise<Vulnerability[]> {
  const { data, error } = await supabase.from("vulnerabilities").select("*").order("risk_score", { ascending: false });
  if (error || !data?.length) return mockVulnerabilities;
  return (data as Record<string, unknown>[]).map(mapVuln);
}
