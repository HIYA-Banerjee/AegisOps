"use client";

import AppShell from "@/components/AppShell";
import RiskBadge from "@/components/RiskBadge";
import { mockTeams, TeamPerformance } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Users, Award, ShieldAlert, TrendingUp, Clock, Calendar, CheckCircle2, AlertTriangle, GitCommit } from "lucide-react";

const trendData: Record<string, { week: string; rate: number }[]> = {
  "Core Platform": [
    { week: "Wk 1", rate: 95 }, { week: "Wk 2", rate: 97 }, { week: "Wk 3", rate: 98 }, { week: "Wk 4", rate: 98.4 }
  ],
  "Auth & Security": [
    { week: "Wk 1", rate: 92 }, { week: "Wk 2", rate: 89 }, { week: "Wk 3", rate: 94 }, { week: "Wk 4", rate: 95.8 }
  ],
  "API Gateway": [
    { week: "Wk 1", rate: 88 }, { week: "Wk 2", rate: 91 }, { week: "Wk 3", rate: 90 }, { week: "Wk 4", rate: 94.2 }
  ],
  "Billing & Subscriptions": [
    { week: "Wk 1", rate: 85 }, { week: "Wk 2", rate: 84 }, { week: "Wk 3", rate: 89 }, { week: "Wk 4", rate: 91.5 }
  ],
  "Data Pipelines": [
    { week: "Wk 1", rate: 80 }, { week: "Wk 2", rate: 78 }, { week: "Wk 3", rate: 82 }, { week: "Wk 4", rate: 84.1 }
  ]
};

