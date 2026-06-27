"use client";

import { Chip, Tooltip, Box } from "@mui/material";
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

export type ConflictType = "room" | "lecturer" | "student" | "time";

interface ConflictWarningBadgeProps {
  conflicts?: ConflictType[];
  count?: number;
  size?: "small" | "medium";
}

const conflictConfig: Record<ConflictType, { label: string; color: "warning" | "error" }> = {
  room: { label: "Trùng phòng", color: "error" },
  lecturer: { label: "Trùng GV", color: "error" },
  student: { label: "Trùng SV", color: "error" },
  time: { label: "Trùng giờ", color: "warning" },
};

export function ConflictWarningBadge({
  conflicts = [],
  count,
  size = "small",
}: ConflictWarningBadgeProps) {
  if (conflicts.length === 0 && (count === undefined || count === 0)) return null;

  const total = count ?? conflicts.length;
  const isError = conflicts.some((c) => c !== "time");

  if (conflicts.length === 1) {
    const cfg = conflictConfig[conflicts[0]];
    return (
      <Tooltip title={cfg.label} arrow>
        <Chip
          icon={isError ? <ErrorIcon sx={{ fontSize: "14px !important" }} /> : <WarningIcon sx={{ fontSize: "14px !important" }} />}
          label={cfg.label}
          color={cfg.color}
          size={size}
          variant="filled"
          sx={{ fontWeight: 700, fontSize: size === "small" ? "0.65rem" : "0.75rem" }}
        />
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={
        <Box>
          <Box sx={{ fontWeight: 700, mb: 0.5 }}>Có {total} xung đột</Box>
          {conflicts.map((c) => (
            <Box key={c} sx={{ fontSize: "0.75rem" }}>
              • {conflictConfig[c].label}
            </Box>
          ))}
        </Box>
      }
      arrow
    >
      <Chip
        icon={<ErrorIcon sx={{ fontSize: "14px !important" }} />}
        label={`${total} xung đột`}
        color="error"
        size={size}
        variant="filled"
        sx={{ fontWeight: 700, fontSize: size === "small" ? "0.65rem" : "0.75rem" }}
      />
    </Tooltip>
  );
}
