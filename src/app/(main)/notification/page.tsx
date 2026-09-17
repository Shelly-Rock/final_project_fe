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
      { label: string; color: string; dotColor: string }
    > = {
      STATUS_CHANGED: {
        label: "Hỏa tốc",
        color: "bg-error/10 text-error border-error/20",
        dotColor: "bg-error",
      },
      REPORT_SUBMITTED: {
        label: "Toàn trường",
        color: "bg-primary/10 text-primary border-primary/20",
        dotColor: "bg-primary",
      },
      REPORT_APPROVED: {
        label: "Chỉ thị",
        color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        dotColor: "bg-purple-400",
      },
      REPORT_REJECTED: {
        label: "Nhắc hạn",
        color: "bg-warning/10 text-warning border-warning/20",
        dotColor: "bg-warning",
      },
      BAN_APPLIED: {
        label: "Bản nháp",
        color: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        dotColor: "bg-slate-400",
      },
      BAN_WARNING: {
        label: "Warning",
        color: "bg-warning/10 text-warning border-warning/20",
        dotColor: "bg-warning",
      },
    };
    return (
      typeMap[type] || {
        label: "Thông báo",
        color: "bg-primary/10 text-primary border-primary/20",
        dotColor: "bg-primary",
      }
    );
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

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins}m trước`;
    if (diffHours < 24)
      return `Hôm nay ${date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-surface text-text-primary">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-9 flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
                Quản lý Thông báo
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Executive Center
              </span>
            </div>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
              Điều phối chỉ thị học thuật, thông tri khẩn và theo dõi tiến độ
              tiếp nhận toàn trường
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-sky-400 text-on-primary text-xs md:text-sm font-semibold tracking-tight shadow-sm shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all whitespace-nowrap h-fit"
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
              <span className="p-1 rounded text-text-muted">⚡</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-bold font-mono text-text-primary">
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
              <span className="text-2xl md:text-3xl font-bold font-mono text-error">
                05
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
              <span className="p-1">✓</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-bold font-mono text-secondary">
                94.6%
              </span>
              <span className="text-xs text-text-secondary">~40m phản hồi</span>
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
              <span className="text-2xl md:text-3xl font-bold font-mono text-warning">
                18
              </span>
              <span className="text-xs text-error font-medium">
                +2 đơn vị trễ
              </span>
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <button className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-medium whitespace-nowrap">
              Tất cả{" "}
              <span className="text-[10px] text-text-muted ml-1">
                {totalCount}
              </span>
            </button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-surface-subtle text-text-secondary hover:text-text-primary text-xs font-medium whitespace-nowrap transition">
              Hỏa tốc{" "}
              <span className="text-[10px] text-text-muted ml-1">5</span>
            </button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-surface-subtle text-text-secondary hover:text-text-primary text-xs font-medium whitespace-nowrap transition">
              Toàn trường{" "}
              <span className="text-[10px] text-text-muted ml-1">45</span>
            </button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-surface-subtle text-text-secondary hover:text-text-primary text-xs font-medium whitespace-nowrap transition">
              Khoa / Viện{" "}
              <span className="text-[10px] text-text-muted ml-1">66</span>
            </button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-surface-subtle text-text-secondary hover:text-text-primary text-xs font-medium whitespace-nowrap transition">
              Bản nháp{" "}
              <span className="text-[10px] text-text-muted ml-1">12</span>
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px] text-text-muted pointer-events-none">
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
              className="w-full bg-surface-subtle border border-border-subtle focus:border-primary/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Notification List */}
        <div className="rounded-lg border border-border-subtle/80 bg-surface-card/40 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-text-secondary text-sm">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="p-4 bg-error/10 border border-error/20 text-error rounded text-sm">
              {error}
            </div>
          ) : paginatedNotifications.length === 0 ? (
            <div className="p-8 text-center text-text-secondary text-sm">
              No notifications found
            </div>
          ) : (
            <>
              {/* Table Header - Hidden on mobile */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border-subtle/80 text-[11px] font-semibold text-text-muted uppercase tracking-wider bg-surface-subtle/50">
                <div className="col-span-6">
                  TIÊU ĐỀ THÔNG BÁO & ĐƠN VỊ PHÁT HÀNH
                </div>
                <div className="col-span-2">THỜI GIAN</div>
                <div className="col-span-3">TIẾN ĐỘ TIẾP NHẬN</div>
                <div className="col-span-1 text-right">THAO TÁC</div>
              </div>

              {/* Notification Items */}
              <div className="divide-y divide-border-subtle/60">
                {paginatedNotifications.map((notification) => {
                  const typeInfo = getTypeInfo(notification.type);
                  const isUnread = !notification.isRead;

                  return (
                    <div
                      key={notification.id}
                      className="p-4 md:px-5 md:py-4 hover:bg-surface-card transition-colors hidden md:grid md:grid-cols-12 gap-4 items-center group"
                    >
                      {/* Title Column */}
                      <div className="col-span-6 flex items-start gap-3 min-w-0">
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ring-4 ring-offset-0 ${typeInfo.dotColor} ${typeInfo.dotColor.replace("bg-", "ring-")}/10`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded border ${typeInfo.color}`}
                            >
                              {typeInfo.label}
                            </span>
                            <h3 className="font-medium text-text-primary truncate text-sm">
                              {notification.title}
                            </h3>
                          </div>
                          <p className="text-xs text-text-secondary line-clamp-1">
                            {notification.message}
                          </p>
                        </div>
                      </div>

                      {/* Time Column */}
                      <div className="col-span-2 text-xs font-mono text-text-secondary">
                        {formatDate(notification.createdAt)}
                      </div>

                      {/* Progress Column */}
                      <div className="col-span-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-text-muted">
                            {isUnread ? "Chưa đọc" : "Đã đọc"}
                          </span>
                          <span
                            className={`font-mono font-medium ${isUnread ? "text-error" : "text-secondary"}`}
                          >
                            {isUnread ? "0%" : "100%"}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-surface-subtle rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isUnread ? "bg-error w-0" : "bg-secondary w-full"}`}
                          ></div>
                        </div>
                      </div>

                      {/* Actions Column */}
                      <div className="col-span-1 flex items-center justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1.5 rounded hover:bg-surface-subtle text-text-muted hover:text-primary transition-colors"
                            title="Mark as read"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              done
                            </span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1.5 rounded hover:bg-surface-subtle text-text-muted hover:text-error transition-colors"
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
              <div className="px-5 py-3.5 border-t border-border-subtle/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-text-secondary bg-surface-subtle/30">
                <span className="font-mono text-text-muted">
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
                    className="px-2 py-1 rounded border border-border-subtle text-text-muted hover:bg-surface-subtle disabled:opacity-40 transition-colors"
                  >
                    Trước
                  </button>
                  {Array.from({ length: Math.min(totalPages, 3) }).map(
                    (_, i) => (
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
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 rounded border border-border-subtle text-text-secondary hover:bg-surface-subtle disabled:opacity-40 transition-colors"
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
            <div className="bg-surface-card border border-border-subtle rounded-lg max-w-xl w-full p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div>
                  <h3 className="text-base font-semibold text-text-primary">
                    Soạn thông báo
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Phát hành trực tiếp đến các đơn vị và cán bộ phụ trách
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-text-muted hover:text-text-primary rounded hover:bg-surface-subtle transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    close
                  </span>
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Đối tượng tiếp nhận
                  </label>
                  <select className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary focus:border-primary/60 focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all">
                    <option>Toàn trường (Tất cả đơn vị & Cán bộ)</option>
                    <option>Ban Giám Hiệu & Hội đồng Trường</option>
                    <option>Trưởng các Khoa, Viện & Bộ môn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Tiêu đề thông báo
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Chỉ thị chuẩn bị kế hoạch NCKH đợt 1..."
                    className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary/60 focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Nội dung tóm tắt / Chỉ đạo
                  </label>
                  <textarea
                    placeholder="Ghi rõ nội dung cốt lõi, thời hạn nộp báo cáo hoặc yêu cầu phản hồi..."
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
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-primary hover:bg-sky-400 text-on-primary text-xs font-semibold tracking-tight shadow-sm shadow-primary/20 transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      send
                    </span>
                    <span>Phát hành ngay</span>
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
