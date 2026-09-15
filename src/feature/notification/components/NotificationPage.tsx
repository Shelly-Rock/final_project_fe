"use client";

import React, { useEffect, useState } from "react";
import { Trash2, CheckCheck, Filter } from "lucide-react";
import { useNotificationStore } from "@/shared/store/notification.store";
import NotificationItem from "./NotificationItem";

const NotificationPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAllAsRead,
    deleteAllNotifications,
  } = useNotificationStore();

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [skip, setSkip] = useState(0);
  const take = 20;

  useEffect(() => {
    fetchNotifications(skip, take);
  }, [skip, fetchNotifications]);

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const handleLoadMore = () => {
    setSkip((prev) => prev + take);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteAll = async () => {
    if (
      confirm(
        "Bạn chắc chắn muốn xóa tất cả thông báo? Hành động này không thể hoàn tác.",
      )
    ) {
      await deleteAllNotifications();
      setSkip(0);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thông báo</h1>
        <p className="text-gray-600">
          Quản lý tất cả thông báo của bạn từ hệ thống
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow mb-6 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tất cả ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "unread"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Chưa đọc ({unreadCount})
          </button>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Đánh dấu tất cả đã đọc
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Xóa tất cả
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading && notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500">Đang tải thông báo...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Không có thông báo</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClose={() => {}}
                />
              ))}
            </div>

            {/* Load More Button */}
            <div className="border-t border-gray-200 p-4 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
              >
                {isLoading ? "Đang tải..." : "Xem thêm"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
