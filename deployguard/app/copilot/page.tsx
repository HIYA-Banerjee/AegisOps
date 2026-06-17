"use client";

import AppShell from "@/components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Terminal, ShieldAlert } from "lucide-react";

type Message = { 
  role: "user" | "ai"; 
  text: string; 
  ts: string;
  toolCall?: { name: string; args: string; status: 'pending' | 'success' | 'failed' };
};

const suggestions = [
  "Why did deployment v2.5.0 fail?",
  "What is the recommended rollback version?",
  "Show service dependencies",
  "Simulate a 3x traffic spike on digital twin",
  "Suggest automated runbook actions for v2.5.0",
  "How do I fix the DB migration timeout?",
  "Is the Supabase connection active?"
];

const aiResponses: Record<string, { text: string; toolCall?: Message["toolCall"] }> = {
  "Why did deployment v2.5.0 fail?": {
    text: "Deployment **v2.5.0** failed due to a **database migration timeout**. The ALTER TABLE statement on the `orders` table (42M rows) attempted to add a new index while the table was under heavy production load.\n\nThe migration held an **exclusive lock** for longer than the 30-second timeout threshold. This caused:\n- All write operations to `orders` to queue and timeout\n- Auth service connection pool to exhaust (100/100 connections)\n- Cascade failures across payment and session services\n\n**Root cause confidence: 94%** (BERT-RCA model)\n\nFix: Use `CREATE INDEX CONCURRENTLY` and schedule migrations during off-peak windows (02:00–04:00 IST).",
    toolCall: { name: "analyzeLogs", args: "deployment_id=v2.5.0", status: "success" }
  },
  "What is the recommended rollback version?": {
    text: "The AI rollback recommendation is **v2.4.9** (deployed 2 hours ago to staging).\n\n**Why v2.4.9?**\n- ✅ 12/12 automated rollback tests passed\n- ✅ No DB schema changes (no revert needed)\n- ✅ Zero data loss risk\n- ✅ All 3 pods healthy in staging\n- ✅ P99 latency: 124ms (vs 847ms current)\n\n**Estimated rollback time:** 3–5 minutes\n**Traffic impact:** ~2 min partial downtime during pod replacement\n\nTo execute: Click **Rollback to v2.4.9** in the Rollback page, or run:\n```bash\nkubectl set image deployment/payment-svc payment-svc=registry/payment-svc:v2.4.9\n```",
    toolCall: { name: "evaluateRollbackImpact", args: "target_version=v2.4.9", status: "success" }
  },
  "Show service dependencies": {
    text: "I have mapped the current service dependency topology in our cluster. There are **5 active service nodes** and **4 connection vectors**:\n- **Primary Node:** `orders-db` (PostgreSQL) is the root.\n- **Auth Gateway:** `auth-svc` connects downstream of the database.\n- **Parallel Processors:** `payment-svc` and `order-svc` load authenticated requests.\n- **Delivery Node:** `notification-svc` is the terminal point.\n\nIn our current simulation, a critical lock on `orders-db` has cascaded through `auth-svc` to trigger OOM kills, blocking 100% of payment checkout traffic. To view this propagation animation, check the **Dependency Graph** page.",
    toolCall: { name: "fetchServiceTopology", args: "cluster_id=k8s-prod-1", status: "success" }
  },
  "Simulate a 3x traffic spike on digital twin": {
    text: "I've initialized the Markov State replication twin model to simulate a **3x request volume spike**:\n- **Real Cluster:** Remains stable at 48% CPU, 12 active pods.\n- **Virtual Twin:** Predicts CPU load will surge to **82%**, memory saturation to **74%**, and network traffic to **3.6 GB/s**.\n- **AI Scaling recommendation:** Spawn **+12 virtual pods** (+3 nodes) to buffer transaction queues.\n\nThe DTMC twin model reports **99.1% accuracy** for this forecast. To trigger this simulation live, go to the **Digital Twin** dashboard and click *Simulate 3x Traffic Spike*.",
    toolCall: { name: "runDigitalTwinSimulation", args: "traffic_multiplier=3", status: "success" }
  },
  "Suggest automated runbook actions for v2.5.0": {
    text: "Here is the AI-prescribed auto-remediation sequence to resolve the failed v2.5.0 deployment:\n1. **Canary rollback** to stable release version **v2.4.9**.\n2. **Micro-restart** on the session cache pool pods.\n3. **Terminate table locks** using unblock index queries on PG console.\n4. **Run canary verification tests** to verify zero error baselines.\n\nYou can trigger these auto-remediations with 1-click execution on the **Root Cause** dashboard.",
    toolCall: { name: "generateRunbook", args: "incident_id=inc-301", status: "success" }
  },
  "How do I fix the DB migration timeout?": {
    text: "To fix the database migration timeout, follow these steps:\n\n1. **Use concurrent indexing:**\n```sql\nCREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);\n```\nThis avoids exclusive table locks.\n\n2. **Set a longer lock timeout** in your migration config:\n```sql\nSET lock_timeout = '60s';\n```\n\n3. **Batch large data migrations** instead of single ALTER TABLE statements.\n\n4. **Schedule migrations** during low-traffic windows (02:00–04:00).\n\n5. **Test with production data snapshot** in staging before deploying.\n\nEstimated fix time: **2–4 hours**",
    toolCall: { name: "scanDatabaseIndexes", args: "table=orders", status: "success" }
  },
  "Is the Supabase connection active?": {
    text: "Yes! The **Supabase client** is fully operational. If credentials are set, it queries active tables; otherwise, it resolves query requests to local synthetic datasets (50+ deployments, 30+ incidents) seamlessly.",
    toolCall: { name: "checkDatabaseConnection", args: "", status: "success" }
  }
};

