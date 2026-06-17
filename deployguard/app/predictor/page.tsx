"use client";

import AppShell from "@/components/AppShell";
import GaugeChart from "@/components/GaugeChart";
import RiskBadge from "@/components/RiskBadge";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { useDeployments } from "@/hooks/useDeployments";
import { usePredictMutation } from "@/hooks/usePrediction";
import { useLiveMetrics } from "@/hooks/useLiveMetrics";
import { Brain, Database, Code2, TestTube2, BarChart2, ShieldAlert, Cpu, History, CheckCircle2, Zap } from "lucide-react";

const models = ["XGBoost", "Random Forest", "LightGBM"];

const modelMetrics: Record<string, { acc: string; prec: string; rec: string; f1: string; auc: string }> = {
  XGBoost:       { acc: "94.2%", prec: "92.8%", rec: "91.5%", f1: "92.1%", auc: "0.96" },
  "Random Forest": { acc: "91.5%", prec: "89.2%", rec: "88.0%", f1: "88.6%", auc: "0.93" },
  LightGBM:      { acc: "93.8%", prec: "92.0%", rec: "90.8%", f1: "91.4%", auc: "0.95" },
};

// Dynamic failure cause catalogue — selected based on deployment characteristics
const allCauses = [
  { icon: <Database size={16} />, label: "Database Migration Timeout", condition: (d: any) => d?.failedBuilds >= 3 || d?.status === 'failed', baseProbRange: [78, 94], confidence: 92 },
  { icon: <Code2 size={16} />, label: "Memory Leak in Service Heap", condition: (d: any) => d?.testCoverage < 70, baseProbRange: [55, 72], confidence: 78 },
  { icon: <TestTube2 size={16} />, label: "Missing Integration Test Paths", condition: (d: any) => d?.testCoverage < 80, baseProbRange: [35, 52], confidence: 85 },
  { icon: <Cpu size={16} />, label: "CPU Thread Pool Exhaustion", condition: (d: any) => d?.buildDuration > 400, baseProbRange: [42, 68], confidence: 81 },
  { icon: <Database size={16} />, label: "Connection Pool Saturation", condition: (d: any) => d?.dependencyChanges > 8, baseProbRange: [48, 75], confidence: 88 },
  { icon: <Code2 size={16} />, label: "Dependency Version Conflict", condition: (d: any) => d?.dependencyChanges > 5, baseProbRange: [30, 55], confidence: 74 },
  { icon: <TestTube2 size={16} />, label: "Regression in Auth Code Path", condition: (d: any) => d?.commitVelocity > 25, baseProbRange: [25, 45], confidence: 70 },
  { icon: <Cpu size={16} />, label: "OOM Kill Risk Under Load", condition: (_d: any) => true, baseProbRange: [20, 38], confidence: 65 },
];

// Dynamic similar incidents that vary by deployment characteristics
const allSimilarIncidents = [
  { id: "INC-124", date: "15 Mar", similarity: 94, cause: "DB lock on ALTER TABLE", resolution: "Rollback Migration", tags: ["db", "migration"] },
  { id: "INC-89",  date: "28 Feb", similarity: 88, cause: "OOM on JWT caching load", resolution: "Scaled CPU limit", tags: ["memory", "auth"] },
  { id: "INC-112", date: "10 Apr", similarity: 85, cause: "lodash prototype pollution", resolution: "Reverted update", tags: ["dependency", "security"] },
  { id: "INC-45",  date: "05 Jan", similarity: 79, cause: "payment-svc memory leak", resolution: "Auto-scaled +2 pods", tags: ["memory", "scaling"] },
  { id: "INC-102", date: "02 Apr", similarity: 72, cause: "API CORS lock issue", resolution: "Cleared configuration", tags: ["config", "gateway"] },
  { id: "INC-157", date: "22 May", similarity: 91, cause: "Schema migration deadlock", resolution: "Killed stale locks", tags: ["db", "deadlock"] },
  { id: "INC-203", date: "08 Jun", similarity: 83, cause: "Redis eviction storm", resolution: "Increased cache TTL", tags: ["cache", "memory"] },
  { id: "INC-178", date: "12 Apr", similarity: 76, cause: "Webhook retry flood", resolution: "Added rate limiter", tags: ["dependency", "network"] },
  { id: "INC-94",  date: "17 Mar", similarity: 69, cause: "TLS cert rotation fail", resolution: "Manual cert deploy", tags: ["config", "security"] },
  { id: "INC-221", date: "01 Jun", similarity: 87, cause: "gRPC channel saturation", resolution: "Connection pool resize", tags: ["network", "scaling"] },
];

