"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import type { Action, Resource, Role } from "../permissions/types";
import { defineAbilityFor } from "../permissions/ability";
import { AppAbility } from "../permissions/ability";
import { useAuthStore } from "@/store";

interface PermissionContextValue {
  role: Role | null;
  ability: AppAbility;
  can: (action: Action | "manage", resource: Resource | "all") => boolean;
  cannot: (action: Action | "manage", resource: Resource | "all") => boolean;
  isReady: boolean;
}

const PermissionContext = createContext<PermissionContextValue | null>(null);

interface PermissionProviderProps {
  children: ReactNode;
  /** Fallback role when auth store is not yet hydrated */
  fallbackRole?: Role | null;
}

/**
 * PermissionProvider consumes `useAuthStore` as the single source of truth for role.
 * Falls back to `fallbackRole` prop only while the store is hydrating from localStorage.
 */
export function PermissionProvider({
  children,
  fallbackRole = null,
}: PermissionProviderProps) {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? null;
  const isHydrated = useAuthStore((s) => s._hasHydrated);

  const effectiveRole = isHydrated ? role : fallbackRole;

  const ability = useMemo(
    () =>
      effectiveRole
        ? defineAbilityFor(effectiveRole)
        : new AppAbility(),
    [effectiveRole],
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

  const value = useMemo(
    () => ({
      role: effectiveRole,
      ability,
      can,
      cannot,
      isReady: isHydrated,
    }),
    [effectiveRole, ability, can, cannot, isHydrated],
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
