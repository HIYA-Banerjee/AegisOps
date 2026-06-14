"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Eye, EyeOff, Lock, Mail, User, CheckCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [team, setTeam] = useState("Core Platform");
  const [role, setRole] = useState<"admin" | "sre" | "developer" | "executive">("developer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const res = await signUp(email, name, password, role, team);
    if (res.error) {
      setError(res.error.message || "Failed to register operator.");
    } else if (res.needsEmailConfirmation) {
      // Supabase requires email confirmation before login
      setEmailSent(true);
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
        {emailSent ? (
          /* Email Confirmation Sent Success View */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "20px 0" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              <CheckCircle style={{ width: 32, height: 32, color: "#10b981" }} />
            </div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: 12,
              }}
            >
              Check Your Email
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 8 }}>
              We&apos;ve sent a confirmation link to:
            </p>
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--accent-cyan)",
                marginBottom: 24,
                padding: "8px 16px",
                borderRadius: 8,
                background: "rgba(0, 212, 255, 0.06)",
                border: "1px solid rgba(0, 212, 255, 0.15)",
              }}
            >
              {email}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 32 }}>
              Click the link in the email to verify your account, then come back and sign in.
              <br />
              <span style={{ fontSize: 12, opacity: 0.8 }}>
                (Check your spam folder if you don&apos;t see it)
              </span>
            </p>
            <Link
              href="/auth/login"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 28px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 14,
                background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))",
                color: "#fff",
                textDecoration: "none",
                boxShadow: "var(--shadow-glow-cyan)",
                transition: "all 0.2s ease",
              }}
            >
              <ArrowLeft style={{ width: 16, height: 16 }} />
              Go to Login
            </Link>
          </div>
        ) : (
          <>
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
            Register <span className="gradient-text">Operator</span>
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8, textAlign: "center" }}>
            DeployGuard Enterprise Access Control
          </p>
        </div>

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

        <form onSubmit={handleSignup}>
          {/* Full Name */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Full Name</label>
            <div style={{ position: "relative" }}>
              <User style={iconStyle} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elena Rostova"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent-cyan)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>
          </div>

          {/* Work Email */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Work Email</label>
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
            <label style={labelStyle}>Choose Password</label>
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

          {/* Grid: DevOps Team & Operator Role */}
          <div style={{ display: "flex", gap: "16px", marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>DevOps Team</label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
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
                <option value="Core Platform">Core Platform</option>
                <option value="Auth & Security">Auth & Security</option>
                <option value="API Gateway">API Gateway</option>
                <option value="Billing & Subscriptions">Billing & Subscriptions</option>
                <option value="Data Pipelines">Data Pipelines</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Operator Role</label>
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
                <option value="sre">SRE</option>
                <option value="admin">Administrator</option>
                <option value="executive">Executive</option>
              </select>
            </div>
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
            {loading ? "Registering Operator..." : "Provision Operator Access"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 24 }}>
          Already registered?{" "}
          <Link href="/auth/login" style={{ color: "var(--accent-cyan)", textDecoration: "none", fontWeight: 600 }}>
            Establish Secure Session
          </Link>
        </p>
        </>
        )}
      </motion.div>
    </div>
  );
}
