// ============================================================
// SERVER-SIDE PERMISSION GUARDS
// Use these in Server Components and API Routes
// ============================================================
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
  requireAll?: boolean; // all roles must match (AND), default: any role (OR)
}

/**
 * Server-side guard: redirect if user does NOT have permission.
 * Use in Server Components or Route Handlers.
 *
 * @example
 * // In a Server Component:
 * export default async function ThesisPage() {
 *   requirePermission({ action: "read", resource: "thesis", redirectTo: "/" });
 *   return <ThesisList />;
 * }
 */
export function requirePermission(
  role: Role,
  options: RequirePermissionOptions,
): void {
  const { action, resource, redirectTo = "/" } = options;

  if (cannot(role, action, resource)) {
    redirect(redirectTo);
  }
}

/**
 * Server-side guard: redirect if user role is not in allowed list.
 */
export function requireRole(role: Role, options: RequireRoleOptions): void {
  const { roles, redirectTo = "/", requireAll = false } = options;

  const hasAccess = requireAll
    ? roles.every((r) => role === r)
    : roles.includes(role);

  if (!hasAccess) {
    redirect(redirectTo);
  }
}

/**
 * Server-side guard: redirect if user is NOT authenticated.
 */
export function requireAuth(
  role: Role | null | undefined,
  redirectTo = "/login",
): asserts role is Role {
  if (!role) {
    redirect(redirectTo);
  }
}

/**
 * Check permission server-side without redirecting.
 * Returns true if allowed, false otherwise.
 *
 * @example
 * if (!checkPermission(role, { action: "delete", resource: "thesis" })) {
 *   throw new Error("Not authorized");
 * }
 */
export function checkPermission(
  role: Role | null | undefined,
  options: RequirePermissionOptions,
): boolean {
  if (!role) return false;
  return can(role, options.action, options.resource);
}

/**
 * Server component wrapper: renders children only if permission is granted.
 */
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
