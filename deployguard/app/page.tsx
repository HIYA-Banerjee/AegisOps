"use client";

import AppShell from "@/components/AppShell";
import AnimatedBar from "@/components/AnimatedBar";
import MetricCard from "@/components/MetricCard";
import RiskBadge from "@/components/RiskBadge";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useDeployments } from "@/hooks/useDeployments";
import { useIncidents } from "@/hooks/useIncidents";
import { useLiveMetrics } from "@/hooks/useLiveMetrics";
import { formatTimeAgo } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import {
  AlertTriangle, Server, Activity, Clock,
  CheckCircle2, XCircle, AlertCircle,
  LayoutDashboard, Bell, MessageSquare, AlertOctagon, Send, Shield, Zap
} from "lucide-react";

const sparkData = [
  { t: "00:00", cpu: 45, mem: 58 },
  { t: "02:00", cpu: 52, mem: 61 },
  { t: "04:00", cpu: 48, mem: 63 },
  { t: "06:00", cpu: 67, mem: 70 },
  { t: "08:00", cpu: 74, mem: 75 },
  { t: "10:00", cpu: 80, mem: 79 },
  { t: "12:00", cpu: 92, mem: 85 },
];

const statusConfig = {
  failed:  { color: "var(--accent-red)",    icon: <XCircle size={14} />,       label: "FAILED" },
  ok:      { color: "var(--accent-green)",   icon: <CheckCircle2 size={14} />,  label: "OK" },
  partial: { color: "var(--accent-orange)", icon: <AlertCircle size={14} />,   label: "PARTIAL" },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: 8, padding: "10px 14px", fontSize: 12,
    }}>
      <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}%
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { deployments: allDeployments, isLoading: deploymentsLoading } = useDeployments();
  const { incidents: allIncidents, isLoading: incidentsLoading } = useIncidents();
  const { data: liveMetrics } = useLiveMetrics("svc-auth", 10000);

  const recentDeployments = useMemo(
    () => allDeployments.slice(0, 4).map((d) => ({
      version: d.version,
      env: d.env,
      status: d.status,
      msg: d.msg,
      ago: d.ago || formatTimeAgo(d.timestamp),
    })),
    [allDeployments]
  );

  const activeIncidents = useMemo(
    () => allIncidents.filter((i) => i.status !== "resolved"),
    [allIncidents]
  );

  const mttrMinutes = useMemo(() => {
    const resolved = allIncidents.filter((i) => i.status === "resolved");
    if (!resolved.length) return 47;
    return Math.round(resolved.reduce((acc, i) => acc + i.durationMin, 0) / resolved.length);
  }, [allIncidents]);

  const activeIncidentSummary = useMemo(() => {
    if (!activeIncidents.length) return "No active incidents";
    const labels = activeIncidents.slice(0, 2).map((i) => `${i.severity}: ${i.service.split("-")[0]}`);
    return labels.join(" · ");
  }, [activeIncidents]);

  const [activeAlerts, setActiveAlerts] = useState(false);
  const [triggerPD, setTriggerPD] = useState(false);
  const [triggerSlack, setTriggerSlack] = useState(false);
  const [triggerTeams, setTriggerTeams] = useState(false);

  const simulateAlertEngine = () => {
    setActiveAlerts(true);
    // Cascade alert timings
    setTimeout(() => setTriggerSlack(true), 200);
    setTimeout(() => setTriggerPD(true), 1200);
    setTimeout(() => setTriggerTeams(true), 2200);

    // Fade out automatically
    setTimeout(() => {
      setTriggerSlack(false);
      setTriggerPD(false);
      setTriggerTeams(false);
      setActiveAlerts(false);
    }, 7500);
  };

  return (
    <AppShell title="Dashboard" subtitle="Real-time DevOps failure prediction & proactive reliability intelligence overview">
      {/* Outage Alert Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="alert-banner"
        style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "rgba(239,68,68,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-red)",
            flexShrink: 0,
            animation: "pulse-ring 2s ease-in-out infinite",
          }}
        >
          <AlertTriangle size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: "var(--accent-red)", fontSize: 14 }}>
            Outage Probability: 81% — within 2 hours
          </div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
            Memory +15%/hr · DB connections 94% · Error rate 3× baseline · auth-service DOWN
          </div>
        </div>
        <RiskBadge level="critical" pulse />
      </motion.div>

      {/* KPI Metrics Row */}
      <div className="grid-metrics" style={{ marginBottom: 20 }}>
        <MetricCard
          label="Health Score"
          value={84}
          unit="/100"
          trend="down"
          trendValue="Dropped (Memory Spikes +12%, DB lock +8%)"
          icon={<Activity size={16} />}
          accentColor="var(--accent-cyan)"
          index={0}
        />
        <MetricCard
          label="Deploy / Day"
          value="4.2"
          trend="up"
          trendValue="Elite tier ✓"
          icon={<LayoutDashboard size={16} />}
          accentColor="var(--accent-green)"
          index={1}
        />
        <MetricCard
          label="Active Incidents"
          value={incidentsLoading ? "—" : activeIncidents.length}
          trend="up"
          trendValue={activeIncidentSummary}
          icon={<AlertTriangle size={16} />}
          accentColor="var(--accent-red)"
          index={2}
        />
        <MetricCard
          label="MTTR"
          value={incidentsLoading ? "—" : String(mttrMinutes)}
          unit=" min"
          trend="neutral"
          trendValue="Target <1hr · On track"
          icon={<Clock size={16} />}
          accentColor="var(--accent-purple)"
          index={3}
        />
        <MetricCard
          label="AI Failures Prevented"
          value={7}
          trend="up"
          trendValue="Auto-Shield active"
          icon={<Shield size={16} />}
          accentColor="var(--accent-purple)"
          index={4}
        />
        <MetricCard
          label="Infrastructure Health"
          value={87}
          unit="/100"
          trend="up"
          trendValue="Cluster metrics stable"
          icon={<Server size={16} />}
          accentColor="var(--accent-cyan)"
          index={5}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid-dashboard-2" style={{ marginBottom: 16 }}>
        {/* Live Infrastructure */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{ minWidth: 0 }}
        >
          <div className="section-label">Live Infrastructure</div>
          <AnimatedBar label="CPU" value={liveMetrics?.cpu ?? 92} index={0} threshold={85} />
          <AnimatedBar label="Memory" value={liveMetrics?.memory ?? 81} index={1} threshold={80} />
          <AnimatedBar label="DB Connections" value={liveMetrics?.dbConnections ?? 98} index={2} threshold={90} />
          <AnimatedBar label="Disk I/O" value={liveMetrics?.diskIo ?? 43} index={3} />
          <AnimatedBar label="Network" value={liveMetrics?.network ?? 37} color="var(--accent-cyan)" index={4} />
        </motion.div>

        {/* CPU/Memory Chart */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          style={{ minWidth: 0 }}
        >
          <div className="section-label">Resource Trend — 12hr</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={sparkData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="t" stroke="var(--text-muted)" fontSize={10} />
              <YAxis stroke="var(--text-muted)" fontSize={10} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cpu" name="CPU" stroke="#ef4444" fill="url(#cpuGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="mem" name="Memory" stroke="var(--accent-cyan)" fill="url(#memGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid-dashboard-asym" style={{ marginBottom: 16 }}>
        {/* Recent Deployments */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ minWidth: 0 }}
        >
          <div className="section-label">Recent Deployments</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(deploymentsLoading ? [] : recentDeployments).map((d, i) => {
              const sc = statusConfig[d.status as keyof typeof statusConfig];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "12px 14px",
                    borderRadius: 8,
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: sc.color,
                      marginTop: 4,
                      flexShrink: 0,
                      boxShadow: `0 0 8px ${sc.color}80`,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>
                        {d.version}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>→</span>
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{d.env}</span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "1px 7px",
                          borderRadius: 4,
                          background: `${sc.color}18`,
                          color: sc.color,
                          border: `1px solid ${sc.color}40`,
                          textTransform: "uppercase",
                        }}
                      >
                        {d.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{d.msg}</div>
                  </div>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", flexShrink: 0 }}>
                    {d.ago}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Column: Alert Simulator + Outage Horizons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          {/* Slack/Teams Enterprise Alert Integration Simulator */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.06), rgba(0,212,255,0.04))", borderColor: "rgba(139,92,246,0.25)" }}
          >
            <div className="section-label">Enterprise Alert Engine Simulator</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
              AegisOps AI continuously aggregates telemetry to auto-alert engineering channels via webhook integration once risk threshold bounds are crossed.
              <br /><br />
              <strong>Trigger Condition:</strong> Failure Risk &gt; 80%
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ padding: 10, borderRadius: 8, background: "var(--bg-input)", border: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text-muted)" }}>ACTIVE INTEGRATIONS</span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                  <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "rgba(0,212,255,0.1)", color: "var(--accent-cyan)" }}>Slack Hook</span>
                  <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "rgba(139,92,246,0.1)", color: "var(--accent-purple)" }}>MS Teams</span>
                  <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "rgba(239,68,68,0.1)", color: "var(--accent-red)" }}>PagerDuty</span>
                </div>
              </div>

              <button
                onClick={simulateAlertEngine}
                disabled={activeAlerts}
                style={{
                  borderRadius: 8, border: "none",
                  background: activeAlerts ? "var(--border)" : "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
                  color: activeAlerts ? "var(--text-muted)" : "#fff",
                  fontSize: 12, fontWeight: 800, cursor: activeAlerts ? "default" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s",
                }}
              >
                <Send size={13} />
                {activeAlerts ? "Alerts Sent ✅" : "Test Alert Integration"}
              </button>
            </div>
          </motion.div>

          {/* AI Outage Forecasting Mini-Widget */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ 
              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.04), rgba(8, 14, 28, 0.95))",
              borderColor: "rgba(239, 68, 68, 0.25)"
            }}
          >
            <div className="section-label" style={{ color: "var(--accent-red)", display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <Zap size={12} className="dot-animate" style={{ color: "var(--accent-red)" }} />
              AI Outage Forecasting Horizon
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { horizon: "1 Hour Horizon", prob: 86, color: "var(--accent-orange)" },
                { horizon: "6 Hours Horizon", prob: 91, color: "var(--accent-red)" },
                { horizon: "24 Hours Horizon", prob: 95, color: "var(--accent-red)" }
              ].map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-input)", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 750, color: "var(--text-primary)" }}>{h.horizon}</div>
                    <span style={{ fontSize: 8, color: "var(--text-muted)" }}>Predictive State Bounds</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="progress-bar" style={{ width: 60, height: 5 }}>
                      <div style={{ width: `${h.prob}%`, height: "100%", background: h.color, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 900, color: h.color }}>{h.prob}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Simulated Alert Notifications (Toast Slide-in Stack) */}
      <div style={{ position: "fixed", bottom: 20, right: 20, display: "flex", flexDirection: "column", gap: 10, zIndex: 9999, width: 340 }}>
        <AnimatePresence>
          {/* Slack Alert Toast */}
          {triggerSlack && (
            <motion.div
              initial={{ opacity: 0, x: 50, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              style={{ padding: "12px 14px", borderRadius: 10, background: "#1a1d21", borderLeft: "4px solid #36c5f0", boxShadow: "0 10px 25px rgba(0,0,0,0.5)", display: "flex", gap: 10, alignItems: "start" }}
            >
              <MessageSquare size={16} style={{ color: "#36c5f0", marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#36c5f0", textTransform: "uppercase" }}>Slack Notification</div>
                <div style={{ fontSize: 11, color: "#e2e8f0", marginTop: 2 }}><strong>#sre-deploy-alerts</strong>: Outage probability hit **81%**! Deployment v2.5.0 blocked automatically.</div>
              </div>
            </motion.div>
          )}

          {/* PagerDuty Alert Toast */}
          {triggerPD && (
            <motion.div
              initial={{ opacity: 0, x: 50, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              style={{ padding: "12px 14px", borderRadius: 10, background: "#0a1e0f", borderLeft: "4px solid #00ff88", boxShadow: "0 10px 25px rgba(0,0,0,0.5)", display: "flex", gap: 10, alignItems: "start" }}
            >
              <AlertOctagon size={16} style={{ color: "#00ff88", marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#00ff88", textTransform: "uppercase" }}>PagerDuty Alert</div>
                <div style={{ fontSize: 11, color: "#e2e8f0", marginTop: 2 }}><strong>Incident #4521</strong>: P0 Critical Triggered — orders-db lock bottleneck. Paging primary on-call team.</div>
              </div>
            </motion.div>
          )}

          {/* Teams Alert Toast */}
          {triggerTeams && (
            <motion.div
              initial={{ opacity: 0, x: 50, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              style={{ padding: "12px 14px", borderRadius: 10, background: "#1f1f2e", borderLeft: "4px solid #a78bfa", boxShadow: "0 10px 25px rgba(0,0,0,0.5)", display: "flex", gap: 10, alignItems: "start" }}
            >
              <Bell size={16} style={{ color: "#a78bfa", marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#a78bfa", textTransform: "uppercase" }}>MS Teams Alert</div>
                <div style={{ fontSize: 11, color: "#e2e8f0", marginTop: 2 }}><strong>Ops-Copilot Channel</strong>: AI recommendation runbook generated for DB index blocks.</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
