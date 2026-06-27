import type { Action, Permission, Resource, Role } from "./types";
import { ACTION, RESOURCE, ROLE } from "./types";

// ---------- Permission sets ----------

const manageAll: Permission[] = [
  { action: ACTION.MANAGE, resource: RESOURCE.USER },
  { action: ACTION.MANAGE, resource: RESOURCE.ROLE },
  { action: ACTION.MANAGE, resource: RESOURCE.PERMISSION },
  { action: ACTION.MANAGE, resource: RESOURCE.THESIS },
  { action: ACTION.MANAGE, resource: RESOURCE.THESIS_TOPIC },
  { action: ACTION.MANAGE, resource: RESOURCE.THESIS_SUBMISSION },
  { action: ACTION.MANAGE, resource: RESOURCE.THESIS_REVIEW },
  { action: ACTION.MANAGE, resource: RESOURCE.THESIS_SCORE },
  { action: ACTION.MANAGE, resource: RESOURCE.THESIS_DEFENSE },
  { action: ACTION.MANAGE, resource: RESOURCE.DEPARTMENT },
  { action: ACTION.MANAGE, resource: RESOURCE.MAJOR },
  { action: ACTION.MANAGE, resource: RESOURCE.CLASS },
  { action: ACTION.MANAGE, resource: RESOURCE.COURSE },
  { action: ACTION.MANAGE, resource: RESOURCE.ANNOUNCEMENT },
  { action: ACTION.MANAGE, resource: RESOURCE.DOCUMENT },
  { action: ACTION.MANAGE, resource: RESOURCE.REPORT },
  { action: ACTION.MANAGE, resource: RESOURCE.SETTING },
  { action: ACTION.MANAGE, resource: RESOURCE.AUDIT_LOG },
  { action: ACTION.MANAGE, resource: RESOURCE.CONFIG },
  { action: ACTION.EXPORT, resource: RESOURCE.REPORT },
  { action: ACTION.EXPORT, resource: RESOURCE.STATISTIC },
  { action: ACTION.IMPORT, resource: RESOURCE.USER },
  { action: ACTION.IMPORT, resource: RESOURCE.THESIS },
];

const adminThesisFull: Permission[] = [
  { action: ACTION.CREATE, resource: RESOURCE.THESIS },
  { action: ACTION.READ, resource: RESOURCE.THESIS },
  { action: ACTION.UPDATE, resource: RESOURCE.THESIS },
  { action: ACTION.DELETE, resource: RESOURCE.THESIS },
  { action: ACTION.APPROVE, resource: RESOURCE.THESIS },
  { action: ACTION.REVIEW, resource: RESOURCE.THESIS },
  { action: ACTION.CREATE, resource: RESOURCE.THESIS_TOPIC },
  { action: ACTION.READ, resource: RESOURCE.THESIS_TOPIC },
  { action: ACTION.UPDATE, resource: RESOURCE.THESIS_TOPIC },
  { action: ACTION.DELETE, resource: RESOURCE.THESIS_TOPIC },
  { action: ACTION.APPROVE, resource: RESOURCE.THESIS_TOPIC },
  { action: ACTION.CREATE, resource: RESOURCE.THESIS_DEFENSE },
  { action: ACTION.READ, resource: RESOURCE.THESIS_DEFENSE },
  { action: ACTION.UPDATE, resource: RESOURCE.THESIS_DEFENSE },
  { action: ACTION.APPROVE, resource: RESOURCE.THESIS_DEFENSE },
  { action: ACTION.READ, resource: RESOURCE.THESIS_SCORE },
  { action: ACTION.CREATE, resource: RESOURCE.THESIS_SCORE },
  { action: ACTION.UPDATE, resource: RESOURCE.THESIS_SCORE },
  { action: ACTION.CREATE, resource: RESOURCE.ANNOUNCEMENT },
  { action: ACTION.READ, resource: RESOURCE.ANNOUNCEMENT },
  { action: ACTION.UPDATE, resource: RESOURCE.ANNOUNCEMENT },
  { action: ACTION.DELETE, resource: RESOURCE.ANNOUNCEMENT },
  { action: ACTION.READ, resource: RESOURCE.REPORT },
  { action: ACTION.READ, resource: RESOURCE.STATISTIC },
  { action: ACTION.CREATE, resource: RESOURCE.DEPARTMENT },
  { action: ACTION.READ, resource: RESOURCE.DEPARTMENT },
  { action: ACTION.UPDATE, resource: RESOURCE.DEPARTMENT },
  { action: ACTION.CREATE, resource: RESOURCE.MAJOR },
  { action: ACTION.READ, resource: RESOURCE.MAJOR },
  { action: ACTION.UPDATE, resource: RESOURCE.MAJOR },
  { action: ACTION.CREATE, resource: RESOURCE.CLASS },
  { action: ACTION.READ, resource: RESOURCE.CLASS },
  { action: ACTION.UPDATE, resource: RESOURCE.CLASS },
  { action: ACTION.CREATE, resource: RESOURCE.COURSE },
  { action: ACTION.READ, resource: RESOURCE.COURSE },
  { action: ACTION.UPDATE, resource: RESOURCE.COURSE },
  { action: ACTION.READ, resource: RESOURCE.DOCUMENT },
  { action: ACTION.CREATE, resource: RESOURCE.DOCUMENT },
  { action: ACTION.UPDATE, resource: RESOURCE.DOCUMENT },
  { action: ACTION.DELETE, resource: RESOURCE.DOCUMENT },
];

