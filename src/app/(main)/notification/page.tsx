"use client";

import React, { useEffect, useState } from "react";
import { notificationApi } from "@/shared/services/api/notification.api";
import { INotification } from "@/shared/types/notification.types";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "STATUS_CHANGED":
        return {
          bg: "bg-error/10",
          text: "text-error",
          border: "border-error/20",
        };
      case "REPORT_SUBMITTED":
        return {
          bg: "bg-primary/10",
          text: "text-primary",
          border: "border-primary/20",
        };
      case "REPORT_APPROVED":
        return {
          bg: "bg-secondary/10",
          text: "text-secondary",
          border: "border-secondary/20",
        };
      case "REPORT_REJECTED":
        return {
          bg: "bg-error/10",
          text: "text-error",
          border: "border-error/20",
        };
      case "BAN_APPLIED":
        return {
          bg: "bg-error/10",
          text: "text-error",
          border: "border-error/20",
        };
      case "BAN_WARNING":
        return {
          bg: "bg-warning/10",
          text: "text-warning",
          border: "border-warning/20",
        };
      default:
        return {
          bg: "bg-primary/10",
          text: "text-primary",
          border: "border-primary/20",
        };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "STATUS_CHANGED":
        return "Status Changed";
      case "REPORT_SUBMITTED":
        return "Report Submitted";
      case "REPORT_APPROVED":
        return "Approved";
      case "REPORT_REJECTED":
        return "Rejected";
      case "BAN_APPLIED":
        return "Ban Applied";
      case "BAN_WARNING":
        return "Warning";
      default:
        return type;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const totalCount = notifications.length;
  const filteredNotifications = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24)
      return `Today ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-surface text-text-primary">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-9 flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-border-subtle pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary">
                Quản lý Thông báo
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Notification Center
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary font-normal">
              Manage and track all notifications across the system
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-sky-400 text-on-primary text-xs sm:text-sm font-semibold tracking-tight shadow-sm shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Create Notification</span>
          </button>
        </header>

        {/* KPI Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="p-5 rounded-xl bg-surface-card/70 hover:bg-surface-card border border-border-subtle/80 hover:border-border-light/60 transition-all group flex flex-col justify-between">
            <div className="flex items-center justify-between text-text-secondary mb-3">
              <span className="text-xs font-medium tracking-wide">
                Total Notifications
              </span>
              <span className="p-1.5 rounded-lg bg-surface-subtle border border-border-subtle text-text-muted group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[17px] block">
                  campaign
                </span>
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-text-primary">
                {totalCount}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface-card/70 hover:bg-surface-card border border-border-subtle/80 hover:border-border-light/60 transition-all group flex flex-col justify-between">
            <div className="flex items-center justify-between text-text-secondary mb-3">
              <span className="text-xs font-medium tracking-wide">Unread</span>
              <span className="p-1.5 rounded-lg bg-surface-subtle border border-border-subtle text-text-muted group-hover:text-error transition-colors">
                <span className="material-symbols-outlined text-[17px] block">
                  bolt
                </span>
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-error">
                {unreadCount}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface-card/70 hover:bg-surface-card border border-border-subtle/80 hover:border-border-light/60 transition-all group flex flex-col justify-between">
            <div className="flex items-center justify-between text-text-secondary mb-3">
              <span className="text-xs font-medium tracking-wide">
                Read Rate
              </span>
              <span className="p-1.5 rounded-lg bg-surface-subtle border border-border-subtle text-text-muted group-hover:text-secondary transition-colors">
                <span className="material-symbols-outlined text-[17px] block">
                  task_alt
                </span>
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-secondary">
                {totalCount > 0
                  ? Math.round(((totalCount - unreadCount) / totalCount) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface-card/70 hover:bg-surface-card border border-border-subtle/80 hover:border-border-light/60 transition-all group flex flex-col justify-between">
            <div className="flex items-center justify-between text-text-secondary mb-3">
              <span className="text-xs font-medium tracking-wide">Status</span>
              <span className="p-1.5 rounded-lg bg-surface-subtle border border-border-subtle text-text-muted group-hover:text-warning transition-colors">
                <span className="material-symbols-outlined text-[17px] block">
                  schedule
                </span>
              </span>
            </div>
            <div className="text-xs font-medium text-secondary">All Active</div>
          </div>
        </section>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="inline-flex items-center p-1 rounded-lg bg-surface-subtle border border-border-subtle overflow-x-auto">
            <button
              onClick={() => {
                setFilter("all");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === "all"
                  ? "bg-surface-card text-text-primary shadow-xs border border-border-subtle/80"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              All{" "}
              <span className="text-text-muted ml-1 font-mono text-[11px]">
                {totalCount}
              </span>
            </button>
            <button
              onClick={() => {
                setFilter("unread");
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === "unread"
                  ? "bg-surface-card text-text-primary shadow-xs border border-border-subtle/80"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Unread{" "}
              <span className="text-text-muted ml-1 font-mono text-[11px]">
                {unreadCount}
              </span>
            </button>
          </div>

          <div className="relative w-full sm:w-72 md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px] text-text-muted pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-surface-subtle border border-border-subtle focus:border-primary/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border-subtle bg-surface-card/40 overflow-hidden shadow-sm backdrop-blur-sm">
          {loading ? (
            <div className="p-8 text-center text-text-secondary">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="p-4 bg-error/10 border border-error/20 text-error rounded-lg m-4">
              {error}
            </div>
          ) : paginatedNotifications.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">
              No notifications found
            </div>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border-subtle/80 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                <div className="col-span-6">Title & Type</div>
                <div className="col-span-2">Time</div>
                <div className="col-span-3">Progress</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              <div className="divide-y divide-border-subtle/60 text-sm">
                {paginatedNotifications.map((notification) => {
                  const colors = getTypeColor(notification.type);
                  const isUnread = !notification.isRead;

                  return (
                    <div
                      key={notification.id}
                      className="p-4 md:px-5 md:py-4 hover:bg-surface-card transition-colors flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center group"
                    >
                      <div className="col-span-6 flex items-start gap-3 min-w-0 w-full">
                        <span
                          className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ring-4 ${
                            isUnread
                              ? `${colors.text.replace("text-", "bg-")} ${colors.text.replace("text-", "ring-")}/10`
                              : "bg-text-muted ring-text-muted/10"
                          }`}
                        ></span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}
                            >
                              {getTypeLabel(notification.type)}
                            </span>
                            <h3 className="font-medium text-text-primary group-hover:text-primary transition-colors truncate">
                              {notification.title}
                            </h3>
                          </div>
                          <p className="text-xs text-text-secondary mt-1 line-clamp-1">
                            {notification.message}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-2 text-xs font-mono text-text-secondary pl-5 md:pl-0">
                        {formatDate(notification.createdAt)}
                      </div>

                      <div className="col-span-3 w-full pl-5 md:pl-0">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-text-muted">
                            {isUnread ? "Unread" : "Read"}
                          </span>
                          <span
                            className={`font-mono font-medium ${isUnread ? "text-error" : "text-secondary"}`}
                          >
                            {isUnread ? "Pending" : "Completed"}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-surface-subtle rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isUnread ? "bg-error w-0" : "bg-secondary w-full"}`}
                          ></div>
                        </div>
                      </div>

                      <div className="col-span-1 flex items-center justify-end gap-1 w-full pl-5 md:pl-0 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1.5 rounded-md hover:bg-surface-subtle text-text-muted hover:text-text-primary transition-colors"
                            title="Mark as read"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              done
                            </span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1.5 rounded-md hover:bg-surface-subtle text-text-muted hover:text-error transition-colors"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="px-5 py-3.5 border-t border-border-subtle/80 flex items-center justify-between text-xs text-text-secondary">
                <span className="font-mono text-text-muted">
                  Showing {startIndex + 1} -{" "}
                  {Math.min(
                    startIndex + itemsPerPage,
                    filteredNotifications.length,
                  )}{" "}
                  of {filteredNotifications.length} notifications
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 rounded border border-border-subtle text-text-muted hover:bg-surface-subtle disabled:opacity-40 transition-colors"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                        currentPage === i + 1
                          ? "bg-surface-subtle border border-border-light text-primary font-medium"
                          : "hover:bg-surface-subtle border border-border-subtle text-text-secondary"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 rounded border border-border-subtle text-text-secondary hover:bg-surface-subtle disabled:opacity-40 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-card border border-border-subtle rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    <span className="material-symbols-outlined text-[18px] block">
                      edit_note
                    </span>
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-text-primary">
                      Create New Notification
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Send to users and stakeholders
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-text-muted hover:text-text-primary rounded-md hover:bg-surface-subtle transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    close
                  </span>
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Notification title..."
                    className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary/60 focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Message
                  </label>
                  <textarea
                    placeholder="Notification message..."
                    rows={4}
                    className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary/60 focus:ring-1 focus:ring-primary/40 focus:outline-none resize-none transition-all"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
                  <button
                    onClick={() => setShowModal(false)}
                    type="button"
                    className="px-4 py-2 rounded-lg border border-border-subtle hover:bg-surface-subtle text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-primary hover:bg-sky-400 text-on-primary text-xs font-semibold tracking-tight shadow-sm shadow-primary/20 transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      send
                    </span>
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
