"use client";

import { useEffect, useRef } from "react";

const LOG_ENTRIES = [
  { level: "error", msg: "[auth-service] DB connection timeout after 30000ms", ts: "07:31:42" },
  { level: "warn",  msg: "[payment-svc] Memory usage at 89% — approaching limit",ts: "07:31:39" },
  { level: "info",  msg: "[k8s] Pod auth-service-7f4d9 restarted (OOMKilled)",   ts: "07:31:36" },
  { level: "error", msg: "[nginx] Upstream connect() failed (errno 111)",          ts: "07:31:33" },
  { level: "debug", msg: "[prometheus] Scraped 1,247 metrics in 42ms",            ts: "07:31:30" },
  { level: "warn",  msg: "[redis] Eviction rate spike — 340 keys/s",              ts: "07:31:27" },
  { level: "info",  msg: "[deploy] v2.5.0 rollout started — 3/10 pods updated",   ts: "07:31:24" },
  { level: "error", msg: "[postgres] max_connections reached (100/100)",           ts: "07:31:21" },
  { level: "info",  msg: "[kafka] Consumer lag on topic events: 12,340 msgs",     ts: "07:31:18" },
  { level: "warn",  msg: "[api-gateway] P99 latency: 847ms (threshold: 500ms)",   ts: "07:31:15" },
  { level: "error", msg: "[migration] ALTER TABLE orders failed — lock timeout",   ts: "07:31:12" },
  { level: "info",  msg: "[hpa] Scaling payment-svc from 3→5 replicas",           ts: "07:31:09" },
  { level: "debug", msg: "[healthcheck] /health 200 OK in 3ms",                   ts: "07:31:06" },
  { level: "warn",  msg: "[cert-manager] TLS cert expires in 7 days",             ts: "07:31:03" },
  { level: "error", msg: "[sidecar] envoy proxy: circuit breaker OPEN",           ts: "07:31:00" },
];

const colorMap: Record<string, string> = {
  error: "var(--accent-red)",
  warn: "var(--accent-orange)",
  info: "var(--accent-cyan)",
  debug: "var(--text-muted)",
  success: "var(--accent-green)",
};

interface LogViewerProps {
  height?: number;
  autoScroll?: boolean;
  entries?: typeof LOG_ENTRIES;
}

export default function LogViewer({
  height = 240,
  autoScroll = true,
  entries = LOG_ENTRIES,
}: LogViewerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [autoScroll]);

  return (
    <div
      ref={ref}
      style={{
        height,
        overflowY: "auto",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "12px",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {[...entries, ...entries].map((entry, i) => (
        <div
          key={i}
          className="log-line"
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 3,
            opacity: i < entries.length * 0.5 ? 0.5 : 1,
          }}
        >
          <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{entry.ts}</span>
          <span
            style={{
              color: colorMap[entry.level],
              flexShrink: 0,
              textTransform: "uppercase",
              fontWeight: 700,
              fontSize: 10,
              width: 40,
            }}
          >
            {entry.level}
          </span>
          <span style={{ color: "var(--text-secondary)" }}>{entry.msg}</span>
        </div>
      ))}
    </div>
  );
}
