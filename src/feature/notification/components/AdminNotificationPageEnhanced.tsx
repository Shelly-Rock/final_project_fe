"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Send, Download, Search, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/shared/services/api-client";

import NotificationScheduler from "./NotificationScheduler";
import BulkActionsBar from "./BulkActionsBar";
import NotificationTemplates from "./NotificationTemplates";
import NotificationPreviewModal from "./NotificationPreviewModal";
import NotificationDragDrop from "./NotificationDragDrop";
import NotificationSettings from "./NotificationSettings";
import RecipientGroupManager from "./RecipientGroupManager";
import AnalyticsDashboard from "./AnalyticsDashboard";
import EmailTemplateDesigner from "./EmailTemplateDesigner";
import SendNotificationForm from "./SendNotificationForm";
import { downloadAsCSV, downloadAsJSON } from "../utils/export";
import { announceToScreenReader } from "../utils/accessibility";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "URGENT" | "DIRECTIVE" | "GENERAL" | "REMINDER";
  status: "PUBLISHED" | "DRAFT" | "SCHEDULED";
  readCount: number;
  totalRecipients: number;
  recipients: string;
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  isPinned?: boolean;
  requiresSignature?: boolean;
}

interface NotificationStats {
  total: number;
  urgent: number;
  readRate: number;
  pending: number;
  scheduled: number;
  drafts: number;
}

type TabType =
  | "overview"
  | "compose"
  | "scheduler"
  | "templates"
  | "analytics"
  | "settings"
  | "groups"
  | "emails";

