"use client";

import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Chip,
  IconButton,
  Badge,
  Divider,
  Button,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Notifications as NotificationIcon,
  CheckCircle as ReadIcon,
  Circle as UnreadIcon,
  DoneAll as ReadAllIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  mockNotifications,
  getNotificationIcon,
  getNotificationColor,
  getUnreadCount,
} from "@/feature/thesis/constants";
import type { ThesisNotification, NotificationType } from "@/feature/thesis/types";

interface NotificationListProps {
  notifications?: ThesisNotification[];
  userId?: string;
  onMarkAsRead?: (notification: ThesisNotification) => void;
  onMarkAllAsRead?: () => void;
  onViewAll?: () => void;
}

export function NotificationList({
  notifications = mockNotifications,
  userId,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAll,
}: NotificationListProps) {
  const [tab, setTab] = useState(0);

  // Filter by user if userId provided
  const userNotifications = userId
    ? notifications.filter((n) => n.recipientId === userId)
    : notifications;

  const unreadCount = getUnreadCount(userNotifications);

  const unreadNotifications = userNotifications.filter((n) => !n.isRead);
  const readNotifications = userNotifications.filter((n) => n.isRead);

  const displayedNotifications = tab === 0 ? unreadNotifications : readNotifications;

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
    <Paper sx={{ width: 400, maxHeight: 500, overflow: "auto" }}>
      {/* Header */}
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Thông báo</Typography>
        <Chip
          label={`${unreadCount} chưa đọc`}
          size="small"
          color={unreadCount > 0 ? "primary" : "default"}
        />
      </Box>

      <Divider />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
          <Tab label={`Mới (${unreadNotifications.length})`} />
          <Tab label={`Đã đọc (${readNotifications.length})`} />
        </Tabs>
      </Box>

      {/* Actions */}
      {unreadCount > 0 && (
        <Box sx={{ p: 1, display: "flex", justifyContent: "flex-end" }}>
          <Button
            size="small"
            startIcon={<ReadAllIcon />}
            onClick={onMarkAllAsRead}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        </Box>
      )}

      {/* Notification List */}
      <List sx={{ p: 0 }}>
        {displayedNotifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {tab === 0 ? "Không có thông báo mới" : "Không có thông báo đã đọc"}
            </Typography>
          </Box>
        ) : (
          displayedNotifications.map((notification) => (
            <ListItem
              key={notification.id}
              disablePadding
              sx={{
                bgcolor: notification.isRead ? "transparent" : "action.hover",
              }}
            >
              <ListItemButton
                onClick={() => onMarkAsRead?.(notification)}
                sx={{ py: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: `${getNotificationColor(notification.type)}.light`,
                      color: `${getNotificationColor(notification.type)}.dark`,
                    }}
                  >
                    <i className={`bi ${getNotificationIcon(notification.type)}`} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      fontWeight={notification.isRead ? 400 : 600}
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mt: 0.5 }}
                      >
                        {formatTime(notification.createdAt)}
                      </Typography>
                    </Box>
                  }
                />
                {!notification.isRead && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      ml: 1,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>

      {/* Footer */}
      {onViewAll && (
        <Divider />
      )}
    </Paper>
  );
}

import { useState } from "react";
