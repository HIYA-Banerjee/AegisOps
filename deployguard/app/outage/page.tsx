"use client";

import AppShell from "@/components/AppShell";
import GaugeChart from "@/components/GaugeChart";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { Zap, TrendingUp, Clock, AlertTriangle, DollarSign, CloudLightning } from "lucide-react";

const histData = [
  { d: "Mon", prob: 23 }, { d: "Tue", prob: 31 }, { d: "Wed", prob: 18 },
  { d: "Thu", prob: 44 }, { d: "Fri", prob: 67 }, { d: "Sat", prob: 55 },
  { d: "Sun", prob: 81 },
];

const riskFactors = [
  { label: "DB Connection Rate", contrib: 34, trend: "+15%/hr" },
  { label: "Error Rate vs Baseline", contrib: 24, trend: "3× baseline" },
  { label: "Memory Growth Rate",  contrib: 18, trend: "+15%/hr" },
  { label: "Auth Service Failure",contrib: 15, trend: "DOWN" },
  { label: "Disk I/O Saturation", contrib: 9,  trend: "87%" },
];

const forecasts = [
  { horizon: "1 Hour Ahead", prob: 86, color: "var(--accent-red)", desc: "Cascading thread pools fully exhausted", trend: "▲ +12% rising", ci: "84% – 88%" },
  { horizon: "6 Hours Ahead", prob: 91, color: "var(--accent-red)", desc: "Active API request timeouts and failures", trend: "▲ +5% rising", ci: "89% – 93%" },
  { horizon: "24 Hours Ahead", prob: 95, color: "var(--accent-red)", desc: "Cluster-wide memory exhaustion OOM state", trend: "▬ stable", ci: "93% – 97%" },
];

export default function OutagePage() {
  const [countdown, setCountdown] = useState(7200); // 2 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const h = Math.floor(countdown / 3600);
  const m = Math.floor((countdown % 3600) / 60);
  const s = countdown % 60;

  return (
    <AppShell title="Outage Prediction Engine" subtitle="Predict outages hours before they occur using ML signals and advanced forecasting horizons">
      {/* Main prediction banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: "24px",
          borderRadius: 12,
          background: "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(251,191,36,0.06))",
          border: "1px solid rgba(239,68,68,0.4)",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "rgba(239,68,68,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--accent-red)",
            animation: "pulse-ring 2s ease-in-out infinite",
          }}>
            <Zap size={28} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Potential Outage Detected</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "var(--accent-red)" }}>Probability: 81%</div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Estimated Time to Outage</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 36, fontWeight: 800, color: "var(--accent-orange)" }}>
            {h.toString().padStart(2, "0")}:{m.toString().padStart(2, "0")}:{s.toString().padStart(2, "0")}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Countdown to predicted impact window</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ padding: "10px 20px", borderRadius: 8, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 2 }}>ESTIMATED LOSS</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--accent-red)" }}>$165,000 / hr</div>
          </div>
          <button style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "var(--accent-red)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            🔔 Page On-Call Team
          </button>
        </div>
      </motion.div>

      {/* Forecasting horizons & cost curve */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Outage Forecasting Horizons */}
        <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="section-label">AI Outage Forecasting Horizon Grid</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {forecasts.map((f, i) => (
              <div key={i} style={{ padding: "12px", borderRadius: 8, background: "var(--bg-input)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 14 }}>
                <CloudLightning size={20} style={{ color: f.color }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 750, color: "var(--text-primary)" }}>{f.horizon} Prediction</span>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: f.trend.includes("rising") ? "var(--accent-red-glow)" : "var(--bg-card)", color: f.trend.includes("rising") ? "var(--accent-red)" : "var(--text-muted)" }}>
                      {f.trend}
                    </span>
                  </div>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>{f.desc}</div>
                  <div style={{ fontSize: 8, color: "var(--accent-cyan)", fontWeight: 700, marginTop: 4 }}>Confidence Bounds: [{f.ci}]</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: f.color }}>{f.prob}%</div>
                  <span style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>OUTAGE RISK</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Business Cost Impact Estimator */}
        <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="section-label">Outage Revenue Cost Curve Estimator</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { duration: "5 min Outage Duration", cost: "$3,500 Loss", color: "var(--accent-green)", pct: 15 },
              { duration: "15 min Outage Duration", cost: "$12,000 Loss", color: "var(--accent-orange)", pct: 45 },
              { duration: "30 min Outage Duration", cost: "$26,000 Loss", color: "var(--accent-red)", pct: 75 },
              { duration: "60 min Outage Duration", cost: "$58,000 Loss", color: "var(--accent-red)", pct: 100 },
            ].map((c, i) => (
              <div key={i} style={{ padding: "10px", borderRadius: 8, background: "var(--bg-input)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: "var(--text-secondary)" }}>{c.duration}</span>
                  <span style={{ fontWeight: 800, color: c.color }}>{c.cost}</span>
                </div>
                <div className="progress-bar" style={{ height: 4 }}>
                  <div style={{ width: `${c.pct}%`, height: "100%", background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Risk factors */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="section-label">Contributing Risk Factors</div>
          {riskFactors.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              style={{ marginBottom: 14 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{f.label}</span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--accent-red)" }}>{f.trend}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-orange)" }}>{f.contrib}%</span>
                </div>
              </div>
              <div className="progress-bar" style={{ height: 5 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${f.contrib * 2.5}%` }}
                  transition={{ duration: 1, delay: 0.4 + i * 0.07, ease: "easeOut" }}
                  style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, var(--accent-red), var(--accent-orange))` }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Historical chart */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="section-label">7-Day Outage Probability Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={histData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="lineG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="d" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <ReferenceLine y={70} stroke="rgba(239,68,68,0.5)" strokeDasharray="4 4" label={{ value: "Alert threshold", fill: "var(--accent-red)", fontSize: 10 }} />
              <Line type="monotone" dataKey="prob" name="Outage Prob %" stroke="var(--accent-red)" strokeWidth={2.5} dot={{ fill: "var(--accent-red)", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", fontSize: 11, color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--accent-red)" }}>Today's 81%</strong> is the highest probability recorded this week. Previous outage on Wednesday: 18% (false alarm). Model accuracy: 91.4%.
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
