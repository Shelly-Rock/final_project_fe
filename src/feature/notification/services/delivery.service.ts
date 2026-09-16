import apiClient from "@/shared/services/api-client";

export interface DeliveryLog {
  id: number;
  notificationId: number;
  recipientId: number;
  recipientEmail: string;
  status: "PENDING" | "SENT" | "FAILED" | "BOUNCED" | "OPENED" | "CLICKED";
  channel: "EMAIL" | "IN_APP" | "SMS" | "WEBHOOK";
  sentAt?: string;
  deliveredAt?: string;
  failureReason?: string;
  retryCount: number;
  lastRetryAt?: string;
  metadata?: Record<string, any>;
}

export interface DeliveryStats {
  total: number;
  sent: number;
  failed: number;
  pending: number;
  bounced: number;
  opened: number;
  clicked: number;
}

export const deliveryService = {
  // Get delivery logs for a notification
  getDeliveryLogs: async (notificationId: number): Promise<DeliveryLog[]> => {
    return apiClient.get(`/notification/${notificationId}/delivery-logs`);
  },

  // Get delivery statistics
  getDeliveryStats: async (notificationId: number): Promise<DeliveryStats> => {
    return apiClient.get(`/notification/${notificationId}/delivery-stats`);
  },

  // Retry failed deliveries
  retryFailedDeliveries: async (
    notificationId: number,
    recipientIds?: number[],
  ): Promise<{ retriedCount: number }> => {
    return apiClient.post(`/notification/${notificationId}/retry-delivery`, {
      recipientIds,
    });
  },

  // Retry specific delivery log
  retryDeliveryLog: async (deliveryLogId: number): Promise<void> => {
    return apiClient.post(`/delivery-logs/${deliveryLogId}/retry`);
  },

  // Mark as opened (webhook callback)
  markAsOpened: async (notificationId: number, recipientId: number): Promise<void> => {
    return apiClient.post(`/notification/${notificationId}/mark-opened`, {
      recipientId,
    });
  },

  // Mark as clicked (webhook callback)
  markAsClicked: async (notificationId: number, recipientId: number): Promise<void> => {
    return apiClient.post(`/notification/${notificationId}/mark-clicked`, {
      recipientId,
    });
  },

  // Get delivery summary by channel
  getDeliverySummaryByChannel: async (
    notificationId: number,
  ): Promise<Record<string, DeliveryStats>> => {
    return apiClient.get(
      `/notification/${notificationId}/delivery-summary-by-channel`,
    );
  },
};
