// ============================================================
// USE PERMISSION HOOK — comprehensive permission access
// ============================================================
"use client";

import { usePermissionContext } from "@/core/providers/PermissionProvider";
import type { Action, Resource } from "@/core/permissions/types";

export type { Action, Resource, Role } from "@/core/permissions/types";

/**
 * Comprehensive permission hook — returns all permission utilities.
 *
 * @example
 * function ThesisActions({ thesis }) {
 *   const { can, role, cannot } = usePermission();
 *
 *   return (
 *     <div>
 *       <span>Vai trò: {role}</span>
 *       {can("update", "thesis") && <EditButton />}
 *       {can("delete", "thesis") && <DeleteButton />}
 *       {cannot("manage", "thesis") && <span>Chỉ xem</span>}
 *     </div>
 *   );
 * }
 */
export function usePermission() {
  const { role, ability, can, cannot } = usePermissionContext();

  return {
    /** Current user role */
    role,

    /** Whether the user can perform an action */
    can: (action: Action | "manage", resource: Resource | "all") =>
      can(action, resource),

    /** Whether the user cannot perform an action */
    cannot: (action: Action | "manage", resource: Resource | "all") =>
      cannot(action, resource),

    /** Direct ability reference for advanced use */
    ability,
  };
}
