"use client";

import AppShell from "@/components/AppShell";
import GaugeChart from "@/components/GaugeChart";
import RiskBadge from "@/components/RiskBadge";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Shield, Key, Package, AlertTriangle, Lock, ShieldCheck, FileCheck, RefreshCw, CheckCircle2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Vulnerability {
  id: string;
  type: string;
  desc: string;
  severity: "critical" | "high" | "medium" | "low";
  cvss: string;
  file: string;
  fix: string;
  isPatched?: boolean;
  patching?: boolean;
}

const initialVulns: Vulnerability[] = [
  { id: "SEC-001", type: "Exposed Secret",      desc: "AWS_SECRET_KEY found in .env.local committed to repo",      severity: "critical", cvss: "9.8", file: ".env.local:L4", fix: "Rotate key immediately, add to .gitignore" },
  { id: "SEC-002", type: "Vulnerable Package",  desc: "lodash@4.17.11 — Prototype Pollution (CVE-2020-8203)",     severity: "high",     cvss: "7.4", file: "package.json:L23", fix: "Upgrade dependency to lodash@4.17.21" },
  { id: "SEC-003", type: "API Key Leak",         desc: "Stripe test API key hardcoded in payment.service.ts",       severity: "high",     cvss: "7.0", file: "payment.service.ts:L87", fix: "Move key to environment variables" },
  { id: "SEC-004", type: "Misconfiguration",    desc: "Docker container running as root user (no --user flag)",    severity: "medium",   cvss: "5.5", file: "Dockerfile:L12", fix: "Add USER 1001 instruction in Dockerfile" },
  { id: "SEC-005", type: "Vulnerable Package",  desc: "express@4.17.1 — Path Traversal (CVE-2022-24999)",         severity: "medium",   cvss: "5.0", file: "package.json:L8",  fix: "Upgrade dependency to express@4.18.2" },
  { id: "SEC-006", type: "Misconfiguration",    desc: "CORS wildcard (*) enabled on production API gateway",       severity: "medium",   cvss: "4.8", file: "app.config.ts:L31", fix: "Restrict CORS parameters to staging/prod domains" },
  { id: "SEC-007", type: "Info Disclosure",     desc: "Stack traces exposed in production error responses",        severity: "low",      cvss: "3.1", file: "error.middleware.ts", fix: "Remove verbose logs in NODE_ENV=production" },
];

const sevColors: Record<string, string> = { critical: "var(--accent-red)", high: "var(--accent-orange)", medium: "var(--accent-cyan)", low: "var(--accent-green)" };

const typeIcon: Record<string, React.ReactNode> = {
  "Exposed Secret":    <Key size={14} />,
  "Vulnerable Package":<Package size={14} />,
  "API Key Leak":      <Lock size={14} />,
  "Misconfiguration":  <AlertTriangle size={14} />,
  "Info Disclosure":   <Shield size={14} />,
};

