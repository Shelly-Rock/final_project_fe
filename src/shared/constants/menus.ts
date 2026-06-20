// ============================================================
// MENU CONSTANTS - Sidebar navigation (Simplified)
// ============================================================
import type { Role } from "@/core/permissions/types";

// ---------- Menu Item Types ----------
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

// ---------- Icon helper (Bootstrap Icons) ----------
export const Icon = {
  houseFill: "bi-house-fill",
  house: "bi-house",
  person: "bi-person",
  personCircle: "bi-person-circle",
  people: "bi-people",
  peopleFill: "bi-people-fill",
  briefcase: "bi-briefcase",
  award: "bi-award",
  fileText: "bi-file-text",
  fileEarmark: "bi-file-earmark-text",
  bookmark: "bi-bookmark",
  bookmarkStar: "bi-bookmark-star",
  chartLine: "bi-chart-line",
  barChart: "bi-bar-chart",
  pieChart: "bi-pie-chart",
  bell: "bi-bell",
  bellFill: "bi-bell-fill",
  megaphone: "bi-megaphone",
  shieldCheck: "bi-shield-check",
  clipboard: "bi-clipboard",
  clipboardCheck: "bi-clipboard-check",
  clipboardData: "bi-clipboard-data",
  calendar: "bi-calendar",
  calendarEvent: "bi-calendar-event",
  calendarCheck: "bi-calendar-check",
  calendarWeek: "bi-calendar-week",
  calendarRange: "bi-calendar-range",
  clock: "bi-clock",
  clockHistory: "bi-clock-history",
  listTask: "bi-list-task",
  layoutSidebar: "bi-layout-sidebar",
  mortarboard: "bi-mortarboard",
  building: "bi-building",
  folder2open: "bi-folder2-open",
  plusCircle: "bi-plus-circle",
  checkCircle: "bi-check-circle",
  xCircle: "bi-x-circle",
  folder: "bi-folder",
  grid: "bi-grid",
  list: "bi-list",
  upload: "bi-upload",
  download: "bi-download",
  star: "bi-star",
  starFill: "bi-star-fill",
  graphUp: "bi-graph-up",
  pencilSquare: "bi-pencil-square",
  chatSquare: "bi-chat-square",
  chatLeftText: "bi-chat-left-text",
  lightbulb: "bi-lightbulb",
  exclamationTriangle: "bi-exclamation-triangle",
  hourglass: "bi-hourglass",
  filePdf: "bi-file-earmark-pdf",
  fileExcel: "bi-file-earmark-excel",
  fileWord: "bi-file-earmark-word",
  personPlus: "bi-person-plus",
  personCheck: "bi-person-check",
  personBadge: "bi-person-badge",
  doorOpen: "bi-door-open",
  gear: "bi-gear",
  archive: "bi-archive",
  diagram3: "bi-diagram-3",
  activity: "bi-activity",
  journal: "bi-journal",
  book: "bi-book",
  clipboardPlus: "bi-clipboard-plus",
  clipboardMinus: "bi-clipboard-minus",
  toggleOn: "bi-toggle-on",
  envelope: "bi-envelope",
  check2Square: "bi-check2-square",
  fileArrowUp: "bi-file-arrow-up",
} as const;

// ============================================================
// MENU SECTIONS BY ROLE - Simplified
// ============================================================

// ---------- ADMIN MENU ----------
const ADMIN_ITEMS: MenuItem[] = [
  {
    key: "dashboard",
    label: "Tổng quan",
    icon: Icon.houseFill,
    path: "/admin/dashboard",
  },
  {
    key: "semester",
    label: "Kỳ khóa luận",
    icon: Icon.calendarRange,
    path: "/admin/semester",
  },
  {
    key: "user",
    label: "Người dùng",
    icon: Icon.people,
    path: "/admin/user",
  },
  {
    key: "council",
    label: "Hội đồng",
    icon: Icon.personBadge,
    path: "/admin/council",
  },
  {
    key: "thesis",
    label: "Khóa luận",
    icon: Icon.book,
    path: "/admin/thesis",
  },
  {
    key: "statistics",
    label: "Thống kê",
    icon: Icon.barChart,
    path: "/admin/statistics",
  },
  {
    key: "report",
    label: "Báo cáo",
    icon: Icon.filePdf,
    path: "/admin/report",
  },
];

// ---------- SECRETARY MENU ----------
const SECRETARY_ITEMS: MenuItem[] = [
  {
    key: "dashboard",
    label: "Tổng quan",
    icon: Icon.houseFill,
    path: "/secretary/dashboard",
  },
  {
    key: "topic-approval",
    label: "Duyệt đề tài",
    icon: Icon.shieldCheck,
    path: "/secretary/topic-approval",
  },
  {
    key: "registration",
    label: "Đăng ký",
    icon: Icon.bookmark,
    path: "/secretary/registration",
  },
  {
    key: "review-assign",
    label: "Phân công phản biện",
    icon: Icon.personPlus,
    path: "/secretary/review-assign",
  },
  {
    key: "defense",
    label: "Lịch bảo vệ",
    icon: Icon.calendarEvent,
    path: "/secretary/defense",
  },
  {
    key: "score-summary",
    label: "Tổng hợp điểm",
    icon: Icon.barChart,
    path: "/secretary/score-summary",
  },
  {
    key: "announcement",
    label: "Thông báo",
    icon: Icon.megaphone,
    path: "/secretary/announcement",
  },
  {
    key: "statistics",
    label: "Thống kê",
    icon: Icon.pieChart,
    path: "/secretary/statistics",
  },
];

