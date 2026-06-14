"use client";

import AppShell from "@/components/AppShell";
import { motion } from "framer-motion";
import { useState } from "react";
import { Network, Database, Cpu, Globe, Server, Activity } from "lucide-react";

// Resource counts across clouds
const providers = [
  { name: "Amazon Web Services", code: "AWS", regions: 8, instances: 142, databases: 18, color: "#ff9900" },
  { name: "Google Cloud Platform", code: "GCP", regions: 4, instances: 65, databases: 9, color: "#4285f4" },
  { name: "Microsoft Azure", code: "Azure", regions: 2, instances: 28, databases: 3, color: "#0078d4" },
  { name: "DigitalOcean", code: "DO", regions: 1, instances: 12, databases: 1, color: "#0080ff" },
];

const regionNodes = [
  { id: "us-east", name: "US East (N. Virginia)", provider: "AWS", lat: "35%", lng: "25%", status: "healthy", ping: "14ms" },
  { id: "eu-west", name: "EU West (Ireland)", provider: "AWS", lat: "45%", lng: "50%", status: "healthy", ping: "78ms" },
  { id: "ap-east", name: "AP East (Tokyo)", provider: "GCP", lat: "50%", lng: "80%", status: "warning", ping: "142ms" },
  { id: "us-west", name: "US West (Oregon)", provider: "Azure", lat: "38%", lng: "15%", status: "healthy", ping: "45ms" },
];

export default function CloudPage() {
  const [selectedRegion, setSelectedRegion] = useState<typeof regionNodes[0] | null>(null);

  return (
    <AppShell title="Multi-Cloud Infrastructure Center" subtitle="Real-time multi-cloud inventory maps, network health metrics, and instances count">
      <div className="space-y-6">

        {/* Global Inventory Counts */}
        <div className="grid-metrics">
          {providers.map((p, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: idx * 0.05 }}
              className="card flex flex-col justify-between"
              style={{ borderLeft: `4px solid ${p.color}` }}
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">{p.code} Resource Cluster</span>
                <h3 className="text-2xl font-bold font-mono mt-1" style={{ color: "var(--text-primary)" }}>{p.instances} Instances</h3>
              </div>
              <div className="flex gap-4 mt-6 text-xs text-secondary font-mono">
                <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {p.regions} Regions</span>
                <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5" /> {p.databases} DBs</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive World Map SVG Layout */}
        <div className="grid-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan" /> Geographic Cluster Map
              </h3>
              <p className="text-xs text-muted mb-6">Select regional nodes to verify live edge network latencies</p>
            </div>

            {/* SVG Map Container */}
            <div className="relative w-full h-80 rounded-xl overflow-hidden border flex items-center justify-center" style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}>
              {/* Simplified Dot World Map SVG Outline */}
              <svg className="absolute w-full h-full text-slate-700/10 dark:text-slate-700/20" viewBox="0 0 1000 500" fill="currentColor">
                {/* Simulated map circles */}
                <circle cx="200" cy="150" r="10" />
                <circle cx="250" cy="180" r="12" />
                <circle cx="280" cy="220" r="8" />
                <circle cx="500" cy="160" r="15" />
                <circle cx="550" cy="190" r="11" />
                <circle cx="780" cy="210" r="14" />
                <circle cx="820" cy="180" r="9" />
                {/* Dotted paths representing connections */}
                <path d="M 250 180 Q 380 120 500 160" stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4" fill="none" />
                <path d="M 500 160 Q 640 150 780 210" stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4" fill="none" />
              </svg>

              {/* Ping Region Interactive Markers */}
              {regionNodes.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRegion(r)}
                  className="absolute p-2 rounded-full cursor-pointer transition-transform hover:scale-125 z-20 group"
                  style={{ top: r.lat, left: r.lng }}
                >
                  <span className="absolute inline-flex h-4 w-4 rounded-full animate-ping opacity-75" style={{ background: r.status === 'healthy' ? 'var(--accent-green)' : 'var(--accent-orange)' }} />
                  <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: r.status === 'healthy' ? 'var(--accent-green)' : 'var(--accent-orange)' }} />
                  {/* Tooltip on hover */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-semibold whitespace-nowrap rounded bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {r.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Region Network Status Info */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Network className="w-4 h-4 text-purple-400" style={{ color: "var(--accent-purple)" }} /> Regional Diagnostic Info
              </h3>

              {selectedRegion ? (
                <div className="space-y-6 pt-4">
                  <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: "var(--border)" }}>
                    <span className="text-xs text-muted">Cluster Target</span>
                    <strong className="text-sm">{selectedRegion.name}</strong>
                  </div>
                  <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: "var(--border)" }}>
                    <span className="text-xs text-muted">Cloud Provider</span>
                    <span className="badge badge-medium">{selectedRegion.provider}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: "var(--border)" }}>
                    <span className="text-xs text-muted">Network Edge Latency</span>
                    <strong className="font-mono text-green">{selectedRegion.ping}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted">SRE Health Status</span>
                    <span className={`badge ${selectedRegion.status === 'healthy' ? 'badge-low' : 'badge-high'}`}>
                      {selectedRegion.status}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center text-muted">
                  <Globe className="w-10 h-10 mb-2 stroke-1" />
                  <p className="text-xs">Click a map region node marker to inspect target network performance values.</p>
                </div>
              )}
            </div>

            <p className="text-[10px] text-muted leading-relaxed mt-4">
              * Global edge CDN proxies are dynamically balanced between AWS and GCP edge layers.
            </p>
          </motion.div>
        </div>

      </div>
    </AppShell>
  );
}