export default function SecurityPage() {
  const [vulns, setVulns] = useState<Vulnerability[]>(initialVulns);
  const [securityScore, setSecurityScore] = useState<number>(72);
  const [patchLogs, setPatchLogs] = useState<string[]>([]);

  const applyPatch = (id: string) => {
    // Set patching status
    setVulns(prev => prev.map(v => v.id === id ? { ...v, patching: true } : v));
    const target = vulns.find(v => v.id === id);
    if (!target) return;

    setPatchLogs(prev => [...prev, `[INIT] Auto-remediating ${target.id} (${target.type})...`]);

    setTimeout(() => {
      setVulns(prev => prev.map(v => v.id === id ? { ...v, patching: false, isPatched: true } : v));
      
      // Calculate score increment based on severity
      const scoreAdd = target.severity === "critical" ? 8 : (target.severity === "high" ? 5 : 3);
      setSecurityScore(score => Math.min(100, score + scoreAdd));
      setPatchLogs(prev => [...prev, `[SUCCESS] Remediated ${target.id}. Applied patch: "${target.fix}"`]);
    }, 1500);
  };

  // Re-calculate distribution based on remaining unpatched vulns
  const activeVulns = vulns.filter(v => !v.isPatched);
  const criticalCount = activeVulns.filter(v => v.severity === "critical").length;
  const highCount = activeVulns.filter(v => v.severity === "high").length;
  const mediumCount = activeVulns.filter(v => v.severity === "medium").length;
  const lowCount = activeVulns.filter(v => v.severity === "low").length;

  const pieData = [
    { name: "Critical", value: criticalCount, color: "#ef4444" },
    { name: "High",     value: highCount, color: "#fbbf24" },
    { name: "Medium",   value: mediumCount, color: "#00d4ff" },
    { name: "Low",      value: lowCount, color: "#00ff88" },
  ].filter(d => d.value > 0);

  return (
    <AppShell title="Security Risk & DevSecOps Center" subtitle="Autonomous software supply chain vulnerability detection, SBOM registry scans, and 1-click AI compliance patching">
      
      {/* Top statistics panel */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 16, marginBottom: 16, alignItems: "start" }}>
        {/* Security score */}
        <motion.div
          className="card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 36px" }}
        >
          <GaugeChart value={securityScore} size={130} strokeWidth={12} color={securityScore >= 90 ? "var(--accent-green)" : "var(--accent-orange)"} label="Security Score" sublabel="/100" unit="" />
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
            {[
              { label: "OWASP Coverage", val: "100% compliant" },
              { label: "Secrets Leakage", val: criticalCount > 0 ? "EXPOSED SECRETS" : "SECURE" },
              { label: "Vulnerability Scan", val: activeVulns.length > 0 ? `${activeVulns.length} OPEN` : "HEALTHY" },
              { label: "Pipeline Protection", val: "ACTIVE" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "4px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                <span style={{ color: "var(--text-muted)" }}>{r.label}</span>
                <span style={{ fontWeight: 700, color: r.val.includes("EXPOSED") || r.val.includes("OPEN") ? "var(--accent-red)" : "var(--accent-green)" }}>{r.val}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Severity breakdown pie */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="section-label">Active Anomaly Distribution</div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend iconType="circle" formatter={(val) => <span style={{ color: "var(--text-secondary)", fontSize: 11 }}>{val}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ minHeight: 190, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <ShieldCheck size={40} style={{ color: "var(--accent-green)", animation: "pulse-glow 2s infinite" }} />
              <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 700 }}>Zero active vulnerabilities! Cluster is secure.</span>
            </div>
          )}
        </motion.div>

        {/* Risk summary */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="section-label">DevSecOps Risk Metrics</div>
          {[
            { label: "Active Findings", val: `${activeVulns.length} items`, color: activeVulns.length > 0 ? "var(--accent-red)" : "var(--accent-green)" },
            { label: "Critical Priority", val: criticalCount, color: criticalCount > 0 ? "var(--accent-red)" : "var(--text-muted)" },
            { label: "High Priority", val: highCount, color: highCount > 0 ? "var(--accent-orange)" : "var(--text-muted)" },
            { label: "Medium Priority", val: mediumCount, color: "var(--text-muted)" },
            { label: "Low Priority", val: lowCount, color: "var(--text-muted)" },
            { label: "Auto-Fix Coverage", val: "100% covered", color: "var(--accent-green)" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7.5px 0", borderBottom: i < 5 ? "1px solid var(--border-subtle)" : "none" }}>
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{r.label}</span>
              <span style={{ fontWeight: 800, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: r.color }}>{r.val}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* NEW: SBOM Supply Chain & Compliance Badges Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Software Bill of Materials (SBOM) */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="section-label" style={{ marginBottom: 0, color: "var(--accent-cyan)" }}>Software Bill of Materials (SBOM) Summary</div>
            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "var(--accent-cyan-glow)", color: "var(--accent-cyan)", fontWeight: 700 }}>
              412 PACKAGES SCANNED
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { label: "Direct Dependencies", val: "42 direct", desc: "Declared in package.json" },
              { label: "Transitive Dependencies", val: "370 sub", desc: "Nested package tree resolved" },
              { label: "License Compliance", val: "100% Legal", desc: "MIT, Apache-2.0, BSD-3" }
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--bg-input)", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  <Package size={11} style={{ color: "var(--accent-cyan)" }} />
                  <span>{s.label}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 900, color: "var(--text-primary)", marginTop: 4 }}>{s.val}</div>
                <div style={{ fontSize: 8, color: "var(--text-muted)", marginTop: 2 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Enterprise Compliance Badges */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ borderColor: "rgba(16,185,129,0.3)" }}>
          <div className="section-label" style={{ color: "var(--accent-green)" }}>Regulatory & Enterprise Compliance Auditing</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { badge: "SOC2 Type II", status: "Compliant", color: "var(--accent-green)", glow: "rgba(16,185,129,0.06)", icon: <ShieldCheck size={14} /> },
              { badge: "GDPR Privacy", status: "Compliant", color: "var(--accent-green)", glow: "rgba(16,185,129,0.06)", icon: <ShieldCheck size={14} /> },
              { badge: "HIPAA Security", status: "Compliant", color: "var(--accent-green)", glow: "rgba(16,185,129,0.06)", icon: <ShieldCheck size={14} /> },
              { badge: "ISO 27001", status: "In Progress", color: "var(--accent-orange)", glow: "rgba(251,191,36,0.06)", icon: <FileCheck size={14} /> }
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px", borderRadius: 8, background: c.glow, border: `1px solid ${c.color === "var(--accent-green)" ? "rgba(16,185,129,0.2)" : "rgba(251,191,36,0.2)"}` }}>
                <div style={{ color: c.color }}>{c.icon}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-primary)" }}>{c.badge}</div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: c.color }}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Auto-remediation Console Logs (Visible when patches are triggering) */}
      {patchLogs.length > 0 && (
        <motion.div 
          className="card" 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ background: "#050b14", border: "1px solid rgba(16,185,129,0.3)", marginBottom: 16 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span className="section-label" style={{ marginBottom: 0, color: "var(--accent-green)" }}>DevSecOps Automated Patch Agent Logs</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-green)", animation: "pulse-glow 1.5s infinite" }} />
          </div>
          <div style={{ maxHeight: 90, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
            {patchLogs.map((log, idx) => (
              <div key={idx} style={{ color: log.startsWith("[SUCCESS]") ? "var(--accent-green)" : "var(--text-secondary)" }}>
                {log}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Vulnerability table */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="section-label">Active Threat Vectors & Vulnerability Registry</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "var(--bg-input)" }}>
                {["ID", "Type", "Description", "CVSS Score", "Target File Path", "Threat Level", "Action Remediation"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vulns.map((v, i) => (
                <tr
                  key={i}
                  style={{ 
                    borderBottom: "1px solid var(--border-subtle)",
                    textDecoration: v.isPatched ? "line-through" : "none",
                    opacity: v.isPatched ? 0.45 : 1,
                    background: v.isPatched ? "rgba(16,185,129,0.02)" : "transparent"
                  }}
                >
                  <td style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono', monospace", color: v.isPatched ? "var(--accent-green)" : "var(--text-muted)" }}>
                    {v.isPatched ? "✓ SECURED" : v.id}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, color: v.isPatched ? "var(--accent-green)" : sevColors[v.severity] }}>
                      {v.isPatched ? <CheckCircle2 size={14} /> : typeIcon[v.type]}
                      <span style={{ color: "var(--text-secondary)" }}>{v.type}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "var(--text-secondary)", maxWidth: 280 }}>{v.desc}</td>
                  <td style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: v.isPatched ? "var(--accent-green)" : (parseFloat(v.cvss) >= 7 ? "var(--accent-red)" : "var(--accent-orange)") }}>{v.cvss}</td>
                  <td style={{ padding: "10px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--text-muted)" }}>{v.file}</td>
                  <td style={{ padding: "10px 12px" }}>
                    {v.isPatched ? (
                      <span className="badge badge-low">SAFE</span>
                    ) : (
                      <RiskBadge level={v.severity} />
                    )}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    {v.isPatched ? (
                      <span style={{ fontSize: 10, color: "var(--accent-green)", fontWeight: 700 }}>Remediated</span>
                    ) : (
                      <button
                        onClick={() => applyPatch(v.id)}
                        disabled={v.patching}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          border: "1px solid var(--border)",
                          background: v.patching ? "var(--bg-input)" : "var(--bg-secondary)",
                          color: v.patching ? "var(--text-muted)" : "var(--accent-cyan)",
                          fontSize: 10,
                          fontWeight: 750,
                          cursor: v.patching ? "default" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4
                        }}
                      >
                        {v.patching ? (
                          <>
                            <RefreshCw size={10} className="animate-spin" />
                            <span>Patching...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={10} />
                            <span>1-Click Patch</span>
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AppShell>
  );
}
