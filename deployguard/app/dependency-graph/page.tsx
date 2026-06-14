"use client";

import AppShell from "@/components/AppShell";
import RiskBadge from "@/components/RiskBadge";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Network, Database, Cpu, ShieldAlert, Zap, Layers, Activity, Users, Clock, AlertTriangle, DollarSign } from "lucide-react";

interface ServiceNode {
  id: string;
  name: string;
  type: 'database' | 'service' | 'gateway';
  status: 'healthy' | 'warning' | 'critical' | 'degraded';
  cpu: number;
  mem: number;
  latency: number;
  errors: number;
  connections: number;
  version: string;
  impactIfFailed: {
    servicesAffected: number;
    sessionsBlocked: number;
    revenueLossHr: number;
  };
}

const serviceNodes: Record<string, ServiceNode> = {
  "orders-db": {
    id: "orders-db",
    name: "orders-db (PostgreSQL)",
    type: "database",
    status: "healthy",
    cpu: 42,
    mem: 68,
    latency: 4,
    errors: 0.01,
    connections: 84,
    version: "v15.4",
    impactIfFailed: { servicesAffected: 4, sessionsBlocked: 34000, revenueLossHr: 165000 }
  },
  "auth-svc": {
    id: "auth-svc",
    name: "auth-service (Node.js)",
    type: "service",
    status: "healthy",
    cpu: 28,
    mem: 54,
    latency: 12,
    errors: 0.1,
    connections: 112,
    version: "v2.4.9",
    impactIfFailed: { servicesAffected: 3, sessionsBlocked: 22000, revenueLossHr: 98000 }
  },
  "payment-svc": {
    id: "payment-svc",
    name: "payment-service (Go)",
    type: "service",
    status: "healthy",
    cpu: 18,
    mem: 30,
    latency: 8,
    errors: 0.05,
    connections: 45,
    version: "v2.5.0",
    impactIfFailed: { servicesAffected: 1, sessionsBlocked: 12000, revenueLossHr: 84000 }
  },
  "order-svc": {
    id: "order-svc",
    name: "order-service (Java)",
    type: "service",
    status: "healthy",
    cpu: 22,
    mem: 41,
    latency: 15,
    errors: 0.08,
    connections: 76,
    version: "v2.3.8",
    impactIfFailed: { servicesAffected: 2, sessionsBlocked: 18000, revenueLossHr: 54000 }
  },
  "notification-svc": {
    id: "notification-svc",
    name: "notification-service (Python)",
    type: "service",
    status: "healthy",
    cpu: 12,
    mem: 25,
    latency: 42,
    errors: 0.2,
    connections: 30,
    version: "v1.9.2",
    impactIfFailed: { servicesAffected: 0, sessionsBlocked: 4500, revenueLossHr: 12000 }
  }
};

