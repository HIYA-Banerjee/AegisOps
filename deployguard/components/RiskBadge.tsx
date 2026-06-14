"use client";

interface RiskBadgeProps {
  level: "critical" | "high" | "medium" | "low" | "ok";
  label?: string;
  pulse?: boolean;
}

const config = {
  critical: { bg: "rgba(239,68,68,0.15)", color: "var(--accent-red)", border: "rgba(239,68,68,0.35)", dot: "#ef4444" },
  high:     { bg: "rgba(251,191,36,0.12)", color: "var(--accent-orange)", border: "rgba(251,191,36,0.35)", dot: "#fbbf24" },
  medium:   { bg: "rgba(0,212,255,0.1)", color: "var(--accent-cyan)", border: "rgba(0,212,255,0.3)", dot: "#00d4ff" },
  low:      { bg: "rgba(0,255,136,0.08)", color: "var(--accent-green)", border: "rgba(0,255,136,0.25)", dot: "#00ff88" },
  ok:       { bg: "rgba(0,255,136,0.08)", color: "var(--accent-green)", border: "rgba(0,255,136,0.25)", dot: "#00ff88" },
};

const labels = {
  critical: "CRITICAL",
  high: "HIGH",
  medium: "MEDIUM",
  low: "LOW",
  ok: "OK",
};

export default function RiskBadge({ level, label, pulse }: RiskBadgeProps) {
  const c = config[level];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: c.dot,
          flexShrink: 0,
          animation: pulse ? "pulse-glow 1.5s ease-in-out infinite" : undefined,
        }}
      />
      {label || labels[level]}
    </span>
  );
}
