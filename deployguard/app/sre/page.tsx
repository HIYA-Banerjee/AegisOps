"use client";

import AppShell from "@/components/AppShell";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSLOMetrics } from "@/hooks/useMetrics";
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from "recharts";
import { Activity, Clock, ShieldAlert, Heart, Zap, ShieldCheck, AlertTriangle } from "lucide-react";

// Synthetic SRE data
const reliabilityTrend = [
  { day: "Mon", availability: 99.99, latency: 124 },
  { day: "Tue", availability: 99.98, latency: 130 },
  { day: "Wed", availability: 99.95, latency: 145 },
  { day: "Thu", availability: 99.99, latency: 118 },
  { day: "Fri", availability: 99.99, latency: 112 },
  { day: "Sat", availability: 100.0, latency: 95 },
  { day: "Sun", availability: 99.99, latency: 98 },
];

const errorBudgetBurn = [
  { time: "00:00", budget: 100 },
  { time: "04:00", budget: 98 },
  { time: "08:00", budget: 95 },
  { time: "12:00", budget: 88 },
  { time: "16:00", budget: 87 },
  { time: "20:00", budget: 85 },
  { time: "24:00", budget: 84 },
];

const slosFallback = [
  { id: "slo-1", name: "Core API Latency", type: "Latency", target: "99.0% < 200ms", current: "99.42%", budget: "58% remaining", status: "healthy" },
  { id: "slo-2", name: "Checkout Success Rate", type: "Availability", target: "99.9% success", current: "99.94%", budget: "40% remaining", status: "healthy" },
  { id: "slo-3", name: "Notification Delivery", type: "Throughput", target: "95.0% < 2s", current: "94.85%", budget: "-15% breached", status: "breached" },
  { id: "slo-4", name: "Database Pool Queue Depth", type: "Saturation", target: "< 10 active", current: "1.2 avg", budget: "92% remaining", status: "healthy" },
];

export default function SREPage() {
  const { data: sloData } = useSLOMetrics();
  const [activeTab, setActiveTab] = useState<"slos" | "incidents" | "postmortems">("slos");

  const slos = sloData?.map((slo) => ({
    id: slo.sloId,
    name: slo.name,
    type: "Availability",
    target: `${slo.targetPercent}%`,
    current: `${slo.currentPercent}%`,
    budget: `${slo.errorBudgetPercent}% remaining`,
    status: slo.status,
  })) ?? slosFallback;

  const breachedCount = slos.filter((s) => s.status === "breached").length;

  return (
    <AppShell title="SRE Reliability Center" subtitle="Monitor error budgets, SLA/SLO performance, and auto-remediation triggers">
      <div className="space-y-6">
        
        {/* KPI Row */}
        <div className="grid-metrics">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="section-label">Overall Availability</p>
                <h3 className="text-2xl font-bold font-mono">99.982%</h3>
              </div>
              <div className="p-2.5 rounded-lg bg-green-500/10 text-green">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-muted mt-4">满足 99.95% SLA 承诺 (Elite)</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="section-label">Error Budget Status</p>
                <h3 className="text-2xl font-bold font-mono">84.2%</h3>
              </div>
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan">
                <Heart className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-muted mt-4">15.8% consumed this month</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="section-label">Mean Time to Restore</p>
                <h3 className="text-2xl font-bold font-mono">24.5 min</h3>
              </div>
              <div className="p-2.5 rounded-lg bg-yellow-500/10 text-yellow-500">
                <Clock className="w-5 h-5" style={{ color: "var(--accent-orange)" }} />
              </div>
            </div>
            <p className="text-xs text-muted mt-4">Improvement of 12% vs last cycle</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="section-label">Auto-Healing Rate</p>
                <h3 className="text-2xl font-bold font-mono">91.4%</h3>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
                <Zap className="w-5 h-5" style={{ color: "var(--accent-purple)" }} />
              </div>
            </div>
            <p className="text-xs text-muted mt-4">32 of 35 minor issues resolved by agent</p>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid-2">
          {/* Availability & Latency History */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan" /> Availability & Latency Timeline
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reliabilityTrend}>
                  <defs>
                    <linearGradient id="availGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="left" domain={[99.9, 100.0]} stroke="var(--accent-cyan)" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" domain={[80, 160]} stroke="var(--text-secondary)" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                  <Area yAxisId="left" type="monotone" dataKey="availability" stroke="var(--accent-cyan)" fillOpacity={1} fill="url(#availGlow)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="latency" stroke="var(--text-secondary)" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Error Budget Burn Rate */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" style={{ color: "var(--accent-red)" }} /> Error Budget Burn Track
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={errorBudgetBurn}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis domain={[80, 100]} stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                  <Line type="monotone" dataKey="budget" stroke="var(--accent-red)" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* SLO Status Cards & Details */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold">Service Level Objectives (SLOs)</h3>
            <span className={`badge ${breachedCount > 0 ? "badge-critical" : "badge-low"}`}>
              {breachedCount > 0 ? `${breachedCount} SLO Breached` : "All Systems Operational"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <th className="pb-3 font-semibold text-muted">Objective</th>
                  <th className="pb-3 font-semibold text-muted">Type</th>
                  <th className="pb-3 font-semibold text-muted">Target Boundary</th>
                  <th className="pb-3 font-semibold text-muted">Current Value</th>
                  <th className="pb-3 font-semibold text-muted">Remaining Error Budget</th>
                  <th className="pb-3 font-semibold text-muted text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {slos.map((slo) => (
                  <tr key={slo.id} className="hover:bg-slate-800/5 transition-colors">
                    <td className="py-4 font-semibold">{slo.name}</td>
                    <td className="py-4 text-secondary">{slo.type}</td>
                    <td className="py-4 font-mono text-secondary">{slo.target}</td>
                    <td className="py-4 font-mono font-semibold">{slo.current}</td>
                    <td className={`py-4 font-mono font-semibold ${slo.status === 'breached' ? 'text-red-400' : 'text-green'}`}>
                      {slo.budget}
                    </td>
                    <td className="py-4 text-right">
                      <span className={`badge ${slo.status === 'breached' ? 'badge-critical' : 'badge-low'}`}>
                        {slo.status === 'breached' ? 'Breached' : 'Healthy'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </AppShell>
  );
}
