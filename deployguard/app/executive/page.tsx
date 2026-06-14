"use client";

import AppShell from "@/components/AppShell";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid 
} from "recharts";
import { TrendingUp, Coins, Activity, Zap, CheckCircle2, ShieldAlert } from "lucide-react";

// Executive high level KPIs
const cadenceData = [
  { month: "Jan", deployments: 142, incidents: 8 },
  { month: "Feb", deployments: 168, incidents: 5 },
  { month: "Mar", deployments: 185, incidents: 12 },
  { month: "Apr", deployments: 210, incidents: 4 },
  { month: "May", deployments: 245, incidents: 3 },
];

const teamHealthSummary = [
  { name: "Core Platform", score: 94, success: 98.4, cost: "$12,400" },
  { name: "Auth & Security", score: 89, success: 95.8, cost: "$8,500" },
  { name: "API Gateway", score: 87, success: 94.2, cost: "$14,200" },
  { name: "Billing & Subscriptions", score: 78, success: 91.5, cost: "$5,800" },
  { name: "Data Pipelines", score: 65, success: 84.1, cost: "$24,900" },
];

export default function ExecutivePage() {
  return (
    <AppShell title="Executive Command Center" subtitle="High-level engineering alignment, cost efficiencies, and quality health scores">
      <div className="space-y-6">

        {/* C-Suite Metrics Grid */}
        <div className="grid-metrics">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="section-label">Enterprise Health Index</p>
                <h3 className="text-3xl font-bold font-mono text-cyan">87.5/100</h3>
              </div>
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-muted mt-4">Calculated across 5 core DevOps layers</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="section-label">Monthly Cloud Spend</p>
                <h3 className="text-3xl font-bold font-mono" style={{ color: "var(--accent-purple)" }}>$65,800</h3>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
                <Coins className="w-6 h-6" style={{ color: "var(--accent-purple)" }} />
              </div>
            </div>
            <p className="text-xs text-muted mt-4">Within 92% of target budget limits</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="section-label">Incident Revenue Saved</p>
                <h3 className="text-3xl font-bold font-mono text-green">$142,500</h3>
              </div>
              <div className="p-2.5 rounded-lg bg-green-500/10 text-green">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-muted mt-4">Prevented by AI proactive rollbacks</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="section-label">Reliability Index</p>
                <h3 className="text-3xl font-bold font-mono text-green">99.98%</h3>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-green">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-muted mt-4">SLA target commitments fully satisfied</p>
          </motion.div>
        </div>

        {/* High-level performance chart */}
        <div className="grid-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card col-span-1">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan" /> Deployment Velocity & Incidents Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cadenceData}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                  <Bar dataKey="deployments" fill="var(--accent-cyan)" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="incidents" fill="var(--accent-red)" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Core Business Risk Warnings */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card col-span-1 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-yellow-500" style={{ color: "var(--accent-orange)" }} /> Platform Governance & Risk Focus
              </h3>
              <div className="space-y-4">
                <div className="p-3.5 rounded-lg flex items-start gap-3 bg-red-500/5 border border-red-500/20">
                  <div className="p-1 rounded bg-red-500/10 text-red-400 mt-0.5">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-red-400">Critical Resource Saturation Risk</h4>
                    <p className="text-xs text-muted mt-1">Data Pipelines team success rate degraded to 84.1%. Proactive action recommended.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg flex items-start gap-3 bg-yellow-500/5 border border-yellow-500/20">
                  <div className="p-1 rounded bg-yellow-500/10 text-yellow-500 mt-0.5" style={{ color: "var(--accent-orange)" }}>
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-yellow-500" style={{ color: "var(--accent-orange)" }}>Cloud Budget Spikes</h4>
                    <p className="text-xs text-muted mt-1">Payment service spend is 14% higher than budget forecast due to high connection limits.</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted mt-4 text-center">Security auditing scans show zero compliance leaks.</p>
          </motion.div>
        </div>

        {/* Business Unit breakdown */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
          <h3 className="text-sm font-semibold mb-4">Engineering Team KPI Health Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                  <th className="pb-3 font-semibold text-muted">DevOps Team</th>
                  <th className="pb-3 font-semibold text-muted">Stability Index</th>
                  <th className="pb-3 font-semibold text-muted">Deployment Success Rate</th>
                  <th className="pb-3 font-semibold text-muted">Estimated Cloud Cost</th>
                  <th className="pb-3 font-semibold text-muted text-right">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {teamHealthSummary.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/5 transition-colors">
                    <td className="py-4 font-semibold">{t.name}</td>
                    <td className="py-4 font-mono font-semibold">{t.score}/100</td>
                    <td className="py-4 font-mono">{t.success}%</td>
                    <td className="py-4 font-mono text-secondary">{t.cost}</td>
                    <td className="py-4 text-right">
                      <span className={`badge ${t.score > 85 ? 'badge-low' : (t.score > 70 ? 'badge-high' : 'badge-critical')}`}>
                        {t.score > 85 ? 'Optimized' : (t.score > 70 ? 'Warning' : 'Needs Review')}
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
