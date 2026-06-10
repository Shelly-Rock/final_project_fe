import { redirect } from "next/navigation";
import type { Action, Resource, Role } from "../types";
import { can, cannot } from "../ability";

export interface RequirePermissionOptions {
  action: Action;
  resource: Resource;
  redirectTo?: string;
}

export interface RequireRoleOptions {
  roles: Role[];
  redirectTo?: string;
  requireAll?: boolean;
}

export function requirePermission(
  role: Role,
  options: RequirePermissionOptions,
): void {
  const { action, resource, redirectTo = "/" } = options;

  if (cannot(role, action, resource)) {
    redirect(redirectTo);
  }
}

export function requireRole(role: Role, options: RequireRoleOptions): void {
  const { roles, redirectTo = "/", requireAll = false } = options;

  const hasAccess = requireAll
    ? roles.every((r) => role === r)
    : roles.includes(role);

  if (!hasAccess) {
    redirect(redirectTo);
  }
}

export function requireAuth(
  role: Role | null | undefined,
  redirectTo = "/login",
): asserts role is Role {
  if (!role) {
    redirect(redirectTo);
  }
}

export function checkPermission(
  role: Role | null | undefined,
  options: RequirePermissionOptions,
): boolean {
  if (!role) return false;
  return can(role, options.action, options.resource);
}

export function PermissionGate({
  role,
  action,
  resource,
  fallback = null,
  children,
}: {
  role: Role;
  action: Action;
  resource: Resource;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  if (cannot(role, action, resource)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
