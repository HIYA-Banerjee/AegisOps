"use client";

import AppShell from "@/components/AppShell";
import RiskBadge from "@/components/RiskBadge";
import { motion } from "framer-motion";
import { useState } from "react";
import { Database, Cpu, Cloud, Network, Clock, DollarSign, Users, AlertTriangle, ShieldCheck, Play, ArrowDown } from "lucide-react";

const events = [
  { time: "07:31:42", event: "DB connections hit 98%", type: "error" },
  { time: "07:31:39", event: "Migration lock acquired on `orders` table", type: "warn" },
  { time: "07:31:33", event: "Auth service pod OOMKilled (memory: 512Mi)", type: "error" },
  { time: "07:31:15", event: "API gateway latency spike — P99: 847ms", type: "warn" },
  { time: "07:31:12", event: "Migration ALTER TABLE failed — timeout 30s", type: "error" },
  { time: "07:31:00", event: "Deployment v2.5.0 initiated to production", type: "info" },
];

const evColors: Record<string, string> = {
  error: "var(--accent-red)",
  warn: "var(--accent-orange)",
  info: "var(--accent-cyan)",
};

const costTiers = [
  { time: "5 min", cost: "$3,500", status: "Elapsed" },
  { time: "15 min", cost: "$12,000", status: "Elapsed" },
  { time: "30 min", cost: "$26,000", status: "Projected" },
  { time: "60 min", cost: "$58,000", status: "Projected" },
];

const runbookSteps = [
  { step: 1, title: "Rollback Deployment", cmd: "kubectl rollout undo deployment/payment-svc -n production", desc: "Revert image tag registry/payment-svc:v2.5.0 to stable v2.4.9 release." },
  { step: 2, title: "Restart Auth Pods", cmd: "kubectl rollout restart deployment/auth-svc -n production", desc: "Clear OOM cache overhead and re-establish fresh session validation pods." },
  { step: 3, title: "Clear Database Lock", cmd: "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE query LIKE '%ALTER TABLE orders%';", desc: "Locate and terminate the migration process lock blocking the connection pool." },
  { step: 4, title: "Run Validation Verification", cmd: "npm run test:prod-canary", desc: "Verify P99 checkout latency returns below 150ms and error rates reach 0%." },
];

