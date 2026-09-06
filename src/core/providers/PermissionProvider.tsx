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
  defineAbilityFor,
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
  const [permissions, setPermissions] = useState<string[] | null>(null);

  useEffect(() => {
    setRoleState(initialRole ?? null);
  }, [initialRole]);

  // Fetch effective permissions from BE when active role changes
  useEffect(() => {
    if (!role) {
      setPermissions(null);
      return;
    }
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
        if (!cancelled) {
          setPermissions(null); // fallback to static ability
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [role]);

  const ability = useMemo(() => {
    if (!role) return new AppAbility();
    // Use dynamic permissions from BE; fall back to static config while unavailable
    if (permissions && permissions.length > 0) {
      return defineAbilityFromPermissions(permissions);
    }
    return defineAbilityFor(role);
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

  const setRole = useCallback((newRole: Role | null) => {
    setRoleState(newRole);
  }, []);

  const value = useMemo(
    () => ({
      role,
      ability,
      permissions: permissions ?? [],
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
