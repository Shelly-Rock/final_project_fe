// src/shared/constants/breadcrumbs.ts
import { UsersIcon, ClipboardListIcon, GraduationCap } from "lucide-react";
import { ChartLineIcon, FileTextIcon } from "lucide-react";
import type { BreadcrumbItem } from "@/shared/components/Breadcrumb";

export const BREADCRUMB_NODES = {
  REGISTRATION_PERIODS: {
    label: "Quản lý đợt đăng ký",
    href: "/registration-periods",
    icon: <ClipboardListIcon size={16} />,
  },
  REGISTRATION_PERIOD_DETAIL: {
    label: "Chi tiết đợt đăng ký",
    href: undefined,
    icon: <ClipboardListIcon size={16} />,
  },
  STUDENTS: {
    label: "Quản lý sinh viên",
    href: "/students",
    icon: <UsersIcon size={16} />,
  },
  STUDENT_DETAIL: {
    label: "Chi tiết sinh viên",
    href: undefined,
    icon: <UsersIcon size={16} />,
  },
  TEACHERS: {
    label: "Quản lý giảng viên",
    href: "/teachers",
    icon: <GraduationCap size={16} />,
  },
  // Progress Tracking Breadcrumbs
  TEACHER_PROGRESS: {
    label: "Theo dõi tiến trình (GV)",
    href: "/progress-tracking/teacher",
    icon: <ChartLineIcon size={16} />,
  },
  STUDENT_PROGRESS: {
    label: "Theo dõi tiến trình (SV)",
    href: "/progress-tracking/student",
    icon: <FileTextIcon size={16} />,
  },
} as const satisfies Record<string, Omit<BreadcrumbItem, "onClick">>;

export type BreadcrumbNodeKey = keyof typeof BREADCRUMB_NODES;

export function createBreadcrumbs<const T extends BreadcrumbNodeKey[]>(
  ...nodes: T
): BreadcrumbItem[] {
  return nodes.map((key) => ({ ...BREADCRUMB_NODES[key] }));
}
