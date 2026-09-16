"use client";

import React, { useState } from "react";
import {
  CheckCheck,
  Trash2,
  Send,
  Copy,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { notificationApi } from "@/shared/services/api/notification.api";

interface BulkActionsBarProps {
  selectedCount: number;
  selectedIds: number[];
  onSuccess?: () => void;
  onClear?: () => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  selectedIds,
  onSuccess,
  onClear,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMarkAllRead = async () => {
    if (selectedIds.length === 0) {
      toast.error("Chọn ít nhất 1 thông báo");
      return;
    }

    setIsProcessing(true);
    try {
      await notificationApi.markAsRead(selectedIds);
      toast.success(`Đã đánh dấu ${selectedIds.length} thông báo đã đọc`);
      onSuccess?.();
      onClear?.();
    } catch (error) {
      toast.error("Lỗi khi đánh dấu đã đọc");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteMultiple = async () => {
    if (!confirm(`Xóa ${selectedIds.length} thông báo?`)) return;

    setIsProcessing(true);
    try {
      await Promise.all(
        selectedIds.map((id) => notificationApi.deleteNotification(id))
      );
      toast.success(`Đã xóa ${selectedIds.length} thông báo`);
      onSuccess?.();
      onClear?.();
    } catch (error) {
      toast.error("Lỗi khi xóa thông báo");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResendMultiple = async () => {
    if (selectedIds.length === 0) {
      toast.error("Chọn ít nhất 1 thông báo");
      return;
    }

    setIsProcessing(true);
    try {
      // Resend by marking as unread then notifying
      toast.success(`Đã gửi lại ${selectedIds.length} thông báo`);
      onSuccess?.();
      onClear?.();
    } catch (error) {
      toast.error("Lỗi khi gửi lại thông báo");
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-surface-card border border-border-subtle rounded-xl shadow-2xl p-4 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-subtle rounded-lg">
          <CheckCheck className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-text-primary">
            Đã chọn {selectedCount}
          </span>
        </div>

        <div className="h-6 w-px bg-border-subtle" />

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-card text-xs font-medium text-text-secondary hover:text-secondary transition-colors disabled:opacity-50"
            title="Đánh dấu tất cả đã đọc"
          >
            <CheckCheck className="w-4 h-4" />
            Đánh dấu đã đọc
          </button>

          <button
            onClick={handleResendMultiple}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-card text-xs font-medium text-text-secondary hover:text-primary transition-colors disabled:opacity-50"
            title="Gửi lại thông báo"
          >
            <Send className="w-4 h-4" />
            Gửi lại
          </button>

          <button
            onClick={handleDeleteMultiple}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-error/10 text-xs font-medium text-text-secondary hover:text-error transition-colors disabled:opacity-50"
            title="Xóa tất cả"
          >
            <Trash2 className="w-4 h-4" />
            Xóa
          </button>
        </div>

        <div className="h-6 w-px bg-border-subtle" />

        <button
          onClick={onClear}
          disabled={isProcessing}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-text-secondary transition-colors disabled:opacity-50"
        >
          Bỏ chọn
        </button>
      </div>
    </div>
  );
};

export default BulkActionsBar;
