"use client";

import { Box, Typography, Chip, Tooltip } from "@mui/material";
import {
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  Warning as WarningIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: "create" | "update" | "confirm" | "override";
  field?: string;
  oldValue?: string | number;
  newValue?: string | number;
  note?: string;
}

interface AuditLogPanelProps {
  entries: AuditEntry[];
  compact?: boolean;
}

const ACTION_CONFIG: Record<AuditEntry["action"], { label: string; color: "default" | "primary" | "warning" | "success" | "error"; icon: React.ReactElement }> = {
  create: { label: "Tạo mới", color: "default", icon: <ApproveIcon sx={{ fontSize: 14 }} /> },
  update: { label: "Chỉnh sửa", color: "primary", icon: <EditIcon sx={{ fontSize: 14 }} /> },
  confirm: { label: "Xác nhận", color: "success", icon: <ApproveIcon sx={{ fontSize: 14 }} /> },
  override: { label: "Ghi đè", color: "warning", icon: <WarningIcon sx={{ fontSize: 14 }} /> },
};

const ROLE_LABELS: Record<string, string> = {
  chutich: "Chủ tịch",
  pth: "Phó Chủ tịch",
  uv1: "Ủy viên 1",
  uv2: "Ủy viên 2",
  hethong: "Hệ thống",
};

export function AuditLogPanel({ entries, compact = false }: AuditLogPanelProps) {
  if (entries.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 3, color: "text.secondary" }}>
        <TimeIcon sx={{ fontSize: 32, mb: 0.5, opacity: 0.5 }} />
        <Typography variant="caption" display="block">
          Chưa có thay đổi nào được ghi nhận
        </Typography>
      </Box>
    );
  }

  if (compact) {
    return (
      <Box>
        {entries.slice(0, 3).map((entry, idx) => {
          const cfg = ACTION_CONFIG[entry.action];
          return (
            <Box
              key={entry.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5,
                p: 0.5,
                borderRadius: 1,
                bgcolor: "grey.50",
              }}
            >
              {cfg.icon}
              <Typography variant="caption" sx={{ flex: 1 }}>
                <strong>{entry.actor}</strong> {cfg.label.toLowerCase()}{entry.field ? ` "${entry.field}"` : ""}
                {entry.oldValue !== undefined && entry.newValue !== undefined && (
                  <Typography component="span" variant="caption" sx={{ color: "text.secondary" }}>
                    {" "}({entry.oldValue} → {entry.newValue})
                  </Typography>
                )}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(entry.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
              </Typography>
            </Box>
          );
        })}
        {entries.length > 3 && (
          <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
            +{entries.length - 3} thay đổi khác
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
      {entries.map((entry, idx) => {
        const cfg = ACTION_CONFIG[entry.action];
        const isLast = idx === entries.length - 1;

        return (
          <Box
            key={entry.id}
            sx={{ display: "flex", gap: 1.5, position: "relative" }}
          >
            {/* Timeline line */}
            {!isLast && (
              <Box
                sx={{
                  position: "absolute",
                  left: 11,
                  top: 28,
                  bottom: -8,
                  width: 2,
                  bgcolor: "divider",
                  zIndex: 0,
                }}
              />
            )}

            {/* Dot */}
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: `${cfg.color}.main`,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                zIndex: 1,
                mt: 0.5,
              }}
            >
              {cfg.icon}
            </Box>

            {/* Content */}
            <Box
              sx={{
                flex: 1,
                pb: isLast ? 0 : 2,
                borderBottom: isLast ? "none" : "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.25 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {entry.actor}
                  </Typography>
                  <Chip
                    label={ROLE_LABELS[entry.role] ?? entry.role}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.6rem", height: 18 }}
                  />
                </Box>
                <Tooltip title={new Date(entry.timestamp).toLocaleString("vi-VN")}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                    {new Date(entry.timestamp).toLocaleDateString("vi-VN")}{" "}
                    {new Date(entry.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  </Typography>
                </Tooltip>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                <Chip
                  label={cfg.label}
                  size="small"
                  color={cfg.color}
                  sx={{ fontWeight: 700, fontSize: "0.65rem", height: 18 }}
                />
                {entry.field && (
                  <Typography variant="caption" color="text.secondary">
                    trường <strong>"{entry.field}"</strong>
                  </Typography>
                )}
              </Box>

              {entry.oldValue !== undefined && entry.newValue !== undefined && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: "error.main",
                      textDecoration: "line-through",
                      px: 0.75,
                      py: 0.25,
                      bgcolor: "error.50",
                      borderRadius: 0.5,
                    }}
                  >
                    {entry.oldValue}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">→</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: "success.main",
                      px: 0.75,
                      py: 0.25,
                      bgcolor: "success.50",
                      borderRadius: 0.5,
                    }}
                  >
                    {entry.newValue}
                  </Typography>
                </Box>
              )}

              {entry.note && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25, fontStyle: "italic" }}>
                  Ghi chú: {entry.note}
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
