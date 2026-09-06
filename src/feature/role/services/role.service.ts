/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
// ROLE — Service (Quản lý phân quyền)
// ============================================================

import { apiClient } from "@/shared/services/api-client";

// ---------- Type Definitions ----------

export interface PermissionItem {
  id: number;
  name: string;
  module: string;
  action: string;
  description: string;
}

export interface RoleItem {
  id: number;
  name: string;
  display_name: string;
  description: string;
  is_system: boolean;
  priority: number;
  permissions: PermissionItem[];
}

export interface UserWithRoles {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  roles: {
    id: number;
    name: string;
    display_name: string;
    description: string;
    is_system: boolean;
    priority: number;
  }[];
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------- Role Service ----------

class RoleService {
  // ==================== ROLES ====================

  async getRoles(): Promise<RoleItem[]> {
    const response: any = await apiClient.get("/roles");
    return response.data || [];
  }

  // ==================== PERMISSIONS ====================

  async getPermissionsCatalog(): Promise<PermissionItem[]> {
    const response: any = await apiClient.get("/permissions");
    return response.data || [];
  }

  async updateRolePermissions(
    roleId: number,
    permissionIds: number[],
  ): Promise<RoleItem> {
    const response: any = await apiClient.patch(
      `/roles/${roleId}/permissions`,
      {
        permission_ids: permissionIds,
      },
    );
    return response.data;
  }

  // ==================== USERS ====================

  async getUsersWithRoles(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResult<UserWithRoles>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.search) searchParams.set("search", params.search);

    const response: any = await apiClient.get(
      `/roles/users?${searchParams.toString()}`,
    );
    return {
      data: response.data || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 20,
      totalPages: response.totalPages || 1,
    };
  }

  async assignUserRoles(userId: number, roleIds: number[]): Promise<any[]> {
    const response: any = await apiClient.put(`/roles/users/${userId}`, {
      role_ids: roleIds,
    });
    return response.data;
  }

  // ==================== ME ====================

  async getMyPermissions(): Promise<{ role: string; permissions: string[] }> {
    const response: any = await apiClient.get("/auth/me/permissions");
    return {
      role: response.data?.role || "",
      permissions: response.data?.permissions || [],
    };
  }
}

// ---------- Singleton Export ----------
export const roleService = new RoleService();
export default roleService;
