"use client";

import React, { useEffect, useState } from "react";
import { Bell, Trash2, Mail, ArrowRight } from "lucide-react";
import { notificationApi } from "@/shared/services/api/notification.api";
import { INotification } from "@/shared/types/notification.types";
import Link from "next/link";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationApi.getNotifications({
        skip: 0,
        take: 50,
        isRead: filter === "unread" ? false : undefined,
      });
      setNotifications(data.notifications);
      setError(null);
    } catch (err) {
      setError("Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const handleDelete = async (id: number) => {
    try {
      await notificationApi.deleteNotification(id);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification");
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead([id]);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Bell className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Notifications
                </h1>
                <p className="text-slate-400 text-sm">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                </p>
              </div>
            </div>
            <Link
              href="/notification/admin"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              <span>Manage</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b border-slate-700">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                filter === "all"
                  ? "text-blue-400 border-blue-400"
                  : "text-slate-400 border-transparent hover:text-slate-300"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                filter === "unread"
                  ? "text-blue-400 border-blue-400"
                  : "text-slate-400 border-transparent hover:text-slate-300"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <Bell className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-slate-400 mt-4">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition ${
                  notification.isRead
                    ? "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                    : "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-400 rounded-full" />
                      )}
                    </div>
                    <p className="text-slate-300 text-sm mb-2">
                      {notification.message}
                    </p>
                    <p className="text-slate-500 text-xs">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 hover:bg-slate-700 rounded transition text-slate-400 hover:text-white"
                        title="Mark as read"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 hover:bg-red-500/10 rounded transition text-slate-400 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
