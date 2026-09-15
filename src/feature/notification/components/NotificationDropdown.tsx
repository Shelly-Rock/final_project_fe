"use client";

import React, { useCallback } from "react";
import { Trash2, CheckCheck } from "lucide-react";
import { useNotificationStore } from "@/shared/store/notification.store";
import NotificationItem from "./NotificationItem";

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onClose,
}) => {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    deleteAllNotifications,
    fetchNotifications,
  } = useNotificationStore();

  const handleMarkAllRead = useCallback(async () => {
    await markAllAsRead();
  }, [markAllAsRead]);

  const handleDeleteAll = useCallback(async () => {
    if (confirm("Bạn chắc chắn muốn xóa tất cả thông báo?")) {
      await deleteAllNotifications();
    }
  }, [deleteAllNotifications]);

  const handleLoadMore = useCallback(() => {
    fetchNotifications(notifications.length, 10);
  }, [notifications.length, fetchNotifications]);

  return (
    <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Thông báo</h3>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="text-xs text-red-600 hover:text-red-700"
              title="Delete all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-gray-500 text-sm">Không có thông báo</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200">
          <button
            onClick={handleLoadMore}
            className="w-full text-xs text-center text-blue-600 hover:text-blue-700 font-medium py-2"
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
