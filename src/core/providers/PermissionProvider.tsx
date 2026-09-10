"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Action, Resource, Role } from "../permissions/types";
import {
  defineAbilityFromPermissions,
  AppAbility,
} from "../permissions/ability";

interface PermissionContextValue {
  role: Role | null;
  ability: AppAbility;
  permissions: string[];
  setRole: (role: Role | null) => void;
  can: (action: Action | "manage", resource: Resource | "all") => boolean;
  cannot: (action: Action | "manage", resource: Resource | "all") => boolean;
}

const PermissionContext = createContext<PermissionContextValue | null>(null);

interface PermissionProviderProps {
  children: ReactNode;
  initialRole?: Role | null;
}

export function PermissionProvider({
  children,
  initialRole = null,
}: PermissionProviderProps) {
  const [role, setRoleState] = useState<Role | null>(initialRole);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    // Clear permissions in the same update that applies a role supplied by auth.
    // This prevents the previous active role's ability surviving one render.
    setPermissions([]);
    setRoleState(initialRole ?? null);
  }, [initialRole]);

  // Fetch effective permissions from BE when active role changes.
  useEffect(() => {
    // Defense in depth for role changes not initiated through setRole().
    setPermissions([]);
    if (!role) return;

    let cancelled = false;
    (async () => {
      try {
        const { roleService } =
          await import("@/feature/role/services/role.service");
        const result = await roleService.getMyPermissions();
        if (!cancelled) {
          setPermissions(result.permissions ?? []);
        }
      } catch {
        // Fail closed: an unavailable permission API must not restore static
        // permissions or retain permissions loaded for an earlier role.
        if (!cancelled) setPermissions([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [role]);

  const ability = useMemo(() => {
    if (!role) return new AppAbility();
    return defineAbilityFromPermissions(permissions);
  }, [role, permissions]);

  const can = useCallback(
    (action: Action | "manage", resource: Resource | "all") =>
      ability.can(action, resource),
    [ability],
  );

  const cannot = useCallback(
    (action: Action | "manage", resource: Resource | "all") =>
      ability.cannot(action, resource),
    [ability],
  );

  const setRole = useCallback(
    (newRole: Role | null) => {
      // Selecting the current role must not clear permissions without causing
      // the role-dependent fetch effect to run again.
      if (newRole === role) return;

      // Never render a new active role with permissions loaded for the old role.
      setPermissions([]);
      setRoleState(newRole);
    },
    [role],
  );

  const value = useMemo(
    () => ({
      role,
      ability,
      permissions,
      setRole,
      can,
      cannot,
    }),
    [role, ability, permissions, setRole, can, cannot],
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissionContext(): PermissionContextValue {
  const ctx = useContext(PermissionContext);
  if (!ctx) {
    throw new Error(
      "usePermissionContext must be used within <PermissionProvider>",
    );
  }
  return ctx;
}
