import { NextRequest } from "next/server";
import { UserRole } from "@/types";
import { Permission, requirePermission } from "@/lib/rbac";

export interface AuthContext {
  userId: string;
  email: string;
  role: UserRole;
}

export function getAuthFromRequest(req: NextRequest): AuthContext | null {
  const userId = req.headers.get("x-user-id");
  const email = req.headers.get("x-user-email");
  const role = req.headers.get("x-user-role") as UserRole | null;

  if (!userId || !role) return null;
  return { userId, email: email || "", role };
}

export function authorizeApi(
  req: NextRequest,
  permission: Permission
): { authorized: true; auth: AuthContext } | { authorized: false; status: number; message: string } {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return { authorized: false, status: 401, message: "Unauthorized" };
  }
  if (!requirePermission(auth.role, permission)) {
    return { authorized: false, status: 403, message: "Forbidden" };
  }
  return { authorized: true, auth };
}
