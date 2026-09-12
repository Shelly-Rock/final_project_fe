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
  upload: "bi-upload",
  peopleTeam: "bi-people-team",
  calendar: "bi-calendar-event",
  scorecard: "bi-scorecard",
  pencilSquare: "bi-pencil-square",
  gear: "bi-gear",
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
        key: "project-config",
        label: "Cấu hình & Duyệt đề tài",
        icon: Icon.gear,
        path: "/project-config",
        roles: ["admin", "secretary"],
      },
      {
        key: "admin-progress",
        label: "Theo dõi tiến trình",
        icon: Icon.graphUp,
        path: "/progress-tracking/admin",
        roles: ["admin"],
      },
      {
        key: "role",
        label: "Phân quyền",
        icon: Icon.personGear,
        path: "/role",
        roles: ["admin"],
      },
      {
        key: "audit",
        label: "Nhật ký Audit",
        icon: Icon.clipboardCheck,
        path: "/audit",
        roles: ["admin", "secretary"],
      },
      {
        key: "dashboard",
        label: "Dashboard Thư ký",
        icon: Icon.graphUp,
        path: "/dashboard",
        roles: ["admin", "secretary"],
      },
      {
        key: "department",
        label: "Dashboard Khoa",
        icon: Icon.people,
        path: "/department",
        roles: ["admin", "secretary"],
      },
    ],
  },
  {
    section: "Giai đoạn 3",
    items: [
      {
        key: "submissions",
        label: "Nộp bài cuối kỳ",
        icon: Icon.upload,
        path: "/submission/admin",
        roles: ["admin", "secretary"],
      },
      {
        key: "committees",
        label: "Hội đồng bảo vệ",
        icon: Icon.peopleTeam,
        path: "/committee",
        roles: ["admin", "secretary"],
      },
      {
        key: "defense-schedule",
        label: "Lịch bảo vệ",
        icon: Icon.calendar,
        path: "/defense-schedule",
        roles: ["admin", "secretary"],
      },
    ],
  },
  {
    section: "Giai đoạn 4",
    items: [
      {
        key: "scoring-management",
        label: "Quản lý chấm điểm",
        icon: Icon.scorecard,
        path: "/scoring/admin",
        roles: ["admin", "secretary"],
      },
    ],
  },
  {
    section: "Giai đoạn 5",
    items: [
      {
        key: "committee-meeting",
        label: "Họp & chốt điểm hội đồng",
        icon: Icon.peopleTeam,
        path: "/scoring/meeting",
        roles: ["admin", "secretary", "teacher"],
      },
    ],
  },
  {
    section: "Giai đoạn 6",
    items: [
      {
        key: "score-publication",
        label: "Tính điểm & công bố",
        icon: Icon.scorecard,
        path: "/scoring/transcript",
        roles: ["admin", "secretary", "teacher"],
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
        roles: ["teacher"],
      },
      {
        key: "teacher-scoring",
        label: "Phiếu chấm điểm",
        icon: Icon.pencilSquare,
        path: "/scoring/teacher",
        roles: ["teacher"],
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
        roles: ["student"],
      },
      {
        key: "student-submission",
        label: "Nộp bài cuối kỳ",
        icon: Icon.upload,
        path: "/submission/student",
        roles: ["student"],
      },
      {
        key: "student-transcript",
        label: "Bảng điểm",
        icon: Icon.scorecard,
        path: "/scoring/my-transcript",
        roles: ["student"],
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
