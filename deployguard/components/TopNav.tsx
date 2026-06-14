"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useSupabaseStatus } from "@/hooks/useSupabaseStatus";

interface TopNavProps {
  title: string;
  subtitle?: string;
}

export default function TopNav({ title, subtitle }: TopNavProps) {
  const { user, signOut } = useAuth();
  const { isConnected, isMockMode, isPublishableKeyMode } = useSupabaseStatus();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "SV";

  const dbStatusColor = isMockMode
    ? "var(--accent-purple)"
    : isPublishableKeyMode
      ? "var(--accent-yellow)"
      : isConnected
        ? "var(--accent-cyan)"
        : "var(--accent-red)";
  const dbStatusLabel = isMockMode
    ? "MOCK DATA"
    : isPublishableKeyMode
      ? "DB OK · AUTH KEY NEEDED"
      : isConnected
        ? "SUPABASE: OK"
        : "DB OFFLINE";

  return (
    <header
      style={{
        height: 60,
        background: "var(--bg-sidebar)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 40,
        backdropFilter: "blur(12px)",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 20,
            background: `${dbStatusColor}18`,
            border: `1px solid ${dbStatusColor}40`,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: dbStatusColor,
              animation: isConnected || isMockMode ? "pulse-glow 2s ease-in-out infinite" : undefined,
            }}
          />
          <span style={{ fontSize: 11, color: dbStatusColor, fontWeight: 600 }}>
            {dbStatusLabel}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 20,
            background: "rgba(0,255,136,0.1)",
            border: "1px solid rgba(0,255,136,0.25)",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--accent-green)",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
          />
          <span style={{ fontSize: 11, color: "var(--accent-green)", fontWeight: 600 }}>
            LIVE
          </span>
        </div>

        <button
          style={{
            position: "relative",
            width: 36,
            height: 36,
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--bg-input)",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Bell size={16} />
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "var(--accent-red)",
              fontSize: 9,
              color: "#fff",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            3
          </span>
        </button>

        <ThemeToggle />

        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              cursor: "pointer",
              border: "none",
            }}
          >
            {initials}
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 40,
                minWidth: 200,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "8px 0",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                zIndex: 50,
              }}
            >
              {user && (
                <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    {user.email}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--accent-cyan)", marginTop: 4, textTransform: "uppercase", fontWeight: 600 }}>
                    {user.role}
                  </div>
                </div>
              )}
              <button
                onClick={handleSignOut}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  background: "transparent",
                  border: "none",
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-input)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