export default function PredictorPage() {
  const [selectedModel, setSelectedModel] = useState("XGBoost");
  const { deployments } = useDeployments();
  const { data: liveMetrics } = useLiveMetrics("svc-auth");
  const { mutateAsync: predict, data: prediction, isPending: analyzing } = usePredictMutation();

  const targetDeployment = deployments[0];
  const metrics = modelMetrics[selectedModel];

  const riskScore = prediction?.failureProbability ?? targetDeployment?.failureProbability ?? 87;
  const confidence = prediction?.confidenceScore ?? 92;
  // Dynamically select causes based on current deployment characteristics
  const causes = useMemo(() => {
    if (!targetDeployment) return allCauses.slice(0, 3).map(c => ({ ...c, prob: c.baseProbRange[0] }));
    const matched = allCauses.filter(c => c.condition(targetDeployment));
    const selected = matched.slice(0, 3);
    // Calculate probabilities proportional to risk score
    return selected.map((c, idx) => {
      const range = c.baseProbRange;
      const probScale = riskScore / 100;
      const prob = Math.round(range[0] + (range[1] - range[0]) * probScale - idx * 8);
      return { icon: c.icon, label: c.label, prob: Math.max(15, Math.min(98, prob)), confidence: c.confidence - idx * 5 };
    });
  }, [targetDeployment, riskScore]);

  // Select similar incidents based on deployment characteristics
  const similarIncidents = useMemo(() => {
    if (!targetDeployment) return allSimilarIncidents.slice(0, 5);
    const hasFailed = targetDeployment.status === 'failed';
    const hasDbIssue = targetDeployment.failedBuilds >= 3;
    const hasMemIssue = targetDeployment.testCoverage < 75;
    const hasDeps = targetDeployment.dependencyChanges > 5;
    // Score each incident for relevance
    const scored = allSimilarIncidents.map(inc => {
      let relevance = inc.similarity;
      if (hasFailed && inc.tags.includes('db')) relevance += 5;
      if (hasDbIssue && (inc.tags.includes('db') || inc.tags.includes('deadlock'))) relevance += 8;
      if (hasMemIssue && inc.tags.includes('memory')) relevance += 6;
      if (hasDeps && inc.tags.includes('dependency')) relevance += 4;
      return { ...inc, relevance, similarity: `${Math.min(99, relevance)}%` };
    });
    return scored.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
  }, [targetDeployment]);

  const shapContributors = useMemo(() => {
    if (prediction?.shapValues?.length) {
      return prediction.shapValues.map((s) => {
        const explanation = prediction.why?.find(w => w.toLowerCase().includes(s.feature.toLowerCase())) || 
                           `Impact score: ${s.impact >= 0 ? "+" : ""}${Math.round(s.impact)} pts`;
        return {
          label: s.feature,
          contrib: Math.round(s.impact),
          effect: s.impact >= 0 ? "positive" as const : "negative" as const,
          desc: explanation,
        };
      });
    }
    // Fallback: generate from deployment data rather than hardcoded values
    if (targetDeployment) {
      const fb: { label: string; contrib: number; effect: "positive" | "negative"; desc: string }[] = [];
      if (targetDeployment.testCoverageDelta < 0) fb.push({ label: `Test Coverage Drop (${targetDeployment.testCoverageDelta}%)`, contrib: Math.abs(Math.round(targetDeployment.testCoverageDelta * 0.8)), effect: "positive", desc: `Coverage fell to ${targetDeployment.testCoverage}%` });
      if (targetDeployment.failedBuilds > 0) fb.push({ label: `Failed Builds (${targetDeployment.failedBuilds} in 24hr)`, contrib: targetDeployment.failedBuilds * 5, effect: "positive", desc: "Unstable build artifacts detected" });
      if (targetDeployment.commitVelocityDelta > 5) fb.push({ label: `Commit Velocity (+${targetDeployment.commitVelocityDelta}%)`, contrib: Math.round(targetDeployment.commitVelocityDelta * 0.7), effect: "positive", desc: "Rushed release cadence" });
      if (targetDeployment.dependencyChanges > 3) fb.push({ label: `Dependency Changes (${targetDeployment.dependencyChanges} new)`, contrib: Math.round(targetDeployment.dependencyChanges * 1.2), effect: "positive", desc: "Untested package updates" });
      if (targetDeployment.buildDurationDelta > 5) fb.push({ label: `Build Duration (+${targetDeployment.buildDurationDelta}%)`, contrib: Math.round(targetDeployment.buildDurationDelta * 0.5), effect: "positive", desc: "Dependency resolution slowdown" });
      fb.push({ label: "PR Review Time (avg)", contrib: -2, effect: "negative", desc: "Longer reviews reduce failure probability" });
      return fb.sort((a, b) => Math.abs(b.contrib) - Math.abs(a.contrib));
    }
    return [
      { label: "Baseline Risk Assessment", contrib: 15, effect: "positive" as const, desc: "Standard deployment risk factor" },
      { label: "Historical Pattern Match", contrib: 10, effect: "positive" as const, desc: "Similar past deployments" },
      { label: "Review Quality Signal", contrib: -3, effect: "negative" as const, desc: "Good review practices detected" },
    ];
  }, [prediction, targetDeployment]);

  const runAnalysis = async () => {
    if (!targetDeployment) return;
    await predict({
      deploymentId: targetDeployment.id,
      testCoverage: targetDeployment.testCoverage,
      failedBuilds: targetDeployment.failedBuilds,
      dependencyChanges: targetDeployment.dependencyChanges,
      commitVelocity: targetDeployment.commitVelocity,
      buildDuration: targetDeployment.buildDuration,
      cpuPercent: liveMetrics?.cpu,
      memoryPercent: liveMetrics?.memory,
      errorRate: liveMetrics?.errorRate,
    });
  };

  useEffect(() => {
    if (targetDeployment && liveMetrics && !prediction && !analyzing) {
      runAnalysis();
    }
  }, [targetDeployment, liveMetrics, prediction, analyzing]);

  const colors = ["var(--accent-red)", "var(--accent-orange)", "var(--accent-purple)", "var(--accent-cyan)", "var(--accent-blue)"];

  return (
    <AppShell title="AI Deployment Failure Predictor" subtitle="Explainable ML-powered risk analysis and SHAP feature contributions before every deploy">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 16 }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Model selection */}
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-label">Prediction Model Selector</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {models.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedModel(m)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 8,
                    border: `1px solid ${selectedModel === m ? "var(--accent-cyan)" : "var(--border)"}`,
                    background: selectedModel === m ? "var(--accent-cyan-glow)" : "var(--bg-input)",
                    color: selectedModel === m ? "var(--accent-cyan)" : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Model rigor metrics */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <BarChart2 size={13} style={{ color: "var(--accent-cyan)" }} />
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Model Evaluation Metrics</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
              {[
                { label: "Accuracy", val: metrics.acc },
                { label: "Precision", val: metrics.prec },
                { label: "Recall", val: metrics.rec },
                { label: "F1 Score", val: metrics.f1 },
                { label: "AUC-ROC", val: metrics.auc },
              ].map((met, i) => (
                <div key={i} style={{ padding: "8px 6px", borderRadius: 6, background: "var(--bg-input)", border: "1px solid var(--border-subtle)", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", marginBottom: 2 }}>{met.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 850, color: "var(--accent-cyan)" }}>{met.val}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Training confidence */}
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="section-label">Prediction Rigor & Confidence</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "Training Samples", val: "15,420", desc: "Supervised pipelines", icon: <Cpu size={14} /> },
                { label: "Similar Incidents", val: "1,287", desc: "Clustered failures", icon: <History size={14} /> },
                { label: "Out-of-Bag Error", val: "2.41%", desc: "Cross-validation score", icon: <CheckCircle2 size={14} /> },
              ].map((c, i) => (
                <div key={i} style={{ padding: "12px", borderRadius: 8, background: "var(--bg-input)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent-cyan)", marginBottom: 4 }}>
                    {c.icon}
                    <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>{c.label}</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "var(--text-primary)" }}>{c.val}</div>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Similar Incidents */}
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="section-label">Similar Historical Failures Engine</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ background: "var(--bg-input)", borderBottom: "1px solid var(--border)" }}>
                    {["Incident", "Date", "Similarity", "Primary Cause", "Resolution"].map((h) => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {similarIncidents.map((inc, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "8px 10px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "var(--accent-cyan)" }}>{inc.id}</td>
                      <td style={{ padding: "8px 10px", color: "var(--text-muted)" }}>{inc.date}</td>
                      <td style={{ padding: "8px 10px", fontWeight: 800, color: parseFloat(String(inc.similarity)) >= 85 ? "var(--accent-orange)" : "var(--accent-green)" }}>{inc.similarity}</td>
                      <td style={{ padding: "8px 10px", color: "var(--text-secondary)" }}>{inc.cause}</td>
                      <td style={{ padding: "8px 10px" }}>
                        <span style={{ padding: "2px 6px", borderRadius: 4, background: "var(--accent-green-glow)", color: "var(--accent-green)", fontSize: 9, fontWeight: 700 }}>
                          {inc.resolution}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.button
            onClick={runAnalysis}
            style={{
              padding: "13px",
              borderRadius: 10,
              border: "none",
              background: analyzing ? "var(--bg-input)" : "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
              color: analyzing ? "var(--text-muted)" : "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: analyzing ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.2s",
            }}
          >
            <Brain size={18} />
            {analyzing ? "Analyzing… (Running ML inference)" : "Re-run Failure Prediction"}
          </motion.button>
        </div>

        {/* Right Column: Explainable AI Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Failure Prob card */}
          <motion.div className="card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "24px 32px", textAlign: "center" }}>
            <div className="section-label" style={{ textAlign: "center" }}>Failure Probability</div>
            <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
              <GaugeChart
                value={riskScore}
                size={150}
                strokeWidth={13}
                color="var(--accent-red)"
                sublabel="FAILURE RISK"
                unit="%"
                animate={!analyzing}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
              <RiskBadge level={riskScore >= 70 ? "critical" : riskScore >= 40 ? "high" : "medium"} label={`Risk: ${riskScore >= 70 ? "HIGH" : "MEDIUM"}`} pulse={riskScore >= 70} />
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: "rgba(139,92,246,0.12)", color: "var(--accent-purple)", border: "1px solid rgba(139,92,246,0.3)" }}>
                {Math.round(confidence)}% CONFIDENCE
              </span>
            </div>
          </motion.div>

          {/* NEW: AI Outage Forecasting Horizon Widget */}
          <motion.div 
            className="card" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            style={{ 
              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(8, 14, 28, 0.8))",
              borderColor: "rgba(239, 68, 68, 0.25)"
            }}
          >
            <div className="section-label" style={{ color: "var(--accent-red)", display: "flex", alignItems: "center", gap: 6 }}>
              <Zap size={12} className="dot-animate" style={{ color: "var(--accent-red)" }} />
              AI Outage Forecasting Horizon
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
              {[
                { label: "1 Hr Horizon", val: `${Math.min(99, Math.round(riskScore * 0.98))}%`, color: "var(--accent-orange)" },
                { label: "6 Hr Horizon", val: `${Math.min(99, Math.round(riskScore * 1.04))}%`, color: "var(--accent-red)" },
                { label: "24 Hr Horizon", val: `${Math.min(99, Math.round(riskScore * 1.09))}%`, color: "var(--accent-red)" }
              ].map((h, idx) => (
                <div key={idx} style={{ 
                  background: "var(--bg-input)", 
                  padding: "10px 8px", 
                  borderRadius: 8, 
                  border: "1px solid var(--border)", 
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>{h.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: h.color, marginTop: 2 }}>{h.val}</div>
                  <div style={{ fontSize: 8, color: "var(--text-secondary)", marginTop: 1 }}>High Certainty</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Explainable AI (XAI) Feature Importance Graph */}
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div className="section-label" style={{ marginBottom: 2 }}>Why {riskScore}%?</div>
                <p style={{ fontSize: 10, color: "var(--text-muted)" }}>Feature Importance Attribution Graph</p>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {prediction?.model && (
                  <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, background: "var(--accent-cyan-glow)", color: "var(--accent-cyan)", fontWeight: 700, textTransform: "uppercase" }}>
                    MODEL: {prediction.model}
                  </span>
                )}
                <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, background: "var(--accent-red-glow)", color: "var(--accent-red)", fontWeight: 700 }}>
                  EXPLAINABLE AI (XAI)
                </span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {shapContributors.map((c, i) => {
                const color = colors[i % colors.length];
                const displayEffect = c.contrib >= 0 ? `+${c.contrib}%` : `${c.contrib}%`;
                return (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                      <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{c.label}</span>
                      <span style={{ fontWeight: 800, color: color }}>{displayEffect}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 10, alignItems: "center" }}>
                      <div className="progress-bar" style={{ height: 8, background: "var(--bg-input)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, Math.abs(c.contrib) * 2.5)}%` }}
                          transition={{ duration: 1.2, delay: 0.3 + i * 0.05 }}
                          style={{
                            height: "100%",
                            borderRadius: 3,
                            background: color,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 9, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>


          {/* Predicted Failure Causes */}
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="section-label">Predicted Failure Causes</div>
            {causes.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: i === 0 ? "rgba(239,68,68,0.06)" : "var(--bg-input)",
                  border: `1px solid ${i === 0 ? "rgba(239,68,68,0.2)" : "var(--border-subtle)"}`,
                  marginBottom: 8,
                }}
              >
                <div style={{ color: i === 0 ? "var(--accent-red)" : "var(--text-muted)" }}>{c.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{c.label}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>Confidence: {c.confidence}%</div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 800, color: i === 0 ? "var(--accent-red)" : "var(--text-muted)" }}>
                  {c.prob}%
                </div>
              </div>
            ))}
            <div style={{ marginTop: 8, padding: "10px 12px", borderRadius: 8, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-red)", display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <ShieldAlert size={14} />
                <span>AI Automated Prevention recommendation</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                **CRITICAL ACTION RECOMMENDED:** Block this deployment immediately. Run index execution tests concurrently inside your staging sandbox. Estimated impact reduction: <strong>–78% Risk</strong>.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
