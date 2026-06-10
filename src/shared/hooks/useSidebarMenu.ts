// ============================================================
// USE SIDEBAR MENU HOOK — Role-based menu filtering
// ============================================================
"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
// import type { Role } from "@/core/permissions/types";
import { usePermissionContext } from "@/core/providers/PermissionProvider";
import {
  getMenuSectionsForRole,
  type MenuItem,
  type MenuSection,
} from "@/shared/constants/menus";

interface UseSidebarMenuReturn {
  sections: MenuSection[];
  activeKey: string | null;
  activeSection: string | null;
  isMenuItemActive: (item: MenuItem) => boolean;
}

export function useSidebarMenu(): UseSidebarMenuReturn {
  // <- {role,can}
  const { role } = usePermissionContext();
  const pathname = usePathname();

  const sections = useMemo<MenuSection[]>(() => {
    if (!role) return [];
    return getMenuSectionsForRole(role);
  }, [role]);

  const activeKey = useMemo<string | null>(() => {
    if (!pathname) return null;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return null;

    for (const section of sections) {
      for (const item of section.items) {
        if (item.path === pathname) return item.key;
        if (item.path && pathname.startsWith(item.path) && item.path !== "/") {
          if (item.path.split("/").filter(Boolean).length === segments.length) {
            return item.key;
          }
        }
      }
    }
    return null;
  }, [pathname, sections]);

  const activeSection = useMemo<string | null>(() => {
    if (!activeKey) return null;
    for (const section of sections) {
      if (section.items.some((item) => item.key === activeKey)) {
        return section.section;
      }
    }
    return null;
  }, [activeKey, sections]);

  const isMenuItemActive = (item: MenuItem): boolean => {
    if (!item.path || !pathname) return false;
    if (item.path === pathname) return true;
    if (
      pathname.startsWith(item.path) &&
      item.path !== "/" &&
      item.path.split("/").filter(Boolean).length ===
        pathname.split("/").filter(Boolean).length
    ) {
      return true;
    }
    return false;
  };

  return { sections, activeKey, activeSection, isMenuItemActive };
}
