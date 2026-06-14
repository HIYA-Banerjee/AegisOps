"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedBarProps {
  label: string;
  value: number; // 0-100
  color?: string;
  showValue?: boolean;
  height?: number;
  index?: number;
  threshold?: number;
}

function getColor(value: number, customColor?: string): string {
  if (customColor) return customColor;
  if (value >= 90) return "var(--accent-red)";
  if (value >= 75) return "var(--accent-orange)";
  if (value >= 50) return "var(--accent-cyan)";
  return "var(--accent-green)";
}

export default function AnimatedBar({
  label,
  value,
  color,
  showValue = true,
  height = 6,
  index = 0,
  threshold,
}: AnimatedBarProps) {
  const [displayed, setDisplayed] = useState(0);
  const barColor = getColor(value, color);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(value), 200 + index * 100);
    return () => clearTimeout(timer);
  }, [value, index]);

  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>
          {label}
        </span>
        {showValue && (
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: barColor,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {value}%
          </span>
        )}
      </div>
      <div
        className="progress-bar"
        style={{ height, background: "var(--border)" }}
      >
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{
            duration: 1.2,
            delay: 0.3 + index * 0.1,
            ease: "easeOut",
          }}
          style={{
            height: "100%",
            borderRadius: 3,
            background:
              value >= 90
                ? `linear-gradient(90deg, ${barColor}, #ff6b6b)`
                : value >= 75
                ? `linear-gradient(90deg, ${barColor}, #ffd93d)`
                : `linear-gradient(90deg, ${barColor}, var(--accent-cyan))`,
            boxShadow: `0 0 8px ${barColor}60`,
          }}
        />
      </div>
      {threshold && value >= threshold && (
        <div style={{ fontSize: 10, color: "var(--accent-red)", marginTop: 3 }}>
          ⚠ Above threshold ({threshold}%)
        </div>
      )}
    </div>
  );
}
