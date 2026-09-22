import apiClient from "@/shared/services/api-client";
import { INotification } from "@/shared/types/notification.types";

interface NotificationListResponse {
  notifications?: INotification[];
  total?: number;
  page?: number;
  limit?: number;
  unreadCount?: number;
}

export const notificationApi = {
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    notifications: INotification[];
    total: number;
    page: number;
    limit: number;
    unreadCount: number;
  }> => {
    const page = params?.page || 1;
    const limit = params?.limit || 20;

    const res = await apiClient.get<NotificationListResponse>(
      "/notifications",
      {
        params: { page, limit },
      },
    );

    return {
      notifications: res?.notifications || [],
      total: res?.total || 0,
      page: res?.page || page,
      limit: res?.limit || limit,
      unreadCount: res?.unreadCount || 0,
    };
  },

  getUnreadCount: async (): Promise<{ unreadCount: number }> => {
    const res = await apiClient.get<{ unreadCount: number }>(
      "/notifications/unread-count",
    );
    return { unreadCount: res?.unreadCount || 0 };
  },

  markAsRead: async (notificationIds: number[]): Promise<void> => {
    await apiClient.patch("/notifications/mark-read", {
      notificationIds,
    });
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch("/notifications/mark-all-read");
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
  }): Promise<INotification[]> => {
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

  getUsersByRole: async (
    role: "STUDENT" | "TEACHER",
  ): Promise<{
    users: Array<{ id: number; name: string; email: string }>;
  }> => {
    const res = await apiClient.get<{
      users: Array<{ id: number; name: string; email: string }>;
    }>(`/notifications/users/${role}`);
    return res || { users: [] };
  },

  getDepartments: async (): Promise<{
    departments: Array<{ id: string; name: string }>;
  }> => {
    const res = await apiClient.get<{
      departments: Array<{ id: string; name: string }>;
    }>("/notifications/compose/departments");
    return res || { departments: [] };
  },

  getUsersByDepartment: async (
    deptId: string,
  ): Promise<{
    users: Array<{ id: number; name: string; email: string; role: string }>;
  }> => {
    const res = await apiClient.get<{
      users: Array<{ id: number; name: string; email: string; role: string }>;
    }>(`/notifications/compose/departments/${deptId}/users`);
    return res || { users: [] };
  },

  getNotificationStats: async (): Promise<{
    total: number;
    urgent: number;
    avgReadRate: number;
    pending: number;
  }> => {
    const res = await apiClient.get<{
      total: number;
      urgent: number;
      avgReadRate: number;
      pending: number;
    }>("/notifications/compose/stats");
    return res || { total: 0, urgent: 0, avgReadRate: 0, pending: 0 };
  },

  composeAndSend: async (data: {
    title: string;
    message: string;
    type: string;
    priority: string;
    recipientIds: number[];
    saveDraft?: boolean;
    attachmentUrl?: string;
  }): Promise<{
    message: string;
    notifications?: INotification[];
    draftId?: number;
  }> => {
    return apiClient.post<{
      message: string;
      notifications?: INotification[];
      draftId?: number;
    }>("/notifications/compose/send", data);
  },

  getDrafts: async (): Promise<{
    drafts: Array<{ id: number; title: string; message: string; type: string }>;
  }> => {
    const res = await apiClient.get<{
      drafts: Array<{
        id: number;
        title: string;
        message: string;
        type: string;
      }>;
    }>("/notifications/drafts");
    return res || { drafts: [] };
  },

  getDraftById: async (
    id: number,
  ): Promise<{ id: number; title: string; message: string; type: string }> => {
    return apiClient.get<{
      id: number;
      title: string;
      message: string;
      type: string;
    }>(`/notifications/drafts/${id}`);
  },

  saveDraft: async (data: {
    title: string;
    message: string;
    type: string;
    priority: string;
    recipientIds: number[];
    fileName?: string;
    fileUrl?: string;
    fileSize?: number;
  }): Promise<{ id: number; title: string; message: string; type: string }> => {
    return apiClient.post<{
      id: number;
      title: string;
      message: string;
      type: string;
    }>("/notifications/drafts", data);
  },

  updateDraft: async (
    id: number,
    data: {
      title: string;
      message: string;
      type: string;
      priority: string;
      recipientIds: number[];
      fileName?: string;
      fileUrl?: string;
      fileSize?: number;
    },
  ): Promise<{ id: number; title: string; message: string; type: string }> => {
    return apiClient.patch<{
      id: number;
      title: string;
      message: string;
      type: string;
    }>(`/notifications/drafts/${id}`, data);
  },

  deleteDraft: async (id: number): Promise<void> => {
    await apiClient.delete(`/notifications/drafts/${id}`);
  },

  publishDraft: async (id: number): Promise<INotification[]> => {
    return apiClient.post<INotification[]>(
      `/notifications/drafts/${id}/publish`,
      {},
    );
  },
};
