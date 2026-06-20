"use client";

import { Chip } from "@mui/material";
import type { RegistrationStatus, MilestoneStatus, WeeklyReportStatus, DefenseStatus } from "@/feature/thesis/types";

type Status = RegistrationStatus | MilestoneStatus | WeeklyReportStatus | DefenseStatus | string;

interface StatusBadgeProps {
  status: Status;
  size?: "small" | "medium";
}

const statusLabels: Record<string, string> = {
  // Registration Status
  pending_supervisor: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  rejected: "Từ chối",
  in_progress: "Đang thực hiện",
  paused: "Tạm ngưng",
  completed: "Hoàn thành",
  withdrawn: "Rút đăng ký",
  
  // Milestone Status
  not_started: "Chưa bắt đầu",
  overdue: "Trễ hạn",
  submitted: "Đã nộp",
  approved: "Đã duyệt",
  revision: "Yêu cầu chỉnh sửa",
  
  // Weekly Report Status
  draft: "Nháp",
  waiting_feedback: "Chờ phản hồi",
  
  // Defense Status
  not_ready: "Chưa đủ điều kiện",
  ready: "Đủ điều kiện",
  scheduled: "Đã lên lịch",
  defending: "Đang bảo vệ",
  defended: "Đã bảo vệ",
  retake: "Phải bảo vệ lại",
  
  // Topic Status
  draft_topic: "Nháp",
  pending_topic: "Chờ duyệt",
  approved_topic: "Đã duyệt",
  rejected_topic: "Từ chối",
  has_registrations: "Có đăng ký",
  full: "Đã đầy",
  cancelled: "Đã hủy",
};

const statusColors: Record<string, "default" | "warning" | "info" | "success" | "error"> = {
  // Registration Status
  pending_supervisor: "warning",
  confirmed: "info",
  rejected: "error",
  in_progress: "info",
  paused: "default",
  completed: "success",
  withdrawn: "default",

  // Milestone Status (in_progress already defined above)
  not_started: "default",
  overdue: "error",
  submitted: "warning",
  approved: "success",
  revision: "warning",

  // Weekly Report Status
  draft: "default",
  waiting_feedback: "warning",

  // Defense Status
  not_ready: "error",
  ready: "success",
  scheduled: "info",
  defending: "warning",
  defended: "info",
  retake: "error",

  // Topic Status
  draft_topic: "default",
  pending_topic: "warning",
  approved_topic: "success",
  rejected_topic: "error",
  has_registrations: "info",
  full: "error",
  cancelled: "default",
};

export function RegistrationStatusBadge({ status, size = "small" }: StatusBadgeProps) {
  return (
    <Chip
      label={statusLabels[status] || status}
      color={statusColors[status] || "default"}
      size={size}
      sx={{ fontWeight: 500 }}
    />
  );
}

export function StatusBadge({ status, size = "small" }: StatusBadgeProps) {
  return (
    <Chip
      label={statusLabels[status] || status}
      color={statusColors[status] || "default"}
      size={size}
      sx={{ fontWeight: 500 }}
    />
  );
}
