"use client";

import { useState } from "react";
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
} from "@mui/material";
import {
  Notifications as NotificationIcon,
} from "@mui/icons-material";
import {
  mockNotifications,
  getUnreadCount,
} from "@/feature/thesis/constants";
import { NotificationList } from "./NotificationList";
import type { ThesisNotification } from "@/feature/thesis/types";

interface NotificationBellProps {
  userId?: string;
  onNotificationClick?: (notification: ThesisNotification) => void;
}

export function NotificationBell({
  userId,
  onNotificationClick,
}: NotificationBellProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  // Filter notifications for current user
  const userNotifications = userId
    ? mockNotifications.filter((n) => n.recipientId === userId)
    : mockNotifications;

  const unreadCount = getUnreadCount(userNotifications);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(anchorEl);
  };

  const handleMarkAsRead = (notification: ThesisNotification) => {
    // In real app, this would call API
    notification.isRead = true;
    onNotificationClick?.(notification);
    handleClose();
  };

  const handleMarkAllAsRead = () => {
    userNotifications.forEach((n) => {
      if (!n.isRead) {
        n.isRead = true;
      }
    });
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ ml: 1 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            overflow: "visible",
          },
        }}
      >
        <NotificationList
          notifications={userNotifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onViewAll={handleClose}
        />
      </Popover>
    </>
  );
}
