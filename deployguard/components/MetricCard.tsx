"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: ReactNode;
  accentColor?: string;
  glowColor?: string;
  index?: number;
}

export default function MetricCard({
  label,
  value,
  unit,
  trend,
  trendValue,
  icon,
  accentColor = "var(--accent-cyan)",
  glowColor,
  index = 0,
}: MetricCardProps) {
  const trendIcon =
    trend === "up" ? (
      <TrendingUp size={12} />
    ) : trend === "down" ? (
      <TrendingDown size={12} />
    ) : (
      <Minus size={12} />
    );

  const trendColor =
    trend === "up"
      ? "var(--accent-green)"
      : trend === "down"
      ? "var(--accent-red)"
      : "var(--text-muted)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      className="card"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Glow accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span className="section-label" style={{ marginBottom: 0 }}>
          {label}
        </span>
        {icon && (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `${accentColor}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accentColor,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.08 + 0.2 }}
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: accentColor,
            lineHeight: 1,
          }}
        >
          {value}
        </motion.span>
        {unit && (
          <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>
            {unit}
          </span>
        )}
      </div>

      {(trend || trendValue) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginTop: 8,
            color: trendColor,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {trendIcon}
          <span>{trendValue}</span>
        </div>
      )}
    </motion.div>
  );
}
