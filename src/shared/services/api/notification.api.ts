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
    scheduledAt?: string;
    isPinned?: boolean;
    requiresSignature?: boolean;
  }): Promise<INotification[]> => {
    return apiClient.post("/notification/send", data);
  },

  // Bulk operations
  bulkMarkAsRead: async (notificationIds: number[]): Promise<void> => {
    await apiClient.patch("/notification/bulk/mark-read", { notificationIds });
  },

  bulkDelete: async (notificationIds: number[]): Promise<void> => {
    await apiClient.post("/notification/bulk/delete", { notificationIds });
  },

  bulkResend: async (notificationIds: number[]): Promise<void> => {
    await apiClient.post("/notification/bulk/resend", { notificationIds });
  },

  // Scheduling
  scheduleNotification: async (data: {
    title: string;
    message: string;
    type: string;
    recipientIds: number[];
    scheduledAt: string;
    isPinned?: boolean;
    requiresSignature?: boolean;
  }): Promise<any> => {
    return apiClient.post("/notification/schedule", data);
  },

  getScheduledNotifications: async (params?: {
    skip?: number;
    take?: number;
  }): Promise<any> => {
    return apiClient.get("/notification/scheduled", { params });
  },

  cancelScheduledNotification: async (id: number): Promise<void> => {
    await apiClient.delete(`/notification/scheduled/${id}`);
  },

  // Templates
  getTemplates: async (): Promise<any[]> => {
    return apiClient.get("/notification/templates");
  },

  createTemplate: async (data: {
    name: string;
    title: string;
    message: string;
    type: string;
  }): Promise<any> => {
    return apiClient.post("/notification/templates", data);
  },

  deleteTemplate: async (id: number): Promise<void> => {
    await apiClient.delete(`/notification/templates/${id}`);
  },

  // Analytics
  getNotificationStats: async (): Promise<{
    total: number;
    sent: number;
    read: number;
    delivered: number;
    failed: number;
    readRate: number;
  }> => {
    return apiClient.get("/notification/stats");
  },

  getDeliveryStatus: async (notificationId: number): Promise<{
    total: number;
    delivered: number;
    read: number;
    failed: number;
    deliveryStatus: Array<{
      recipientId: number;
      status: "PENDING" | "DELIVERED" | "READ" | "FAILED";
      deliveredAt?: string;
      readAt?: string;
    }>;
  }> => {
    return apiClient.get(`/notification/${notificationId}/delivery-status`);
  },

  getDepartmentAnalytics: async (): Promise<{
    departments: Array<{
      name: string;
      total: number;
      readCount: number;
      readRate: number;
    }>;
  }> => {
    return apiClient.get("/notification/analytics/departments");
  },
};
