import { UserRole } from "@/types";

export type Permission =
  | "deployments:read"
  | "deployments:write"
  | "incidents:read"
  | "incidents:write"
  | "incidents:resolve"
  | "metrics:read"
  | "alerts:send"
  | "simulations:run"
  | "admin:audit"
  | "admin:users"
  | "executive:read";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    "deployments:read", "deployments:write",
    "incidents:read", "incidents:write", "incidents:resolve",
    "metrics:read", "alerts:send", "simulations:run",
    "admin:audit", "admin:users", "executive:read",
  ],
  sre: [
    "deployments:read", "deployments:write",
    "incidents:read", "incidents:write", "incidents:resolve",
    "metrics:read", "alerts:send", "simulations:run",
  ],
  developer: [
    "deployments:read", "deployments:write",
    "incidents:read", "metrics:read", "simulations:run",
  ],
  executive: [
    "deployments:read", "incidents:read", "metrics:read", "executive:read",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function requirePermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  return hasPermission(role, permission);
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  sre: "DevOps Engineer",
  developer: "Developer",
  executive: "Manager",
};
