// ============================================================
// MENU CONSTANTS — Sidebar navigation items
// ============================================================
import type { Role } from "@/core/permissions/types";

// ---------- Menu Item Types ----------
export interface MenuItem {
  key: string;
  label: string;
  icon?: string; // bootstrap icon class (e.g., "bi bi-house")
  path?: string;
  children?: MenuItem[];
  roles?: Role[];
  permission?: {
    action: string;
    resource: string;
  };
}

export interface MenuSection {
  section: string;
  items: MenuItem[];
}

// ---------- Icon helper (Bootstrap Icons) ----------
export const Icon = {
  house: "bi-house",
  houseFill: "bi-house-fill",
  personCircle: "bi-person-circle",
  person: "bi-person",
  personBadge: "bi-person-badge",
  people: "bi-people",
} as const;

// ---------- Menu Items ----------
export const MENU_ITEMS: MenuItem[] = [
  {
    key: "students",
    label: "Quản lý sinh viên",
    icon: Icon.personBadge,
    path: "/students",
    roles: ["admin", "secretary"],
  },
];

// ---------- Menu Sections ----------
export const MENU_SECTIONS: MenuSection[] = [
  {
    section: "Quản lý",
    items: [
      {
        key: "students",
        label: "Quản lý sinh viên",
        icon: Icon.personBadge,
        path: "/students",
        roles: ["admin", "secretary"],
      },
    ],
  },
];

// ---------- Utility ----------
export function getMenuItemsForRole(role: Role): MenuItem[] {
  return MENU_ITEMS.filter((item) => {
    if (item.roles && !item.roles.includes(role)) return false;
    return true;
  });
}

export function getMenuSectionsForRole(role: Role): MenuSection[] {
  return MENU_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (item.roles && !item.roles.includes(role)) return false;
      return true;
    }),
  })).filter((section) => section.items.length > 0);
}
