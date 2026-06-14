"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "sre" | "developer" | "executive">("developer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const res = await signIn(email, password, role);
    if (res.error) {
      setError(res.error.message || "Invalid credentials");
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "var(--text-muted)",
    marginBottom: "8px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    paddingTop: "12px",
    paddingRight: "14px",
    paddingBottom: "12px",
    paddingLeft: "40px",
    borderRadius: "10px",
    fontSize: "14px",
    background: "var(--bg-input)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    outline: "none",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box",
  };

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "16px",
    height: "16px",
    color: "var(--text-muted)",
    pointerEvents: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        position: "relative",
        overflow: "hidden",
        padding: 20,
      }}
    >
      {/* Background Animated Gradients */}
      <div
        style={{
          position: "absolute",
          top: -160,
          left: -160,
          width: 384,
          height: 384,
          borderRadius: "50%",
          filter: "blur(120px)",
          opacity: 0.2,
          background: "var(--accent-cyan)",
          animation: "float 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -160,
          right: -160,
          width: 384,
          height: 384,
          borderRadius: "50%",
          filter: "blur(120px)",
          opacity: 0.2,
          background: "var(--accent-purple)",
          animation: "float 8s ease-in-out infinite alternate",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
        style={{
          width: "100%",
          maxWidth: 440,
          padding: 36,
          borderRadius: 16,
          position: "relative",
          zIndex: 10,
          background: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18,
              background: "rgba(0, 212, 255, 0.1)",
              border: "1px solid var(--accent-cyan)",
              boxShadow: "var(--shadow-glow-cyan)",
            }}
          >
            <Shield style={{ width: 26, height: 26, color: "var(--accent-cyan)" }} />
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            AegisOps <span className="gradient-text">DeployGuard</span>
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8, textAlign: "center" }}>
            Autonomous AI DevOps & Release Risk Intelligence
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: "12px 16px",
              marginBottom: 24,
              borderRadius: 10,
              fontSize: 13,
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "var(--accent-red)",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail style={iconStyle} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="devops@aegisops.ai"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-cyan)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock style={iconStyle} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: "44px" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-cyan)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Assigned Access Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                fontSize: 14,
                background: "var(--bg-input)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                outline: "none",
                cursor: "pointer",
                appearance: "auto",
              }}
            >
              <option value="developer">Developer</option>
              <option value="sre">Site Reliability Engineer (SRE)</option>
              <option value="admin">Administrator / Platform Owner</option>
              <option value="executive">Executive Manager</option>
            </select>
          </div>

          {/* Remember + Reset */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 12,
              marginBottom: 24,
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked style={{ accentColor: "var(--accent-cyan)" }} />
              <span>Remember this system</span>
            </label>
            <Link
              href="/auth/reset"
              style={{ color: "var(--accent-cyan)", textDecoration: "none", fontWeight: 600 }}
            >
              Reset Credentials?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: 10,
              border: "none",
              fontWeight: 700,
              fontSize: 14,
              background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "var(--shadow-glow-cyan)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading ? "Authenticating Session..." : "Establish Secure Session"}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px 0",
            gap: 12,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0 }}>
            Or continue with
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        {/* Google SSO */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-primary)",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-input)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google Identity SSO
        </button>

        {/* Sign up link */}
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 24 }}>
          New deployment operator?{" "}
          <Link href="/auth/signup" style={{ color: "var(--accent-cyan)", textDecoration: "none", fontWeight: 600 }}>
            Register Operator Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
