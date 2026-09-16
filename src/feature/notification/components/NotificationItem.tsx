"use client";

import React, { useCallback } from "react";
import { Trash2, Circle } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { useNotificationStore } from "@/shared/store/notification.store";
import { INotification } from "@/shared/types/notification.types";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface NotificationItemProps {
  notification: INotification;
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClose,
}) => {
  const { markAsRead, deleteNotification } = useNotificationStore();

  const handleClick = useCallback(async () => {
    if (!notification.isRead) {
      await markAsRead([notification.id]);
    }
  }, [notification.id, notification.isRead, markAsRead]);

  const handleDelete = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      await deleteNotification(notification.id);
    },
    [notification.id, deleteNotification],
  );

  const getTypeColor = (type: string) => {
    const typeColorMap: Record<string, string> = {
      STATUS_CHANGED: "bg-blue-50 text-blue-900",
      REPORT_SUBMITTED: "bg-green-50 text-green-900",
      REPORT_APPROVED: "bg-emerald-50 text-emerald-900",
      REPORT_REJECTED: "bg-red-50 text-red-900",
      BAN_APPLIED: "bg-red-50 text-red-900",
      BAN_WARNING: "bg-yellow-50 text-yellow-900",
    };
    return typeColorMap[type] || "bg-gray-50 text-gray-900";
  };

  const getTypeLabel = (type: string) => {
    const typeLabelMap: Record<string, string> = {
      STATUS_CHANGED: "Thay đổi trạng thái",
      REPORT_SUBMITTED: "Nộp báo cáo",
      REPORT_APPROVED: "Phê duyệt báo cáo",
      REPORT_REJECTED: "Từ chối báo cáo",
      BAN_APPLIED: "Bị cấm",
      BAN_WARNING: "Cảnh báo cấm",
    };
    return typeLabelMap[type] || type;
  };

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
        !notification.isRead ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {!notification.isRead && (
          <Circle className="w-2 h-2 mt-2 flex-shrink-0 fill-blue-600 text-blue-600" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {notification.title}
            </h4>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {notification.message}
          </p>
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${getTypeColor(
                notification.type,
              )}`}
            >
              {getTypeLabel(notification.type)}
            </span>
            <span className="text-xs text-gray-500">
              {dayjs(notification.createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