const teacherThesisManage: Permission[] = [
  { action: ACTION.READ, resource: RESOURCE.THESIS },
  { action: ACTION.CREATE, resource: RESOURCE.THESIS },
  { action: ACTION.UPDATE, resource: RESOURCE.THESIS },
  { action: ACTION.DELETE, resource: RESOURCE.THESIS },
  { action: ACTION.CREATE, resource: RESOURCE.THESIS_TOPIC },
  { action: ACTION.READ, resource: RESOURCE.THESIS_TOPIC },
  { action: ACTION.UPDATE, resource: RESOURCE.THESIS_TOPIC },
  { action: ACTION.DELETE, resource: RESOURCE.THESIS_TOPIC },
  { action: ACTION.REVIEW, resource: RESOURCE.THESIS },
  { action: ACTION.CREATE, resource: RESOURCE.THESIS_REVIEW },
  { action: ACTION.READ, resource: RESOURCE.THESIS_REVIEW },
  { action: ACTION.UPDATE, resource: RESOURCE.THESIS_REVIEW },
  { action: ACTION.CREATE, resource: RESOURCE.THESIS_SCORE },
  { action: ACTION.READ, resource: RESOURCE.THESIS_SCORE },
  { action: ACTION.UPDATE, resource: RESOURCE.THESIS_SCORE },
  { action: ACTION.READ, resource: RESOURCE.THESIS_DEFENSE },
  { action: ACTION.CREATE, resource: RESOURCE.THESIS_DEFENSE },
  { action: ACTION.READ, resource: RESOURCE.DEPARTMENT },
  { action: ACTION.READ, resource: RESOURCE.MAJOR },
  { action: ACTION.READ, resource: RESOURCE.CLASS },
  { action: ACTION.READ, resource: RESOURCE.ANNOUNCEMENT },
  { action: ACTION.CREATE, resource: RESOURCE.ANNOUNCEMENT },
  { action: ACTION.READ, resource: RESOURCE.DOCUMENT },
  { action: ACTION.CREATE, resource: RESOURCE.DOCUMENT },
  { action: ACTION.READ, resource: RESOURCE.REPORT },
  { action: ACTION.READ, resource: RESOURCE.STATISTIC },
];

const studentThesisBasic: Permission[] = [
  { action: ACTION.CREATE, resource: RESOURCE.THESIS },
  { action: ACTION.READ, resource: RESOURCE.THESIS },
  { action: ACTION.UPDATE, resource: RESOURCE.THESIS },
  { action: ACTION.CREATE, resource: RESOURCE.THESIS_SUBMISSION },
  { action: ACTION.READ, resource: RESOURCE.THESIS_SUBMISSION },
  { action: ACTION.UPDATE, resource: RESOURCE.THESIS_SUBMISSION },
  { action: ACTION.READ, resource: RESOURCE.THESIS_TOPIC },
  { action: ACTION.CREATE, resource: RESOURCE.THESIS_TOPIC },
  { action: ACTION.READ, resource: RESOURCE.THESIS_REVIEW },
  { action: ACTION.READ, resource: RESOURCE.THESIS_SCORE },
  { action: ACTION.READ, resource: RESOURCE.THESIS_DEFENSE },
  { action: ACTION.READ, resource: RESOURCE.ANNOUNCEMENT },
  { action: ACTION.READ, resource: RESOURCE.DOCUMENT },
  { action: ACTION.CREATE, resource: RESOURCE.DOCUMENT },
  { action: ACTION.CREATE, resource: RESOURCE.COMMENT },
  { action: ACTION.READ, resource: RESOURCE.COMMENT },
  { action: ACTION.UPDATE, resource: RESOURCE.COMMENT },
  { action: ACTION.DELETE, resource: RESOURCE.COMMENT },
  { action: ACTION.DELETE, resource: RESOURCE.COMMENT },
  { action: ACTION.READ, resource: RESOURCE.CLASS },
  { action: ACTION.READ, resource: RESOURCE.COURSE },
];

const councilThesisGrade: Permission[] = [
  { action: ACTION.READ, resource: RESOURCE.THESIS_DEFENSE },
  { action: ACTION.GRADE, resource: RESOURCE.THESIS },
  { action: ACTION.READ, resource: RESOURCE.THESIS },
  { action: ACTION.CREATE, resource: RESOURCE.THESIS_SCORE },
  { action: ACTION.READ, resource: RESOURCE.THESIS_SCORE },
  { action: ACTION.UPDATE, resource: RESOURCE.THESIS_SCORE },
  { action: ACTION.READ, resource: RESOURCE.ANNOUNCEMENT },
  { action: ACTION.READ, resource: RESOURCE.DOCUMENT },
];

// ---------- Role → Permissions map ----------
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLE.ADMIN]: [...manageAll, ...adminThesisFull],
  [ROLE.SECRETARY]: adminThesisFull,
  [ROLE.TEACHER]: teacherThesisManage,
  [ROLE.STUDENT]: studentThesisBasic,
  [ROLE.COUNCIL]: councilThesisGrade,
};

// ---------- Helpers ----------

export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function hasPermission(
  permissions: Permission[],
  action: Action | string,
  resource: Resource | string,
): boolean {
  return permissions.some((p) => {
    const actions = Array.isArray(p.action) ? p.action : [p.action];
    const resources = Array.isArray(p.resource) ? p.resource : [p.resource];
    return (
      actions.includes(action as Action) &&
      resources.includes(resource as Resource)
    );
  });
}
