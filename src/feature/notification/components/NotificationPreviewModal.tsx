"use client";

import React, { useState } from "react";
import { X, Copy, Trash2, Edit, Eye } from "lucide-react";
import { toast } from "sonner";
import RecipientAnalytics from "./RecipientAnalytics";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "URGENT" | "DIRECTIVE" | "GENERAL" | "REMINDER";
  recipients: string;
  totalRecipients: number;
  readCount: number;
  unreadCount?: number;
  isPinned?: boolean;
  requiresSignature?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationPreviewModalProps {
  isOpen: boolean;
  notification: Notification | null;
  onClose: () => void;
  onEdit?: (notification: Notification) => void;
  onDelete?: (id: number) => void;
  onResend?: (id: number) => void;
}

const NotificationPreviewModal: React.FC<NotificationPreviewModalProps> = ({
  isOpen,
  notification,
  onClose,
  onEdit,
  onDelete,
  onResend,
}) => {
  const [showAnalytics, setShowAnalytics] = useState(false);

  if (!isOpen || !notification) return null;

  const handleCopyLink = () => {
    const link = `${window.location.origin}/notification/${notification.id}`;
    navigator.clipboard.writeText(link);
    toast.success("Đã sao chép liên kết");
  };

  const handleDelete = () => {
    if (confirm("Bạn chắc chắn muốn xóa thông báo này?")) {
      onDelete?.(notification.id);
      onClose();
    }
  };

  const typeConfig = {
    URGENT: {
      label: "Hỏa tốc",
      color: "text-error bg-error/10 border-error/20",
    },
    DIRECTIVE: {
      label: "Chỉ thị",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    GENERAL: {
      label: "Toàn trường",
      color: "text-primary bg-primary/10 border-primary/20",
    },
    REMINDER: {
      label: "Nhắc hạn",
      color: "text-warning bg-warning/10 border-warning/20",
    },
  };

  const config = typeConfig[notification.type];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-surface-card border border-border-subtle rounded-xl max-w-2xl w-full shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded border ${config.color}`}
                >
                  {config.label}
                </span>
                {notification.isPinned && (
                  <span className="text-xs px-2 py-0.5 rounded bg-warning/10 text-warning border border-warning/20 font-medium">
                    Ghim lên
                  </span>
                )}
                {notification.requiresSignature && (
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-medium">
                    Yêu cầu ký số
                  </span>
                )}
              </div>
              <h2 className="text-base font-semibold text-text-primary">
                {notification.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-subtle transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {!showAnalytics ? (
              <div className="px-6 py-4 space-y-6">
                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-surface-subtle border border-border-subtle/80">
                  <div>
                    <p className="text-xs text-text-muted mb-1">Gửi lúc</p>
                    <p className="text-sm text-text-primary font-medium">
                      {new Date(notification.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Cập nhật lúc</p>
                    <p className="text-sm text-text-primary font-medium">
                      {new Date(notification.updatedAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>

                {/* Message Content */}
                <div>
                  <p className="text-xs text-text-muted mb-2 font-semibold uppercase tracking-wide">
                    Nội dung
                  </p>
                  <div className="p-4 rounded-lg bg-surface-subtle border border-border-subtle/80 text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                    {notification.message}
                  </div>
                </div>

                {/* Recipients Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle/80 text-center">
                    <p className="text-xs text-text-muted mb-1">
                      Tổng người nhận
                    </p>
                    <p className="text-xl font-bold text-primary">
                      {notification.totalRecipients}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle/80 text-center">
                    <p className="text-xs text-text-muted mb-1">Đã đọc</p>
                    <p className="text-xl font-bold text-secondary">
                      {notification.readCount}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle/80 text-center">
                    <p className="text-xs text-text-muted mb-1">Chưa đọc</p>
                    <p className="text-xl font-bold text-error">
                      {notification.unreadCount ??
                        Math.max(
                          notification.totalRecipients - notification.readCount,
                          0,
                        )}
                    </p>
                  </div>
                </div>

                {/* Recipients List */}
                <div>
                  <p className="text-xs text-text-muted mb-2 font-semibold uppercase tracking-wide">
                    Người nhận ({notification.totalRecipients})
                  </p>
                  <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle/80 max-h-32 overflow-y-auto">
                    <p className="text-sm text-text-secondary">
                      {notification.recipients}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-6 py-4">
                <RecipientAnalytics
                  notificationId={notification.id}
                  analytics={{
                    id: notification.id,
                    title: notification.title,
                    sentAt: notification.createdAt,
                    totalRecipients: notification.totalRecipients,
                    readCount: notification.readCount,
                    unreadCount:
                      notification.unreadCount ??
                      Math.max(
                        notification.totalRecipients - notification.readCount,
                        0,
                      ),
                    byDepartment: [
                      {
                        department: "Khoa CNTT",
                        total: 10,
                        read: 10,
                        unread: 0,
                        readPercentage: 100,
                      },
                      {
                        department: "Khoa Điện-Điện tử",
                        total: 12,
                        read: 11,
                        unread: 1,
                        readPercentage: 92,
                      },
                      {
                        department: "Khoa Cơ khí",
                        total: 8,
                        read: 6,
                        unread: 2,
                        readPercentage: 75,
                      },
                      {
                        department: "Viện Sau ĐH",
                        total: 20,
                        read: 19,
                        unread: 1,
                        readPercentage: 95,
                      },
                    ],
                  }}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border-subtle px-6 py-4 flex items-center justify-between bg-surface-subtle/50">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-surface-subtle transition-colors"
            >
              <Eye className="w-4 h-4" />
              {showAnalytics ? "Ẩn" : "Xem"} Thống kê
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
              >
                <Copy className="w-4 h-4" />
                Sao chép liên kết
              </button>
              {onEdit && (
                <button
                  onClick={() => {
                    onEdit(notification);
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-surface-subtle transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              )}
              {onResend && (
                <button
                  onClick={() => {
                    onResend(notification.id);
                    toast.success("Đã gửi lại thông báo");
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                >
                  Gửi lại
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-error hover:bg-error/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPreviewModal;
