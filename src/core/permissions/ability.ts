// ============================================================
// ABILITY BUILDER — CASL-style ability without external dependency
// ============================================================
import { type Action, type Resource, type Role } from "./types";
import { ACTION } from "./types";
import { ROLE_PERMISSIONS } from "./permissions";

// ---------- Ability Rule ----------
export interface AbilityRule {
  action: Action | Action[] | "*";
  resource: Resource | "*";
  conditions?: Record<string, unknown>;
}

export type AbilityAction = Action | "manage";
export type AbilityResource = Resource | "all";

// ---------- Ability class ----------
export class AppAbility {
  rules: AbilityRule[] = [];

  constructor(rules: AbilityRule[] = []) {
    this.rules = rules;
  }

  can(action: string, resource: string): boolean {
    return this.rules.some((rule) => {
      if (rule.resource !== "*" && rule.resource !== resource) return false;
      if (rule.action === "*" || rule.action === ACTION.MANAGE) return true;
      const ruleActions = Array.isArray(rule.action)
        ? rule.action
        : [rule.action];
      return ruleActions.includes(action as Action);
    });
  }

  cannot(action: string, resource: string): boolean {
    return !this.can(action, resource);
  }

  // Check with explicit wildcard expansion
  canAny(actions: Action[], resource: Resource): boolean {
    return actions.some((a) => this.can(a, resource));
  }

  // Check all actions
  canAll(actions: Action[], resource: Resource): boolean {
    return actions.every((a) => this.can(a, resource));
  }
}

// ---------- Builder ----------
function buildRules(role: Role): AbilityRule[] {
  const permissions = ROLE_PERMISSIONS[role] ?? [];

  return permissions.map(
    (p): AbilityRule => ({
      action: Array.isArray(p.action)
        ? p.action.length === 1
          ? p.action[0]
          : (p.action as Action[])
        : p.action,
      resource: Array.isArray(p.resource) ? p.resource[0] : p.resource,
    }),
  );
}

// ---------- Public API ----------

export function defineAbilityFor(role: Role): AppAbility {
  const rules = buildRules(role);
  return new AppAbility(rules);
}

// ---------- Permission check (pure function) ----------
export function can(
  role: Role,
  action: AbilityAction,
  resource: AbilityResource,
): boolean {
  const ability = defineAbilityFor(role);
  return ability.can(action, resource);
}

export function cannot(
  role: Role,
  action: AbilityAction,
  resource: AbilityResource,
): boolean {
  return !can(role, action, resource);
}

// ---------- Role hierarchy helpers ----------
export function isRoleHigherOrEqual(role: Role, comparedRole: Role): boolean {
  const hierarchy: Record<Role, number> = {
    admin: 100,
    secretary: 75,
    teacher: 50,
    student: 25,
  };
  return (hierarchy[role] ?? 0) >= (hierarchy[comparedRole] ?? 0);
}

export function isRoleHigher(role: Role, comparedRole: Role): boolean {
  const hierarchy: Record<Role, number> = {
    admin: 100,
    secretary: 75,
    teacher: 50,
    student: 25,
  };
  return (hierarchy[role] ?? 0) > (hierarchy[comparedRole] ?? 0);
}