export default function TeamInsightsPage() {
  const [selectedTeamName, setSelectedTeamName] = useState<string>("Core Platform");

  const activeTeam = mockTeams.find(t => t.name === selectedTeamName) || mockTeams[0];

  const mostStableTeam = [...mockTeams].sort((a, b) => b.stabilityScore - a.stabilityScore)[0];
  const highestRiskTeam = [...mockTeams].sort((a, b) => a.stabilityScore - b.stabilityScore)[0];

  return (
    <AppShell title="Team Performance Insights" subtitle="Correlate team-specific deployment frequencies, code quality trends, DORA lead times, and risk mitigations">
      
      {/* Top Highlights: Most Stable & Highest Risk */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Most Stable Team Spotlight */}
        <motion.div 
          className="card" 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(8, 14, 28, 0.95))",
            borderColor: "rgba(16, 185, 129, 0.35)",
            display: "flex",
            alignItems: "center",
            gap: 16
          }}
        >
          <div style={{ 
            width: 44, height: 44, borderRadius: 10, background: "rgba(16, 185, 129, 0.15)", color: "var(--accent-green)",
            display: "flex", alignItems: "center", flexShrink: 0,
            alignSelf: "center", justifyContent: "center"
          }}>
            <Award size={22} />
          </div>
          <div>
            <span style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Most Stable Team (Leaderboard 1st)</span>
            <div style={{ fontSize: 18, fontWeight: 900, color: "var(--accent-green)", marginTop: 2 }}>{mostStableTeam.name}</div>
            <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
              Stability Score: <strong>{mostStableTeam.stabilityScore}%</strong> · Success Rate: <strong>{mostStableTeam.successRate}%</strong> · Lead Time: <strong>{mostStableTeam.leadTimeDays}d</strong>
            </p>
          </div>
        </motion.div>

        {/* Highest Risk Spotlight */}
        <motion.div 
          className="card" 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{ 
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(8, 14, 28, 0.95))",
            borderColor: "rgba(239, 68, 68, 0.35)",
            display: "flex",
            alignItems: "center",
            gap: 16
          }}
        >
          <div style={{ 
            width: 44, height: 44, borderRadius: 10, background: "rgba(239, 68, 68, 0.15)", color: "var(--accent-red)",
            display: "flex", alignItems: "center", flexShrink: 0,
            alignSelf: "center", justifyContent: "center"
          }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <span style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Highest Risk Repository (Leaderboard 5th)</span>
            <div style={{ fontSize: 18, fontWeight: 900, color: "var(--accent-red)", marginTop: 2 }}>{highestRiskTeam.name}</div>
            <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
              Stability Score: <strong>{highestRiskTeam.stabilityScore}%</strong> · Total Outages: <strong>{highestRiskTeam.failures} failures</strong> · Lead Time: <strong>{highestRiskTeam.leadTimeDays}d</strong>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Insights Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
        {/* Left Column: Team Leaderboard */}
        <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>DevOps Stability Leaderboard</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mockTeams.map((team, idx) => {
              const isSelected = team.name === selectedTeamName;
              return (
                <motion.div
                  key={team.name}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedTeamName(team.name)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: `1.5px solid ${isSelected ? "var(--accent-cyan)" : "var(--border)"}`,
                    background: isSelected ? "var(--accent-cyan-glow)" : "var(--bg-input)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.15s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {/* Position Number */}
                    <span style={{ fontSize: 13, fontWeight: 900, color: isSelected ? "var(--accent-cyan)" : "var(--text-muted)", width: 14 }}>
                      #{idx + 1}
                    </span>

                    {/* Team Avatar & Name */}
                    <div style={{ 
                      width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
                      color: "#fff", display: "flex", alignItems: "center", fontSize: 11, fontWeight: 800,
                      alignSelf: "center", justifyContent: "center"
                    }}>
                      {team.avatar}
                    </div>

                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>{team.name}</div>
                      <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>
                        {team.deployments} deploys · {team.commits} commits · {team.preventedFailures} AI blocks
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: team.stabilityScore >= 85 ? "var(--accent-green)" : (team.stabilityScore >= 75 ? "var(--accent-orange)" : "var(--accent-red)") }}>
                      {team.stabilityScore}%
                    </div>
                    <span style={{ fontSize: 8, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>STABILITY</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Column: Dynamic Recharts Trend & Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Selected Team Detail Telemetry */}
          <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div className="section-label" style={{ marginBottom: 0 }}>Team Telemetry Metrics</div>
              <RiskBadge level={activeTeam.stabilityScore >= 85 ? "low" : (activeTeam.stabilityScore >= 75 ? "medium" : "critical")} label={activeTeam.stabilityScore >= 85 ? "ELITE CLASS" : "RISK GAP"} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                { label: "Deployment success", val: `${activeTeam.successRate}%`, icon: <CheckCircle2 size={12} />, color: "var(--accent-green)" },
                { label: "Average Lead Time", val: `${activeTeam.leadTimeDays} days`, icon: <Clock size={12} />, color: "var(--accent-cyan)" },
                { label: "AI Preempted Blocks", val: `${activeTeam.preventedFailures} prevented`, icon: <TrendingUp size={12} />, color: "var(--accent-purple)" },
                { label: "Unstable releases", val: `${activeTeam.failures} failures`, icon: <AlertTriangle size={12} />, color: activeTeam.failures > 2 ? "var(--accent-red)" : "var(--text-muted)" }
              ].map((sub, idx) => (
                <div key={idx} style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    {sub.icon}
                    <span>{sub.label}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: sub.color, marginTop: 4 }}>
                    {sub.val}
                  </div>
                </div>
              ))}
            </div>

            {/* DORA deployment frequency indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 8, padding: 8 }}>
              <GitCommit size={14} style={{ color: "var(--accent-cyan)", flexShrink: 0 }} />
              <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>
                Core telemetry scans verify <strong>{activeTeam.name}</strong> satisfies the <strong>Elite DORA classification</strong> under standard release cycles.
              </div>
            </div>
          </motion.div>

          {/* Success Trend Recharts */}
          <motion.div className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="section-label">Success Rate Trend — 4 Weeks</div>
            
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={trendData[selectedTeamName as keyof typeof trendData]} margin={{ top: 5, right: 10, bottom: 0, left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={10} />
                <YAxis stroke="var(--text-muted)" fontSize={10} domain={[60, 100]} />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 11 }} />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  name="Success Rate %" 
                  stroke="var(--accent-purple)" 
                  strokeWidth={2} 
                  dot={{ fill: "var(--accent-purple)", r: 3 }} 
                  activeDot={{ r: 5 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
