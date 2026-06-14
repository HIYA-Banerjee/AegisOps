import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return dateString;
  }
}

export function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHr < 24) return `${diffHr} hr ago`;
    return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  } catch (e) {
    return dateString;
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function calculateRiskScore(params: {
  testCoverage: number;
  failedBuilds: number;
  dependencyChanges: number;
  commitVelocity: number;
  buildDuration: number;
}): number {
  let score = 10;
  if (params.testCoverage < 80) score += (80 - params.testCoverage) * 1.5;
  if (params.testCoverage < 50) score += 20;
  score += params.failedBuilds * 15;
  score += params.dependencyChanges * 3;
  if (params.commitVelocity > 30) score += (params.commitVelocity - 30) * 0.5;
  if (params.buildDuration > 400) score += (params.buildDuration - 400) * 0.1;
  return Math.min(Math.max(Math.round(score), 0), 100);
}
