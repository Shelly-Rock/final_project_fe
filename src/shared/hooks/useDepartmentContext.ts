"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SCOPED_MENU_KEYS = new Set([
  "teachers",
  "project-config",
  "notifications",
]);

function getDepartmentIdFromPath(pathname: string | null): string | null {
  if (!pathname) return null;
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 2 && parts[0] === "department" && parts[1] !== "admin") {
    return decodeURIComponent(parts[1]);
  }
  return null;
}

export function useDepartmentContext() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const departmentId = useMemo(() => {
    return (
      getDepartmentIdFromPath(pathname) ?? searchParams.get("departmentId")
    );
  }, [pathname, searchParams]);

  return { departmentId };
}

export function buildDepartmentScopedPath(
  path: string | undefined,
  itemKey: string,
  departmentId: string | null,
): string {
  if (!path || !departmentId) return path || "#";

  if (itemKey === "department") {
    return `/department/${encodeURIComponent(departmentId)}`;
  }

  if (!SCOPED_MENU_KEYS.has(itemKey)) return path;

  const [basePath, existingQuery = ""] = path.split("?");
  const params = new URLSearchParams(existingQuery);
  params.set("departmentId", departmentId);
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
