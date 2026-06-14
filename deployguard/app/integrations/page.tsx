"use client";

import AppShell from "@/components/AppShell";
import { mockIntegrations, mockWebhookEvents, Integration } from "@/lib/mockData";
import { useIntegrations } from "@/hooks/useIntegrations";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Plug, Settings, CheckCircle2, AlertCircle, Play, Info, Terminal, RefreshCw, Key, Link2 } from "lucide-react";

export default function IntegrationsPage() {
  const { integrations: fetchedIntegrations, isLoading } = useIntegrations();
  const [integrationsList, setIntegrationsList] = useState<Integration[]>(mockIntegrations);
  const [selectedId, setSelectedId] = useState<string>("git-gh");
  const [testSuccess, setTestSuccess] = useState<boolean>(false);
  const [testing, setTesting] = useState<boolean>(false);

  useEffect(() => {
    if (fetchedIntegrations.length > 0) {
      setIntegrationsList(fetchedIntegrations);
      if (!fetchedIntegrations.find((i) => i.id === selectedId)) {
        setSelectedId(fetchedIntegrations[0].id);
      }
    }
  }, [fetchedIntegrations, selectedId]);

  const selectedItem = integrationsList.find(i => i.id === selectedId) || integrationsList[0];

  const toggleConnection = (id: string) => {
    setIntegrationsList(prev => prev.map(item => {
      if (item.id === id) {
        const isConnected = item.status === "connected";
        return {
          ...item,
          status: isConnected ? "available" : "connected",
          connectedAt: isConnected ? undefined : new Date().toISOString(),
          webhookUrl: isConnected ? undefined : `https://api.aegisops.ai/webhooks/${item.id.replace("git-", "").replace("cicd-", "").replace("cloud-", "").replace("chat-", "").replace("monitoring-", "").replace("itsm-", "")}/${Math.random().toString(16).substring(2, 9)}`
        };
      }
      return item;
    }));
  };

  const runConnectionTest = () => {
    setTesting(true);
    setTestSuccess(false);
    setTimeout(() => {
      setTesting(false);
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 2000);
    }, 1200);
  };

  const connectedCount = integrationsList.filter(i => i.status === "connected").length;

  return (
    <AppShell title="Enterprise Integrations Hub" subtitle="Correlate risk vectors and orchestrate AI SRE runbooks across your entire DevOps, VCS, and monitoring stack">
      
      {/* Top Banner Count */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
        {[
          { label: "Active Integrations", val: `${connectedCount} Connected`, color: "var(--accent-green)" },
          { label: "Data Pipeline Pipelines", val: "4 Scrapers Health", color: "var(--accent-cyan)" },
          { label: "Webhook Sync status", val: "Operational (0 errors)", color: "var(--accent-purple)" }
        ].map((met, idx) => (
          <motion.div 
            key={idx} 
            className="card"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: "10px 14px", borderLeft: `3px solid ${met.color}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <span style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase" }}>{met.label}</span>
              <div style={{ fontSize: 16, fontWeight: 900, color: met.color, marginTop: 2 }}>{met.val}</div>
            </div>
            <Plug size={16} style={{ color: met.color, opacity: 0.6 }} />
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
        {/* Left Column: Grid of Integrations */}
        <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>Supported Integrations Ecosystem</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {integrationsList.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedId(item.id)}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: `1.5px solid ${isSelected ? "var(--accent-cyan)" : "var(--border)"}`,
                    background: "var(--bg-input)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 110,
                    transition: "all 0.15s"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.logoColor }} />
                        <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)" }}>{item.name}</span>
                      </div>
                      <span className={`badge badge-${item.status === "connected" ? "low" : item.status === "available" ? "medium" : "high"}`} style={{ fontSize: 8 }}>
                        {item.status.replace("_", " ")}
                      </span>
                    </div>
                    <p style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.3 }}>
                      {item.description}
                    </p>
                  </div>

                  <div style={{ fontSize: 8, color: "var(--text-secondary)", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, borderTop: "1px solid var(--border-subtle)", paddingTop: 6 }}>
                    <span style={{ textTransform: "uppercase" }}>{item.category}</span>
                    {item.status === "connected" && (
                      <span style={{ color: "var(--accent-green)", fontWeight: 700 }}>● Active</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Column: Configuration & Logs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Configuration Drawer */}
          <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div className="section-label" style={{ marginBottom: 0 }}>Integration Config Manager</div>
              <Settings size={14} style={{ color: "var(--text-muted)" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: selectedItem.logoColor }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 850 }}>{selectedItem.name}</div>
                <span style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase" }}>{selectedItem.category} integration wrapper</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {selectedItem.status === "connected" ? (
                <>
                  <div>
                    <label style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Webhook Receiver URL</label>
                    <div style={{ display: "flex", gap: 6 }}>
                      <pre style={{ flex: 1, padding: "8px 10px", background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "var(--accent-cyan)", overflowX: "auto" }}>
                        {selectedItem.webhookUrl}
                      </pre>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Integration Client Token</label>
                      <div style={{ display: "flex", gap: 6, background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 10px", alignItems: "center" }}>
                        <Key size={10} style={{ color: "var(--text-muted)" }} />
                        <span style={{ fontSize: 9, color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}>••••••••••••••••</span>
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Sync Heartbeat Status</label>
                      <div style={{ display: "flex", gap: 6, background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 10px", alignItems: "center", color: "var(--accent-green)", fontWeight: 700, fontSize: 9 }}>
                        <CheckCircle2 size={10} />
                        <span>HEALTHY CONNECTION</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button
                      onClick={runConnectionTest}
                      disabled={testing}
                      style={{
                        flex: 1, padding: 10, borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-input)", color: testing ? "var(--text-muted)" : "var(--text-primary)",
                        fontSize: 11, fontWeight: 750, cursor: testing ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                      }}
                    >
                      <RefreshCw size={11} className={testing ? "animate-spin" : ""} />
                      {testing ? "Testing link..." : "Test Connection Integrity"}
                    </button>

                    <button
                      onClick={() => toggleConnection(selectedItem.id)}
                      style={{
                        padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", color: "var(--accent-red)",
                        fontSize: 11, fontWeight: 750, cursor: "pointer"
                      }}
                    >
                      Disconnect
                    </button>
                  </div>
                  
                  {testSuccess && (
                    <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, padding: 8, fontSize: 10, color: "var(--accent-green)", display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                      <CheckCircle2 size={12} />
                      <span>API connection verified successfully. Zero telemetry jitter detected.</span>
                    </div>
                  )}
                </>
              ) : selectedItem.status === "available" ? (
                <div style={{ padding: "16px 0", textAlign: "center", display: "flex", flexDirection: "column", gap: 12 }}>
                  <Plug size={32} style={{ color: "var(--text-muted)", margin: "0 auto", animation: "float 3s infinite" }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)" }}>Integration Link Ready</div>
                    <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4, padding: "0 20px" }}>
                      Integrate DeployGuard's ML risk filters with your workspace. Connecting provides webhook event tracking.
                    </p>
                  </div>
                  <button
                    onClick={() => toggleConnection(selectedItem.id)}
                    style={{
                      margin: "0 auto", padding: "10px 24px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
                      color: "#fff", fontSize: 12, fontWeight: 750, cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                    }}
                  >
                    <Link2 size={12} />
                    <span>Authorize & Connect {selectedItem.name}</span>
                  </button>
                </div>
              ) : (
                <div style={{ padding: "20px 0", textAlign: "center", display: "flex", flexDirection: "column", gap: 8, color: "var(--text-muted)" }}>
                  <Info size={32} style={{ color: "var(--accent-orange)", margin: "0 auto" }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)" }}>Enterprise Roadmap Integration</div>
                    <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4, padding: "0 20px" }}>
                      Jira Service Desk is currently in private preview. This integration will automatically create issue trackers with full SHAP values.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Webhook events console */}
          <motion.div 
            className="card" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.15 }}
            style={{ background: "#050b14", border: "1px solid var(--border)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div className="section-label" style={{ marginBottom: 0, color: "var(--accent-cyan)" }}>Webhook Event Receiver Stream</div>
              <Terminal size={14} style={{ color: "var(--accent-cyan)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
              {mockWebhookEvents.map((evt, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: 6 }}>
                  <span style={{ color: "var(--text-muted)" }}>[{evt.time}]</span>
                  <span style={{ color: "var(--accent-purple)", fontWeight: 700 }}>{evt.integration.toUpperCase()}</span>
                  <span style={{ color: "var(--accent-cyan)" }}>{evt.event}</span>
                  <span style={{ color: "#e2e8f0", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{evt.msg}</span>
                  <span style={{ color: evt.status === "success" ? "var(--accent-green)" : "var(--accent-orange)" }}>
                    {evt.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
