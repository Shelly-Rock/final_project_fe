// ============================================================
// SHARED UI COMPONENTS — Permission-based access control
// ============================================================
"use client";

import type { ReactNode } from "react";
import { usePermissionContext } from "@/core/providers/PermissionProvider";
import type { Action, Resource } from "@/core/permissions/types";

// ---------- PermissionGuard ----------
interface PermissionGuardProps {
  action: Action | "manage";
  resource: Resource | "all";
  children: ReactNode;
  fallback?: ReactNode | null;
}

/**
 * Shows children only when the user has the required permission.
 * Uses client-side ability from PermissionProvider context.
 *
 * @example
 * <PermissionGuard action="delete" resource="thesis" fallback={<DisabledButton />}>
 *   <DeleteButton />
 * </PermissionGuard>
 */
export function PermissionGuard({
  action,
  resource,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { can } = usePermissionContext();

  if (!can(action, resource)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// ---------- ProtectedComponent ----------
interface ProtectedComponentProps {
  action: Action | "manage";
  resource: Resource | "all";
  children: ReactNode;
  fallback?: ReactNode | null;
  message?: string;
}

/**
 * Similar to PermissionGuard but renders a default "access denied" message.
 *
 * @example
 * <ProtectedComponent
 *   action="manage"
 *   resource="user"
 *   message="Bạn không có quyền quản lý người dùng."
 * >
 *   <UserManagementPanel />
 * </ProtectedComponent>
 */
export function ProtectedComponent({
  action,
  resource,
  children,
  fallback = null,
  message,
}: ProtectedComponentProps) {
  const { can } = usePermissionContext();

  if (!can(action, resource)) {
    return (
      <>
        {fallback ??
          (message && (
            <p style={{ color: "#d13b3b", fontSize: "0.875rem" }}>{message}</p>
          ))}
      </>
    );
  }

  return <>{children}</>;
}

// ---------- RoleGate ----------
interface RoleGateProps {
  roles: Role[] | Role;
  children: ReactNode;
  fallback?: ReactNode | null;
  requireAll?: boolean;
}

// Type re-export for convenience in shared components
type Role = "admin" | "secretary" | "teacher" | "student";

/**
 * Shows children only when the user's role matches.
 *
 * @example
 * <RoleGate roles={["admin", "secretary"]}>
 *   <AdminPanel />
 * </RoleGate>
 */
export function RoleGate({
  roles,
  children,
  fallback = null,
  requireAll = false,
}: RoleGateProps) {
  const { role } = usePermissionContext();

  if (!role) return <>{fallback}</>;

  const target = Array.isArray(roles) ? roles : [roles];
  const hasAccess = requireAll
    ? target.every((r) => role === r)
    : target.includes(role as Role);

  if (!hasAccess) return <>{fallback}</>;

  return <>{children}</>;
}
