// ============================================================
// PERMISSION HOOKS — client-side permission checks
// ============================================================
"use client";

import { usePermissionContext } from "@/core/providers/PermissionProvider";
import type { Action, Resource, Role } from "@/core/permissions/types";

/**
 * Hook to check if the current user can perform an action on a resource.
 *
 * @example
 * function DeleteButton({ thesisId }) {
 *   const canDelete = useCan("delete", "thesis");
 *   return canDelete ? <button>Delete</button> : null;
 * }
 */
export function useCan(
  action: Action | "manage",
  resource: Resource | "all",
): boolean {
  const { can } = usePermissionContext();
  return can(action, resource);
}

/**
 * Hook to check if the current user CANNOT perform an action.
 */
export function useCannot(
  action: Action | "manage",
  resource: Resource | "all",
): boolean {
  const { cannot } = usePermissionContext();
  return cannot(action, resource);
}

/**
 * Hook to get all actions available for a specific resource.
 */
export function useActionsForResource(resource: Resource): Action[] {
  const { ability } = usePermissionContext();
  // Return actions that can be performed on this resource
  const allActions: Action[] = [
    "create",
    "read",
    "update",
    "delete",
    "manage",
    "approve",
    "submit",
    "review",
    "export",
    "import",
  ];
  return allActions.filter((a) => ability.can(a, resource));
}

/**
 * Hook to check the current user's role.
 */
export function useRole(): Role | null {
  const { role } = usePermissionContext();
  return role;
}

/**
 * Hook to check if current user's role matches any of the given roles.
 *
 * @example
 * const isAdminOrSecretary = useIsRole(["admin", "secretary"]);
 */
export function useIsRole(roles: Role[]): boolean {
  const { role } = usePermissionContext();
  if (!role) return false;
  return roles.includes(role);
}
