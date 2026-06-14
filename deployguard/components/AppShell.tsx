"use client";

import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AppShell({ children, title, subtitle }: AppShellProps) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          marginLeft: 240,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <TopNav title={title} subtitle={subtitle} />
        <main
          style={{
            flex: 1,
            padding: "24px",
            background: "var(--bg-primary)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
