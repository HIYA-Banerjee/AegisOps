"use client";

import AppShell from "@/components/AppShell";
import AnimatedBar from "@/components/AnimatedBar";
import RiskBadge from "@/components/RiskBadge";
import { motion } from "framer-motion";
import { useState } from "react";
import { FlaskConical, Cpu, HardDrive, Clock, AlertTriangle, CheckCircle2, Server, HelpCircle, Network } from "lucide-react";

const services = ["payment-service", "auth-service", "order-service", "api-gateway", "notification-svc"];
const versions = ["v2.6.0", "v2.5.1-rc1", "v2.5.0", "v2.4.9-patch"];

type PredictionData = {
  cpu: number;
  mem: number;
  latency: number;
  latencyVal: string;
  downtime: string;
  risk: "high" | "medium" | "low" | "critical";
  riskScore: number;
  why: string;
  warnings: string[];
  replicas: string;
};

const predictions: Record<string, PredictionData> = {
  "payment-service": {
    cpu: 15, mem: 12, latency: 90, latencyVal: "+90ms", downtime: "5 min", risk: "critical", riskScore: 67,
    why: "Exclusive schema locks committed on active orders index block execution of payment validation transactions.",
    warnings: ["DB connection pool may saturate at peak", "New ORM queries not indexed", "Memory allocation +12% vs v2.4.9"],
    replicas: "3 → 5",
  },
  "auth-service": {
    cpu: 8, mem: 32, latency: 45, latencyVal: "+45ms", downtime: "0 min", risk: "medium", riskScore: 64,
    why: "Loading entire JWT active user caching map on boot exhausts allocated memory space.",
    warnings: ["Session store memory spike expected", "JWT signing overhead +8%"],
    replicas: "2 → 2",
  },
  "order-service": {
    cpu: 5, mem: 6, latency: 3, latencyVal: "+3ms", downtime: "0 min", risk: "low", riskScore: 32,
    why: "Clean deployment containing minor routing fixes and telemetry endpoints. Expected impact is negligible.",
    warnings: [],
    replicas: "3 → 3",
  },
};

