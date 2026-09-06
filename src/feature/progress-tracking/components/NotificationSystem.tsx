"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Badge,
  Button,
  Chip,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Circle as CircleIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  DoneAll as DoneAllIcon,
} from "@mui/icons-material";
import { toast } from "sonner";
import { progressTrackingService } from "../services";
import type {
  Notification,
  NotificationType,
} from "../services/progress-tracking.service";

// ============================================================
// Notification Badge Component (for header)
// ============================================================

interface NotificationBadgeProps {
  recipientId: number;
  maxCount?: number;
  onNotificationClick?: () => void;
}

export function NotificationBadge({
  recipientId,
  maxCount = 99,
  onNotificationClick,
}: NotificationBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    try {
      const result = await progressTrackingService.getNotifications({
        recipientId,
        isRead: false,
      });
      setUnreadCount(result.data.length);
    } catch {
      // Silently fail
    }
  }, [recipientId]);

  useEffect(() => {
    loadUnreadCount();
    // Poll every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [loadUnreadCount]);

  return (
    <Tooltip title="Thông báo">
      <IconButton color="inherit" onClick={onNotificationClick}>
        <Badge
          badgeContent={unreadCount > maxCount ? `${maxCount}+` : unreadCount}
          color="error"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}

// ============================================================
// Notification List Component
// ============================================================

interface NotificationListProps {
  recipientId: number;
  maxHeight?: number | string;
  showTabs?: boolean;
}

export function NotificationList({
  recipientId,
  maxHeight = 400,
  showTabs = true,
}: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const result = await progressTrackingService.getNotifications({
        recipientId,
      });
      setNotifications(result.data);
    } catch {
      toast.error("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  }, [recipientId]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await progressTrackingService.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch {
      toast.error("Không thể đánh dấu đã đọc");
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAllRead(true);
    try {
      await progressTrackingService.markAllNotificationsAsRead(recipientId);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("Đã đánh dấu tất cả là đã đọc");
    } catch {
      toast.error("Không thể đánh dấu đã đọc");
    } finally {
      setMarkingAllRead(false);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (tabValue === 0) return true; // All
    if (tabValue === 1) return !n.isRead; // Unread
    return n.isRead; // Read
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "STATUS_CHANGED":
        return <CircleIcon color="info" fontSize="small" />;
      case "REPORT_SUBMITTED":
        return <DescriptionIcon color="primary" fontSize="small" />;
      case "REPORT_APPROVED":
        return <CheckCircleIcon color="success" fontSize="small" />;
      case "REPORT_REJECTED":
        return <WarningIcon color="error" fontSize="small" />;
      case "BAN_WARNING":
        return <WarningIcon color="warning" fontSize="small" />;
      case "BAN_APPLIED":
        return <BlockIcon color="error" fontSize="small" />;
      default:
        return <InfoIcon color="action" fontSize="small" />;
    }
  };

  const getNotificationColor = (
    type: NotificationType,
    isRead: boolean,
  ):
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" => {
    if (!isRead) return "primary";
    switch (type) {
      case "BAN_APPLIED":
        return "error";
      case "BAN_WARNING":
        return "warning";
      case "REPORT_APPROVED":
        return "success";
      case "REPORT_REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  const formatTime = (dateString: string): string => {
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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6">Thông báo</Typography>
          {unreadCount > 0 && (
            <Chip label={`${unreadCount} mới`} size="small" color="primary" />
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Làm mới">
            <IconButton size="small" onClick={loadNotifications}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {unreadCount > 0 && (
            <Tooltip title="Đánh dấu tất cả đã đọc">
              <Button
                size="small"
                startIcon={
                  markingAllRead ? (
                    <CircularProgress size={16} />
                  ) : (
                    <DoneAllIcon />
                  )
                }
                onClick={handleMarkAllAsRead}
                disabled={markingAllRead}
              >
                Đọc hết
              </Button>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Tabs */}
      {showTabs && (
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{ px: 2, borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Tab label={`Tất cả (${notifications.length})`} />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                Chưa đọc
                {unreadCount > 0 && (
                  <CircleIcon sx={{ fontSize: 8, color: "primary.main" }} />
                )}
              </Box>
            }
          />
          <Tab label="Đã đọc" />
        </Tabs>
      )}

      {/* Notification List */}
      <Box sx={{ flex: 1, overflow: "auto", maxHeight }}>
        {loading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : filteredNotifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <NotificationsIcon
              sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
            />
            <Typography color="text.secondary">
              {tabValue === 0
                ? "Không có thông báo nào"
                : tabValue === 1
                  ? "Không có thông báo chưa đọc"
                  : "Không có thông báo đã đọc"}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.isRead
                      ? "transparent"
                      : "action.hover",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "action.selected",
                    },
                  }}
                  onClick={() => {
                    if (!notification.isRead) {
                      handleMarkAsRead(notification.id);
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {notification.isRead ? (
                      <CircleIcon
                        sx={{ fontSize: 10, color: "text.disabled" }}
                      />
                    ) : (
                      getNotificationIcon(notification.type)
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={notification.isRead ? 400 : 600}
                          sx={{ flex: 1 }}
                        >
                          {notification.title}
                        </Typography>
                        {!notification.isRead && (
                          <CircleIcon
                            sx={{ fontSize: 8, color: "primary.main" }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.primary"
                          sx={{ display: "block" }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {formatTime(notification.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      size="small"
                      label={getNotificationTypeLabel(notification.type)}
                      color={getNotificationColor(
                        notification.type,
                        notification.isRead,
                      )}
                      variant={notification.isRead ? "outlined" : "filled"}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                {index < filteredNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}

// ============================================================
// Notification Types Helper
// ============================================================

function getNotificationTypeLabel(type: NotificationType): string {
  const labels: Record<NotificationType, string> = {
    STATUS_CHANGED: "Trạng thái",
    REPORT_SUBMITTED: "Báo cáo mới",
    REPORT_APPROVED: "Đã duyệt",
    REPORT_REJECTED: "Từ chối",
    BAN_WARNING: "Cảnh báo",
    BAN_APPLIED: "Cấm thi",
  };
  return labels[type] || type;
}

// ============================================================
// Notification Toast Hook
// ============================================================

export function useNotificationToast(recipientId: number) {
  const [lastNotification, setLastNotification] = useState<Notification | null>(
    null,
  );
  const lastNotificationRef = useRef<Notification | null>(null);

  const checkNewNotifications = useCallback(async () => {
    try {
      const result = await progressTrackingService.getNotifications({
        recipientId,
        isRead: false,
      });
      const latest = result.data[0];
      if (latest && latest.id !== lastNotificationRef.current?.id) {
        lastNotificationRef.current = latest;
        setLastNotification(latest);

        // Show toast for new notification
        const toastType =
          latest.type === "BAN_APPLIED"
            ? "error"
            : latest.type === "BAN_WARNING"
              ? "warning"
              : latest.type === "REPORT_APPROVED"
                ? "success"
                : "info";

        toast[toastType](latest.title, {
          description: latest.message,
          duration: 5000,
        });
      }
    } catch {
      // Silently fail
    }
  }, [recipientId]);

  useEffect(() => {
    checkNewNotifications();
    const interval = setInterval(checkNewNotifications, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, [checkNewNotifications]);

  return { lastNotification };
}
