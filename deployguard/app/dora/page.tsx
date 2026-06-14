"use client";

import AppShell from "@/components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useDORAMetrics } from "@/hooks/useMetrics";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, PieChart, Pie,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, Activity, Clock, RefreshCw, AlertTriangle, FileText, Download, CheckCircle2 } from "lucide-react";

const deployFreqData = [
  { day: "Mon", deploys: 5 }, { day: "Tue", deploys: 7 }, { day: "Wed", deploys: 4 },
  { day: "Thu", deploys: 8 }, { day: "Fri", deploys: 6 }, { day: "Sat", deploys: 2 },
  { day: "Sun", deploys: 3 },
];

const leadTimeData = [
  { week: "W1", hours: 18 }, { week: "W2", hours: 14 }, { week: "W3", hours: 21 },
  { week: "W4", hours: 12 }, { week: "W5", hours: 9 }, { week: "W6", hours: 11 },
];

const mttrData = [
  { month: "Jan", min: 65 }, { month: "Feb", min: 52 }, { month: "Mar", min: 78 },
  { month: "Apr", min: 43 }, { month: "May", min: 47 },
];

const cfrData = [
  { name: "Success", value: 87, color: "#00ff88" },
  { name: "Changed", value: 8,  color: "#fbbf24" },
  { name: "Failed",  value: 5,  color: "#ef4444" },
];

const doraMetricsFallback = [
  {
    label: "Deployment Frequency",
    value: "4.2/day",
    tier: "Elite",
    trend: "up",
    trendVal: "+12% vs last month",
    icon: <Activity size={20} />,
    color: "var(--accent-green)",
    desc: "Multiple deploys per day — Elite DORA tier",
  },
  {
    label: "Lead Time for Changes",
    value: "11 hrs",
    tier: "High",
    trend: "down",
    trendVal: "–3hr vs last week",
    icon: <Clock size={20} />,
    color: "var(--accent-cyan)",
    desc: "Time from commit to production",
  },
  {
    label: "Mean Time to Restore",
    value: "47 min",
    tier: "Medium",
    trend: "up",
    trendVal: "+4min vs last month",
    icon: <RefreshCw size={20} />,
    color: "var(--accent-orange)",
    desc: "Average incident recovery time",
  },
  {
    label: "Change Failure Rate",
    value: "5%",
    tier: "Medium",
    trend: "down",
    trendVal: "–2% this month",
    icon: <AlertTriangle size={20} />,
    color: "var(--accent-red)",
    desc: "% of deployments causing incidents",
  },
];

const tierColors: Record<string, string> = {
  Elite: "var(--accent-green)",
  High: "var(--accent-cyan)",
  Medium: "var(--accent-orange)",
  Low: "var(--accent-red)",
};

