"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Send,
  Download,
  Settings,
  BarChart3,
  Mail,
  Users,
  Plus,
  Search,
  Filter,
  Sun,
  Moon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import apiClient from "@/shared/services/api-client";

import NotificationScheduler from "./NotificationScheduler";
import BulkActionsBar from "./BulkActionsBar";
import NotificationTemplates from "./NotificationTemplates";
import RecipientAnalytics from "./RecipientAnalytics";
import NotificationPreviewModal from "./NotificationPreviewModal";
import ThemeToggle from "./ThemeToggle";
import NotificationDragDrop from "./NotificationDragDrop";
import NotificationSettings from "./NotificationSettings";
import RecipientGroupManager from "./RecipientGroupManager";
import AnalyticsDashboard from "./AnalyticsDashboard";
import EmailTemplateDesigner from "./EmailTemplateDesigner";
import { exportNotifications, downloadAsCSV, downloadAsJSON } from "../utils/export";
import { memoize, debounce } from "../utils/performance";
import { announceToScreenReader, A11Y_LABELS } from "../utils/accessibility";

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

const SendNotificationSchema = z.object({
  recipientRole: z.string().min(1, "Chọn đối tượng tiếp nhận"),
  title: z.string().min(5, "Tiêu đề phải ít nhất 5 ký tự"),
  message: z.string().min(10, "Nội dung phải ít nhất 10 ký tự"),
  type: z.enum(["URGENT", "DIRECTIVE", "GENERAL", "REMINDER"]),
  isPinned: z.boolean().optional(),
  requiresSignature: z.boolean().optional(),
  scheduledAt: z.date().optional(),
  templateId: z.number().optional(),
});

