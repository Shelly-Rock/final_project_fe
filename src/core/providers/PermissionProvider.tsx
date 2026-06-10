"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Action, Resource, Role } from "../permissions/types";
import { defineAbilityFor } from "../permissions/ability";
import { AppAbility } from "../permissions/ability";

interface PermissionContextValue {
  role: Role | null;
  ability: AppAbility;
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

  const ability = useMemo(
    () => (role ? defineAbilityFor(role) : new AppAbility()),
    [role],
  );

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
    () => ({ role, ability, setRole, can, cannot }),
    [role, ability, setRole, can, cannot],
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
