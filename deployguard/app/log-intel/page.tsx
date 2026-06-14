"use client";

import AppShell from "@/components/AppShell";
import LogViewer from "@/components/LogViewer";
import GaugeChart from "@/components/GaugeChart";
import { motion } from "framer-motion";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, TrendingUp, Bug, Zap } from "lucide-react";

const sources = ["All Sources", "Application", "Server", "Kubernetes", "Docker"];

const anomalies = [
  { id: "ANO-001", type: "error", msg: "DB connection timeout spike — 340 errors/min", severity: "critical", score: 97, time: "2 min ago" },
  { id: "ANO-002", type: "warn",  msg: "Memory leak pattern in auth-service heap",    severity: "high",     score: 84, time: "7 min ago" },
  { id: "ANO-003", type: "warn",  msg: "Abnormal request latency — P99: 2.4s",       severity: "high",     score: 78, time: "12 min ago" },
  { id: "ANO-004", type: "info",  msg: "Unusual deployment at 07:31 (off-hours)",    severity: "medium",   score: 61, time: "14 min ago" },
  { id: "ANO-005", type: "warn",  msg: "Redis eviction rate: 340 keys/s (10× avg)", severity: "medium",   score: 55, time: "18 min ago" },
];

const hourlyData = Array.from({ length: 12 }, (_, i) => ({
  h: `${(7 + i).toString().padStart(2, "0")}:00`,
  errors: Math.floor(Math.random() * 80 + (i === 11 ? 340 : 10)),
  warns: Math.floor(Math.random() * 40 + (i === 11 ? 120 : 5)),
}));

const sevColors: Record<string, string> = {
  critical: "var(--accent-red)",
  high: "var(--accent-orange)",
  medium: "var(--accent-cyan)",
};

export default function LogIntelPage() {
  const [source, setSource] = useState("All Sources");

  return (
    <AppShell title="Log Intelligence System" subtitle="AI anomaly detection across all log sources">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Anomaly score */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <GaugeChart value={89} size={110} strokeWidth={10} color="var(--accent-red)" label="Anomaly Score" sublabel="/100" unit="" />
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Log Intelligence Status</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "Errors/min", val: "340", bad: true },
                { label: "Anomalies", val: "5 active", bad: true },
                { label: "Patterns",  val: "12 detected", bad: false },
                { label: "Streams",   val: "8 live", bad: false },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", width: 80 }}>{s.label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: s.bad ? "var(--accent-red)" : "var(--accent-green)" }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Error chart */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="section-label">Error Rate — Last 12hrs</div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={hourlyData} margin={{ top: 0, right: 5, bottom: 0, left: -25 }}>
              <XAxis dataKey="h" stroke="var(--text-muted)" fontSize={9} />
              <YAxis stroke="var(--text-muted)" fontSize={9} />
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="errors" name="Errors" fill="var(--accent-red)" opacity={0.8} radius={[2, 2, 0, 0]} />
              <Bar dataKey="warns" name="Warnings" fill="var(--accent-orange)" opacity={0.7} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Anomaly list */}
        <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="section-label">Detected Anomalies</div>
          {anomalies.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: "var(--bg-input)",
                border: `1px solid ${sevColors[a.severity] || "var(--border-subtle)"}30`,
                borderLeft: `3px solid ${sevColors[a.severity] || "var(--text-muted)"}`,
                marginBottom: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)" }}>{a.id}</span>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: sevColors[a.severity], textTransform: "uppercase" }}>{a.severity}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800, color: sevColors[a.severity] }}>{a.score}</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>{a.msg}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{a.time}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Log stream */}
        <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="section-label" style={{ marginBottom: 0 }}>Live Log Stream</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {sources.map((s) => (
                <button
                  key={s}
                  onClick={() => setSource(s)}
                  style={{
                    padding: "3px 8px",
                    borderRadius: 6,
                    border: `1px solid ${source === s ? "var(--accent-cyan)" : "var(--border)"}`,
                    background: source === s ? "var(--accent-cyan-glow)" : "var(--bg-input)",
                    color: source === s ? "var(--accent-cyan)" : "var(--text-muted)",
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <LogViewer height={280} />
        </motion.div>
      </div>

      {/* Pattern analysis */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="section-label">AI Error Pattern Analysis</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {[
            { icon: <Bug size={16} />, title: "Connection Timeout Loop", count: "340/min", desc: "Recursive DB reconnection attempts causing connection pool exhaustion", color: "var(--accent-red)" },
            { icon: <TrendingUp size={16} />, title: "Memory Growth Pattern", count: "+15MB/min", desc: "Heap size increasing linearly — classic memory leak signature", color: "var(--accent-orange)" },
            { icon: <AlertTriangle size={16} />, title: "Cascade Failure Chain", count: "6 services", desc: "Auth failure → session miss → payment retry → order timeout", color: "var(--accent-orange)" },
            { icon: <Zap size={16} />, title: "Latency Spike Cluster", count: "847ms P99", desc: "All high-latency requests correlated with DB lock wait events", color: "var(--accent-cyan)" },
          ].map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              style={{ padding: "14px", borderRadius: 8, background: "var(--bg-input)", border: `1px solid ${p.color}25` }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: p.color }}>
                {p.icon}
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: p.color }}>{p.count}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{p.title}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>{p.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AppShell>
  );
}
