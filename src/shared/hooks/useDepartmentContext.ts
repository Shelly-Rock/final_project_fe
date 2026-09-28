"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** Routes whose data can be scoped to the selected faculty. */
const SCOPED_MENU_KEYS = new Set([
  "admin-progress",
  "students",
  "teachers",
  "registration-periods",
  "project-config",
  "submissions",
  "committees",
  "defense-schedule",
  "scoring-management",
  "committee-meeting",
  "score-publication",
  "post-defense",
  "statistics",
  "notifications",
  "audit",
]);

function getFacultyIdFromPath(pathname: string | null): string | null {
  if (!pathname) return null;
  const parts = pathname.split("/").filter(Boolean);
  if (
    parts.length === 2 &&
    parts[0] === "department" &&
    parts[1] !== "admin" &&
    parts[1] !== "faculties"
  ) {
    return decodeURIComponent(parts[1]);
  }
  return null;
}

export function useFacultyContext() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const facultyId = useMemo(() => {
    return (
      getFacultyIdFromPath(pathname) ??
      searchParams.get("facultyId") ??
      // Keep links created by older builds working while they are still open.
      searchParams.get("departmentId")
    );
  }, [pathname, searchParams]);

  return { facultyId, departmentId: facultyId };
}

export function buildFacultyScopedPath(
  path: string | undefined,
  itemKey: string,
  facultyId: string | null,
): string {
  if (!path || !facultyId) return path || "#";

  if (itemKey === "department") {
    return `/department/${encodeURIComponent(facultyId)}`;
  }

  if (!SCOPED_MENU_KEYS.has(itemKey)) return path;

  const [basePath, existingQuery = ""] = path.split("?");
  const params = new URLSearchParams(existingQuery);
  params.delete("departmentId");
  params.set("facultyId", facultyId);
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

/** @deprecated Use useFacultyContext. */
export function useDepartmentContext() {
  return useFacultyContext();
}

/** @deprecated Use buildFacultyScopedPath. */
export function buildDepartmentScopedPath(
  path: string | undefined,
  itemKey: string,
  departmentId: string | null,
): string {
  return buildFacultyScopedPath(path, itemKey, departmentId);
}