type SendNotificationFormData = z.infer<typeof SendNotificationSchema>;

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
  const [page, setPage] = useState(1);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [previewNotification, setPreviewNotification] =
    useState<Notification | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showGroupManager, setShowGroupManager] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<SendNotificationFormData>({
    resolver: zodResolver(SendNotificationSchema),
    defaultValues: {
      type: "GENERAL",
      isPinned: true,
      requiresSignature: false,
    },
  });

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<{
        notifications: Notification[];
        stats: NotificationStats;
      }>("/notification/admin/list", {
        params: {
          page,
          limit: 10,
          filter,
          search: searchTerm,
        },
      });
      setNotifications(response.notifications);
      setStats(response.stats);
        announceToScreenReader(`${response.notifications.length} notifications loaded`);
      } catch (error) {
        toast.error("Lỗi khi tải danh sách thông báo");
        announceToScreenReader("Error loading notifications", "assertive");
      } finally {
        setLoading(false);
      }
    }, [page, filter, searchTerm]
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Handle send notification
  const onSubmit = async (data: SendNotificationFormData) => {
    try {
      await apiClient.post("/notification/send", data);
      toast.success("Thông báo đã được gửi thành công");
      announceToScreenReader("Notification sent successfully");
      reset();
      setActiveTab("overview");
      fetchNotifications();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Lỗi khi gửi thông báo"
      );
      announceToScreenReader("Error sending notification", "assertive");
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedNotifications.length === 0) {
      toast.error("Chọn ít nhất một thông báo");
      return;
    }

    try {
      switch (action) {
        case "delete":
          await apiClient.post("/notification/admin/bulk-delete", {
            ids: selectedNotifications,
          });
          toast.success("Đã xóa thông báo");
          break;
        case "remind":
          await apiClient.post("/notification/admin/bulk-remind", {
            ids: selectedNotifications,
          });
          toast.success("Đã gửi nhắc nhở");
          break;
      }
      announceToScreenReader(`Bulk action ${action} completed`);
      setSelectedNotifications([]);
      fetchNotifications();
    } catch (error) {
      toast.error("Lỗi khi thực hiện hành động");
    }
  };

  // Handle export
  const handleExport = async (format: "csv" | "json" | "pdf") => {
    try {
      if (format === "csv") {
        downloadAsCSV(notifications as any);
      } else {
        downloadAsJSON(notifications as any);
      }
      toast.success(`Đã xuất sang ${format.toUpperCase()}`);
      announceToScreenReader(`Exported to ${format}`);
    } catch (error) {
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
              {theme === "dark" ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
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
              color: "primary",
            },
            {
              label: "Khẩn cấp",
              value: stats.urgent,
              icon: "⚡",
              color: "error",
            },
            {
              label: "Tỷ lệ đọc",
              value: `${stats.readRate}%`,
              icon: "✓",
              color: "secondary",
            },
            {
              label: "Cần đôn đốc",
              value: stats.pending,
              icon: "⏰",
              color: "warning",
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
            theme === "dark"
              ? "border-border-subtle"
              : "border-gray-200"
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
              onClick={() => setActiveTab(tab.id as TabType)}
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
                    e.target.value as "all" | "urgent" | "draft" | "scheduled"
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
                onClick={() => handleExport("pdf")}
                className={`px-4 py-2 rounded-lg border font-medium flex items-center gap-2 transition-colors ${
                  theme === "dark"
                    ? "border-border-subtle hover:bg-surface-subtle"
                    : "border-gray-200 hover:bg-gray-100"
                }`}
              >
                <Download size={18} /> PDF
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
                  notifications={filteredNotifications as any}
                  onReorder={() => fetchNotifications()}
                  onNotificationSelect={(id) => {
                    const notification = filteredNotifications.find(n => n.id === id);
                    if (notification) setPreviewNotification(notification);
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Compose Tab */}
        {activeTab === "compose" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium mb-2">
                Đối tượng tiếp nhận
              </label>
              <select
                {...register("recipientRole")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-surface-subtle border-border-subtle"
                    : "bg-white border-gray-200"
                } focus:outline-none`}
              >
                <option>Toàn trường</option>
                <option>Khoa/Viện</option>
                <option>Giảng viên</option>
                <option>Sinh viên</option>
              </select>
              {errors.recipientRole && (
                <p className="text-error text-sm mt-1">
                  {errors.recipientRole.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Loại thông báo
              </label>
              <select
                {...register("type")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-surface-subtle border-border-subtle"
                    : "bg-white border-gray-200"
                } focus:outline-none`}
              >
                <option value="GENERAL">Thông thường</option>
                <option value="DIRECTIVE">Chỉ thị</option>
                <option value="URGENT">Khẩn cấp</option>
                <option value="REMINDER">Nhắc nhở</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tiêu đề</label>
              <input
                type="text"
                {...register("title")}
                placeholder="Nhập tiêu đề thông báo"
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-surface-subtle border-border-subtle"
                    : "bg-white border-gray-200"
                } focus:outline-none`}
              />
              {errors.title && (
                <p className="text-error text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Nội dung
              </label>
              <textarea
                {...register("message")}
                rows={6}
                placeholder="Nhập nội dung thông báo"
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-surface-subtle border-border-subtle"
                    : "bg-white border-gray-200"
                } focus:outline-none resize-none`}
              />
              {errors.message && (
                <p className="text-error text-sm mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isPinned")}
                  className="w-4 h-4 rounded"
                />
                <span>Ghim lên đầu trang</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("requiresSignature")}
                  className="w-4 h-4 rounded"
                />
                <span>Yêu cầu ký số xác nhận</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-strong text-on-primary"
              }`}
            >
              <Send size={18} />
              {isSubmitting ? "Đang gửi..." : "Phát hành ngay"}
            </button>
          </form>
        )}

        {/* Scheduler Tab */}
        {activeTab === "scheduler" && (
          <NotificationScheduler isOpen={activeTab === "scheduler"} onClose={() => {}} onSuccess={fetchNotifications} />
        )}

        {/* Templates Tab */}
        {activeTab === "templates" && (
          <NotificationTemplates />
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <AnalyticsDashboard />
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <NotificationSettings />
        )}

        {/* Groups Tab */}
        {activeTab === "groups" && (
          <RecipientGroupManager />
        )}

        {/* Email Tab */}
        {activeTab === "emails" && (
          <EmailTemplateDesigner />
        )}
      </section>

      {/* Preview Modal */}
      {previewNotification && (
        <NotificationPreviewModal
          isOpen={!!previewNotification}
          notification={previewNotification as any}
          onClose={() => setPreviewNotification(null)}
        />
      )}
    </div>
  );
};

export default AdminNotificationPageEnhanced;