// src/shared/constants/breadcrumbs.ts
import { UsersIcon, ClipboardListIcon, GraduationCap } from "lucide-react";
import { ChartLineIcon, FileTextIcon } from "lucide-react";
import { UploadIcon, PeopleIcon, CalendarIcon } from "lucide-react";
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
  // Stage 3 - Submission & Committee
  SUBMISSIONS: {
    label: "Nộp bài cuối kỳ",
    href: "/submission/admin",
    icon: <UploadIcon size={16} />,
  },
  STUDENT_SUBMISSION: {
    label: "Nộp bài cuối kỳ",
    href: "/submission/student",
    icon: <UploadIcon size={16} />,
  },
  COMMITTEES: {
    label: "Hội đồng bảo vệ",
    href: "/committee",
    icon: <PeopleIcon size={16} />,
  },
  DEFENSE_SCHEDULE: {
    label: "Lịch bảo vệ",
    href: "/defense-schedule",
    icon: <CalendarIcon size={16} />,
  },
} as const satisfies Record<string, Omit<BreadcrumbItem, "onClick">>;

export type BreadcrumbNodeKey = keyof typeof BREADCRUMB_NODES;

export function createBreadcrumbs<const T extends BreadcrumbNodeKey[]>(
  ...nodes: T
): BreadcrumbItem[] {
  return nodes.map((key) => ({ ...BREADCRUMB_NODES[key] }));
}
