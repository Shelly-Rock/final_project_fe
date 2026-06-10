import type { Action, Permission, Resource, Role } from "../types";
import { ACTION, ROLE } from "../types";
import { getPermissionsForRole } from "../permissions";
import { can } from "../ability";

// ---------- Simple role check ----------
export function isRole(role: Role | null | undefined, target: Role): boolean {
  return role === target;
}

export function isAnyRole(
  role: Role | null | undefined,
  targets: Role[],
): boolean {
  if (!role) return false;
  return targets.includes(role);
}

// ---------- Permission list helpers ----------
export function filterByResource(
  permissions: Permission[],
  resource: Resource,
): Permission[] {
  return permissions.filter((p) => {
    const resources = Array.isArray(p.resource) ? p.resource : [p.resource];
    return resources.includes(resource);
  });
}

export function filterByAction(
  permissions: Permission[],
  action: Action,
): Permission[] {
  return permissions.filter((p) => {
    const actions = Array.isArray(p.action) ? p.action : [p.action];
    return actions.includes(action);
  });
}

export function getActionsForResource(
  role: Role,
  resource: Resource,
): Action[] {
  const perms = filterByResource(getPermissionsForRole(role), resource);
  const actions: Action[] = [];
  for (const p of perms) {
    const a = Array.isArray(p.action) ? p.action : [p.action];
    for (const act of a) {
      if (!actions.includes(act)) actions.push(act);
    }
  }
  return actions;
}

// ---------- Convenience permission checks ----------
export function canCreate(role: Role, resource: Resource): boolean {
  return can(role, ACTION.CREATE, resource);
}

export function canRead(role: Role, resource: Resource): boolean {
  return can(role, ACTION.READ, resource);
}

export function canUpdate(role: Role, resource: Resource): boolean {
  return can(role, ACTION.UPDATE, resource);
}

export function canDelete(role: Role, resource: Resource): boolean {
  return can(role, ACTION.DELETE, resource);
}

export function canManage(role: Role, resource: Resource): boolean {
  return can(role, ACTION.MANAGE, resource);
}

// ---------- Resource list by role ----------
export function getAccessibleResources(role: Role): Resource[] {
  const perms = getPermissionsForRole(role);
  const resources = new Set<Resource>();
  for (const p of perms) {
    const r = Array.isArray(p.resource) ? p.resource : [p.resource];
    for (const res of r) {
      resources.add(res);
    }
  }
  return Array.from(resources);
}

// ---------- Role description ----------
export function getRoleDescription(role: Role): string {
  switch (role) {
    case ROLE.ADMIN:
      return "Toàn quyền quản lý hệ thống";
    case ROLE.SECRETARY:
      return "Quản lý đồ án, phân công giảng viên, theo dõi tiến độ";
    case ROLE.TEACHER:
      return "Hướng dẫn sinh viên, phản biện và chấm điểm đồ án";
    case ROLE.STUDENT:
      return "Đăng ký đề tài, nộp đồ án và theo dõi kết quả";
    default:
      return "Vai trò không xác định";
  }
}
