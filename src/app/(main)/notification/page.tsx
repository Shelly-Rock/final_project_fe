"use client";

import React, { useEffect, useState } from "react";
import { notificationApi } from "@/shared/services/api/notification.api";
import { INotification } from "@/shared/types/notification.types";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
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
  }, []);

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

  const getTypeInfo = (type: string) => {
    const typeMap: Record<
      string,
      { label: string; dotColor: string; bgColor: string; textColor: string }
    > = {
      STATUS_CHANGED: {
        label: "Hỏa tốc",
        dotColor: "bg-error",
        bgColor: "bg-error/20",
        textColor: "text-error",
      },
      REPORT_SUBMITTED: {
        label: "Toàn trường",
        dotColor: "bg-primary",
        bgColor: "bg-primary/20",
        textColor: "text-primary",
      },
      REPORT_APPROVED: {
        label: "Chỉ thị",
        dotColor: "bg-purple-400",
        bgColor: "bg-purple-500/20",
        textColor: "text-purple-400",
      },
      REPORT_REJECTED: {
        label: "Nhắc hạn",
        dotColor: "bg-warning",
        bgColor: "bg-warning/20",
        textColor: "text-warning",
      },
      BAN_APPLIED: {
        label: "Bản nháp",
        dotColor: "bg-slate-500",
        bgColor: "bg-slate-500/20",
        textColor: "text-slate-400",
      },
      BAN_WARNING: {
        label: "Warning",
        dotColor: "bg-warning",
        bgColor: "bg-warning/20",
        textColor: "text-warning",
      },
    };
    return (
      typeMap[type] || {
        label: "Thông báo",
        dotColor: "bg-primary",
        bgColor: "bg-primary/20",
        textColor: "text-primary",
      }
    );
  };

  const getCategoryCount = (category: string) => {
    return notifications.filter((n) => {
      const typeInfo = getTypeInfo(n.type);
      if (category === "all") return true;
      return typeInfo.label.toLowerCase() === category.toLowerCase();
    }).length;
  };

  const filterCategories = [
    { id: "all", label: "Tất cả", count: notifications.length },
    { id: "hỏa tốc", label: "Hỏa tốc", count: getCategoryCount("Hỏa tốc") },
    {
      id: "toàn trường",
      label: "Toàn trường",
      count: getCategoryCount("Toàn trường"),
    },
    {
      id: "khoa/viện",
      label: "Khoa / Viện",
      count: getCategoryCount("Khoa / Viện"),
    },
    { id: "bản nháp", label: "Bản nháp", count: getCategoryCount("Bản nháp") },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const totalCount = notifications.length;

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "all") return matchesSearch;
    const typeInfo = getTypeInfo(n.type);
    return (
      matchesSearch && typeInfo.label.toLowerCase() === filter.toLowerCase()
    );
  });

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

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins}m trước`;
    if (diffHours < 24)
      return `Hôm nay ${date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
    if (diffDays === 1) return "Hôm qua";
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-surface text-text-primary">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-9 flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-text-primary">
                Quản lý Thông báo
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Executive Center
              </span>
            </div>
            <p className="text-sm text-text-secondary">
              Điều phối chỉ thị học thuật, thông tri khẩn và theo dõi tiến độ
              tiếp nhận toàn trường
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-sky-400 text-on-primary text-sm font-semibold tracking-tight shadow-sm shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all whitespace-nowrap h-fit"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Soạn thông báo</span>
          </button>
        </header>

        {/* KPI Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-surface-card/70 border border-border-subtle/80 hover:border-border-light/60 transition-colors">
            <div className="flex items-center justify-between text-text-secondary mb-3">
              <span className="text-xs font-medium tracking-wide">
                Tổng thông báo
              </span>
              <span className="p-1 text-text-muted">⚡</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-text-primary">
                {totalCount}
              </span>
              <span className="text-xs text-secondary">+14% tháng này</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface-card/70 border border-border-subtle/80 hover:border-border-light/60 transition-colors">
            <div className="flex items-center justify-between text-text-secondary mb-3">
              <span className="text-xs font-medium tracking-wide">
                Khẩn cấp & Chỉ thị
              </span>
              <span className="p-1 text-error">⚡</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-error">
                {String(
                  getCategoryCount("Hỏa tốc") + getCategoryCount("Chỉ thị"),
                ).padStart(2, "0")}
              </span>
              <span className="text-xs text-text-secondary">
                100% tiếp nhận
              </span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface-card/70 border border-border-subtle/80 hover:border-border-light/60 transition-colors">
            <div className="flex items-center justify-between text-text-secondary mb-3">
              <span className="text-xs font-medium tracking-wide">
                Tỷ lệ đọc trung bình
              </span>
              <span className="p-1 text-secondary">✓</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-secondary">
                94.6%
              </span>
              <span className="text-xs text-text-secondary">~40 phần nói</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface-card/70 border border-border-subtle/80 hover:border-border-light/60 transition-colors">
            <div className="flex items-center justify-between text-text-secondary mb-3">
              <span className="text-xs font-medium tracking-wide">
                Cần đôn đốc
              </span>
              <span className="p-1 text-warning">⏱</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-warning">
                18
              </span>
              <span className="text-xs text-text-secondary">+2 đơn vị trễ</span>
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setFilter(category.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  filter === category.id
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "bg-surface-subtle border-border-subtle text-text-secondary hover:text-text-primary"
                }`}
              >
                {category.label} {category.count}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-text-muted pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, người gửi..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-surface-subtle border border-border-subtle focus:border-primary/60 rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border-subtle bg-surface-card/40 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-text-secondary">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="p-4 bg-error/10 border border-error/20 text-error rounded-lg">
              {error}
            </div>
          ) : paginatedNotifications.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">
              No notifications found
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-border-subtle/80 bg-surface-subtle/50">
                <div className="col-span-5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Tiêu đề thông báo & Đơn vị phát hành
                </div>
                <div className="col-span-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Thời gian
                </div>
                <div className="col-span-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Tiến độ tiếp nhận
                </div>
                <div className="col-span-2 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">
                  Thao tác
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border-subtle/60">
                {paginatedNotifications.map((notification) => {
                  const typeInfo = getTypeInfo(notification.type);
                  const isUnread = !notification.isRead;

                  return (
                    <div
                      key={notification.id}
                      className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-surface-card/80 transition-colors items-start group"
                    >
                      <div className="col-span-12 md:col-span-5 flex gap-3">
                        <span
                          className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${typeInfo.dotColor}`}
                        ></span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded ${typeInfo.bgColor} ${typeInfo.textColor} border border-current/20`}
                            >
                              {typeInfo.label}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-text-primary truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
                            {notification.message}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-2 text-xs text-text-secondary font-mono">
                        {formatDate(notification.createdAt)}
                      </div>

                      <div className="col-span-12 md:col-span-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-text-muted">
                            {isUnread ? "Chưa đọc" : "Đã đọc"}
                          </span>
                          <span className="text-xs font-semibold text-secondary">
                            {isUnread ? "0%" : "100%"} (
                            {isUnread ? "0/50" : "50/50"})
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-subtle rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isUnread ? "bg-error w-0" : "bg-secondary w-full"}`}
                          ></div>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1.5 rounded-md hover:bg-surface-subtle text-text-muted hover:text-secondary transition-colors"
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
              <div className="px-6 py-3 border-t border-border-subtle/80 flex items-center justify-between text-xs text-text-secondary bg-surface-subtle/30">
                <span className="font-mono">
                  Hiển thị {startIndex + 1} -{" "}
                  {Math.min(
                    startIndex + itemsPerPage,
                    filteredNotifications.length,
                  )}{" "}
                  trong tổng số {filteredNotifications.length} thông báo
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 rounded border border-border-subtle text-text-muted hover:bg-surface-subtle disabled:opacity-40 transition-colors text-xs"
                  >
                    Trước
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-7 h-7 rounded flex items-center justify-center text-xs transition-colors ${
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
                    className="px-2 py-1 rounded border border-border-subtle text-text-secondary hover:bg-surface-subtle disabled:opacity-40 transition-colors text-xs"
                  >
                    Tiếp
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
                <h3 className="text-lg font-semibold text-text-primary">
                  Soạn thông báo mới
                </h3>
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
                  <label className="block text-xs font-medium text-text-secondary mb-2">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tiêu đề..."
                    className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary/60 focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2">
                    Nội dung
                  </label>
                  <textarea
                    placeholder="Nhập nội dung..."
                    rows={4}
                    className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary/60 focus:ring-1 focus:ring-primary/40 focus:outline-none resize-none transition-all"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
                  <button
                    onClick={() => setShowModal(false)}
                    type="button"
                    className="px-4 py-2 rounded-lg border border-border-subtle hover:bg-surface-subtle text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-primary hover:bg-sky-400 text-on-primary text-xs font-semibold tracking-tight shadow-sm shadow-primary/20 transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      send
                    </span>
                    <span>Gửi</span>
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
