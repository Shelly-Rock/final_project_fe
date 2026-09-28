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

/** Tài khoản thư ký được liên kết 1-1 với một khoa. */
export interface SecretaryAccount {
  id: number;
  userId: number;
  secretaryId: string;
  username: string;
  email: string;
  facultyId: string;
  facultyName: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SecretaryAccountInput {
  username?: string;
  email?: string;
  password?: string;
  facultyId: string;
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

  // ==================== SECRETARY ACCOUNTS ====================

  private mapSecretary(raw: any): SecretaryAccount {
    const user = raw?.user ?? {};
    const faculty = raw?.faculty ?? {};
    return {
      id: Number(raw?.id ?? raw?.secretary_id ?? 0),
      userId: Number(raw?.userId ?? raw?.user_id ?? user?.id ?? 0),
      secretaryId: String(
        raw?.secretaryId ?? raw?.secretary_id ?? raw?.id ?? "",
      ),
      username: String(raw?.username ?? user?.username ?? ""),
      email: String(raw?.email ?? user?.email ?? ""),
      facultyId: String(raw?.facultyId ?? raw?.faculty_id ?? faculty?.id ?? ""),
      facultyName: String(
        raw?.facultyName ?? raw?.faculty_name ?? faculty?.name ?? "",
      ),
      isActive: Boolean(
        raw?.isActive ?? raw?.is_active ?? user?.is_active ?? true,
      ),
      createdAt: raw?.createdAt ?? raw?.created_at,
      updatedAt: raw?.updatedAt ?? raw?.updated_at,
    };
  }

  private toSecretaryPayload(input: SecretaryAccountInput) {
    return {
      ...(input.username ? { username: input.username } : {}),
      ...(input.email ? { email: input.email } : {}),
      ...(input.password ? { password: input.password } : {}),
      faculty_id: input.facultyId,
    };
  }

  async getSecretaryAccounts(): Promise<SecretaryAccount[]> {
    const response: any = await apiClient.get("/users/secretaries", {
      params: { page: 1, limit: 100 },
    });
    const payload = response?.data ?? response;
    const rows = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : [];
    return rows.map((row: any) => this.mapSecretary(row));
  }

  async createSecretaryAccount(
    input: SecretaryAccountInput,
  ): Promise<SecretaryAccount> {
    const response: any = await apiClient.post(
      "/users/secretaries",
      this.toSecretaryPayload(input),
    );
    return this.mapSecretary(response?.data ?? response);
  }

  async updateSecretaryAccount(
    id: number,
    input: SecretaryAccountInput,
  ): Promise<SecretaryAccount> {
    const response: any = await apiClient.patch(
      `/users/secretaries/${id}`,
      this.toSecretaryPayload(input),
    );
    return this.mapSecretary(response?.data ?? response);
  }

  async deleteSecretaryAccount(id: number): Promise<void> {
    await apiClient.delete(`/users/secretaries/${id}`);
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
