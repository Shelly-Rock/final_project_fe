"use client";

import {
  Box,
  Typography,
  Chip,
} from "@mui/material";
import {
  getNotificationIcon,
  getNotificationColor,
} from "@/feature/thesis/constants";
import type { ThesisNotification } from "@/feature/thesis/types";

interface NotificationItemProps {
  notification: ThesisNotification;
  onClick?: (notification: ThesisNotification) => void;
}

export function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <Box
      onClick={() => onClick?.(notification)}
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        cursor: "pointer",
        bgcolor: notification.isRead ? "transparent" : "action.hover",
        "&:hover": {
          bgcolor: "action.selected",
        },
        transition: "background-color 0.2s",
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: `${getNotificationColor(notification.type)}.light`,
          color: `${getNotificationColor(notification.type)}.dark`,
          flexShrink: 0,
        }}
      >
        <i className={`bi ${getNotificationIcon(notification.type)}`} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Typography
            variant="body2"
            fontWeight={notification.isRead ? 400 : 600}
            sx={{
              flex: 1,
              pr: 1,
            }}
          >
            {notification.title}
          </Typography>
          {!notification.isRead && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "primary.main",
                flexShrink: 0,
              }}
            />
          )}
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mt: 0.5,
          }}
        >
          {notification.message}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, display: "block" }}
        >
          {formatTime(notification.createdAt)}
        </Typography>
      </Box>
    </Box>
  );
}
