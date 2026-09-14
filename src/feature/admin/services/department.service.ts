import { apiClient } from "@/shared/services/api-client";

export interface Department {
  id: string;
  name: string;
  facultyId: string;
}

const API_BASE = "/administrative";

class DepartmentService {
  async getAll(facultyId?: string): Promise<Department[]> {
    const params = new URLSearchParams();
    if (facultyId) {
      params.set("facultyId", facultyId);
    }
    const url = `${API_BASE}/departments${params.toString() ? `?${params.toString()}` : ""}`;
    const response: Record<string, unknown> = await apiClient.get(url);
    const departments = (
      Array.isArray(response) ? response : (response.data as unknown[]) || []
    ) as Array<Record<string, unknown>>;
    return departments.map((raw: Record<string, unknown>) => ({
      id: raw.id as string,
      name: raw.name as string,
      facultyId: raw.faculty_id as string,
    }));
  }
}

export const departmentService = new DepartmentService();
export default departmentService;
