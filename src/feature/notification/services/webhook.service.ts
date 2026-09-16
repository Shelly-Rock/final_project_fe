import apiClient from "@/shared/services/api-client";

export interface Webhook {
  id: number;
  url: string;
  events: WebhookEvent[];
  headers?: Record<string, string>;
  isActive: boolean;
  retryPolicy?: {
    maxRetries: number;
    backoffMultiplier: number;
    initialDelayMs: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type WebhookEvent =
  | "notification.created"
  | "notification.sent"
  | "notification.read"
  | "notification.failed"
  | "notification.delivered"
  | "notification.deleted";

export interface WebhookLog {
  id: number;
  webhookId: number;
  event: WebhookEvent;
  payload: Record<string, any>;
  statusCode?: number;
  responseBody?: string;
  error?: string;
  retryCount: number;
  createdAt: string;
}

export interface WebhookTestRequest {
  url: string;
  event: WebhookEvent;
  payload?: Record<string, any>;
}

export const webhookService = {
  // Get all webhooks
  getWebhooks: async (): Promise<Webhook[]> => {
    return apiClient.get("/webhooks");
  },

  // Get single webhook
  getWebhook: async (webhookId: number): Promise<Webhook> => {
    return apiClient.get(`/webhooks/${webhookId}`);
  },

  // Create webhook
  createWebhook: async (data: {
    url: string;
    events: WebhookEvent[];
    headers?: Record<string, string>;
    retryPolicy?: Webhook["retryPolicy"];
  }): Promise<Webhook> => {
    return apiClient.post("/webhooks", data);
  },

  // Update webhook
  updateWebhook: async (webhookId: number, data: Partial<Webhook>): Promise<Webhook> => {
    return apiClient.patch(`/webhooks/${webhookId}`, data);
  },

  // Delete webhook
  deleteWebhook: async (webhookId: number): Promise<void> => {
    return apiClient.delete(`/webhooks/${webhookId}`);
  },

  // Toggle webhook active status
  toggleWebhook: async (webhookId: number): Promise<Webhook> => {
    return apiClient.patch(`/webhooks/${webhookId}/toggle`);
  },

  // Get webhook logs
  getWebhookLogs: async (webhookId: number, options?: {
    page?: number;
    limit?: number;
    event?: WebhookEvent;
    status?: "success" | "failed";
  }): Promise<{ logs: WebhookLog[]; total: number }> => {
    return apiClient.get(`/webhooks/${webhookId}/logs`, { params: options });
  },

  // Get webhook log detail
  getWebhookLogDetail: async (webhookId: number, logId: number): Promise<WebhookLog> => {
    return apiClient.get(`/webhooks/${webhookId}/logs/${logId}`);
  },

  // Test webhook
  testWebhook: async (request: WebhookTestRequest): Promise<{
    statusCode: number;
    responseBody: string;
    duration: number;
  }> => {
    return apiClient.post("/webhooks/test", request);
  },

  // Retry failed webhook delivery
  retryWebhookDelivery: async (webhookId: number, logId: number): Promise<WebhookLog> => {
    return apiClient.post(`/webhooks/${webhookId}/logs/${logId}/retry`);
  },

  // Clear webhook logs
  clearWebhookLogs: async (webhookId: number): Promise<{ deletedCount: number }> => {
    return apiClient.delete(`/webhooks/${webhookId}/logs`);
  },
};
