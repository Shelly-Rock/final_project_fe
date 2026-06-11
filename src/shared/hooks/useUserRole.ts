"use client";

import { useSession } from "next-auth/react";
import { ROLE } from "@/core/permissions/types";
import type { Role } from "@/core/permissions/types";

export function useUserRole(): Role | null {
  const { data: session } = useSession();
  return session?.user?.role ?? null;
}

export function useIsRole(...roles: Role[]): boolean {
  const userRole = useUserRole();
  return userRole !== null && roles.includes(userRole);
}

export function useIsAdmin(): boolean {
  return useIsRole(ROLE.ADMIN);
}

export function useIsSecretary(): boolean {
  return useIsRole(ROLE.SECRETARY);
}

export function useIsTeacher(): boolean {
  return useIsRole(ROLE.TEACHER);
}

export function useIsStudent(): boolean {
  return useIsRole(ROLE.STUDENT);
}

export function useCanManageTheses(): boolean {
  const role = useUserRole();
  return (
    role === ROLE.ADMIN || role === ROLE.SECRETARY || role === ROLE.TEACHER
  );
}

export function useCanSubmitThesis(): boolean {
  const role = useUserRole();
  return role === ROLE.STUDENT;
}
