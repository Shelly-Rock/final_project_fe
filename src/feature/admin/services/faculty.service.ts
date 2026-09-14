import { apiClient } from "@/shared/services/api-client";

export interface Faculty {
  id: string;
  name: string;
}

const API_BASE = "/administrative";

class FacultyService {
  async getAll(): Promise<Faculty[]> {
    const response: Record<string, unknown> = await apiClient.get(
      `${API_BASE}/faculties`,
    );
    const faculties = Array.isArray(response) ? response : response.data || [];
    return faculties.map((raw: Record<string, unknown>) => ({
      id: raw.id,
      name: raw.name,
    }));
  }
}

export const facultyService = new FacultyService();
export default facultyService;
