"use client";

import { useCallback } from "react";
import Link from "next/link";
import { ArrowRight, BellOff, CheckCheck, Trash2 } from "lucide-react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNotificationStore } from "@/shared/store/notification.store";
import NotificationItem from "./NotificationItem";

interface NotificationDropdownProps {
  onClose: () => void;
}

export default function NotificationDropdown({
  onClose,
}: NotificationDropdownProps) {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAllAsRead,
    deleteAllNotifications,
  } = useNotificationStore();

  const handleMarkAllRead = useCallback(async () => {
    await markAllAsRead();
  }, [markAllAsRead]);

  const handleDeleteAll = useCallback(async () => {
    if (window.confirm("Bạn chắc chắn muốn xóa tất cả thông báo?")) {
      await deleteAllNotifications();
    }
  }, [deleteAllNotifications]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1 }}>
          Thông báo
        </Typography>
        {unreadCount > 0 && (
          <Typography
            variant="caption"
            sx={{
              color: "primary.main",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {unreadCount} chưa đọc
          </Typography>
        )}
        <Tooltip title="Đánh dấu tất cả đã đọc">
          <span>
            <IconButton
              size="small"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              aria-label="Đánh dấu tất cả đã đọc"
            >
              <CheckCheck size={18} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Xóa tất cả thông báo">
          <span>
            <IconButton
              size="small"
              color="error"
              onClick={handleDeleteAll}
              disabled={notifications.length === 0}
              aria-label="Xóa tất cả thông báo"
            >
              <Trash2 size={17} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Box sx={{ overflowY: "auto", minHeight: 0, flex: 1 }}>
        {error && (
          <Typography
            role="alert"
            variant="body2"
            sx={{ px: 2, py: 1.5, color: "error.main" }}
          >
            Không thể cập nhật thông báo. Vui lòng thử lại.
          </Typography>
        )}
        {isLoading && notifications.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box
            sx={{ py: 5, px: 2, textAlign: "center", color: "text.secondary" }}
          >
            <BellOff size={24} style={{ margin: "0 auto 10px" }} />
            <Typography variant="body2">Chưa có thông báo</Typography>
          </Box>
        ) : (
          notifications
            .slice(0, 5)
            .map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
        )}
      </Box>

      <Box
        sx={{
          px: 2,
          py: 1,
          borderTop: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <Button
          component={Link}
          href="/notification"
          onClick={onClose}
          endIcon={<ArrowRight size={16} />}
          sx={{
            width: "100%",
            justifyContent: "space-between",
            fontWeight: 600,
          }}
        >
          Xem tất cả thông báo
        </Button>
      </Box>
    </Box>
  );
}
