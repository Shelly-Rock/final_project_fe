// ============================================================
// PERMISSIONS BARREL — export all permission utilities
// ============================================================

// Types
export type {
  Role,
  Action,
  Resource,
  Permission,
  RoleUser,
  AbilityCheck,
} from "./types";
export { ROLE, ROLE_LABELS, ROLE_HIERARCHY, ACTION, RESOURCE } from "./types";

// Permissions mapping
export {
  ROLE_PERMISSIONS,
  getPermissionsForRole,
  hasPermission,
} from "./permissions";

// Ability builder
export { AppAbility, defineAbilityFor, can, cannot } from "./ability";
export { isRoleHigherOrEqual, isRoleHigher } from "./ability";

// Helpers
export {
  canCreate,
  canRead,
  canUpdate,
  canDelete,
  canManage,
  getAccessibleResources,
  getRoleDescription,
  getActionsForResource,
  isRole,
  isAnyRole,
  filterByResource,
  filterByAction,
} from "./helpers/hasPermission";

// Guards
export {
  requirePermission,
  requireRole,
  requireAuth,
  checkPermission,
  PermissionGate,
} from "./guards/permission.server";
