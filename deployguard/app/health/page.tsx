"use client";

import AppShell from "@/components/AppShell";
import GaugeChart from "@/components/GaugeChart";
import { motion } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, Heart, Shield, Server, Activity, GitBranch, Users } from "lucide-react";

const radarData = [
  { dim: "Deployment", score: 91 },
  { dim: "Infrastructure", score: 80 },
  { dim: "Security", score: 72 },
  { dim: "Reliability", score: 78 },
  { dim: "Observability", score: 88 },
  { dim: "Team Velocity", score: 85 },
];

const trendData = [
  { d: "Jan", score: 71 }, { d: "Feb", score: 74 }, { d: "Mar", score: 69 },
  { d: "Apr", score: 79 }, { d: "May", score: 84 },
];

const subScores = [
  { label: "Deployment Health",    score: 91, icon: <GitBranch size={16} />, color: "var(--accent-green)",   trend: "+3",  desc: "4.2 deploys/day · 95% success rate" },
  { label: "Infrastructure Health",score: 80, icon: <Server size={16} />,    color: "var(--accent-cyan)",    trend: "-2",  desc: "CPU 92% critical · 3/4 nodes healthy" },
  { label: "Security Health",      score: 72, icon: <Shield size={16} />,    color: "var(--accent-orange)",  trend: "+5",  desc: "1 critical CVE · 72/100 OWASP score" },
  { label: "Reliability",          score: 78, icon: <Activity size={16} />,  color: "var(--accent-cyan)",    trend: "+1",  desc: "99.2% uptime · MTTR 47 min" },
  { label: "Observability",        score: 88, icon: <Heart size={16} />,     color: "var(--accent-green)",   trend: "+6",  desc: "Full metrics, logs, traces coverage" },
  { label: "Team Velocity",        score: 85, icon: <Users size={16} />,     color: "var(--accent-purple)",  trend: "+4",  desc: "Lead time 11hr · CFR 5%" },
];

const recommendations = [
  { priority: "P1", text: "Rotate exposed AWS_SECRET_KEY immediately", impact: "+8 security score", color: "var(--accent-red)" },
  { priority: "P2", text: "Fix DB migration process — use CONCURRENTLY", impact: "+5 deployment score", color: "var(--accent-orange)" },
  { priority: "P2", text: "Increase auth-service memory limit to 768Mi", impact: "+4 infra score", color: "var(--accent-orange)" },
  { priority: "P3", text: "Upgrade lodash and express to patched versions", impact: "+3 security score", color: "var(--accent-cyan)" },
  { priority: "P3", text: "Add CORS restriction to production API", impact: "+2 security score", color: "var(--accent-cyan)" },
  { priority: "P4", text: "Improve test coverage from 60% → 80%", impact: "+4 deployment score", color: "var(--text-muted)" },
];

const getScoreColor = (s: number) =>
  s >= 85 ? "var(--accent-green)" : s >= 70 ? "var(--accent-orange)" : "var(--accent-red)";

export default function HealthPage() {
  return (
    <AppShell title="DevOps Health Score" subtitle="Holistic AI-generated score across all DevOps dimensions">
      {/* Main score + sub-scores */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, marginBottom: 16 }}>
        {/* Overall gauge */}
        <motion.div
          className="card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 24px", minWidth: 260 }}
        >
          <div className="section-label" style={{ textAlign: "center", marginBottom: 12 }}>Overall Score</div>
          <GaugeChart
            value={84}
            size={130}
            strokeWidth={12}
            color="var(--accent-cyan)"
            sublabel="OVERALL"
            unit=""
          />
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 750, color: "var(--accent-cyan)" }}>Good Standing</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>Top 24% of similar teams</div>
          </div>

          {/* Why Score Dropped panel */}
          <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 8, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", width: "100%" }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: "var(--accent-red)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>⚠️ Score drop factors:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 9, color: "var(--text-secondary)" }}>
              <div>• Cluster memory saturation: <strong style={{ color: "var(--accent-orange)" }}>+12%</strong></div>
              <div>• Request latency overhead: <strong style={{ color: "var(--accent-orange)" }}>+8%</strong></div>
              <div>• Failed deployments (24hr): <strong style={{ color: "var(--accent-red)" }}>+3%</strong></div>
            </div>
          </div>
        </motion.div>

        {/* Sub-score grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {subScores.map((s, i) => (
            <motion.div
              key={i}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{ position: "relative", overflow: "hidden", padding: "16px" }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ color: s.color }}>{s.icon}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {s.trend.startsWith("+") ? <TrendingUp size={11} style={{ color: "var(--accent-green)" }} /> : <TrendingDown size={11} style={{ color: "var(--accent-red)" }} />}
                  <span style={{ fontSize: 10, fontWeight: 700, color: s.trend.startsWith("+") ? "var(--accent-green)" : "var(--accent-red)" }}>{s.trend}</span>
                </div>
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: getScoreColor(s.score), lineHeight: 1 }}>{s.score}</div>
              <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.4 }}>{s.desc}</div>
              {/* Mini score bar */}
              <div style={{ marginTop: 8, height: 3, borderRadius: 2, background: "var(--border)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.score}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.08, ease: "easeOut" }}
                  style={{ height: "100%", borderRadius: 2, background: s.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Radar chart */}
        <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <div className="section-label">Health Radar</div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="dim" stroke="var(--text-muted)" fontSize={11} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="var(--border)" tick={false} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="var(--accent-cyan)"
                fill="var(--accent-cyan)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v: any) => [`${v}/100`, "Score"]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Score trend */}
        <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }}>
          <div className="section-label">Score History — 5 Months</div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="d" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} domain={[60, 100]} />
              <Tooltip
                contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v: any) => [`${v}/100`, "Health Score"]}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--accent-cyan)"
                strokeWidth={3}
                dot={{ fill: "var(--accent-cyan)", r: 5, strokeWidth: 2, stroke: "var(--bg-card)" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
        <div className="section-label">AI Improvement Recommendations</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 }}>
          {recommendations.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.05 }}
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: "var(--bg-input)",
                border: `1px solid ${r.color}25`,
                borderLeft: `3px solid ${r.color}`,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <span style={{
                flexShrink: 0,
                fontSize: 9,
                fontWeight: 800,
                padding: "3px 6px",
                borderRadius: 4,
                background: `${r.color}18`,
                color: r.color,
                border: `1px solid ${r.color}30`,
              }}>
                {r.priority}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>{r.text}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent-green)" }}>→ {r.impact}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 8, background: "var(--accent-cyan-glow)", border: "1px solid rgba(0,212,255,0.2)", fontSize: 12, color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--accent-cyan)" }}>💡 AI Projection:</strong> Implementing all P1 and P2 recommendations would bring your overall score from <strong>84 → 96</strong> within 2 sprint cycles.
        </div>
      </motion.div>
    </AppShell>
  );
}
