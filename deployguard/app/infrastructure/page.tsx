"use client";

import AppShell from "@/components/AppShell";
import AnimatedBar from "@/components/AnimatedBar";
import GaugeChart from "@/components/GaugeChart";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Server, Container, Cpu, HardDrive, Wifi } from "lucide-react";

const timeData = Array.from({ length: 24 }, (_, i) => ({
  h: `${i.toString().padStart(2, "0")}:00`,
  cpu: Math.min(95, 40 + Math.random() * 50 + (i > 18 ? 20 : 0)),
  mem: Math.min(95, 55 + Math.random() * 30 + (i > 18 ? 10 : 0)),
  net: Math.min(90, 20 + Math.random() * 40),
}));

const pods = [
  { name: "auth-svc-7f4d9",    status: "critical", cpu: 94, mem: 92 },
  { name: "payment-svc-3a2b1", status: "warning",  cpu: 78, mem: 81 },
  { name: "api-gw-5c8d3",      status: "ok",       cpu: 42, mem: 56 },
  { name: "order-svc-1e9f0",   status: "ok",       cpu: 35, mem: 48 },
  { name: "notif-svc-8b7c4",   status: "ok",       cpu: 12, mem: 28 },
  { name: "cache-9d2e6",       status: "warning",  cpu: 65, mem: 74 },
  { name: "worker-4f1a8",      status: "ok",       cpu: 28, mem: 41 },
  { name: "scheduler-2c5b9",   status: "ok",       cpu: 8,  mem: 22 },
];

const podStatusColor = { critical: "var(--accent-red)", warning: "var(--accent-orange)", ok: "var(--accent-green)" };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {Math.round(p.value)}%</div>
      ))}
    </div>
  );
};

export default function InfrastructurePage() {
  return (
    <AppShell title="Infrastructure Health" subtitle="Real-time cluster, node, and container monitoring">
      {/* Top KPI gauges */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
        {[
          { label: "CPU Usage", value: 92, color: "var(--accent-red)", sub: "4/4 Nodes" },
          { label: "Memory Usage", value: 85, color: "var(--accent-orange)", sub: "6.8/8 GB" },
          { label: "Node Health", value: 74, color: "var(--accent-cyan)", sub: "3/4 Healthy" },
        ].map((g, i) => (
          <motion.div
            key={i}
            className="card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 28 }}
          >
            <GaugeChart value={g.value} size={130} strokeWidth={12} color={g.color} label={g.label} sublabel={g.sub} unit="%" />
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Resource bars */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="section-label">Node Resources</div>
          <AnimatedBar label="CPU" value={92} index={0} threshold={85} />
          <AnimatedBar label="Memory" value={85} index={1} threshold={80} />
          <AnimatedBar label="Disk" value={67} index={2} />
          <AnimatedBar label="Network Rx" value={43} color="var(--accent-cyan)" index={3} />
          <AnimatedBar label="Network Tx" value={31} color="var(--accent-purple)" index={4} />
          <AnimatedBar label="GPU" value={12} color="var(--accent-green)" index={5} />
        </motion.div>

        {/* Time series chart */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="section-label">24hr Resource History</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={timeData} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <defs>
                <linearGradient id="cpuG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="memG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="netG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="h" stroke="var(--text-muted)" fontSize={9} interval={3} />
              <YAxis stroke="var(--text-muted)" fontSize={9} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cpu" name="CPU" stroke="#ef4444" fill="url(#cpuG)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="mem" name="Memory" stroke="var(--accent-cyan)" fill="url(#memG)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="net" name="Network" stroke="var(--accent-purple)" fill="url(#netG)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Pod/Container grid */}
      <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="section-label" style={{ marginBottom: 0 }}>Kubernetes Pods</div>
          <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
            {[{ c: "var(--accent-red)", l: "Critical" }, { c: "var(--accent-orange)", l: "Warning" }, { c: "var(--accent-green)", l: "Healthy" }].map((i, k) => (
              <span key={k} style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: i.c }} />{i.l}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {pods.map((pod, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.04 }}
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                background: "var(--bg-input)",
                border: `1px solid ${podStatusColor[pod.status as keyof typeof podStatusColor]}40`,
                borderLeft: `3px solid ${podStatusColor[pod.status as keyof typeof podStatusColor]}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Container size={12} style={{ color: podStatusColor[pod.status as keyof typeof podStatusColor] }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--text-primary)", fontWeight: 600 }}>
                  {pod.name}
                </span>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 2 }}>CPU</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: pod.cpu > 85 ? "var(--accent-red)" : "var(--accent-cyan)" }}>{pod.cpu}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 2 }}>MEM</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: pod.mem > 80 ? "var(--accent-orange)" : "var(--text-secondary)" }}>{pod.mem}%</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AppShell>
  );
}