const AdminNotificationPageEnhanced: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    urgent: 0,
    readRate: 0,
    pending: 0,
    scheduled: 0,
    drafts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [filter, setFilter] = useState<
    "all" | "urgent" | "draft" | "scheduled"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>(
    [],
  );
  const [previewNotification, setPreviewNotification] =
    useState<Notification | null>(null);
  const [showComposeModal, setShowComposeModal] = useState(false);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<{
        notifications: Notification[];
        stats: NotificationStats;
      }>("/notification/admin/list", {
        params: {
          page: 1,
          limit: 10,
          filter,
          search: searchTerm,
        },
      });
      setNotifications(response.notifications);
      setStats(response.stats);
      announceToScreenReader(
        `${response.notifications.length} notifications loaded`,
      );
    } catch {
      toast.error("Lỗi khi tải danh sách thông báo");
      announceToScreenReader("Error loading notifications", "assertive");
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Handle export
  const handleExport = async (format: "csv" | "json") => {
    try {
      if (format === "csv") {
        downloadAsCSV(notifications);
      } else {
        downloadAsJSON(notifications);
      }
      toast.success(`Đã xuất sang ${format.toUpperCase()}`);
      announceToScreenReader(`Exported to ${format}`);
    } catch {
      toast.error("Lỗi khi xuất dữ liệu");
    }
  };

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "urgent" && n.type === "URGENT") ||
        (filter === "draft" && n.status === "DRAFT") ||
        (filter === "scheduled" && n.status === "SCHEDULED");

      return matchesSearch && matchesFilter;
    });
  }, [notifications, searchTerm, filter]);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === "dark"
          ? "bg-surface text-text-primary"
          : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`border-b ${
          theme === "dark"
            ? "border-border-subtle bg-surface-card"
            : "border-gray-200 bg-white"
        } sticky top-0 z-40`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Quản lý Thông báo</h1>
            <p className="text-sm opacity-70">
              Điều phối chỉ thị học thuật và thông báo toàn trường
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 rounded-lg ${
                theme === "dark"
                  ? "bg-surface-subtle hover:bg-surface-card"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Tổng thông báo",
              value: stats.total,
              icon: "📢",
            },
            {
              label: "Khẩn cấp",
              value: stats.urgent,
              icon: "⚡",
            },
            {
              label: "Tỷ lệ đọc",
              value: `${stats.readRate}%`,
              icon: "✓",
            },
            {
              label: "Cần đôn đốc",
              value: stats.pending,
              icon: "⏰",
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`p-5 rounded-xl border ${
                theme === "dark"
                  ? "bg-surface-card/70 border-border-subtle/80 hover:border-border-light/60"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              } transition-all`}
            >
              <div className="text-2xl mb-2">{card.icon}</div>
              <div className="text-xs opacity-70">{card.label}</div>
              <div className="text-3xl font-bold mt-1">{card.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="max-w-7xl mx-auto px-6">
        <div
          className={`flex overflow-x-auto gap-2 pb-4 border-b ${
            theme === "dark" ? "border-border-subtle" : "border-gray-200"
          }`}
        >
          {[
            { id: "overview", label: "Tổng quan", icon: "📊" },
            { id: "compose", label: "Soạn thông báo", icon: "✏️" },
            { id: "scheduler", label: "Lên lịch", icon: "⏰" },
            { id: "templates", label: "Mẫu", icon: "📋" },
            { id: "analytics", label: "Phân tích", icon: "📈" },
            { id: "settings", label: "Cài đặt", icon: "⚙️" },
            { id: "groups", label: "Nhóm người dùng", icon: "👥" },
            { id: "emails", label: "Email", icon: "✉️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TabType);
                if (tab.id === "compose") {
                  setShowComposeModal(true);
                }
              }}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? theme === "dark"
                    ? "bg-primary text-on-primary"
                    : "bg-blue-600 text-white"
                  : theme === "dark"
                    ? "text-text-secondary hover:bg-surface-subtle"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm thông báo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    theme === "dark"
                      ? "bg-surface-subtle border-border-subtle focus:border-primary"
                      : "bg-white border-gray-200 focus:border-blue-500"
                  } focus:outline-none transition-colors`}
                  aria-label="Search notifications"
                />
              </div>
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(
                    e.target.value as "all" | "urgent" | "draft" | "scheduled",
                  )
                }
                className={`px-4 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-surface-subtle border-border-subtle text-text-primary"
                    : "bg-white border-gray-200 text-gray-900"
                } focus:outline-none transition-colors`}
              >
                <option value="all">Tất cả</option>
                <option value="urgent">Khẩn cấp</option>
                <option value="draft">Bản nháp</option>
                <option value="scheduled">Đã lên lịch</option>
              </select>
              <button
                onClick={() => handleExport("csv")}
                className={`px-4 py-2 rounded-lg border font-medium flex items-center gap-2 transition-colors ${
                  theme === "dark"
                    ? "border-border-subtle hover:bg-surface-subtle"
                    : "border-gray-200 hover:bg-gray-100"
                }`}
              >
                <Download size={18} /> CSV
              </button>
              <button
                onClick={() => handleExport("json")}
                className={`px-4 py-2 rounded-lg border font-medium flex items-center gap-2 transition-colors ${
                  theme === "dark"
                    ? "border-border-subtle hover:bg-surface-subtle"
                    : "border-gray-200 hover:bg-gray-100"
                }`}
              >
                <Download size={18} /> JSON
              </button>
            </div>

            {/* Bulk Actions */}
            {selectedNotifications.length > 0 && (
              <BulkActionsBar
                selectedCount={selectedNotifications.length}
                selectedIds={selectedNotifications}
                onSuccess={fetchNotifications}
                onClear={() => setSelectedNotifications([])}
              />
            )}

            {/* Notifications Table */}
            <div
              className={`rounded-lg border overflow-hidden ${
                theme === "dark"
                  ? "bg-surface-card/40 border-border-subtle"
                  : "bg-white border-gray-200"
              }`}
            >
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                  <p className="opacity-70">Đang tải...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="opacity-70">Không có thông báo</p>
                </div>
              ) : (
                <NotificationDragDrop
                  notifications={filteredNotifications}
                  onReorder={() => fetchNotifications()}
                  onNotificationSelect={(id) => {
                    const notification = filteredNotifications.find(
                      (n) => n.id === id,
                    );
                    if (notification) setPreviewNotification(notification);
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Scheduler Tab */}
        {activeTab === "scheduler" && (
          <NotificationScheduler
            isOpen={activeTab === "scheduler"}
            onClose={() => {}}
            onSuccess={fetchNotifications}
          />
        )}

        {/* Templates Tab */}
        {activeTab === "templates" && <NotificationTemplates />}

        {/* Analytics Tab */}
        {activeTab === "analytics" && <AnalyticsDashboard />}

        {/* Settings Tab */}
        {activeTab === "settings" && <NotificationSettings />}

        {/* Groups Tab */}
        {activeTab === "groups" && <RecipientGroupManager />}

        {/* Email Tab */}
        {activeTab === "emails" && <EmailTemplateDesigner />}
      </section>

      {/* Compose Modal */}
      {showComposeModal && (
        <SendNotificationForm
          onSuccess={() => {
            fetchNotifications();
            setShowComposeModal(false);
          }}
          onClose={() => setShowComposeModal(false)}
        />
      )}

      {/* Preview Modal */}
      {previewNotification && (
        <NotificationPreviewModal
          isOpen={!!previewNotification}
          notification={previewNotification}
          onClose={() => setPreviewNotification(null)}
        />
      )}
    </div>
  );
};

export default AdminNotificationPageEnhanced;