export default function DORAPage() {
  const { data: doraData } = useDORAMetrics();
  const [generating, setGenerating] = useState(false);
  const [reportSaved, setReportSaved] = useState(false);

  const doraMetrics = useMemo(() => {
    if (!doraData) return doraMetricsFallback;
    return [
      { ...doraMetricsFallback[0], value: `${doraData.deploymentFrequency}/day`, tier: doraData.tier },
      { ...doraMetricsFallback[1], value: `${doraData.leadTimeHours} hrs` },
      { ...doraMetricsFallback[2], value: `${doraData.meanTimeToRestoreMinutes} min` },
      { ...doraMetricsFallback[3], value: `${doraData.changeFailureRatePercent}%` },
    ];
  }, [doraData]);

  const startGeneration = () => {
    setGenerating(true);
    setReportSaved(false);
    setTimeout(() => {
      setGenerating(false);
      setReportSaved(true);
      setTimeout(() => setReportSaved(false), 4000);
    }, 1800);
  };

  return (
    <AppShell title="DORA Metrics & Team Productivity" subtitle="Track engineering performance with key DevOps Research and Assessment metrics">
      {/* DORA metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 20 }}>
        {doraMetrics.map((m, i) => (
          <motion.div
            key={i}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{ position: "relative", overflow: "hidden" }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${m.color}, transparent)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ color: m.color }}>{m.icon}</div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: `${tierColors[m.tier]}18`, color: tierColors[m.tier], border: `1px solid ${tierColors[m.tier]}30` }}>
                {m.tier} Tier
              </span>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: m.color, marginBottom: 4 }}>{m.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: m.trend === "up" && m.label !== "Deployment Frequency" ? "var(--accent-red)" : "var(--accent-green)" }}>
              {m.trend === "up" ? <TrendingUp size={11} /> : m.trend === "down" ? <TrendingDown size={11} /> : <Minus size={11} />}
              {m.trendVal}
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>{m.desc}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Deploy frequency chart */}
        <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
          <div className="section-label">Deployment Frequency — This Week</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={deployFreqData} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="deploys" name="Deployments" fill="var(--accent-green)" radius={[4, 4, 0, 0]} opacity={0.85}>
                {deployFreqData.map((entry, i) => (
                  <Cell key={i} fill={entry.deploys >= 7 ? "var(--accent-cyan)" : "var(--accent-green)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Lead time chart */}
        <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <div className="section-label">Lead Time for Changes — 6 Weeks</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={leadTimeData} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(v) => [`${v}h`, "Lead Time"]} />
              <Line type="monotone" dataKey="hours" name="Hours" stroke="var(--accent-cyan)" strokeWidth={2.5} dot={{ fill: "var(--accent-cyan)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* MTTR chart */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <div className="section-label">Mean Time to Restore — Monthly</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={mttrData} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(v) => [`${v} min`, "MTTR"]} />
              <Bar dataKey="min" name="Minutes" fill="var(--accent-orange)" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Change failure rate */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="section-label">Change Failure Rate Breakdown</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={cfrData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                  {cfrData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {cfrData.map((d, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? "1px solid var(--border-subtle)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }} />
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{d.name}</span>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 14, color: d.color }}>{d.value}%</span>
                </div>
              ))}
              <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: 6, background: "var(--bg-input)", fontSize: 11, color: "var(--text-muted)" }}>
                Target CFR: &lt;5% · Current: 5% · Borderline
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Weekly Report & PDF Generator */}
      <motion.div 
        className="card" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.55 }} 
        style={{ 
          background: "linear-gradient(135deg, rgba(0,212,255,0.06), rgba(139,92,246,0.04))", 
          borderColor: "rgba(0,212,255,0.3)" 
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(0,212,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-cyan)" }}>
                <FileText size={22} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Generate AI DevOps Performance Report</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                  Weekly DORA performance analysis and automated SRE diagnostic recommendations.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <AnimatePresence>
                {reportSaved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.25)", color: "var(--accent-green)", fontSize: 11, fontWeight: 700 }}
                  >
                    <CheckCircle2 size={13} />
                    <span>AegisOps_Weekly_Report.pdf downloaded!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={startGeneration}
                disabled={generating}
                style={{
                  padding: "10px 20px", borderRadius: 8, border: "none",
                  background: generating ? "var(--border)" : "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
                  color: generating ? "var(--text-muted)" : "#fff",
                  fontSize: 12, fontWeight: 800, cursor: generating ? "default" : "pointer",
                  display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
                }}
              >
                <Download size={13} />
                {generating ? "Compiling DORA stats..." : "Compile & Download PDF"}
              </button>
            </div>
          </div>

          {/* Compilation progress feedback */}
          {generating && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              style={{ background: "var(--bg-input)", padding: 12, borderRadius: 8, border: "1px solid var(--border)", fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}
            >
              <div style={{ color: "var(--accent-cyan)", fontWeight: 700, marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
                <span>Report Compiler Pipeline</span>
                <span className="dot-animate" style={{ background: "var(--accent-cyan)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, color: "var(--text-secondary)" }}>
                <div>[1/3] Parsing deployment logs (42 records) and rollback traces... SUCCESS</div>
                <div>[2/3] Resolving SBOM packages license compatibility tree... SUCCESS</div>
                <div>[3/3] Assembling charts and compiling PDF layout... IN PROGRESS</div>
              </div>
            </motion.div>
          )}

          {/* Document Preview Card */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: 10, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-green)" }} />
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.08em" }}>Weekly Report Preview (May 24 – May 31, 2026)</span>
              </div>
              <span style={{ fontSize: 9, color: "var(--text-muted)" }}>Doc Ref: DG-REP-4122</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Remediation & Stability Recommendations</div>
                <p style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Deploy frequency remains at <strong>Elite tier</strong>. However, the database locks onALTER TABLE indices represent the highest critical threat vector, degrading MTTR to <strong>47 minutes</strong>. 
                  AI recommends restricting unindexed migrations and deploying predictive scaling policies (+2 pods) during peak transaction gates.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Deployments", val: "42", desc: "Elite tier" },
                  { label: "Failures", val: "3", desc: "MTTR 47m" },
                  { label: "AI Prevented", val: "7", desc: "Outages blocked" },
                  { label: "Avg Health", val: "87/100", desc: "Stable bounds" }
                ].map((s, i) => (
                  <div key={i} style={{ background: "var(--bg-input)", padding: 8, borderRadius: 6, border: "1px solid var(--border-subtle)", textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "var(--accent-cyan)" }}>{s.val}</div>
                    <div style={{ fontSize: 8, color: "var(--text-secondary)", fontWeight: 700, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}
