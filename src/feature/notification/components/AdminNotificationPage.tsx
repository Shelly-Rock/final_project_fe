"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Send,
  Edit,
  Trash2,
  Bell,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Plus,
  X,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import apiClient from "@/shared/services/api-client";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "URGENT" | "DIRECTIVE" | "GENERAL" | "REMINDER";
  status: "PUBLISHED" | "DRAFT";
  readCount: number;
  totalRecipients: number;
  recipients: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationStats {
  total: number;
  urgent: number;
  readRate: number;
  pending: number;
}

const SendNotificationSchema = z.object({
  recipientRole: z.string().min(1, "Chọn đối tượng tiếp nhận"),
  title: z.string().min(5, "Tiêu đề phải ít nhất 5 ký tự"),
  message: z.string().min(10, "Nội dung phải ít nhất 10 ký tự"),
  type: z.enum(["URGENT", "DIRECTIVE", "GENERAL", "REMINDER"]),
  isPinned: z.boolean().optional(),
  requiresSignature: z.boolean().optional(),
});

type SendNotificationFormData = z.infer<typeof SendNotificationSchema>;

const AdminNotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    urgent: 0,
    readRate: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "urgent" | "draft">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
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
          limit: 5,
          status: filter === "draft" ? "DRAFT" : "PUBLISHED",
          type: filter === "urgent" ? "URGENT" : undefined,
          search: searchTerm,
        },
      });
      setNotifications(response.notifications);
      setStats(response.stats);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách thông báo");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, filter, searchTerm]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Send notification
  const onSubmit = async (data: SendNotificationFormData) => {
    try {
      await apiClient.post("/notification/admin/send", {
        ...data,
      });
      toast.success("Phát hành thông báo thành công");
      reset();
      setIsModalOpen(false);
      fetchNotifications();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Lỗi khi phát hành thông báo"
      );
    }
  };

  // Delete notification
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn chắc chắn muốn xóa thông báo này?")) return;
    try {
      await apiClient.delete(`/notification/admin/${id}`);
      toast.success("Xóa thành công");
      fetchNotifications();
    } catch (error) {
      toast.error("Lỗi khi xóa thông báo");
    }
  };

  // Send reminder
  const handleReminder = async (id: number) => {
    try {
      await apiClient.post(`/notification/admin/${id}/remind`);
      toast.success("Gửi nhắc nhở thành công");
    } catch (error) {
      toast.error("Lỗi khi gửi nhắc nhở");
    }
  };

  // Get type color
  const getTypeStyle = (type: string) => {
    switch (type) {
      case "URGENT":
        return {
          bg: "bg-red-50 dark:bg-red-950",
          border: "border-red-200 dark:border-red-800",
          badge:
            "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700",
          icon: "text-red-500",
          dot: "bg-red-500",
        };
      case "DIRECTIVE":
        return {
          bg: "bg-purple-50 dark:bg-purple-950",
          border: "border-purple-200 dark:border-purple-800",
          badge:
            "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700",
          icon: "text-purple-500",
          dot: "bg-purple-400",
        };
      case "REMINDER":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-950",
          border: "border-yellow-200 dark:border-yellow-800",
          badge:
            "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700",
          icon: "text-yellow-500",
          dot: "bg-yellow-500",
        };
      default:
        return {
          bg: "bg-blue-50 dark:bg-blue-950",
          border: "border-blue-200 dark:border-blue-800",
          badge:
            "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700",
          icon: "text-blue-500",
          dot: "bg-blue-500",
        };
    }
  };

  const filteredNotifications = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Bell className="w-7 h-7 text-blue-600" />
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Quản lý Thông báo
                </h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Điều phối chỉ thị học thuật, thông tri khẩn và theo dõi tiến độ tiếp nhận toàn trường
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Soạn thông báo
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Tổng thông báo",
              value: stats.total,
              change: "+14%",
              icon: Bell,
              color: "bg-blue-50 dark:bg-blue-950 text-blue-600",
            },
            {
              label: "Khẩn cấp & Chỉ thị",
              value: stats.urgent,
              change: "100% tiếp nhận",
              icon: AlertCircle,
              color: "bg-red-50 dark:bg-red-950 text-red-600",
            },
            {
              label: "Tỷ lệ đọc trung bình",
              value: `${stats.readRate}%`,
              change: "~40m phản hồi",
              icon: CheckCircle2,
              color: "bg-green-50 dark:bg-green-950 text-green-600",
            },
            {
              label: "Cần đôn đốc",
              value: stats.pending,
              change: "2 đơn vị trễ",
              icon: Clock,
              color: "bg-yellow-50 dark:bg-yellow-950 text-yellow-600",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            {["all", "urgent", "draft"].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f as any);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                {f === "all" && "Tất cả"}
                {f === "urgent" && "Hỏa tốc"}
                {f === "draft" && "Bản nháp"}
              </button>
            ))}
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, người gửi..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Đang tải thông báo...
              </p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">
                Không có thông báo
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const typeStyle = getTypeStyle(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`bg-white dark:bg-slate-800 border ${typeStyle.border} rounded-lg p-5 hover:shadow-md transition-shadow`}
                >
                  <div className="flex gap-4">
                    <div className={`w-1 rounded-full ${typeStyle.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded border ${typeStyle.badge}`}
                            >
                              {notification.type === "URGENT" && "Hỏa tốc"}
                              {notification.type === "DIRECTIVE" && "Chỉ thị"}
                              {notification.type === "REMINDER" && "Nhắc hạn"}
                              {notification.type === "GENERAL" && "Toàn trường"}
                            </span>
                            {notification.status === "DRAFT" && (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600">
                                Bản nháp
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {notification.recipients} •{" "}
                            <span className="text-slate-500 dark:text-slate-500">
                              {notification.message.substring(0, 60)}...
                            </span>
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">
                            {new Date(notification.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {notification.readCount}/{notification.totalRecipients}
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-green-500"
                          style={{
                            width: `${(notification.readCount / notification.totalRecipients) * 100}%`,
                          }}
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {notification.status === "DRAFT" && (
                          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded transition-colors">
                            <Edit className="w-4 h-4" />
                            Sửa
                          </button>
                        )}
                        {notification.status === "PUBLISHED" &&
                          notification.type === "URGENT" && (
                            <button
                              onClick={() => handleReminder(notification.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950 rounded transition-colors"
                            >
                              <Bell className="w-4 h-4" />
                              Nhắc nhở
                            </button>
                          )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {filteredNotifications.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Trước
            </button>
            <button className="w-8 h-8 rounded bg-blue-600 text-white font-medium flex items-center justify-center">
              {page}
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Tiếp
            </button>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Soạn thông báo mới
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Phát hành trực tiếp đến các đơn vị và cán bộ phụ trách
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Recipient Role */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Đối tượng tiếp nhận
                </label>
                <select
                  {...register("recipientRole")}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn đối tượng...</option>
                  <option value="all">
                    Toàn trường (Tất cả đơn vị & Cán bộ)
                  </option>
                  <option value="leadership">Ban Giám Hiệu & Hội đồng Trường</option>
                  <option value="heads">
                    Trưởng các Khoa, Viện & Bộ môn
                  </option>
                  <option value="it">Khoa Công Nghệ Thông Tin</option>
                  <option value="ee">Khoa Điện - Điện Tử</option>
                  <option value="me">Khoa Cơ Khí & Tự Động Hóa</option>
                </select>
                {errors.recipientRole && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.recipientRole.message}
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Loại thông báo
                </label>
                <select
                  {...register("type")}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="GENERAL">Thông thường</option>
                  <option value="URGENT">Hỏa tốc</option>
                  <option value="DIRECTIVE">Chỉ thị</option>
                  <option value="REMINDER">Nhắc hạn</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Tiêu đề thông báo
                </label>
                <input
                  type="text"
                  {...register("title")}
                  placeholder="Ví dụ: Chỉ thị chuẩn bị kế hoạch NCKH đợt 1..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Nội dung tóm tắt / Chỉ đạo
                </label>
                <textarea
                  {...register("message")}
                  rows={4}
                  placeholder="Ghi rõ nội dung cốt lõi, thời hạn nộp báo cáo hoặc yêu cầu phản hồi..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Checkboxes */}
              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("isPinned")}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Ghim lên đầu trang chủ
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("requiresSignature")}
                    className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-2 focus:ring-red-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Yêu cầu ký số xác nhận
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-semibold transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Đang phát hành..." : "Phát hành ngay"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationPage;
