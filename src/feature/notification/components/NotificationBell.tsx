"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import { Badge, IconButton, Popover, Tooltip } from "@mui/material";
import { useNotificationStore } from "@/shared/store/notification.store";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell: React.FC = () => {
  const { data: session, status } = useSession();
  const { unreadCount, fetchNotifications, fetchUnreadCount } =
    useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;

    // Initial load
    fetchNotifications(1, 20);
    fetchUnreadCount();

    // Poll for new notifications every 30 seconds
    pollIntervalRef.current = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [fetchNotifications, fetchUnreadCount, session?.accessToken, status]);

  useEffect(() => {
    if (isOpen && status === "authenticated") fetchNotifications(1, 5);
  }, [fetchNotifications, isOpen, status]);

  const handleToggle = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <Tooltip title="Thông báo">
        <IconButton
          onClick={handleToggle}
          aria-label="Thông báo"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          sx={{ width: 40, height: 40, color: "text.secondary" }}
        >
          <Badge badgeContent={unreadCount} max={99} color="error">
            <Bell size={21} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        marginThreshold={12}
        PaperProps={{
          sx: {
            mt: 1,
            width: 420,
            maxWidth: "calc(100vw - 24px)",
            maxHeight: "min(70vh, 620px)",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 16px 48px rgba(15, 23, 42, 0.18)",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {isOpen && <NotificationDropdown onClose={handleClose} />}
      </Popover>
    </>
  );
};

export default NotificationBell;
