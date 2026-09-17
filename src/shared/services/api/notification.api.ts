import apiClient from "@/shared/services/api-client";
import { INotification } from "@/shared/types/notification.types";

interface NotificationListResponse {
  notifications?: INotification[];
  total?: number;
}

interface UnreadCountResponse {
  count?: number;
}

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
    const limit = params?.take || 20;
    const page =
      params?.skip !== undefined ? Math.floor(params.skip / limit) + 1 : 1;

    const [res, countRes] = await Promise.all([
      apiClient.get<NotificationListResponse>("/notifications", {
        params: { page, limit },
      }),
      apiClient.get<UnreadCountResponse>("/notifications/unread-count"),
    ]);

    return {
      notifications: res?.notifications || [],
      total: res?.total || 0,
      unreadCount: countRes?.count || 0,
    };
  },

  getUnreadCount: async (): Promise<{ unreadCount: number }> => {
    const res = await apiClient.get<UnreadCountResponse>(
      "/notifications/unread-count",
    );
    return { unreadCount: res?.count || 0 };
  },

  markAsRead: async (notificationIds: number[]): Promise<void> => {
    await apiClient.post("/notifications/mark-as-read", {
      notification_ids: notificationIds,
    });
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.post("/notifications/mark-all-as-read");
  },

  deleteNotification: async (notificationId: number): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}`);
  },

  deleteAllNotifications: async (): Promise<void> => {
    await apiClient.delete("/notifications/all");
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
    // Map recipientIds to a batch payload matching CreateNotificationDto
    const payload = data.recipientIds.map((id) => ({
      title: data.title,
      message: data.message,
      type: data.type,
      recipient_id: id,
      related_student_id: data.relatedStudentId,
      related_report_id: data.relatedReportId,
    }));
    return apiClient.post("/notifications/batch", payload);
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
  }): Promise<{ id: number; [key: string]: unknown }> => {
    return apiClient.post("/notification/schedule", data);
  },

  getScheduledNotifications: async (params?: {
    skip?: number;
    take?: number;
  }): Promise<{
    data: { id: number; [key: string]: unknown }[];
    total: number;
  }> => {
    return apiClient.get("/notification/scheduled", { params });
  },

  cancelScheduledNotification: async (id: number): Promise<void> => {
    await apiClient.delete(`/notification/scheduled/${id}`);
  },

  // Templates
  getTemplates: async (): Promise<
    { id: number; name: string; title: string; message: string; type: string }[]
  > => {
    return apiClient.get("/notification/templates");
  },

  createTemplate: async (data: {
    name: string;
    title: string;
    message: string;
    type: string;
  }): Promise<{
    id: number;
    name: string;
    title: string;
    message: string;
    type: string;
  }> => {
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

  getDeliveryStatus: async (
    notificationId: number,
  ): Promise<{
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
