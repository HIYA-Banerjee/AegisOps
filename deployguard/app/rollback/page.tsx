"use client";

import AppShell from "@/components/AppShell";
import RiskBadge from "@/components/RiskBadge";
import { motion } from "framer-motion";
import { RotateCcw, CheckCircle2, XCircle, Clock, GitCommit } from "lucide-react";

const versions = [
  { ver: "v2.5.0", env: "prod",    date: "14 min ago", status: "failed",  risk: "critical", note: "DB migration timeout · auth-svc down" },
  { ver: "v2.4.9", env: "staging", date: "2hr ago",    status: "ok",      risk: "low",      note: "All tests passed · clean deploy" },
  { ver: "v2.4.8", env: "prod",    date: "6hr ago",    status: "partial", risk: "medium",   note: "Memory spike — auto-scaled +2 nodes" },
  { ver: "v2.4.7", env: "prod",    date: "1 day ago",  status: "ok",      risk: "low",      note: "Zero errors · 99.9% uptime" },
  { ver: "v2.4.6", env: "prod",    date: "2 days ago", status: "ok",      risk: "low",      note: "Security patches applied" },
  { ver: "v2.4.5", env: "prod",    date: "4 days ago", status: "ok",      risk: "low",      note: "Performance optimization" },
];

const statusColors = {
  failed:  "var(--accent-red)",
  ok:      "var(--accent-green)",
  partial: "var(--accent-orange)",
};

export default function RollbackPage() {
  return (
    <AppShell title="Automated Rollback Recommendation" subtitle="AI identifies the safest rollback target after deployment failures">
      {/* Recommendation banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: 24,
          borderRadius: 12,
          background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(251,191,36,0.06))",
          border: "1px solid rgba(239,68,68,0.4)",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 56, height: 56, borderRadius: 14,
            background: "rgba(239,68,68,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--accent-red)",
            animation: "pulse-ring 2s ease-in-out infinite",
            flexShrink: 0,
          }}
        >
          <RotateCcw size={26} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "var(--accent-red)" }}>Current Deployment: FAILED</span>
            <RiskBadge level="critical" pulse />
          </div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            <span style={{ fontWeight: 700 }}>AI Recommendation:</span>{" "}
            Rollback to{" "}
            <span style={{ color: "var(--accent-green)", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>v2.4.9</span>{" "}
            — last known stable version. Estimated rollback time: <strong>3–5 min</strong>. Zero data loss risk.
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button style={{
            padding: "12px 24px", borderRadius: 10, border: "none",
            background: "var(--accent-green)", color: "#0a0f1e",
            fontSize: 13, fontWeight: 800, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <RotateCcw size={16} /> Rollback to v2.4.9
          </button>
          <button style={{
            padding: "10px 24px", borderRadius: 10, cursor: "pointer",
            border: "1px solid var(--border)", background: "var(--bg-input)",
            color: "var(--text-secondary)", fontSize: 12, fontWeight: 600,
          }}>
            Override — Keep v2.5.0
          </button>
        </div>
      </motion.div>

      {/* Version timeline + impact */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Version history */}
        <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="section-label">Deployment Version History</div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 12, top: 0, bottom: 0, width: 1, background: "var(--border)" }} />
            {versions.map((v, i) => {
              const color = statusColors[v.status as keyof typeof statusColors];
              const isRecommended = v.ver === "v2.4.9";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  style={{
                    display: "flex",
                    gap: 18,
                    marginBottom: 16,
                    paddingLeft: 32,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute", left: 8, top: 6,
                      width: 10, height: 10, borderRadius: "50%",
                      background: color,
                      boxShadow: `0 0 8px ${color}80`,
                      border: isRecommended ? "2px solid var(--accent-green)" : "none",
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      borderRadius: 8,
                      background: isRecommended ? "rgba(0,255,136,0.06)" : "var(--bg-input)",
                      border: `1px solid ${isRecommended ? "rgba(0,255,136,0.3)" : "var(--border-subtle)"}`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 13, color: "var(--text-primary)" }}>{v.ver}</span>
                        <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: `${color}18`, color }}>
                          {v.status.toUpperCase()}
                        </span>
                        {isRecommended && (
                          <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "rgba(0,255,136,0.12)", color: "var(--accent-green)", fontWeight: 700 }}>
                            ⭐ RECOMMENDED
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{v.date}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{v.note}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Rollback impact assessment */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <div className="section-label">Rollback Impact Assessment — v2.4.9</div>
            {[
              { label: "Data Loss Risk",     value: "None",        ok: true },
              { label: "Estimated Downtime", value: "3–5 min",     ok: true },
              { label: "DB Schema Revert",   value: "Not required", ok: true },
              { label: "Active Sessions",    value: "Preserved",    ok: true },
              { label: "Feature Rollback",   value: "DB migration only", ok: true },
              { label: "Rollback Tests",     value: "12/12 PASS",  ok: true },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i < 5 ? "1px solid var(--border-subtle)" : "none" }}>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{r.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  {r.ok ? <CheckCircle2 size={13} style={{ color: "var(--accent-green)" }} /> : <XCircle size={13} style={{ color: "var(--accent-red)" }} />}
                  <span style={{ fontSize: 12, fontWeight: 600, color: r.ok ? "var(--accent-green)" : "var(--accent-red)" }}>{r.value}</span>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <div className="section-label">Rollback Steps (Auto-generated)</div>
            {[
              "Pause traffic to production — route to v2.4.9 pods",
              "Scale down v2.5.0 deployment to 0 replicas",
              "Apply v2.4.9 image: registry/payment-svc:v2.4.9",
              "Wait for health checks to pass (3/3 replicas)",
              "Resume traffic — verify error rate < 0.1%",
              "Notify on-call team of successful rollback",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < 5 ? "1px solid var(--border-subtle)" : "none" }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--accent-green-glow)", color: "var(--accent-green)", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{step}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
