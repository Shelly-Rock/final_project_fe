"use client";

import { useCallback } from "react";
import { Trash2 } from "lucide-react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { useNotificationStore } from "@/shared/store/notification.store";
import type { INotification } from "@/shared/types/notification.types";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const TYPE_LABELS: Record<string, string> = {
  STATUS_CHANGED: "Thay đổi trạng thái",
  REPORT_SUBMITTED: "Nộp báo cáo",
  REPORT_APPROVED: "Phê duyệt báo cáo",
  REPORT_REJECTED: "Từ chối báo cáo",
  BAN_APPLIED: "Tạm khóa",
  BAN_WARNING: "Cảnh báo",
  GENERAL: "Thông thường",
  DIRECTIVE: "Chỉ thị",
  URGENT: "Hỏa tốc",
  REMINDER: "Nhắc hạn",
};

interface NotificationItemProps {
  notification: INotification;
}

export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const { markAsRead, deleteNotification } = useNotificationStore();

  const handleMarkRead = useCallback(async () => {
    if (!notification.isRead) await markAsRead([notification.id]);
  }, [notification.id, notification.isRead, markAsRead]);

  const handleDelete = useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation();
      await deleteNotification(notification.id);
    },
    [notification.id, deleteNotification],
  );

  return (
    <Box
      role={notification.isRead ? undefined : "button"}
      tabIndex={notification.isRead ? undefined : 0}
      aria-label={
        notification.isRead
          ? undefined
          : `Đánh dấu đã đọc: ${notification.title}`
      }
      onClick={handleMarkRead}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleMarkRead();
        }
      }}
      sx={{
        display: "flex",
        gap: 1.25,
        px: 2,
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: notification.isRead ? "background.paper" : "action.hover",
        cursor: notification.isRead ? "default" : "pointer",
        "&:hover": { bgcolor: "action.selected" },
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
        },
        "&:last-child": { borderBottom: 0 },
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          width: 8,
          height: 8,
          mt: 0.75,
          borderRadius: "50%",
          bgcolor: notification.isRead ? "transparent" : "primary.main",
          flexShrink: 0,
        }}
      />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <Typography
            component="span"
            variant="body2"
            sx={{
              flex: 1,
              minWidth: 0,
              fontWeight: notification.isRead ? 500 : 700,
              color: "text.primary",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              overflowWrap: "anywhere",
            }}
          >
            {notification.title}
          </Typography>
          <Tooltip title="Xóa thông báo">
            <IconButton
              size="small"
              onClick={handleDelete}
              aria-label={`Xóa thông báo: ${notification.title}`}
              sx={{
                mt: -0.5,
                mr: -0.5,
                flexShrink: 0,
                color: "text.secondary",
              }}
            >
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography
          component="span"
          variant="body2"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            overflowWrap: "anywhere",
            color: "text.secondary",
            fontSize: 12,
            lineHeight: 1.5,
            mt: 0.25,
          }}
        >
          {notification.message}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
          <Typography
            component="span"
            variant="caption"
            noWrap
            sx={{ color: "primary.main", fontWeight: 600, minWidth: 0 }}
          >
            {TYPE_LABELS[notification.type] || "Thông báo"}
          </Typography>
          <Typography
            component="time"
            variant="caption"
            sx={{ color: "text.secondary", whiteSpace: "nowrap", ml: "auto" }}
            dateTime={notification.createdAt}
          >
            {dayjs(notification.createdAt).fromNow()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