// ---------- TEACHER MENU ----------
const TEACHER_ITEMS: MenuItem[] = [
  {
    key: "dashboard",
    label: "Tổng quan",
    icon: Icon.houseFill,
    path: "/teacher/dashboard",
  },
  {
    key: "supervision",
    label: "Hướng dẫn",
    icon: Icon.lightbulb,
    path: "/teacher/supervision",
  },
  {
    key: "review",
    label: "Phản biện",
    icon: Icon.clipboardCheck,
    path: "/teacher/review",
  },
  {
    key: "defense",
    label: "Bảo vệ",
    icon: Icon.calendarEvent,
    path: "/teacher/defense",
  },
  {
    key: "scoring",
    label: "Chấm điểm",
    icon: Icon.pencilSquare,
    path: "/teacher/scoring",
  },
  {
    key: "notifications",
    label: "Thông báo",
    icon: Icon.bell,
    path: "/teacher/notifications",
  },
  {
    key: "statistics",
    label: "Thống kê",
    icon: Icon.barChart,
    path: "/teacher/statistics",
  },
];

// ---------- STUDENT MENU ----------
const STUDENT_ITEMS: MenuItem[] = [
  {
    key: "dashboard",
    label: "Tổng quan",
    icon: Icon.houseFill,
    path: "/student/dashboard",
  },
  {
    key: "topic",
    label: "Đăng ký đề tài",
    icon: Icon.book,
    path: "/student/topic",
  },
  {
    key: "work",
    label: "Thực hiện",
    icon: Icon.listTask,
    path: "/student/work",
  },
  {
    key: "submission",
    label: "Nộp bài",
    icon: Icon.upload,
    path: "/student/submission",
  },
  {
    key: "defense",
    label: "Lịch bảo vệ",
    icon: Icon.calendarEvent,
    path: "/student/defense",
  },
  {
    key: "result",
    label: "Kết quả",
    icon: Icon.award,
    path: "/student/result",
  },
  {
    key: "request",
    label: "Yêu cầu",
    icon: Icon.chatSquare,
    path: "/student/request",
  },
  {
    key: "profile",
    label: "Hồ sơ",
    icon: Icon.personCircle,
    path: "/student/profile",
  },
  {
    key: "notifications",
    label: "Thông báo",
    icon: Icon.bell,
    path: "/student/notifications",
  },
];

// ---------- MENU SECTIONS ----------
export const MENU_SECTIONS_BY_ROLE: Record<Role, MenuSection[]> = {
  admin: [
    {
      section: "Quản trị",
      items: ADMIN_ITEMS,
    },
  ],
  secretary: [
    {
      section: "Quản lý",
      items: SECRETARY_ITEMS,
    },
  ],
  teacher: [
    {
      section: "Giảng viên",
      items: TEACHER_ITEMS,
    },
  ],
  student: [
    {
      section: "Sinh viên",
      items: STUDENT_ITEMS,
    },
  ],
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function getMenuSectionsForRole(role: Role): MenuSection[] {
  return MENU_SECTIONS_BY_ROLE[role] || [];
}

export function getMenuItemsForRole(role: Role): MenuItem[] {
  const sections = getMenuSectionsForRole(role);
  return sections.flatMap((section) => section.items);
}

export function getMenuItemByKey(key: string, role: Role): MenuItem | undefined {
  const items = getMenuItemsForRole(role);
  return items.find((item) => item.key === key);
}

export function hasPermission(
  role: Role,
  action: string,
  resource: string
): boolean {
  const items = getMenuItemsForRole(role);
  return items.some(
    (item) =>
      item.permission &&
      (item.permission.action === action || item.permission.action === "manage") &&
      item.permission.resource === resource
  );
}

// ============================================================
// ROLE PERMISSIONS MATRIX
// ============================================================

export const ROLE_PERMISSIONS: Record<
  Role,
  {
    description: string;
    features: string[];
  }
> = {
  admin: {
    description: "Quản trị viên - Toàn quyền",
    features: [
      "Quản lý kỳ khóa luận",
      "Quản lý người dùng",
      "Quản lý hội đồng",
      "Quản lý khóa luận",
      "Xem thống kê",
      "Xuất báo cáo",
    ],
  },
  secretary: {
    description: "Thư ký khoa - Quản lý quy trình",
    features: [
      "Duyệt đề tài",
      "Quản lý đăng ký",
      "Phân công phản biện",
      "Lên lịch bảo vệ",
      "Tổng hợp điểm",
      "Quản lý thông báo",
      "Xem thống kê",
    ],
  },
  teacher: {
    description: "Giảng viên - Hướng dẫn & Phản biện",
    features: [
      "Hướng dẫn sinh viên",
      "Phản biện đồ án",
      "Tham gia bảo vệ",
      "Chấm điểm",
      "Xem thống kê",
    ],
  },
  student: {
    description: "Sinh viên - Thực hiện đồ án",
    features: [
      "Xem đăng ký đề tài",
      "Thực hiện khóa luận",
      "Nộp bài và báo cáo",
      "Xem lịch bảo vệ",
      "Xem kết quả",
      "Gửi yêu cầu",
    ],
  },
};
