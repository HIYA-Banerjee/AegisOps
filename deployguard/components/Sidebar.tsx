"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Brain,
  GitBranch,
  SearchCode,
  Server,
  Zap,
  FileText,
  Shield,
  FlaskConical,
  RotateCcw,
  MessageSquare,
  BarChart3,
  Heart,
  ChevronLeft,
  ChevronRight,
  Network,
  Cpu,
  Plug,
  Users,
  Award,
  Coins,
  Globe,
  Skull,
  Bot,
  Activity,
} from "lucide-react";

const navSections = [
  {
    title: "Core Operations",
    items: [
      { href: "/", icon: LayoutDashboard, label: "Dashboard", color: "var(--accent-cyan)" },
      { href: "/incidents", icon: MessageSquare, label: "Incidents Center", color: "var(--accent-red)" },
      { href: "/rollback", icon: RotateCcw, label: "Rollback Engine", color: "var(--accent-orange)" },
      { href: "/integrations", icon: Plug, label: "Integrations Hub", color: "var(--accent-cyan)" },
    ]
  },
  {
    title: "AI & Intelligence",
    items: [
      { href: "/copilot", icon: Bot, label: "AI Copilot", color: "var(--accent-purple)" },
      { href: "/predictor", icon: Brain, label: "AI Predictor", color: "var(--accent-purple)" },
      { href: "/root-cause", icon: SearchCode, label: "Root Cause", color: "var(--accent-orange)" },
      { href: "/digital-twin", icon: Cpu, label: "Digital Twin", color: "var(--accent-cyan)" },
    ]
  },
  {
    title: "Reliability & SRE",
    items: [
      { href: "/sre", icon: Activity, label: "SRE Reliability", color: "var(--accent-green)" },
      { href: "/dora", icon: BarChart3, label: "DORA Metrics", color: "var(--accent-cyan)" },
      { href: "/health", icon: Heart, label: "Health Score", color: "var(--accent-green)" },
      { href: "/team-insights", icon: Users, label: "Team Insights", color: "var(--accent-purple)" },
    ]
  },
  {
    title: "Infrastructure",
    items: [
      { href: "/infrastructure", icon: Server, label: "Cluster Info", color: "var(--accent-green)" },
      { href: "/cloud", icon: Globe, label: "Multi-Cloud", color: "var(--accent-cyan)" },
      { href: "/chaos", icon: Skull, label: "Chaos Platform", color: "var(--accent-red)" },
      { href: "/simulator", icon: FlaskConical, label: "Simulator", color: "var(--accent-purple)" },
    ]
  },
  {
    title: "Governance",
    items: [
      { href: "/executive", icon: Award, label: "Executive Command", color: "var(--accent-cyan)" },
      { href: "/cost", icon: Coins, label: "Cost Intelligence", color: "var(--accent-purple)" },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: collapsed ? 60 : 240,
        minHeight: "100vh",
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 60,
          display: "flex",
          alignItems: "center",
          padding: collapsed ? "0 14px" : "0 20px",
          borderBottom: "1px solid var(--border)",
          gap: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: 16,
            fontWeight: 800,
            color: "#fff",
          }}
        >
          A
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
              Aegis<span style={{ color: "var(--accent-cyan)" }}>Ops</span>{" "}
              <span style={{ color: "var(--accent-purple)" }}>AI</span>
            </div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              DevOps Intelligence
            </div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {navSections.map((section) => (
          <div key={section.title} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {!collapsed && (
              <div 
                style={{ 
                  fontSize: 9, 
                  fontWeight: 700, 
                  color: "var(--text-muted)", 
                  padding: "6px 12px 2px",
                  letterSpacing: "0.12em", 
                  textTransform: "uppercase" 
                }}
              >
                {section.title}
              </div>
            )}
            {section.items.map(({ href, icon: Icon, label, color }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  title={collapsed ? label : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: collapsed ? "10px 14px" : "8px 12px",
                    borderRadius: 8,
                    textDecoration: "none",
                    background: active ? "var(--accent-cyan-glow)" : "transparent",
                    border: active ? "1px solid rgba(0,212,255,0.2)" : "1px solid transparent",
                    color: active ? "var(--accent-cyan)" : "var(--text-secondary)",
                    fontWeight: active ? 600 : 400,
                    fontSize: 12.5,
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "var(--bg-card-hover)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  <Icon size={15} style={{ color: active ? color : "inherit", flexShrink: 0 }} />
                  {!collapsed && <span>{label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          margin: "8px",
          padding: "8px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--bg-input)",
          color: "var(--text-muted)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s ease",
        }}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
