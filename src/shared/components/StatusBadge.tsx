"use client";

import { Chip, type ChipProps } from "@mui/material";
import {
  LockOpen as OpenIcon,
  Lock as LockedIcon,
  HourglassEmpty as PendingIcon,
} from "@mui/icons-material";

type TopicStatus = "open" | "locked" | "pending";

interface StatusBadgeProps {
  status: TopicStatus;
  size?: "small" | "medium";
}

const statusConfig: Record<
  TopicStatus,
  { label: string; color: ChipProps["color"]; icon: React.ReactElement }
> = {
  open: {
    label: "Mở đăng ký",
    color: "success",
    icon: <OpenIcon fontSize="small" />,
  },
  locked: {
    label: "Đã khóa",
    color: "error",
    icon: <LockedIcon fontSize="small" />,
  },
  pending: {
    label: "Chờ duyệt",
    color: "warning",
    icon: <PendingIcon fontSize="small" />,
  },
};

export function StatusBadge({ status, size = "small" }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.pending;

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size={size}
      variant="filled"
      sx={{ fontWeight: 600, fontSize: size === "small" ? "0.7rem" : "0.8rem" }}
    />
  );
}
