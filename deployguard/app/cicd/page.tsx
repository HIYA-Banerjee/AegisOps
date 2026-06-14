"use client";

import AppShell from "@/components/AppShell";
import RiskBadge from "@/components/RiskBadge";
import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Clock, GitBranch } from "lucide-react";

const platforms = ["GitHub Actions", "Jenkins", "GitLab CI/CD", "Azure DevOps", "CircleCI"];

const pipelines: Record<string, any> = {
  "GitHub Actions": {
    risk: "high",
    score: 31,
    stages: [
      { name: "Checkout",     status: "ok",      duration: "2s" },
      { name: "Install Deps", status: "ok",      duration: "48s" },
      { name: "Lint",         status: "ok",      duration: "12s" },
      { name: "Unit Tests",   status: "warning", duration: "1m 2s" },
      { name: "Build",        status: "ok",      duration: "3m 18s" },
      { name: "Integration",  status: "failed",  duration: "4m 31s" },
      { name: "Deploy",       status: "blocked", duration: "—" },
    ],
    issues: [
      { severity: "critical", msg: "Integration tests failing — DB connection refused" },
      { severity: "high",     msg: "Test coverage dropped below 60% threshold" },
      { severity: "high",     msg: "Deployment blocked due to upstream failure" },
      { severity: "medium",   msg: "Build time increased by 40% vs baseline" },
    ],
  },
  Jenkins: {
    risk: "medium",
    score: 68,
    stages: [
      { name: "SCM Poll",   status: "ok",      duration: "1s" },
      { name: "Compile",    status: "ok",      duration: "1m 12s" },
      { name: "Test",       status: "warning", duration: "2m 45s" },
      { name: "SonarQube",  status: "ok",      duration: "30s" },
      { name: "Package",    status: "ok",      duration: "45s" },
      { name: "Deploy Dev", status: "ok",      duration: "2m 10s" },
      { name: "Smoke Test", status: "ok",      duration: "1m 5s" },
    ],
    issues: [
      { severity: "medium", msg: "3 flaky tests detected in payment module" },
      { severity: "low",    msg: "Agent CPU above 80% during build" },
    ],
  },
  "GitLab CI/CD": {
    risk: "low",
    score: 89,
    stages: [
      { name: "Prepare",   status: "ok", duration: "5s" },
      { name: "Build",     status: "ok", duration: "2m 20s" },
      { name: "Test",      status: "ok", duration: "3m 45s" },
      { name: "Review",    status: "ok", duration: "1m 0s" },
      { name: "Staging",   status: "ok", duration: "4m 30s" },
      { name: "Production",status: "ok", duration: "5m 0s" },
    ],
    issues: [
      { severity: "low", msg: "DAST scan found 2 low-severity info disclosures" },
    ],
  },
  "Azure DevOps": {
    risk: "medium",
    score: 61,
    stages: [
      { name: "Restore",    status: "ok",      duration: "30s" },
      { name: "Build",      status: "ok",      duration: "1m 50s" },
      { name: "Test",       status: "warning", duration: "5m 12s" },
      { name: "Publish",    status: "ok",      duration: "1m 5s" },
      { name: "Dev Deploy", status: "ok",      duration: "3m 20s" },
      { name: "UAT",        status: "warning", duration: "2m 45s" },
      { name: "Prod",       status: "blocked", duration: "—" },
    ],
    issues: [
      { severity: "high",   msg: "UAT environment: 2 failing API contract tests" },
      { severity: "medium", msg: "Missing approval gate for production release" },
      { severity: "low",    msg: "Azure artifact feed cache miss — slow build" },
    ],
  },
  CircleCI: {
    risk: "low",
    score: 91,
    stages: [
      { name: "Setup",    status: "ok", duration: "8s" },
      { name: "Deps",     status: "ok", duration: "55s" },
      { name: "Test",     status: "ok", duration: "2m 30s" },
      { name: "Coverage", status: "ok", duration: "25s" },
      { name: "Deploy",   status: "ok", duration: "3m 10s" },
    ],
    issues: [],
  },
};