export default function DependencyGraphPage() {
  const [simulationMode, setSimulationMode] = useState<"normal" | "failure">("normal");
  const [selectedNode, setSelectedNode] = useState<string>("orders-db");

  const nodes = { ...serviceNodes };

  // Apply failure simulation states dynamically
  if (simulationMode === "failure") {
    nodes["orders-db"] = {
      ...nodes["orders-db"],
      status: "critical", cpu: 98, mem: 94, latency: 450, errors: 48.5, connections: 100
    };
    nodes["auth-svc"] = {
      ...nodes["auth-svc"],
      status: "critical", cpu: 100, mem: 98, latency: 1250, errors: 94.2
    };
    nodes["payment-svc"] = {
      ...nodes["payment-svc"],
      status: "degraded", cpu: 45, mem: 52, latency: 3400, errors: 78.4
    };
    nodes["order-svc"] = {
      ...nodes["order-svc"],
      status: "degraded", cpu: 52, mem: 60, latency: 3200, errors: 65.2
    };
    nodes["notification-svc"] = {
      ...nodes["notification-svc"],
      status: "warning", cpu: 15, mem: 28, latency: 4500, errors: 32.0
    };
  }

  const activeNode = nodes[selectedNode];

  return (
    <AppShell title="Service Dependency Graph" subtitle="Interactive real-time service topology, communication vectors, and cascading blast-radius simulation">
      {/* Simulation Controls */}
      <motion.div 
        className="card" 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          marginBottom: 16, 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          background: simulationMode === "failure" ? "linear-gradient(135deg, rgba(239,68,68,0.04), rgba(10,16,32,0.95))" : "var(--bg-card)",
          borderColor: simulationMode === "failure" ? "rgba(239,68,68,0.3)" : "var(--border)"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="section-label" style={{ marginBottom: 0 }}>Cluster Topology State</span>
            {simulationMode === "failure" && (
              <span className="dot-animate" style={{ width: 8, height: 8, background: "var(--accent-red)" }} />
            )}
          </div>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>
            {simulationMode === "normal" 
              ? "Running in live production state. Metrics operating inside historical thresholds." 
              : "ALERT: Database ALTER TABLE lock cascade failure propagation simulated."}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => { setSimulationMode("normal"); if (selectedNode === "orders-db") setSelectedNode("orders-db"); }}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: simulationMode === "normal" ? "var(--accent-cyan-glow)" : "var(--bg-input)",
              color: simulationMode === "normal" ? "var(--accent-cyan)" : "var(--text-secondary)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            ✓ Live Healthy Topology
          </button>
          <button
            onClick={() => setSimulationMode("failure")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              background: simulationMode === "failure" ? "var(--accent-red)" : "var(--bg-input)",
              color: simulationMode === "failure" ? "#fff" : "var(--text-secondary)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: simulationMode === "failure" ? "0 0 14px rgba(239,68,68,0.25)" : "none",
              transition: "all 0.2s"
            }}
          >
            ⚡ Simulate Cascading Failure
          </button>
        </div>
      </motion.div>

      {/* Main Graph Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
        {/* SVG Node Canvas */}
        <motion.div 
          className="card" 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          style={{ position: "relative", minHeight: 460, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
        >
          <div className="section-label" style={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}>Topology Map Canvas (SVG)</div>
          
          {/* SVG Connection Paths */}
          <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}>
            <defs>
              <linearGradient id="normalGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--accent-cyan)" />
                <stop offset="100%" stopColor="var(--accent-green)" />
              </linearGradient>
              <linearGradient id="failureGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--accent-red)" />
                <stop offset="100%" stopColor="var(--accent-orange)" />
              </linearGradient>
            </defs>

            {/* Connecting Lines based on positioning */}
            {/* DB to Auth (Center vertical) */}
            <path 
              d="M 280 90 L 280 180" 
              stroke={simulationMode === "failure" ? "var(--accent-red)" : "var(--accent-cyan)"} 
              strokeWidth="2.5"
              strokeDasharray={simulationMode === "failure" ? "4 4" : "none"}
              style={{
                strokeDashoffset: simulationMode === "failure" ? 100 : 0,
                animation: simulationMode === "failure" ? "shimmer 2s linear infinite" : "none"
              }}
              fill="none" 
            />

            {/* Auth to Payment (Left fork) */}
            <path 
              d="M 280 230 C 280 260, 160 260, 160 290" 
              stroke={simulationMode === "failure" ? "var(--accent-red)" : "var(--accent-cyan)"} 
              strokeWidth="2"
              fill="none" 
            />

            {/* Auth to Order (Right fork) */}
            <path 
              d="M 280 230 C 280 260, 400 260, 400 290" 
              stroke={simulationMode === "failure" ? "var(--accent-red)" : "var(--accent-cyan)"} 
              strokeWidth="2"
              fill="none" 
            />

            {/* Payment & Order converging to Notification */}
            <path 
              d="M 160 340 C 160 370, 280 370, 280 400" 
              stroke={simulationMode === "failure" ? "var(--accent-orange)" : "var(--accent-green)"} 
              strokeWidth="2"
              fill="none" 
            />
            <path 
              d="M 400 340 C 400 370, 280 370, 280 400" 
              stroke={simulationMode === "failure" ? "var(--accent-orange)" : "var(--accent-green)"} 
              strokeWidth="2"
              fill="none" 
            />
          </svg>

          {/* Absolute HTML Nodes */}
          <div style={{ position: "relative", width: "100%", height: "100%", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 34, padding: "20px 0" }}>
            
            {/* Database Node */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedNode("orders-db")}
              style={{
                width: 170,
                padding: 12,
                borderRadius: 10,
                border: `2.5px solid ${selectedNode === "orders-db" ? "var(--accent-cyan)" : (nodes["orders-db"].status === "critical" ? "var(--accent-red)" : "var(--border)")}`,
                background: "var(--bg-card)",
                cursor: "pointer",
                boxShadow: nodes["orders-db"].status === "critical" ? "0 0 15px rgba(239,68,68,0.2)" : "var(--shadow-card)",
                textAlign: "center",
                transition: "all 0.15s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", color: nodes["orders-db"].status === "critical" ? "var(--accent-red)" : "var(--accent-cyan)", marginBottom: 6 }}>
                <Database size={20} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 800 }}>orders-db</div>
              <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>PostgreSQL Database</div>
              <div style={{ marginTop: 6 }}>
                <span className={`badge badge-${nodes["orders-db"].status}`}>
                  {nodes["orders-db"].status}
                </span>
              </div>
            </motion.div>

            {/* Auth Service Node */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedNode("auth-svc")}
              style={{
                width: 170,
                padding: 12,
                borderRadius: 10,
                border: `2px solid ${selectedNode === "auth-svc" ? "var(--accent-cyan)" : (nodes["auth-svc"].status === "critical" ? "var(--accent-red)" : "var(--border)")}`,
                background: "var(--bg-card)",
                cursor: "pointer",
                boxShadow: nodes["auth-svc"].status === "critical" ? "0 0 15px rgba(239,68,68,0.2)" : "var(--shadow-card)",
                textAlign: "center",
                transition: "all 0.15s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", color: nodes["auth-svc"].status === "critical" ? "var(--accent-red)" : "var(--accent-cyan)", marginBottom: 6 }}>
                <Cpu size={20} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 800 }}>auth-service</div>
              <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>Session Cache Auth</div>
              <div style={{ marginTop: 6 }}>
                <span className={`badge badge-${nodes["auth-svc"].status}`}>
                  {nodes["auth-svc"].status}
                </span>
              </div>
            </motion.div>

            {/* Fork Row (Payment and Order Services in Parallel) */}
            <div style={{ display: "flex", gap: 80, width: "100%", justifyContent: "center" }}>
              {/* Payment Service Node */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedNode("payment-svc")}
                style={{
                  width: 160,
                  padding: 12,
                  borderRadius: 10,
                  border: `2px solid ${selectedNode === "payment-svc" ? "var(--accent-cyan)" : (nodes["payment-svc"].status === "degraded" ? "var(--accent-orange)" : "var(--border)")}`,
                  background: "var(--bg-card)",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.15s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "center", color: nodes["payment-svc"].status === "degraded" ? "var(--accent-orange)" : "var(--accent-cyan)", marginBottom: 6 }}>
                  <Layers size={18} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 800 }}>payment-service</div>
                <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>Stripe API Core</div>
                <div style={{ marginTop: 6 }}>
                  <span className={`badge badge-${nodes["payment-svc"].status}`}>
                    {nodes["payment-svc"].status}
                  </span>
                </div>
              </motion.div>

              {/* Order Service Node */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedNode("order-svc")}
                style={{
                  width: 160,
                  padding: 12,
                  borderRadius: 10,
                  border: `2px solid ${selectedNode === "order-svc" ? "var(--accent-cyan)" : (nodes["order-svc"].status === "degraded" ? "var(--accent-orange)" : "var(--border)")}`,
                  background: "var(--bg-card)",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.15s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "center", color: nodes["order-svc"].status === "degraded" ? "var(--accent-orange)" : "var(--accent-cyan)", marginBottom: 6 }}>
                  <Layers size={18} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 800 }}>order-service</div>
                <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>Cart & Checkout</div>
                <div style={{ marginTop: 6 }}>
                  <span className={`badge badge-${nodes["order-svc"].status}`}>
                    {nodes["order-svc"].status}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Notification Service Node */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedNode("notification-svc")}
              style={{
                width: 170,
                padding: 12,
                borderRadius: 10,
                border: `2px solid ${selectedNode === "notification-svc" ? "var(--accent-cyan)" : "var(--border)"}`,
                background: "var(--bg-card)",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.15s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", color: "var(--accent-green)", marginBottom: 6 }}>
                <Layers size={18} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 800 }}>notification-service</div>
              <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>Slack & Webhooks</div>
              <div style={{ marginTop: 6 }}>
                <span className={`badge badge-${nodes["notification-svc"].status}`}>
                  {nodes["notification-svc"].status}
                </span>
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* Details Panel & Impact Analysis */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Node Metrics Details */}
          <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div className="section-label" style={{ marginBottom: 0 }}>Node Telemetry Details</div>
              <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "var(--accent-cyan)", fontWeight: 700 }}>
                {activeNode.version}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: activeNode.status === "critical" ? "rgba(239,68,68,0.1)" : "var(--accent-cyan-glow)",
                color: activeNode.status === "critical" ? "var(--accent-red)" : "var(--accent-cyan)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {activeNode.type === "database" ? <Database size={20} /> : <Cpu size={20} />}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>{activeNode.name}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>Active Version Node Config</div>
              </div>
            </div>

            {/* Metrics display */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                { label: "CPU Usage", val: `${activeNode.cpu}%`, icon: <Cpu size={12} />, limit: 80 },
                { label: "Memory Usage", val: `${activeNode.mem}%`, icon: <Activity size={12} />, limit: 80 },
                { label: "P99 Latency", val: `${activeNode.latency}ms`, icon: <Clock size={12} />, limit: 200 },
                { label: "Error Rate", val: `${activeNode.errors}%`, icon: <AlertTriangle size={12} />, limit: 5 }
              ].map((met, idx) => {
                const isOverLimit = activeNode.status === "critical" || activeNode.status === "degraded" ? parseFloat(met.val) > met.limit : false;
                return (
                  <div key={idx} style={{ padding: 10, borderRadius: 8, background: "var(--bg-input)", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase" }}>
                      {met.icon}
                      <span>{met.label}</span>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: isOverLimit ? "var(--accent-red)" : "var(--text-primary)", marginTop: 4 }}>
                      {met.val}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Blast Radius Impact Analysis */}
          <motion.div 
            className="card" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.15 }}
            style={{ 
              background: simulationMode === "failure" ? "linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(10, 16, 32, 0.95))" : "var(--bg-card)",
              borderColor: simulationMode === "failure" ? "rgba(239, 68, 68, 0.3)" : "var(--border)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div className="section-label" style={{ marginBottom: 0 }}>Impact & Blast Radius Analysis</div>
              <span className="badge badge-high">PROPAGATION SCAN</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Downstream Services Blocked", val: `${activeNode.impactIfFailed.servicesAffected} Services`, icon: <Network size={16} />, color: activeNode.impactIfFailed.servicesAffected > 0 ? "var(--accent-red)" : "var(--text-muted)" },
                { label: "Active Sessions Blocked", val: activeNode.impactIfFailed.sessionsBlocked.toLocaleString(), icon: <Users size={16} />, color: activeNode.impactIfFailed.servicesAffected > 0 ? "var(--accent-orange)" : "var(--text-muted)" },
                { label: "Estimated Risk Loss / Hour", val: `$${activeNode.impactIfFailed.revenueLossHr.toLocaleString()}`, icon: <DollarSign size={16} />, color: activeNode.impactIfFailed.servicesAffected > 0 ? "var(--accent-red)" : "var(--text-muted)" }
              ].map((imp, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, background: "var(--bg-input)", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)" }}>
                  <div style={{ color: imp.color, display: "flex", alignItems: "center" }}>
                    {imp.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text-primary)" }}>{imp.val}</div>
                    <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, marginTop: 1 }}>{imp.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {simulationMode === "failure" ? (
              <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 8, background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-red)", display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <ShieldAlert size={14} className="dot-animate" />
                  <span>Cascading Failure Alert</span>
                </div>
                <div style={{ fontSize: 10, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                  Orders-db primary failure has cascaded through auth-service to block payment-service checkout workflows. <strong>Immediate isolation rollback required.</strong>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 8, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-green)", display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Activity size={14} />
                  <span>Isolation Boundaries Stable</span>
                </div>
                <div style={{ fontSize: 10, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                  Service network connections are running stably. Live request traffic checks show zero transaction blocks or routing bottlenecks.
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
