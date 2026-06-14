"use client";

import AppShell from "@/components/AppShell";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useIncidents } from "@/hooks/useIncidents";
import { Incident } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { 
  AlertTriangle, Clock, Activity, ShieldCheck, Play, CheckCircle, Search, Loader2 
} from "lucide-react";

export default function IncidentsPage() {
  const { incidents: allIncidents, isLoading, resolveIncident, isResolving } = useIncidents();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<"ALL" | "P0" | "P1" | "P2">("ALL");

  const filteredIncidents = useMemo(() => {
    let result = allIncidents;
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        (inc) => inc.title.toLowerCase().includes(term) || inc.service.toLowerCase().includes(term)
      );
    }
    if (filterSeverity !== "ALL") {
      result = result.filter((inc) => inc.severity === filterSeverity);
    }
    return result;
  }, [allIncidents, search, filterSeverity]);

  const activeCount = allIncidents.filter((i) => i.status !== "resolved").length;
  const resolvedIncidents = allIncidents.filter((i) => i.status === "resolved");
  const mttrAvg = resolvedIncidents.length
    ? Math.round(resolvedIncidents.reduce((acc, curr) => acc + curr.durationMin, 0) / resolvedIncidents.length)
    : 0;
  const revenueLoss = allIncidents
    .filter((i) => i.status !== "resolved")
    .reduce((acc, curr) => acc + curr.cost, 0);

  const handleResolve = async (id: string) => {
    await resolveIncident(id);
    setSelectedIncident((prev) => (prev?.id === id ? { ...prev, status: "resolved" } : prev));
  };

  const displaySelected = selectedIncident ?? filteredIncidents[0] ?? null;

  return (
    <AppShell title="Incidents Management Center" subtitle="Track live site outages, execute recovery runbooks, and audit service blast radiuses">
      <div className="space-y-6">

        <div className="grid-metrics">
          <div className="card flex justify-between items-center">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-muted">Active Outages</span>
              <h3 className="text-2xl font-bold font-mono text-red-400 mt-1">{activeCount} Incidents</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="card flex justify-between items-center">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-muted">Mean Time to Restore (MTTR)</span>
              <h3 className="text-2xl font-bold font-mono text-cyan mt-1">{mttrAvg} minutes</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="card flex justify-between items-center">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-muted">Estimated Revenue Loss</span>
              <h3 className="text-2xl font-bold font-mono text-yellow-500 mt-1">{formatCurrency(revenueLoss)} active</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-yellow-500/10 text-yellow-500" style={{ color: "var(--accent-orange)" }}>
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="card flex justify-between items-center">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-muted">Autonomous Mitigation Rate</span>
              <h3 className="text-2xl font-bold font-mono text-green mt-1">94.2%</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-green-500/10 text-green">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card flex items-center justify-between py-3">
          <div className="flex items-center gap-3 w-1/2">
            <Search className="w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Filter incidents by title or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none"
              style={{ color: "var(--text-primary)" }}
            />
          </div>

          <div className="flex gap-2 text-xs">
            {(["ALL", "P0", "P1", "P2"] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${filterSeverity === sev ? "border-cyan text-cyan" : "border-slate-800 text-muted"}`}
                style={{ borderColor: filterSeverity === sev ? "var(--accent-cyan)" : "var(--border)" }}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="card flex items-center justify-center py-16 text-muted gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading incidents...</span>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
              <h3 className="text-sm font-semibold mb-4">All Incident Reports</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                      <th className="pb-3 font-semibold text-muted">Service</th>
                      <th className="pb-3 font-semibold text-muted">Incident Title</th>
                      <th className="pb-3 font-semibold text-muted">Severity</th>
                      <th className="pb-3 font-semibold text-muted">Status</th>
                      <th className="pb-3 font-semibold text-muted text-right">Age</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium" style={{ borderColor: "var(--border)" }}>
                    {filteredIncidents.map((inc) => (
                      <tr 
                        key={inc.id} 
                        onClick={() => setSelectedIncident(inc)}
                        className={`hover:bg-slate-800/5 transition-colors cursor-pointer ${displaySelected?.id === inc.id ? "bg-slate-800/10" : ""}`}
                      >
                        <td className="py-3.5 font-bold text-cyan">{inc.service}</td>
                        <td className="py-3.5 font-semibold text-secondary pr-4 line-clamp-1 max-w-[220px]">{inc.title}</td>
                        <td className="py-3.5">
                          <span className={`badge ${inc.severity === "P0" ? "badge-critical" : inc.severity === "P1" ? "badge-high" : "badge-medium"}`}>
                            {inc.severity}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className={`badge ${inc.status === "resolved" ? "badge-low" : "badge-high"}`}>
                            {inc.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-mono text-muted">
                          {inc.durationMin}m
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card flex flex-col justify-between">
              {displaySelected ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs uppercase font-bold tracking-wider text-muted font-mono">{displaySelected.id}</span>
                      <span className={`badge ${displaySelected.status === "resolved" ? "badge-low" : "badge-critical"}`}>
                        {displaySelected.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-primary mt-2">{displaySelected.title}</h4>
                    <p className="text-xs text-muted mt-2"><strong>Started:</strong> {new Date(displaySelected.startedAt).toLocaleString()}</p>
                  </div>

                  <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-secondary">
                    <strong className="text-red-400 block mb-1">RCA Diagnosis:</strong>
                    {displaySelected.rootCause}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted block mb-2">Service Blast Radius</span>
                    <div className="flex flex-wrap gap-2">
                      {displaySelected.blastRadius.map((b, idx) => (
                        <span key={idx} className="badge badge-medium" style={{ textTransform: "none" }}>{b}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted block mb-3">Remediation Runbook steps</span>
                    <div className="space-y-3">
                      {displaySelected.runbookSteps.map((step) => (
                        <div key={step.step} className="flex items-start gap-3 text-xs">
                          <div className="p-1 rounded bg-slate-800 mt-0.5 text-secondary">
                            {step.status === "completed" ? (
                              <CheckCircle className="w-3.5 h-3.5 text-green" />
                            ) : step.status === "running" ? (
                              <Activity className="w-3.5 h-3.5 text-cyan animate-pulse" />
                            ) : (
                              <Play className="w-3.5 h-3.5 text-muted" />
                            )}
                          </div>
                          <div>
                            <h5 className="font-semibold text-secondary">{step.title}</h5>
                            <p className="text-[11px] text-muted mt-0.5">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {displaySelected.status !== "resolved" && (
                    <button
                      onClick={() => handleResolve(displaySelected.id)}
                      disabled={isResolving}
                      className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all"
                      style={{
                        background: "linear-gradient(135deg, var(--accent-green), var(--accent-cyan))",
                        color: "#fff",
                        cursor: isResolving ? "not-allowed" : "pointer",
                        opacity: isResolving ? 0.7 : 1,
                      }}
                    >
                      {isResolving ? "Resolving..." : "Mark as Resolved"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-muted">
                  <AlertTriangle className="w-10 h-10 mb-2 stroke-1" />
                  <p className="text-xs">Select an incident from the table list to inspect runbooks.</p>
                </div>
              )}

              <p className="text-[10px] text-muted leading-relaxed mt-8 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                * Revenue impacts are compiled by integrating PagerDuty trigger durations with Stripe metrics logs.
              </p>
            </motion.div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
