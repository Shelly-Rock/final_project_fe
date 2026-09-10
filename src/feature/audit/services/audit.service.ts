/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
// AUDIT — Service (Nhật ký Audit)
// ============================================================

import { apiClient } from "@/shared/services/api-client";

// ---------- Type Definitions ----------

export interface AuditLog {
  id: number;
  entity_type: string;
  entity_id: number;
  action: string;
  actor_user_id: number;
  before_data: Record<string, any> | null;
  after_data: Record<string, any> | null;
  reason: string | null;
  created_at: string;
  actor?: {
    id: number;
    username: string;
    email: string;
  };
}

export interface AuditQueryParams {
  page?: number;
  limit?: number;
  entity_type?: string;
  entity_id?: number;
  actor_user_id?: number;
  action?: string;
  from?: string;
  to?: string;
}

export interface PaginatedAuditLogs {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------- Audit Service ----------

class AuditService {
  async getLogs(params?: AuditQueryParams): Promise<PaginatedAuditLogs> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.entity_type) searchParams.set("entity_type", params.entity_type);
    if (params?.entity_id) searchParams.set("entity_id", String(params.entity_id));
    if (params?.actor_user_id) searchParams.set("actor_user_id", String(params.actor_user_id));
    if (params?.action) searchParams.set("action", params.action);
    if (params?.from) searchParams.set("from", params.from);
    if (params?.to) searchParams.set("to", params.to);

    const response: any = await apiClient.get(`/audit?${searchParams.toString()}`);
    return {
      data: response.data || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 20,
      totalPages: response.totalPages || 1,
    };
  }
}

// ---------- Singleton Export ----------
export const auditService = new AuditService();
export default auditService;