export default function SimulatorPage() {
  const [service, setService] = useState("payment-service");
  const [version, setVersion] = useState("v2.6.0");
  const [simRun, setSimRun] = useState(false);
  const [running, setRunning] = useState(false);

  const pred = predictions[service as keyof typeof predictions] || predictions["order-service"];

  const runSim = () => {
    setRunning(true);
    setSimRun(false);
    setTimeout(() => { setRunning(false); setSimRun(true); }, 1500);
  };

  return (
    <AppShell title="Deployment Impact Simulator" subtitle="Proactive Digital Twin cluster simulation before releasing code to production">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Config Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-label">Digital Twin Config</div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Target Service</label>
              <select
                value={service}
                onChange={(e) => { setService(e.target.value); setSimRun(false); }}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--text-primary)", fontSize: 13, fontWeight: 600, outline: "none" }}
              >
                {services.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Proposed Version</label>
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--text-primary)", fontSize: 13, fontWeight: 600, outline: "none" }}
              >
                {versions.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                { label: "Active Replicas", value: "3" },
                { label: "Canary Traffic %", value: "100" },
              ].map((f, i) => (
                <div key={i}>
                  <label style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{f.label}</label>
                  <input
                    defaultValue={f.value}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--text-primary)", fontSize: 13, fontWeight: 600, outline: "none" }}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={runSim}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 10,
                border: "none",
                background: running ? "var(--bg-input)" : "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
                color: running ? "var(--text-muted)" : "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: running ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.2s",
              }}
            >
              <FlaskConical size={18} />
              {running ? "Initializing Digital Twin Environment…" : "Simulate proposed deployment"}
            </button>
          </motion.div>

          {/* Infrastructure Digital Twin Visualization */}
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div className="section-label" style={{ marginBottom: 0 }}>Digital Twin Infrastructure Map</div>
              <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "rgba(0,212,255,0.12)", color: "var(--accent-cyan)", fontWeight: 700 }}>
                {simRun ? "TWIN SIMULATION ACTIVE" : "REAL LIVE BASELINE"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {/* Production Live Baseline */}
              <div style={{ padding: 12, borderRadius: 8, background: "var(--bg-input)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8 }}>
                  <Server size={12} />
                  <span>Real Prod Cluster</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { name: "Node-1", cpu: 52 },
                    { name: "Node-2", cpu: 45 },
                    { name: "Node-3", cpu: 41 },
                  ].map((node, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
                      <span style={{ color: "var(--text-secondary)" }}>{node.name}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "var(--accent-green)" }}>CPU {node.cpu}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Virtual Twin Model */}
              <div style={{ padding: 12, borderRadius: 8, background: simRun ? "rgba(139,92,246,0.05)" : "var(--bg-input)", border: `1px solid ${simRun ? "rgba(139,92,246,0.25)" : "var(--border-subtle)"}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, color: simRun ? "var(--accent-purple)" : "var(--text-muted)", textTransform: "uppercase", marginBottom: 8 }}>
                  <Network size={12} />
                  <span>Virtual Twin copy</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { name: "Node-1-Twin", cpu: simRun ? 52 + pred.cpu : 52 },
                    { name: "Node-2-Twin", cpu: simRun ? 45 + pred.cpu : 45 },
                    { name: "Node-3-Twin", cpu: simRun ? 41 + pred.cpu : 41 },
                  ].map((node, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
                      <span style={{ color: "var(--text-secondary)" }}>{node.name}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: simRun && (node.cpu >= 75) ? "var(--accent-red)" : "var(--accent-cyan)" }}>
                        CPU {node.cpu}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: AI Output */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {simRun ? (
            <>
              <motion.div
                className="card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ borderColor: pred.risk === "critical" ? "rgba(239,68,68,0.4)" : pred.risk === "medium" ? "rgba(251,191,36,0.3)" : "rgba(0,255,136,0.25)" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div className="section-label" style={{ marginBottom: 0 }}>Digital Twin Simulation Results</div>
                  <RiskBadge level={pred.risk as any} label={`Failure Risk: ${pred.riskScore}%`} />
                </div>

                {/* Key Metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 16 }}>
                  {[
                    { icon: <Cpu size={16} />, label: "CPU Increase", value: `+${pred.cpu}%`, color: pred.cpu > 20 ? "var(--accent-red)" : "var(--accent-orange)" },
                    { icon: <HardDrive size={16} />, label: "Memory Increase", value: `+${pred.mem}%`, color: pred.mem > 20 ? "var(--accent-orange)" : "var(--accent-cyan)" },
                    { icon: <AlertTriangle size={16} />, label: "Latency Spike", value: pred.latencyVal, color: pred.latency > 50 ? "var(--accent-red)" : "var(--accent-green)" },
                    { icon: <Clock size={16} />, label: "Downtime Estimate", value: pred.downtime, color: pred.downtime === "0 min" ? "var(--accent-green)" : "var(--accent-red)" },
                  ].map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      style={{ padding: "12px", borderRadius: 8, background: "var(--bg-input)", border: "1px solid var(--border-subtle)", textAlign: "center" }}
                    >
                      <div style={{ color: m.color, marginBottom: 6, display: "flex", justifyContent: "center" }}>{m.icon}</div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>{m.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: m.color }}>{m.value}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Why Simulator Explanation */}
                <div style={{ padding: "12px 14px", borderRadius: 8, background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.25)", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "var(--accent-purple)", marginBottom: 4 }}>
                    <HelpCircle size={14} />
                    <span>AI Simulation Explainability (Why?)</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {pred.why}
                  </div>
                </div>

                {/* Resource bars */}
                <div className="section-label">Predicted Resource Overhead</div>
                <AnimatedBar label="CPU Load (simulated)" value={52 + pred.cpu} index={0} />
                <AnimatedBar label="Memory Load (simulated)" value={61 + pred.mem} index={1} />
                <AnimatedBar label="Target Replicas" value={65} color="var(--accent-purple)" index={2} />
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>Deployment Scale Adjustment: {pred.replicas}</div>
              </motion.div>

              {/* Warnings */}
              {pred.warnings.length > 0 && (
                <motion.div
                  className="card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{ borderColor: "rgba(251,191,36,0.3)" }}
                >
                  <div className="section-label">Simulation Alerts</div>
                  {pred.warnings.map((w, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, padding: "8px 0", borderBottom: i < pred.warnings.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                      <AlertTriangle size={13} style={{ color: "var(--accent-orange)", flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{w}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              className="card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 380, gap: 16 }}
            >
              <FlaskConical size={48} style={{ color: "var(--text-muted)", animation: "float 3s ease-in-out infinite" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 6 }}>
                  {running ? "Simulating Virtual Twin..." : "Digital Twin Environment Ready"}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Configure your deployment and run the virtual twin simulation to verify CPU, Memory, and Network risk before production.
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Reinforcement Learning (RL) Optimizer Card */}
        <motion.div 
          className="card" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.35 }}
          style={{ 
            gridColumn: "1 / -1", 
            marginTop: 16,
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.04), rgba(10, 16, 32, 0.95))",
            borderColor: "rgba(139, 92, 246, 0.3)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div className="section-label" style={{ marginBottom: 2, color: "var(--accent-purple)" }}>Reinforcement Learning (RL) Policy Optimizer</div>
              <p style={{ fontSize: 11, color: "var(--text-secondary)" }}>Continuous agent self-optimization via reward-driven deployment scenarios</p>
            </div>
            <span className="badge" style={{ background: "var(--accent-purple-glow)", color: "var(--accent-purple)", border: "1px solid rgba(139,92,246,0.3)" }}>
              AGENT CONVERGED ✓
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
            {/* Left: RL Training Logs & Chart */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { label: "RL Epochs", val: "1,200", desc: "Simulated scenarios" },
                  { label: "Cumulative Reward", val: "+42.5", desc: "Outage penalty avoided", color: "var(--accent-green)" },
                  { label: "Convergence Rate", val: "99.2%", desc: "Stable policy corridor", color: "var(--accent-cyan)" }
                ].map((stat, idx) => (
                  <div key={idx} style={{ flex: 1, background: "var(--bg-input)", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>{stat.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: stat.color || "var(--text-primary)", marginTop: 2 }}>{stat.val}</div>
                    <div style={{ fontSize: 8, color: "var(--text-muted)", marginTop: 1 }}>{stat.desc}</div>
                  </div>
                ))}
              </div>

              {/* Policy Convergence SVG Chart */}
              <div style={{ background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: 8, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>Policy Convergence Rate Trend</span>
                  <span style={{ fontSize: 8, color: "var(--text-secondary)" }}>Reward plateau at Epoch 1080</span>
                </div>
                <div style={{ height: 60, display: "flex", alignItems: "flex-end", gap: 4, paddingBottom: 2 }}>
                  {[20, 28, 35, 42, 38, 55, 68, 62, 75, 82, 89, 95, 98, 99, 99.2].map((val, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <div 
                        style={{ 
                          width: "100%", 
                          height: `${val * 0.5}px`, 
                          background: `linear-gradient(to top, var(--accent-purple), var(--accent-cyan))`, 
                          borderRadius: "2px 2px 0 0",
                          opacity: 0.4 + (i / 15) * 0.6,
                          transition: "height 1s ease"
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Policy Optimization Decisions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>AI Learned Decisions</span>
              {[
                { 
                  rule: "Best Deployment Window", 
                  decision: "Tuesdays 03:00 – 05:00 UTC", 
                  benefit: "98.4% success corridor (lowest resource usage, minimal concurrent commits)" 
                },
                { 
                  rule: "Best Rollback Strategy", 
                  decision: "Progressive Canary Drain with 10% traffic shifts", 
                  benefit: "Mitigates cascade DB lock triggers. Average MTTR reduction: -14 min" 
                },
                { 
                  rule: "Best Scaling Policy", 
                  decision: "Dynamic CPU-derivative predictive provisioning", 
                  benefit: "Proactively scales replica pool by +2 nodes 4 minutes before locks propagate" 
                }
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, background: "var(--bg-input)", padding: 10, borderRadius: 8, border: "1px solid var(--border)" }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", background: "var(--accent-purple-glow)", color: "var(--accent-purple)",
                    display: "flex", alignItems: "center", fontSize: 10, fontWeight: 800, flexShrink: 0,
                    alignSelf: "center", justifyContent: "center"
                  }}>
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)" }}>{item.rule}: <span style={{ color: "var(--accent-cyan)" }}>{item.decision}</span></div>
                    <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>{item.benefit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
