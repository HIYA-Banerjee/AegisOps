"use client";

import AppShell from "@/components/AppShell";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useCostMetrics } from "@/hooks/useMetrics";
import { formatCurrency } from "@/lib/utils";
import { 
  AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid 
} from "recharts";
import { DollarSign, ShieldAlert, TrendingDown, ArrowUpRight, TrendingUp, AlertTriangle } from "lucide-react";

// Synthesized Cost Metrics
const monthlySpendData = [
  { month: "Jan", actual: 48000, forecast: 46000 },
  { month: "Feb", actual: 52000, forecast: 50000 },
  { month: "Mar", actual: 59000, forecast: 54000 },
  { month: "Apr", actual: 61000, forecast: 58000 },
  { month: "May", actual: 65800, forecast: 62000 },
];

const cloudShareData = [
  { name: "AWS (Elastic)", value: 41200, color: "#ff9900" },
  { name: "GCP (BigQuery)", value: 18400, color: "#4285f4" },
  { name: "Azure (AD)", value: 6200, color: "#0078d4" },
];

const costAnomaliesFallback = [
  { id: "anom-1", service: "payment-service (AWS)", amount: "+$1,100", reason: "Spike in container scaling triggers", time: "2 hrs ago" },
  { id: "anom-2", service: "data-pipeline (GCP)", amount: "+$2,400", reason: "Unoptimized query scans on BigQuery", time: "1 day ago" },
];

export default function CostPage() {
  const { data: costData } = useCostMetrics();

  const costAnomalies = useMemo(() => {
    if (!costData) return costAnomaliesFallback;
    return costData
      .filter((c) => c.anomalyDetected)
      .map((c) => ({
        id: c.serviceName,
        service: `${c.serviceName} (${c.provider.toUpperCase()})`,
        amount: `+${formatCurrency(c.forecastCost - c.currentCost)}`,
        reason: `Forecast ${formatCurrency(c.forecastCost)} vs current ${formatCurrency(c.currentCost)}`,
        time: "recent",
      }));
  }, [costData]);

  const totalSpend = useMemo(
    () => costData?.reduce((acc, c) => acc + c.currentCost, 0) ?? 65800,
    [costData]
  );

  const anomalyCount = costAnomalies.length;

  return (
    <AppShell title="Cost Intelligence Platform" subtitle="Analyze multi-cloud cloud spends, detect anomalies, and forecast SRE resource costs">
      <div className="space-y-6">

        {/* Cost KPI Overview */}
        <div className="grid-metrics">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="section-label">Month-To-Date Spend</p>
                <h3 className="text-3xl font-bold font-mono text-cyan">{formatCurrency(totalSpend)}</h3>
              </div>
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-muted mt-4">+$3,800 vs budget projection</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="section-label">Forecasted Spends</p>
                <h3 className="text-3xl font-bold font-mono" style={{ color: "var(--accent-purple)" }}>$78,200</h3>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
                <TrendingUp className="w-6 h-6" style={{ color: "var(--accent-purple)" }} />
              </div>
            </div>
            <p className="text-xs text-muted mt-4">Targeting 5% lower via rightsizing</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="section-label">Optimization Savings</p>
                <h3 className="text-3xl font-bold font-mono text-green">$11,400</h3>
              </div>
              <div className="p-2.5 rounded-lg bg-green-500/10 text-green">
                <TrendingDown className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-muted mt-4">12 rightsizing recommendations active</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="section-label">Active Anomalies</p>
                <h3 className="text-3xl font-bold font-mono text-red-400">{anomalyCount} Anomalies</h3>
              </div>
              <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-muted mt-4">Auto-remediation triggers enabled</p>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid-2">
          {/* Spend Timeline Area */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
            <h3 className="text-sm font-semibold mb-4">Cost Growth & Forecast Curves</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySpendData}>
                  <defs>
                    <linearGradient id="spendGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                  <Area type="monotone" dataKey="actual" stroke="var(--accent-cyan)" fillOpacity={1} fill="url(#spendGlow)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="forecast" stroke="var(--accent-purple)" strokeDasharray="5 5" fill="none" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Cloud Share Distribution */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
            <h3 className="text-sm font-semibold mb-4">Cloud Provider Allocations</h3>
            <div className="h-64 flex items-center justify-between">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={cloudShareData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                      {cloudShareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-4 pr-4">
                {cloudShareData.map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                      <span className="font-semibold">{c.name}</span>
                    </div>
                    <span className="font-mono text-secondary">${c.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Anomalies List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" /> Active Cloud Budget Anomalies
            </h3>
            <span className="badge badge-high">Action Recommended</span>
          </div>

          <div className="space-y-4">
            {costAnomalies.map((anom) => (
              <div key={anom.id} className="p-4 rounded-xl flex justify-between items-center border hover:border-red-500/40 transition-colors" style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}>
                <div>
                  <h4 className="text-sm font-bold text-red-400">{anom.service}</h4>
                  <p className="text-xs text-secondary mt-1">{anom.reason}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-red-400">{anom.amount}</span>
                  <p className="text-xs text-muted mt-1">{anom.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </AppShell>
  );
}