export default function RootCausePage() {
  const [activeStep, setActiveStep] = useState(1);
  const [runningStep, setRunningStep] = useState<number | null>(null);
  const [stepDone, setStepDone] = useState<Record<number, boolean>>({});
  const [autoHealing, setAutoHealing] = useState(false);
  const [healingProgress, setHealingProgress] = useState(0);
  const [healingLog, setHealingLog] = useState<string[]>([]);

  const triggerStep = (stepId: number) => {
    setRunningStep(stepId);
    setTimeout(() => {
      setRunningStep(null);
      setStepDone((prev) => ({ ...prev, [stepId]: true }));
      if (stepId < 4) setActiveStep(stepId + 1);
    }, 1200);
  };

  const runAutoHealing = () => {
    setAutoHealing(true);
    setHealingProgress(5);
    setActiveStep(1);
    setStepDone({});
    setHealingLog(["[SYSTEM] Initiating autonomous AI remediation..."]);

    const steps = [
      { id: 1, log: "[Remediation Phase 1] Reverting payment-svc deployment to stable v2.4.9..." },
      { id: 2, log: "[Remediation Phase 2] Triggering progressive pod restarts on auth-svc cluster..." },
      { id: 3, log: "[Remediation Phase 3] Terminating pg_stat_activity connection lock on ALTER TABLE orders..." },
      { id: 4, log: "[Remediation Phase 4] Invoking production canary verification suite... All checks 100% OK." }
    ];

    let currentStep = 0;
    const runNext = () => {
      if (currentStep < 4) {
        const step = steps[currentStep];
        setRunningStep(step.id);
        setHealingProgress((currentStep + 1) * 20);
        setHealingLog(prev => [...prev, `[RUNNING] ${step.log}`]);

        setTimeout(() => {
          setRunningStep(null);
          setStepDone(prev => ({ ...prev, [step.id]: true }));
          setHealingProgress((currentStep + 1) * 25);
          setHealingLog(prev => [...prev, `[SUCCESS] Remediated phase ${step.id}.`]);
          if (step.id < 4) setActiveStep(step.id + 1);
          currentStep++;
          setTimeout(runNext, 800);
        }, 1200);
      } else {
        setHealingLog(prev => [...prev, "[COMPLETE] DeployGuard AI successfully healed the production cluster! MTTR: 14 min."]);
        setAutoHealing(false);
      }
    };

    setTimeout(runNext, 800);
  };

  return (
    <AppShell title="Root Cause Analysis" subtitle="AI failure cascades, service dependency tree models, business cost metrics, and automated SRE runbooks">
      {/* Top Banner: Blast Radius & Outage Cost */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Business Cost & Revenue Loss Highlight */}
        <motion.div 
          className="card" 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(10, 16, 32, 0.95))",
            borderColor: "rgba(239, 68, 68, 0.35)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="section-label" style={{ marginBottom: 0, color: "var(--accent-red)" }}>Estimated Business Impact</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-red)", animation: "pulse-ring 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent-red)" }}>CRITICAL LOSS DETECTED</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 14, alignItems: "center" }}>
            {/* Pulsing loss metrics */}
            <div style={{ background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 8, padding: 14, textAlign: "center" }}>
              <span style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Estimated Revenue Loss</span>
              <div className="gradient-text" style={{ fontSize: 26, fontWeight: 900, margin: "6px 0", background: "linear-gradient(135deg, #ef4444, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                $8,400
              </div>
              <span style={{ fontSize: 9, color: "var(--text-muted)" }}>Elapsed Outage (14 min)</span>
            </div>

            {/* Failure Cost Estimator Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { time: "5 min outage", cost: "$3,500", color: "var(--text-secondary)" },
                { time: "15 min outage", cost: "$12,000", color: "var(--accent-orange)" },
                { time: "30 min outage", cost: "$26,000", color: "var(--accent-red)" }
              ].map((tier, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", background: "var(--bg-input)", padding: "6px 10px", borderRadius: 6, fontSize: 11 }}>
                  <span style={{ color: "var(--text-secondary)" }}>{tier.time}</span>
                  <span style={{ fontWeight: 800, color: tier.color }}>{tier.cost}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enlarged Blast Radius Analytics */}
        <motion.div className="card" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={{ borderColor: "rgba(0, 212, 255, 0.25)" }}>
          <div className="section-label" style={{ color: "var(--accent-cyan)" }}>Incident Blast Radius & System Isolation</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Users Impacted", val: "12,540", desc: "Active API sessions interrupted", icon: <Users size={16} />, color: "var(--accent-cyan)", glow: "rgba(0, 212, 255, 0.08)" },
              { label: "Services Affected", val: "6 Services", desc: "Cascading microservice failure", icon: <Network size={16} />, color: "var(--accent-red)", glow: "rgba(239, 68, 68, 0.08)" },
              { label: "Active Regions", val: "2 Regions", desc: "US-East & AP-South active pools", icon: <Cloud size={16} />, color: "var(--accent-orange)", glow: "rgba(251, 191, 36, 0.08)" },
              { label: "Isolated Pools", val: "2 Node Pools", desc: "Remediation target sandbox", icon: <ShieldCheck size={16} />, color: "var(--accent-green)", glow: "rgba(16, 185, 129, 0.08)" },
            ].map((b, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02 }}
                style={{ 
                  padding: "12px 14px", 
                  borderRadius: 10, 
                  background: "var(--bg-input)", 
                  border: `1px solid var(--border)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12
                }}
              >
                <div style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: 8, 
                  background: b.glow, 
                  color: b.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  {b.icon}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "var(--text-primary)" }}>{b.val}</div>
                  <div style={{ fontSize: 10, color: "var(--text-secondary)", fontWeight: 700, marginTop: 1 }}>{b.label}</div>
                  <div style={{ fontSize: 8, color: "var(--text-muted)", marginTop: 1 }}>{b.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16 }}>
        {/* Left: Cascading failure dependency map */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Cascade map visualization */}
          <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div className="section-label" style={{ marginBottom: 0 }}>Cascading Failure Dependency Graph</div>
              <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: "rgba(239,68,68,0.12)", color: "var(--accent-red)", fontWeight: 700 }}>
                PROPAGATION TIMELINE ACTIVE
              </span>
            </div>

            {/* Tree graph visualization using pure CSS nodes */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "10px 0" }}>
              {/* DB Lock node */}
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "2px solid var(--accent-red)", width: "100%", maxWidth: 320, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 0 10px rgba(239,68,68,0.15)" }}>
                <Database size={16} style={{ color: "var(--accent-red)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 750, color: "var(--accent-red)" }}>orders-db (Exclusive Index Lock)</div>
                  <div style={{ fontSize: 9, color: "var(--text-secondary)" }}>Primary Lock: ALTER TABLE index creation</div>
                </div>
                <RiskBadge level="critical" label="ROOT" />
              </div>

              <ArrowDown size={14} style={{ color: "var(--accent-red)", strokeWidth: 3 }} />

              {/* Auth service node */}
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid var(--accent-red)", width: "100%", maxWidth: 300, display: "flex", alignItems: "center", gap: 10 }}>
                <Cpu size={16} style={{ color: "var(--accent-red)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 750, color: "var(--text-primary)" }}>auth-service (OOM Killed)</div>
                  <div style={{ fontSize: 9, color: "var(--text-muted)" }}>Conn Exhaustion + heap memory limit hit</div>
                </div>
                <RiskBadge level="critical" label="CRITICAL" />
              </div>

              <ArrowDown size={14} style={{ color: "var(--accent-orange)" }} />

              {/* Middle row services (Parallel checkout block) */}
              <div style={{ display: "flex", gap: 10, width: "100%", justifyContent: "center" }}>
                {/* Payment service */}
                <div style={{ padding: "10px 12px", borderRadius: 8, background: "var(--bg-input)", border: "1px solid var(--accent-orange)", width: 170, display: "flex", alignItems: "center", gap: 8 }}>
                  <Network size={14} style={{ color: "var(--accent-orange)" }} />
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-primary)" }}>payment-svc</div>
                    <span style={{ fontSize: 8, color: "var(--accent-orange)" }}>Timeout: 504 Gateway</span>
                  </div>
                </div>

                {/* Order service */}
                <div style={{ padding: "10px 12px", borderRadius: 8, background: "var(--bg-input)", border: "1px solid var(--accent-orange)", width: 170, display: "flex", alignItems: "center", gap: 8 }}>
                  <Cloud size={14} style={{ color: "var(--accent-orange)" }} />
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-primary)" }}>order-svc</div>
                    <span style={{ fontSize: 8, color: "var(--accent-orange)" }}>Timeout: 504 Gateway</span>
                  </div>
                </div>
              </div>

              <ArrowDown size={14} style={{ color: "var(--text-muted)" }} />

              {/* Notification degraded node */}
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "var(--bg-input)", border: "1px solid var(--border-subtle)", width: "100%", maxWidth: 280, display: "flex", alignItems: "center", gap: 10 }}>
                <Cloud size={14} style={{ color: "var(--text-muted)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)" }}>notification-svc (Degraded)</div>
                  <div style={{ fontSize: 9, color: "var(--text-muted)" }}>Cascading queuing lag: +45s</div>
                </div>
                <RiskBadge level="low" label="DEGRADED" />
              </div>
            </div>
          </motion.div>

          {/* Primary Cause / Secondary Cause */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ borderColor: "rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.04)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <span className="section-label" style={{ marginBottom: 0 }}>Primary Cause</span>
              <RiskBadge level="critical" label="CONFIRMED" pulse />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-red)", flexShrink: 0 }}>
                <Database size={22} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--accent-red)" }}>Database Migration Index Timeout</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                  ALTER TABLE on orders (42M rows) held exclusive table lock under peak loads, causing connection pool exhaust (100/100 connections).
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: AI Recovery Runbook & Events */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Automated SRE Recovery Runbook */}
          <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div className="section-label" style={{ marginBottom: 2 }}>AI Recovery Runbook (Self-Healing)</div>
                <p style={{ fontSize: 10, color: "var(--text-muted)" }}>Remediation execution panel</p>
              </div>
              <button
                onClick={runAutoHealing}
                disabled={autoHealing}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: autoHealing ? "var(--bg-input)" : "linear-gradient(135deg, var(--accent-green), var(--accent-cyan))",
                  color: autoHealing ? "var(--text-muted)" : "#0a0f1e",
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: autoHealing ? "default" : "pointer",
                  boxShadow: autoHealing ? "none" : "0 0 12px rgba(0,255,136,0.25)",
                  transition: "all 0.2s"
                }}
              >
                {autoHealing ? "Healing..." : "⚡ Trigger Auto-Remediation"}
              </button>
            </div>

            {/* Dynamic Progress Bar */}
            {(autoHealing || healingProgress > 0) && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-secondary)", marginBottom: 4 }}>
                  <span>AI Healing Progress</span>
                  <span style={{ fontWeight: 800, color: "var(--accent-green)" }}>{healingProgress}%</span>
                </div>
                <div className="progress-bar" style={{ height: 6, background: "var(--bg-input)" }}>
                  <motion.div
                    animate={{ width: `${healingProgress}%` }}
                    transition={{ duration: 0.5 }}
                    style={{ height: "100%", background: "linear-gradient(90deg, var(--accent-cyan), var(--accent-green))", borderRadius: 3 }}
                  />
                </div>
              </div>
            )}

            {/* Healing Live Console Logs */}
            {healingLog.length > 0 && (
              <div style={{ background: "#050b14", border: "1px solid var(--border)", borderRadius: 8, padding: 12, marginBottom: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
                <div style={{ color: "var(--accent-green)", fontWeight: 700, marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Autonomous Remediation Console</span>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-green)", animation: "pulse-glow 1.5s infinite" }} />
                </div>
                <div style={{ maxHeight: 110, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4, color: "var(--text-secondary)" }}>
                  {healingLog.map((log, i) => {
                    let color = "var(--text-secondary)";
                    if (log.startsWith("[SUCCESS]")) color = "var(--accent-green)";
                    else if (log.startsWith("[SYSTEM]")) color = "var(--accent-cyan)";
                    else if (log.startsWith("[COMPLETE]")) color = "var(--accent-green)";
                    return (
                      <div key={i} style={{ color }}>
                        {log}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {runbookSteps.map((step) => {
                const isActive = activeStep === step.step;
                const isRunning = runningStep === step.step;
                const isDone = stepDone[step.step];
                return (
                  <div
                    key={step.step}
                    style={{
                      padding: "12px",
                      borderRadius: 8,
                      background: isActive ? "rgba(0,255,136,0.03)" : "var(--bg-input)",
                      border: `1px solid ${isRunning ? "var(--accent-cyan)" : isDone ? "var(--accent-green)" : isActive ? "rgba(0,255,136,0.25)" : "var(--border-subtle)"}`,
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 18, height: 18, borderRadius: "50%", background: isDone ? "var(--accent-green-glow)" : "var(--border)", color: isDone ? "var(--accent-green)" : "var(--text-muted)", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {step.step}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 750, color: isDone ? "var(--accent-green)" : "var(--text-primary)" }}>{step.title}</span>
                      </div>
                      <button
                        onClick={() => triggerStep(step.step)}
                        disabled={!isActive || isRunning || isDone}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          border: "none",
                          background: isDone ? "var(--accent-green-glow)" : isRunning ? "var(--border)" : isActive ? "var(--accent-cyan)" : "var(--bg-card)",
                          color: isDone ? "var(--accent-green)" : isRunning ? "var(--text-muted)" : isActive ? "#0a0f1e" : "var(--text-muted)",
                          fontSize: 10,
                          fontWeight: 750,
                          cursor: isActive && !isRunning && !isDone ? "pointer" : "default",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {isRunning ? "Running..." : isDone ? "Completed" : (
                          <>
                            <Play size={10} />
                            Run Step
                          </>
                        )}
                      </button>
                    </div>

                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{step.desc}</div>
                    <pre style={{ padding: "8px", background: "var(--bg-secondary)", borderRadius: 5, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "var(--accent-cyan)", overflowX: "auto" }}>
                      {step.cmd}
                    </pre>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* AI Analysis */}
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.06), rgba(0,212,255,0.04))", borderColor: "rgba(139,92,246,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 14 }}>🤖</span>
              <span className="section-label" style={{ marginBottom: 0 }}>AI Analysis — RCA Insights</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              The schema index additions on table <code style={{ background: "var(--bg-input)", padding: "1px 5px", borderRadius: 3 }}>orders</code> initiated a critical connection bottleneck. The resulting OOMKill loop on the session cache pods triggered the cascading timeout on the payment endpoints.
              <br /><br />
              <strong>Mitigation strategy:</strong> Termination of active locks followed by deployment rollbacks to version 2.4.9 restores P99 checkout times to normal baselines.
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
