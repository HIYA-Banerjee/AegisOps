"use client";

import AppShell from "@/components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Play, Square, Activity, Cpu, Network, Skull, Database, Sparkles, CheckCircle2 } from "lucide-react";

const attackTypes = [
  { id: "cpu", name: "CPU Burn stress", icon: Cpu, desc: "Inject heavy computational loads in node CPU registers", color: "var(--accent-cyan)" },
  { id: "latency", name: "Network Latency", icon: Network, desc: "Inject artificial network delays (100ms - 500ms) on gateway traffic", color: "var(--accent-purple)" },
  { id: "kill", name: "Kubernetes Pod Eviction", icon: Skull, desc: "Randomly terminate active pod container replicas", color: "var(--accent-red)" },
  { id: "db", name: "DB Connection Exhaustion", icon: Database, desc: "Simulate transaction locks and exhaust query pools", color: "var(--accent-orange)" },
];

export default function ChaosPage() {
  const [selectedAttack, setSelectedAttack] = useState("cpu");
  const [intensity, setIntensity] = useState(5);
  const [duration, setDuration] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [blastRadius, setBlastRadius] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      setLogs([
        `[${new Date().toLocaleTimeString()}] Establishing secure connection with target cluster kubernetes-node-pool-A...`,
        `[${new Date().toLocaleTimeString()}] Verifying active replica health parameters...`,
        `[${new Date().toLocaleTimeString()}] Initializing chaos agent on target nodes...`,
      ]);

      let step = 0;
      interval = setInterval(() => {
        step++;
        const time = new Date().toLocaleTimeString();
        if (step === 1) {
          setLogs(prev => [...prev, `[${time}] INJECTING: ${attackTypes.find(a => a.id === selectedAttack)?.name} (Intensity: ${intensity}/10)`]);
          setBlastRadius(["auth-service (Latency +120ms)", "gateway-service (Queues growing)"]);
        } else if (step === 2) {
          setLogs(prev => [...prev, `[${time}] WARNING: Kubernetes auto-scaler triggered replica threshold (+2 nodes)`]);
        } else if (step === 3) {
          setLogs(prev => [...prev, `[${time}] DETECTED: Self-healing circuit-breakers activated successfully`]);
          setBlastRadius(["auth-service (Recovering)", "gateway-service (Recovered)"]);
        } else if (step === 4) {
          setLogs(prev => [...prev, `[${time}] EXPERIMENT COMPLETED: Chaos agent detached safely, metrics recovered`]);
          setIsRunning(false);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isRunning, selectedAttack, intensity]);

  const handleStart = () => {
    setIsRunning(true);
    setBlastRadius([]);
  };

  const handleStop = () => {
    setIsRunning(false);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ABORTED: Experiment terminated by operator request`]);
  };

  return (
    <AppShell title="Chaos Engineering Platform" subtitle="Inject synthetic failures, audit blast radiuses, and verify autonomous self-healing bounds">
      <div className="space-y-6">

        {/* Experiment builder cards */}
        <div className="grid-3">
          {/* Form parameters */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold mb-4">1. Choose Failure Scenario</h3>
              <div className="grid grid-2 gap-4">
                {attackTypes.map((a) => {
                  const Icon = a.icon;
                  const isSelected = selectedAttack === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => !isRunning && setSelectedAttack(a.id)}
                      className="p-4 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-3.5 hover:bg-slate-800/5"
                      style={{ 
                        borderColor: isSelected ? "var(--accent-cyan)" : "var(--border)",
                        background: isSelected ? "rgba(0, 212, 255, 0.05)" : "var(--bg-card)" 
                      }}
                    >
                      <div className="p-2 rounded-lg" style={{ background: isSelected ? "rgba(0, 212, 255, 0.15)" : "var(--bg-input)", color: isSelected ? "var(--accent-cyan)" : "var(--text-secondary)" }}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">{a.name}</h4>
                        <p className="text-xs text-muted mt-1 leading-relaxed">{a.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Slider controls */}
              <div className="grid-2 mt-8">
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className="uppercase tracking-wider text-muted">Attack Intensity</span>
                    <span className="font-mono text-cyan">{intensity}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    disabled={isRunning}
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                    style={{ background: "var(--border)" }}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className="uppercase tracking-wider text-muted">Target Duration</span>
                    <span className="font-mono text-cyan">{duration}s</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="10"
                    disabled={isRunning}
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                    style={{ background: "var(--border)" }}
                  />
                </div>
              </div>
            </div>

            {/* Run Button */}
            <div className="pt-8 border-t flex gap-4 mt-8" style={{ borderColor: "var(--border)" }}>
              {isRunning ? (
                <button
                  onClick={handleStop}
                  className="px-6 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 hover:opacity-90"
                  style={{ background: "var(--accent-red)", color: "#ffffff" }}
                >
                  <Square className="w-4 h-4 fill-white" /> Terminate Scenario
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className="px-6 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 glow-cyan hover:opacity-90 cursor-pointer"
                  style={{ background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))", color: "#ffffff" }}
                >
                  <Play className="w-4 h-4 fill-white" /> Inject Chaos Experiment
                </button>
              )}
            </div>
          </motion.div>

          {/* Blast Radius visualizer */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card col-span-1 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold mb-4">2. Estimated Blast Radius</h3>
              <div className="relative w-full h-48 rounded-xl flex items-center justify-center border" style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}>
                {/* Visual Circle of Radius */}
                <div className={`absolute w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center ${isRunning ? 'animate-spin-slow border-red-500/55' : 'border-slate-700/35'}`}>
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isRunning ? 'bg-red-500/10' : 'bg-slate-700/5'}`}>
                    <Skull className={`w-8 h-8 ${isRunning ? 'text-red-400' : 'text-muted'}`} />
                  </div>
                </div>
              </div>

              {/* Status List */}
              <div className="space-y-2.5 mt-6">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted block">Simulated Blast Node Outputs</span>
                {blastRadius.length > 0 ? (
                  blastRadius.map((b, idx) => (
                    <div key={idx} className="p-2.5 rounded text-xs flex justify-between items-center border" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
                      <span className="font-semibold">{b.split(" ")[0]}</span>
                      <span className="text-muted font-mono">{b.split(" ").slice(1).join(" ")}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted">Awaiting scenario deployment to map parameters.</p>
                )}
              </div>
            </div>

            <p className="text-[10px] text-muted mt-6">
              * Self-healing logic evaluates gateway rules continuously during inject.
            </p>
          </motion.div>
        </div>

        {/* Live Logs Console */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan" /> Chaos Agent Live Logs stream
          </h3>
          <div className="p-4 rounded-lg font-mono text-xs overflow-y-auto h-48 space-y-2.5 border" style={{ background: "var(--bg-input)", borderColor: "var(--border)" }}>
            {logs.length > 0 ? (
              logs.map((l, idx) => (
                <div key={idx} className="log-line">
                  {l.includes("WARNING") ? (
                    <span className="log-warn">{l}</span>
                  ) : l.includes("INJECTING") ? (
                    <span className="log-error">{l}</span>
                  ) : l.includes("COMPLETED") || l.includes("remediation") ? (
                    <span className="log-success">{l}</span>
                  ) : (
                    <span className="text-secondary">{l}</span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted">Awaiting scenario execution launch triggers...</p>
            )}
          </div>
        </motion.div>

      </div>
    </AppShell>
  );
}
