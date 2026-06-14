import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "AegisOps AI — DevOps Intelligence Platform",
  description:
    "AI-powered DevOps failure prediction, infrastructure monitoring, outage prevention, and intelligent root cause analysis platform.",
  keywords: ["DevOps", "AI", "deployment monitoring", "SRE", "infrastructure"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
