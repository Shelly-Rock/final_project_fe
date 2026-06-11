import { ROLE } from "@/core/permissions/types";
import type { Role } from "@/core/permissions/types";

// ============ ROLE-SPECIFIC STATS ============
interface RoleStats {
  stats: {
    label: string;
    value: string;
    sub: string;
    icon: string;
    color: string;
    bg: string;
  }[];
}

export const ROLE_STATS: Record<Role, RoleStats> = {
  [ROLE.ADMIN]: {
    stats: [
      {
        label: "Tổng đồ án",
        value: "156",
        sub: "Quy mô hệ thống",
        icon: "bi-mortarboard",
        color: "#2a5bc0",
        bg: "#e8efff",
      },
      {
        label: "Chờ duyệt",
        value: "23",
        sub: "Cần xử lý ngay",
        icon: "bi-hourglass-split",
        color: "#d13b3b",
        bg: "#ffebeb",
      },
      {
        label: "Đang thực hiện",
        value: "89",
        sub: "Tiến độ chung",
        icon: "bi-gear-wide-connected",
        color: "#e89b33",
        bg: "#fff8e8",
      },
      {
        label: "Hoàn thành",
        value: "44",
        sub: "Kết quả cuối kỳ",
        icon: "bi-check-circle",
        color: "#1dab60",
        bg: "#e8fff5",
      },
    ],
  },
  [ROLE.SECRETARY]: {
    stats: [
      {
        label: "Đồ án chờ duyệt",
        value: "23",
        sub: "Cần xử lý",
        icon: "bi-hourglass-split",
        color: "#d13b3b",
        bg: "#ffebeb",
      },
      {
        label: "Đề tài mới",
        value: "15",
        sub: "Đăng ký tuần này",
        icon: "bi-file-earmark-plus",
        color: "#2a5bc0",
        bg: "#e8efff",
      },
      {
        label: "GV quá tải",
        value: "3",
        sub: "Cần phân công lại",
        icon: "bi-exclamation-triangle",
        color: "#e89b33",
        bg: "#fff8e8",
      },
      {
        label: "SV chưa đăng ký",
        value: "30",
        sub: "Cần liên hệ",
        icon: "bi-person-dash",
        color: "#7a52cc",
        bg: "#f3eeff",
      },
    ],
  },
  [ROLE.TEACHER]: {
    stats: [
      {
        label: "Đồ án hướng dẫn",
        value: "12",
        sub: "Đang theo dõi",
        icon: "bi-journal-bookmark",
        color: "#2a5bc0",
        bg: "#e8efff",
      },
      {
        label: "Chờ phản biện",
        value: "5",
        sub: "Cần chấm",
        icon: "bi-pencil-square",
        color: "#e89b33",
        bg: "#fff8e8",
      },
      {
        label: "Đã hoàn thành",
        value: "28",
        sub: "Học kỳ này",
        icon: "bi-check-circle",
        color: "#1dab60",
        bg: "#e8fff5",
      },
      {
        label: "Deadline sắp tới",
        value: "3",
        sub: "Trong 7 ngày",
        icon: "bi-calendar-event",
        color: "#d13b3b",
        bg: "#ffebeb",
      },
    ],
  },
  [ROLE.STUDENT]: {
    stats: [
      {
        label: "Đồ án của tôi",
        value: "1",
        sub: "Đang thực hiện",
        icon: "bi-mortarboard",
        color: "#2a5bc0",
        bg: "#e8efff",
      },
      {
        label: "Tiến độ",
        value: "65%",
        sub: "Hoàn thành",
        icon: "bi-graph-up",
        color: "#1dab60",
        bg: "#e8fff5",
      },
      {
        label: "Ngày nộp",
        value: "15/07",
        sub: "Deadline",
        icon: "bi-calendar-check",
        color: "#e89b33",
        bg: "#fff8e8",
      },
      {
        label: "Phản hồi",
        value: "2",
        sub: "Từ GVHD",
        icon: "bi-chat-dots",
        color: "#7a52cc",
        bg: "#f3eeff",
      },
    ],
  },
};

// ============ ROLE-SPECIFIC WIDGETS ============
export interface DashboardWidget {
  id: string;
  title: string;
  roles: Role[];
}

export const DASHBOARD_WIDGETS: DashboardWidget[] = [
  {
    id: "faculty-charts",
    title: "Tiến độ theo khoa",
    roles: [ROLE.ADMIN, ROLE.SECRETARY],
  },
  {
    id: "thesis-trend",
    title: "Xu hướng đồ án",
    roles: [ROLE.ADMIN, ROLE.SECRETARY],
  },
  {
    id: "overloaded-lecturers",
    title: "GV quá tải",
    roles: [ROLE.ADMIN, ROLE.SECRETARY],
  },
  {
    id: "unregistered-students",
    title: "SV chưa đăng ký",
    roles: [ROLE.ADMIN, ROLE.SECRETARY],
  },
  {
    id: "my-theses",
    title: "Đồ án của tôi",
    roles: [ROLE.TEACHER, ROLE.STUDENT],
  },
  { id: "my-pending-reviews", title: "Chờ phản biện", roles: [ROLE.TEACHER] },
  {
    id: "activity-feed",
    title: "Hoạt động gần đây",
    roles: [ROLE.ADMIN, ROLE.SECRETARY, ROLE.TEACHER],
  },
  {
    id: "timeline",
    title: "Lịch & Deadline",
    roles: [ROLE.ADMIN, ROLE.SECRETARY, ROLE.TEACHER, ROLE.STUDENT],
  },
];

export function getWidgetsForRole(role: Role): DashboardWidget[] {
  return DASHBOARD_WIDGETS.filter((widget) => widget.roles.includes(role));
}

// ============ ROLE-SPECIFIC TITLES ============
export const ROLE_PAGE_TITLES: Record<
  Role,
  { title: string; subtitle: string }
> = {
  [ROLE.ADMIN]: {
    title: "Tổng quan hệ thống",
    subtitle: "Quản lý toàn bộ hoạt động đồ án",
  },
  [ROLE.SECRETARY]: {
    title: "Bảng điều khiển",
    subtitle: "Hỗ trợ quản lý đồ án sinh viên",
  },
  [ROLE.TEACHER]: {
    title: "Trang giảng viên",
    subtitle: "Theo dõi đồ án hướng dẫn",
  },
  [ROLE.STUDENT]: {
    title: "Trang sinh viên",
    subtitle: "Quản lý đồ án cá nhân",
  },
};