const stageStatusConfig = {
  ok:      { color: "var(--accent-green)",  icon: <CheckCircle2 size={14} /> },
  warning: { color: "var(--accent-orange)", icon: <AlertCircle size={14} /> },
  failed:  { color: "var(--accent-red)",    icon: <XCircle size={14} /> },
  blocked: { color: "var(--text-muted)",    icon: <Clock size={14} /> },
};

const sevColors = { critical: "var(--accent-red)", high: "var(--accent-orange)", medium: "var(--accent-cyan)", low: "var(--text-muted)" };

export default function CICDPage() {
  const [active, setActive] = useState("GitHub Actions");
  const p = pipelines[active];

  return (
    <AppShell title="CI/CD Risk Analyzer" subtitle="Detect broken workflows, missing tests & unsafe deployments">
      {/* Platform tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {platforms.map((pl) => {
          const plData = pipelines[pl];
          const riskColor = plData.risk === "high" ? "var(--accent-red)" : plData.risk === "medium" ? "var(--accent-orange)" : "var(--accent-green)";
          return (
            <button
              key={pl}
              onClick={() => setActive(pl)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: `1px solid ${active === pl ? "var(--accent-cyan)" : "var(--border)"}`,
                background: active === pl ? "var(--accent-cyan-glow)" : "var(--bg-card)",
                color: active === pl ? "var(--accent-cyan)" : "var(--text-secondary)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s",
              }}
            >
              <GitBranch size={12} />
              {pl}
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: riskColor, flexShrink: 0 }} />
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Pipeline visualization */}
        <motion.div
          className="card"
          key={active}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 0 }}>Pipeline Stages</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Risk Score</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: p.risk === "low" ? "var(--accent-green)" : p.risk === "medium" ? "var(--accent-orange)" : "var(--accent-red)" }}>
                {p.score}/100
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {p.stages.map((stage: any, i: number) => {
              const sc = stageStatusConfig[stage.status as keyof typeof stageStatusConfig];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 12px",
                    borderRadius: 7,
                    background: stage.status === "failed" ? "rgba(239,68,68,0.06)" : "var(--bg-input)",
                    border: `1px solid ${stage.status === "failed" ? "rgba(239,68,68,0.2)" : "var(--border-subtle)"}`,
                  }}
                >
                  <span style={{ color: sc.color }}>{sc.icon}</span>
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>
                    {stage.name}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--text-muted)" }}>
                    {stage.duration}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Issues and risk panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <motion.div
            className="card"
            key={active + "-issues"}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div className="section-label" style={{ marginBottom: 0 }}>Detected Issues</div>
              <RiskBadge level={p.risk as any} />
            </div>

            {p.issues.length === 0 ? (
              <div style={{ textAlign: "center", padding: 32, color: "var(--accent-green)" }}>
                <CheckCircle2 size={40} style={{ margin: "0 auto 8px" }} />
                <div style={{ fontWeight: 600 }}>No issues detected</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Pipeline is healthy</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {p.issues.map((issue: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 7,
                      background: "var(--bg-input)",
                      border: `1px solid ${sevColors[issue.severity as keyof typeof sevColors]}30`,
                      borderLeft: `3px solid ${sevColors[issue.severity as keyof typeof sevColors]}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: sevColors[issue.severity as keyof typeof sevColors] }}>
                        {issue.severity}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{issue.msg}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Summary stats */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="section-label">Safety Summary</div>
            {[
              { label: "Tests Present", value: p.score >= 80, pass: true },
              { label: "Security Scan", value: p.risk !== "high", pass: p.risk !== "high" },
              { label: "All Stages Pass", value: p.risk === "low", pass: p.risk === "low" },
              { label: "Approval Gates", value: p.score >= 70, pass: p.score >= 70 },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 3 ? "1px solid var(--border-subtle)" : "none" }}>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{row.label}</span>
                <span style={{ color: row.pass ? "var(--accent-green)" : "var(--accent-red)", fontSize: 12, fontWeight: 700 }}>
                  {row.pass ? "✓ PASS" : "✗ FAIL"}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