import { generateCopilotResponse } from "@/lib/copilot-engine";


function formatMessage(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: "var(--text-primary)", fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("```") && part.endsWith("```")) {
      return <pre key={i} style={{ background: "var(--bg-secondary)", padding: "10px", borderRadius: 6, margin: "8px 0", fontSize: 11, color: "var(--accent-green)", fontFamily: "'JetBrains Mono', monospace", overflowX: "auto" }}>{part.slice(3, -3).trim()}</pre>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} style={{ background: "var(--bg-secondary)", padding: "1px 5px", borderRadius: 3, fontSize: 11, color: "var(--accent-cyan)", fontFamily: "'JetBrains Mono', monospace" }}>{part.slice(1, -1)}</code>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hello! I'm **AegisOps AI Copilot**, your context-aware release and SRE agent.\n\nI have full context about your current system: **Outage probability 81%**, v2.5.0 deployment failed, auth-service down. How can I help?",
      ts: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMsg = async (text: string) => {
    if (!text.trim()) return;
    const ts = new Date().toLocaleTimeString();
    setMessages((m) => [...m, { role: "user", text, ts }]);
    setInput("");
    setTyping(true);

    try {
      const res = await generateCopilotResponse(text);
      setTyping(false);
      setMessages((m) => [...m, { role: "ai", text: res.text, ts: new Date().toLocaleTimeString(), toolCall: res.toolCall }]);
    } catch (err: any) {
      setTyping(false);
      setMessages((m) => [...m, { role: "ai", text: `Error: ${err.message || err}`, ts: new Date().toLocaleTimeString() }]);
    }
  };

  return (
    <AppShell title="AI DevOps Copilot" subtitle="Context-aware AI partner for continuous deployment risk profiling, log analysis, and incident runbooks">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, height: "calc(100vh - 140px)" }}>
        {/* Chat panel */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}
        >
          {/* Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>AegisOps AI Copilot</div>
                <div style={{ fontSize: 10, color: "var(--accent-green)", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-green)", display: "inline-block", animation: "pulse-glow 2s infinite" }} />
                  Context-Aware (GPT-4o/Claude-3.5)
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            <AnimatePresence>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: "flex", gap: 10, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                      background: msg.role === "ai" ? "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))" : "linear-gradient(135deg, var(--accent-cyan), var(--accent-green))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {msg.role === "ai" ? <Bot size={14} color="#fff" /> : <User size={14} color="#fff" />}
                    </div>
                    <div style={{ maxWidth: "75%" }}>
                      <div style={{
                        padding: "12px 16px",
                        borderRadius: msg.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                        background: msg.role === "user" ? "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))" : "var(--bg-input)",
                        border: msg.role === "ai" ? "1px solid var(--border)" : "none",
                        color: msg.role === "user" ? "#fff" : "var(--text-secondary)",
                        fontSize: 13,
                        lineHeight: 1.6,
                      }}>
                        {formatMessage(msg.text)}
                      </div>
                      <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 3, textAlign: msg.role === "user" ? "right" : "left" }}>{msg.ts}</div>
                    </div>
                  </motion.div>

                  {/* Tool Call Rendering */}
                  {msg.role === "ai" && msg.toolCall && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ 
                        marginLeft: 40,
                        padding: "8px 12px",
                        borderRadius: 8,
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        maxWidth: "60%",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 11,
                        color: "var(--text-secondary)"
                      }}
                    >
                      <Terminal className="w-3.5 h-3.5 text-cyan" />
                      <div>
                        <span className="font-semibold text-cyan">Tool Execution: </span>
                        <code className="font-mono text-muted">{msg.toolCall.name}({msg.toolCall.args})</code>
                        <span className="badge badge-low ml-2" style={{ fontSize: 9, padding: "1px 6px" }}>{msg.toolCall.status}</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}

              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Bot size={14} color="#fff" />
                  </div>
                  <div style={{ padding: "12px 18px", borderRadius: "12px 12px 12px 4px", background: "var(--bg-input)", border: "1px solid var(--border)", display: "flex", gap: 4, alignItems: "center" }}>
                    {[0, 1, 2].map((d) => (
                      <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-cyan)", animation: `pulse-glow 1.4s ease-in-out ${d * 0.2}s infinite` }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(input); } }}
              placeholder="Ask about deployments, root causes, logs, and triggers…"
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 8,
                border: "1px solid var(--border)", background: "var(--bg-input)",
                color: "var(--text-primary)", fontSize: 13, outline: "none",
              }}
            />
            <button
              onClick={() => sendMsg(input)}
              disabled={!input.trim() || typing}
              style={{
                width: 40, height: 40, borderRadius: 8, border: "none",
                background: input.trim() && !typing ? "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))" : "var(--bg-input)",
                color: input.trim() && !typing ? "#fff" : "var(--text-muted)",
                cursor: input.trim() && !typing ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </motion.div>

        {/* Sidebar — suggestions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <span style={{ fontSize: 14 }}>✨</span>
              <span className="section-label" style={{ marginBottom: 0 }}>Incident Queries</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMsg(s)}
                  style={{
                    padding: "9px 12px", borderRadius: 7, textAlign: "left",
                    border: "1px solid var(--border)", background: "var(--bg-input)",
                    color: "var(--text-secondary)", fontSize: 12, cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-cyan)"; e.currentTarget.style.color = "var(--accent-cyan)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <div className="section-label">Active Context</div>
            {[
              { label: "Deployment", val: "v2.5.0 FAILED" },
              { label: "Outage Prob", val: "81%" },
              { label: "Auth Service", val: "DOWN" },
              { label: "Active P0s", val: "1 incident" },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 3 ? "1px solid var(--border-subtle)" : "none" }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)", marginRight: 8 }}>{c.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: c.val.includes("FAILED") || c.val.includes("DOWN") ? "var(--accent-red)" : "var(--accent-cyan)" }}>{c.val}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
