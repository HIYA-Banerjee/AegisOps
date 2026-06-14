"use client";

import { motion } from "framer-motion";

interface GaugeChartProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  sublabel?: string;
  unit?: string;
  animate?: boolean;
}

export default function GaugeChart({
  value,
  size = 120,
  strokeWidth = 10,
  color = "var(--accent-cyan)",
  bgColor = "var(--border)",
  label,
  sublabel,
  unit = "",
  animate = true,
}: GaugeChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use 270deg arc (three-quarters)
  const arcLength = circumference * 0.75;
  const fillLength = (value / 100) * arcLength;
  const offset = arcLength - fillLength;

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(135deg)" }}>
          {/* Background arc */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={bgColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Value arc */}
          <motion.circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: animate ? offset : offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        </svg>
        {/* Center text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              fontSize: size > 100 ? 26 : 18,
              fontWeight: 800,
              color: color,
              lineHeight: 1,
            }}
          >
            {value}
            <span style={{ fontSize: size > 100 ? 14 : 10, fontWeight: 600 }}>{unit}</span>
          </motion.span>
          {sublabel && (
            <span style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>
              {sublabel}
            </span>
          )}
        </div>
      </div>
      {label && (
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-secondary)",
            textAlign: "center",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
