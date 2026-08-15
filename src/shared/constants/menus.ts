import type { Role } from "@/core/permissions/types";
export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
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

export const Icon = {
  house: "bi-house",
  houseFill: "bi-house-fill",
  personCircle: "bi-person-circle",
  person: "bi-person",
  personBadge: "bi-person-badge",
  people: "bi-people",
  clipboard: "bi-clipboard",
  clipboardCheck: "bi-clipboard-check",
  personGear: "bi-person-gear",
  bookmarkStar: "bi-bookmark-star",
  graphUp: "bi-graph-up",
  fileEarmarkText: "bi-file-earmark-text",
} as const;

export const MENU_ITEMS: MenuItem[] = [
  {
    key: "students",
    label: "Quản lý sinh viên",
    icon: Icon.personBadge,
    path: "/students",
    roles: ["admin", "secretary"],
  },
  {
    key: "registration-periods",
    label: "Đợt đăng ký",
    icon: Icon.clipboard,
    path: "/registration-periods",
    roles: ["admin", "secretary"],
  },
];

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
      {
        key: "teachers",
        label: "Quản lý giảng viên",
        icon: Icon.personGear,
        path: "/teachers",
        roles: ["admin", "secretary"],
      },
      {
        key: "registration-periods",
        label: "Đợt đăng ký",
        icon: Icon.clipboard,
        path: "/registration-periods",
        roles: ["admin", "secretary"],
      },
      {
        key: "admin-progress",
        label: "Theo dõi tiến trình",
        icon: Icon.graphUp,
        path: "/progress-tracking/admin",
        roles: ["admin"],
      },
    ],
  },
  {
    section: "Giảng viên",
    items: [
      {
        key: "my-topics",
        label: "Đề tài của tôi",
        icon: Icon.clipboardCheck,
        path: "/my-topics",
        roles: ["teacher"],
      },
      {
        key: "teacher-progress",
        label: "Theo dõi tiến trình",
        icon: Icon.graphUp,
        path: "/progress-tracking/teacher",
        roles: ["teacher"], // Admin sẽ có trang riêng
      },
    ],
  },
  {
    section: "Sinh viên",
    items: [
      {
        key: "topic-registration",
        label: "Đăng ký đề tài",
        icon: Icon.bookmarkStar,
        path: "/topic-registration",
        roles: ["admin", "student"],
      },
      {
        key: "student-progress",
        label: "Theo dõi tiến trình",
        icon: Icon.fileEarmarkText,
        path: "/progress-tracking/student",
        roles: ["student"], // Admin sẽ có trang riêng
      },
    ],
  },
];

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
