"use client";

import { useState } from "react";
import { Shield, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await resetPassword(email);
    if (res.error) {
      setError(res.error.message);
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Background Animated Gradients */}
      <div 
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: "var(--accent-cyan)", animation: "float 8s ease-in-out infinite" }}
      />
      <div 
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: "var(--accent-purple)", animation: "float 8s ease-in-out infinite alternate" }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl relative z-10 card"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
      >
        <div className="flex flex-col items-center mb-6">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 glow-cyan"
            style={{ background: "rgba(0, 212, 255, 0.1)", border: "1px solid var(--accent-cyan)" }}
          >
            <Shield className="w-6 h-6 text-cyan" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-center">
            {submitted ? "Token Dispatched" : "Reset Credentials"}
          </h1>
          <p className="text-sm text-muted mt-2 text-center">
            {submitted ? "A reset token has been sent to your inbox." : "DeployGuard Recovery System"}
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6 text-center">
            <div className="flex justify-center text-green">
              <CheckCircle className="w-16 h-16 animate-pulse" />
            </div>
            <p className="text-sm text-secondary">
              We've dispatched a secure login token to <strong className="text-cyan">{email}</strong>. Check your inbox and follow the embedded link to access your operator dashboard.
            </p>
            <Link 
              href="/auth/login"
              className="mt-6 w-full py-2.5 rounded-lg border font-medium flex items-center justify-center space-x-2 hover:bg-slate-800/10 transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {error && (
              <div style={{
                padding: "12px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "var(--accent-red)",
              }}>
                {error}
              </div>
            )}
            <div>
              <label style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text-muted)",
                marginBottom: "8px",
              }}>
                Work Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "16px",
                  height: "16px",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="devops@aegisops.ai"
                  style={{
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
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ 
                width: "100%",
                padding: "14px 0",
                borderRadius: "10px",
                border: "none",
                fontWeight: 700,
                fontSize: "14px",
                background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))", 
                color: "#ffffff",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "var(--shadow-glow-cyan)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
            >
              {loading ? "Verifying Operator..." : "Dispatch Recovery Token"}
            </button>

            <Link 
              href="/auth/login"
              style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text-primary)",
                fontSize: "14px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              <ArrowLeft style={{ width: "16px", height: "16px" }} />
              Return to Session Login
            </Link>
          </form>
        )}
      </motion.div>
    </div>
  );
}
