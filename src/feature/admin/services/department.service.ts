import { apiClient } from "@/shared/services/api-client";

export interface Department {
  id: string;
  name: string;
  facultyId: string;
}

export interface CreateDepartmentInput {
  id: string;
  name: string;
  facultyId: string;
}

export interface UpdateDepartmentInput {
  name?: string;
  facultyId?: string;
}

const API_BASE = "/administrative";

function mapDepartment(raw: Record<string, unknown>): Department {
  return {
    id: raw.id as string,
    name: raw.name as string,
    facultyId: (raw.facultyId ?? raw.faculty_id) as string,
  };
}

function unwrapDepartments(response: unknown): Department[] {
  const list = Array.isArray(response)
    ? response
    : ((response as { data?: unknown })?.data as unknown[]) || [];
  if (!Array.isArray(list)) return [];
  return list.map((raw) => mapDepartment(raw as Record<string, unknown>));
}

class DepartmentService {
  async getAll(facultyId?: string): Promise<Department[]> {
    const response = await apiClient.get<unknown>(`${API_BASE}/departments`, {
      params: { facultyId },
    });
    return unwrapDepartments(response);
  }

  async getById(id: string): Promise<Department> {
    const response = await apiClient.get<Record<string, unknown>>(
      `${API_BASE}/departments/${encodeURIComponent(id)}`,
    );
    return mapDepartment(response);
  }

  async create(data: CreateDepartmentInput): Promise<Department> {
    const response = await apiClient.post<Record<string, unknown>>(
      `${API_BASE}/departments`,
      data,
    );
    return mapDepartment(response);
  }

  async update(id: string, data: UpdateDepartmentInput): Promise<Department> {
    const response = await apiClient.patch<Record<string, unknown>>(
      `${API_BASE}/departments/${encodeURIComponent(id)}`,
      data,
    );
    return mapDepartment(response);
  }

  async delete(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(
      `${API_BASE}/departments/${encodeURIComponent(id)}`,
    );
  }
}

export const departmentService = new DepartmentService();
export default departmentService;
