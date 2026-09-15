import apiClient from "@/shared/services/api-client";
import { INotification } from "@/shared/types/notification.types";

export const notificationApi = {
  getNotifications: async (params?: {
    skip?: number;
    take?: number;
    isRead?: boolean;
  }): Promise<{
    notifications: INotification[];
    total: number;
    unreadCount: number;
  }> => {
    return apiClient.get("/notification", { params });
  },

  getUnreadCount: async (): Promise<{ unreadCount: number }> => {
    return apiClient.get("/notification/unread-count");
  },

  markAsRead: async (notificationIds: number[]): Promise<void> => {
    await apiClient.patch("/notification/mark-read", {
      notificationIds,
    });
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch("/notification/mark-all-read");
  },

  deleteNotification: async (notificationId: number): Promise<void> => {
    await apiClient.delete(`/notification/${notificationId}`);
  },

  deleteAllNotifications: async (): Promise<void> => {
    await apiClient.delete("/notification/all");
  },

  sendNotification: async (data: {
    title: string;
    message: string;
    type: string;
    recipientIds: number[];
    relatedStudentId?: number;
    relatedReportId?: number;
  }): Promise<INotification[]> => {
    return apiClient.post("/notification/send", data);
  },
};
