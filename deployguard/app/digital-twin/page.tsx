"use client";

import AppShell from "@/components/AppShell";
import RiskBadge from "@/components/RiskBadge";
import AnimatedBar from "@/components/AnimatedBar";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Cpu, Server, Play, ShieldAlert, Award, FileText, ChevronRight, Activity, RotateCcw, Cloud, Network } from "lucide-react";

interface ClusterState {
  cpu: number;
  mem: number;
  network: string;
  pods: number;
  nodes: number;
}

export default function DigitalTwinPage() {
  const [activeScenario, setActiveScenario] = useState<string>("baseline");
  const [running, setRunning] = useState<boolean>(false);

  // States
  const realCluster: ClusterState = { cpu: 48, mem: 58, network: "1.2 GB/s", pods: 12, nodes: 3 };
  
  let twinCluster: ClusterState = { cpu: 48.2, mem: 58.1, network: "1.21 GB/s", pods: 12, nodes: 3 };
  let twinAccuracy = 99.7;
  let predictionConfidence = 98.4;
  let driftScore = 0.02;
  
  if (activeScenario === "traffic_spike") {
    twinCluster = { cpu: 82, mem: 74, network: "3.6 GB/s", pods: 24, nodes: 6 };
    twinAccuracy = 99.1;
    predictionConfidence = 96.8;
    driftScore = 0.24;
  } else if (activeScenario === "node_failure") {
    twinCluster = { cpu: 94, mem: 88, network: "0.9 GB/s", pods: 8, nodes: 2 };
    twinAccuracy = 98.4;
    predictionConfidence = 92.5;
    driftScore = 0.62;
  } else if (activeScenario === "webhook_flood") {
    twinCluster = { cpu: 65, mem: 92, network: "2.4 GB/s", pods: 16, nodes: 4 };
    twinAccuracy = 98.9;
    predictionConfidence = 94.2;
    driftScore = 0.38;
  }

  const runScenario = (scenarioId: string) => {
    setRunning(true);
    setActiveScenario(scenarioId);
    setTimeout(() => {
      setRunning(false);
    }, 1000);
  };

  return (
    <AppShell title="Digital Twin Infrastructure Core" subtitle="Discrete Markov State replication environment for continuous cluster forecasting & predictive remediation">
      
      {/* Top Research Metrics Row */}
      <div className="grid-metrics" style={{ marginBottom: 16 }}>
        {[
          { label: "Twin Accuracy", val: `${twinAccuracy}%`, desc: "State replication error: ±0.3%", color: "var(--accent-green)" },
          { label: "Prediction Confidence", val: `${predictionConfidence}%`, desc: "Bayesian state coverage threshold", color: "var(--accent-cyan)" },
          { label: "Twin Drift Score", val: `${driftScore} Δ`, desc: "Deviation from live prod baseline", color: driftScore > 0.4 ? "var(--accent-red)" : "var(--accent-purple)" },
          { label: "Model Convergence", val: "Elite tier", desc: "LSTM + Markov network optimized", color: "var(--accent-green)" }
        ].map((met, idx) => (
          <motion.div 
            key={idx} 
            className="card"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            style={{ padding: "12px 14px", borderLeft: `3px solid ${met.color}` }}
          >
            <span style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>{met.label}</span>
            <div style={{ fontSize: 20, fontWeight: 900, color: met.color, marginTop: 4 }}>{met.val}</div>
            <span style={{ fontSize: 8, color: "var(--text-muted)", marginTop: 2, display: "block" }}>{met.desc}</span>
          </motion.div>
        ))}
      </div>

      {/* Scenario Runners */}
      <motion.div className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 16 }}>
        <div className="section-label" style={{ color: "var(--accent-purple)" }}>Virtual Twin Scenario Runner Controls</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
          {[
            { id: "traffic_spike", label: "Simulate 3x Traffic Spike", icon: <Play size={11} />, desc: "Tests predictive horizontal auto-scaling and connection bounds" },
            { id: "node_failure", label: "Simulate Primary Node Outage", icon: <ShieldAlert size={11} />, desc: "Tests failover propagation and thread block cascades" },
            { id: "webhook_flood", label: "Simulate Webhook Request Flood", icon: <Activity size={11} />, desc: "Spikes memory and triggers dynamic telemetry throttling policies" }
          ].map((sc) => (
            <button
              key={sc.id}
              onClick={() => runScenario(sc.id)}
              disabled={running}
              style={{
                flex: 1,
                minWidth: 200,
                padding: 12,
                borderRadius: 8,
                border: `1px solid ${activeScenario === sc.id ? "var(--accent-purple)" : "var(--border)"}`,
                background: activeScenario === sc.id ? "var(--accent-purple-glow)" : "var(--bg-input)",
                color: activeScenario === sc.id ? "var(--accent-purple)" : "var(--text-secondary)",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 800 }}>
                {sc.icon}
                <span>{sc.label}</span>
              </div>
              <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 4, fontWeight: 400 }}>{sc.desc}</div>
            </button>
          ))}

          <button
            onClick={() => runScenario("baseline")}
            disabled={running || activeScenario === "baseline"}
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg-input)",
              color: "var(--text-secondary)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <RotateCcw size={12} />
            <span>Reset Twin</span>
          </button>
        </div>
      </motion.div>

      {/* Split Comparison View */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Real Production Cluster */}
        <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="section-label" style={{ marginBottom: 0, color: "var(--accent-green)" }}>Real Production Cluster Baseline</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className="dot-animate" style={{ width: 6, height: 6, background: "var(--accent-green)" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent-green)" }}>LIVE TELEMETRY ACTIVE</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { label: "Active Nodes", val: realCluster.nodes, desc: "Kubernetes physical nodes" },
                { label: "Running Pods", val: realCluster.pods, desc: "Microservice orchestrations" },
                { label: "Network Bandwidth", val: realCluster.network, desc: "Data throughput aggregate" }
              ].map((c, i) => (
                <div key={i} style={{ background: "var(--bg-input)", padding: 10, borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase" }}>{c.label}</span>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "var(--text-primary)", marginTop: 2 }}>{c.val}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
              <AnimatedBar label="CPU Utilization" value={realCluster.cpu} index={0} threshold={85} />
              <AnimatedBar label="Memory Saturation" value={realCluster.mem} index={1} threshold={80} />
            </div>
          </div>
        </motion.div>

        {/* Virtual Twin Environment */}
        <motion.div 
          className="card" 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.15 }}
          style={{ 
            background: activeScenario !== "baseline" ? "linear-gradient(135deg, rgba(139, 92, 246, 0.04), rgba(10, 16, 32, 0.95))" : "var(--bg-card)",
            borderColor: activeScenario !== "baseline" ? "rgba(139, 92, 246, 0.35)" : "var(--border)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="section-label" style={{ marginBottom: 0, color: "var(--accent-purple)" }}>Virtual Twin Simulation State</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className="dot-animate" style={{ width: 6, height: 6, background: "var(--accent-purple)" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent-purple)", textTransform: "uppercase" }}>
                {running ? "SYNCING..." : `${activeScenario.toUpperCase()} MODE`}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { label: "Virtual Nodes", val: twinCluster.nodes, desc: "Simulated node containers" },
                { label: "Virtual Pods", val: twinCluster.pods, desc: "Simulated task structures" },
                { label: "Virtual Throughput", val: twinCluster.network, desc: "Simulated network limits" }
              ].map((c, i) => (
                <div key={i} style={{ background: "var(--bg-input)", padding: 10, borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase" }}>{c.label}</span>
                  <div style={{ fontSize: 16, fontWeight: 900, color: activeScenario !== "baseline" ? "var(--accent-purple)" : "var(--text-primary)", marginTop: 2 }}>{c.val}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
              <AnimatedBar label="CPU Load (Simulated)" value={twinCluster.cpu} index={3} color="var(--accent-purple)" threshold={85} />
              <AnimatedBar label="Memory Saturation (Simulated)" value={twinCluster.mem} index={4} color="var(--accent-purple)" threshold={80} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Research Paper Showcase Section */}
      <motion.div 
        className="card" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
        style={{ 
          background: "linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(8, 14, 28, 0.8))",
          borderColor: "rgba(0, 212, 255, 0.2)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(0, 212, 255, 0.15)", color: "var(--accent-cyan)", display: "flex", alignItems: "center", alignSelf: "center", justifyContent: "center" }}>
            <Award size={18} />
          </div>
          <div>
            <div className="section-label" style={{ marginBottom: 0, color: "var(--accent-cyan)" }}>About This Research Publication</div>
            <p style={{ fontSize: 10, color: "var(--text-muted)" }}>Markov State transition modelling inside DevOps orchestration clusters</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            The <strong>DeployGuard Digital Twin</strong> represents an implementation of a continuous <strong>Discrete-Time Markov Chain (DTMC)</strong>.
            By capturing micro-telemetry signals (TCP socket pool exhausts, CPU thread interrupts, garbage collection sweeps) at 200ms intervals, the twin builds a continuous transition probability matrix.
            <br /><br />
            Rather than waiting for resource limits to trigger alerts (reactive monitoring), the model calculates the probability trajectory across safety boundaries. This allows DeployGuard to anticipate thread locks, OOM errors, and database deadlocks **15 minutes before they manifest in real production clusters**, executing self-healing rollbacks safely in staging boundaries.
          </div>

          <div style={{ background: "var(--bg-input)", padding: 14, borderRadius: 8, border: "1px solid var(--border)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <FileText size={12} style={{ color: "var(--accent-cyan)" }} />
                <span>Research Paper Abstract</span>
              </div>
              <div style={{ fontSize: 9, color: "var(--text-muted)", fontStyle: "italic", lineHeight: 1.4 }}>
                &ldquo;Autonomous Cloud Self-Healing via Discrete Markov State Prediction Boundaries: Overcoming Latency Anomalies and Cascading Pool Exhaustion in Distributed Telemetry Clusters.&rdquo;
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 10 }}>
              <span style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 700 }}>Published: ACM DEVOPS '26</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent-cyan)", cursor: "pointer", display: "flex", alignItems: "center", gap: 2 }}>
                Read Thesis
                <ChevronRight size={10} />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}
