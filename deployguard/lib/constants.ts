export const RISK_THRESHOLDS = {
  LOW: 30,
  MEDIUM: 70,
  HIGH: 100,
};

export const COLOR_MAPS = {
  risk: {
    low: "var(--accent-green)",
    medium: "var(--accent-yellow)",
    high: "var(--accent-red)",
  },
  severity: {
    P0: "var(--accent-red)",
    P1: "var(--accent-orange)",
    P2: "var(--accent-yellow)",
  },
  status: {
    ok: "var(--accent-green)",
    failed: "var(--accent-red)",
    partial: "var(--accent-yellow)",
    active: "var(--accent-red)",
    resolved: "var(--accent-green)",
    investigating: "var(--accent-orange)",
  },
};

export const DORA_BENCHMARKS = {
  deploymentFrequency: {
    ELITE: { min: 4, label: "Multiple deploys per day", tier: "Elite" as const },
    HIGH: { min: 1, label: "Once per day to once per week", tier: "High" as const },
    MEDIUM: { min: 0.1, label: "Once per week to once per month", tier: "Medium" as const },
    LOW: { min: 0, label: "Fewer than once per month", tier: "Low" as const },
  },
  leadTimeHours: {
    ELITE: { max: 24, label: "Less than one day", tier: "Elite" as const },
    HIGH: { max: 168, label: "One day to one week", tier: "High" as const },
    MEDIUM: { max: 720, label: "One week to one month", tier: "Medium" as const },
    LOW: { max: Infinity, label: "More than one month", tier: "Low" as const },
  },
  meanTimeToRestoreMinutes: {
    ELITE: { max: 60, label: "Less than one hour", tier: "Elite" as const },
    HIGH: { max: 1440, label: "Less than one day", tier: "High" as const },
    MEDIUM: { max: 10080, label: "Less than one week", tier: "Medium" as const },
    LOW: { max: Infinity, label: "More than one week", tier: "Low" as const },
  },
  changeFailureRatePercent: {
    ELITE: { max: 15, label: "0-15%", tier: "Elite" as const },
    HIGH: { max: 20, label: "16-20%", tier: "High" as const },
    MEDIUM: { max: 30, label: "21-30%", tier: "Medium" as const },
    LOW: { max: 100, label: "More than 30%", tier: "Low" as const },
  },
};
