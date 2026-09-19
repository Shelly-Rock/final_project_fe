"use client";

import React, { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { notificationApi } from "@/shared/services/api/notification.api";

interface NotificationSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const NotificationScheduler: React.FC<NotificationSchedulerProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<
    "URGENT" | "DIRECTIVE" | "GENERAL" | "REMINDER"
  >("GENERAL");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim() || !scheduledDate || !scheduledTime) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsSubmitting(true);
    try {
      const scheduledAt = new Date(
        `${scheduledDate}T${scheduledTime}`,
      ).toISOString();

      await notificationApi.scheduleNotification({
        title,
        message,
        type,
        recipientIds: [],
        scheduledAt,
      });

      toast.success("Đã lên lịch thông báo thành công");
      setTitle("");
      setMessage("");
      setScheduledDate("");
      setScheduledTime("");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Lỗi khi lên lịch thông báo",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-card border border-border-subtle rounded-xl max-w-xl w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">
              Lên lịch thông báo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSchedule} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Tiêu đề
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary/60 focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all"
              placeholder="Nhập tiêu đề thông báo"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Nội dung
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary/60 focus:ring-1 focus:ring-primary/40 focus:outline-none resize-none transition-all"
              placeholder="Nhập nội dung thông báo"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Loại thông báo
            </label>
            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as
                    | "URGENT"
                    | "DIRECTIVE"
                    | "GENERAL"
                    | "REMINDER",
                )
              }
              className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary focus:border-primary/60 focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all"
            >
              <option value="GENERAL">Thông thường</option>
              <option value="URGENT">Hỏa tốc</option>
              <option value="DIRECTIVE">Chỉ thị</option>
              <option value="REMINDER">Nhắc hạn</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Ngày gửi
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full bg-surface-subtle border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary focus:border-primary/60 focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Giờ gửi
              </label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-muted" />
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="flex-1 bg-surface-subtle border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary focus:border-primary/60 focus:ring-1 focus:ring-primary/40 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-border-subtle hover:bg-surface-subtle text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg bg-primary hover:bg-sky-400 text-on-primary text-xs font-semibold tracking-tight shadow-sm shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang xử lý..." : "Lên lịch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationScheduler;
