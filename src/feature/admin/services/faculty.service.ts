import { apiClient } from "@/shared/services/api-client";
import type { CreateFacultyInput, Faculty, UpdateFacultyInput } from "../types";

interface FacultyApiResponse {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
  is_active?: boolean;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

interface FacultyQueryParams extends Record<
  string,
  string | number | boolean | undefined
> {
  search?: string;
  isActive?: boolean;
}

const API_BASE = "/administrative";

function unwrapFaculties(response: unknown): FacultyApiResponse[] {
  if (Array.isArray(response)) return response as FacultyApiResponse[];
  const data = (response as { data?: unknown })?.data;
  return Array.isArray(data) ? (data as FacultyApiResponse[]) : [];
}

function mapFaculty(raw: FacultyApiResponse): Faculty {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? null,
    isActive: raw.isActive ?? raw.is_active ?? true,
    createdAt: raw.createdAt ?? raw.created_at,
    updatedAt: raw.updatedAt ?? raw.updated_at,
  };
}

class FacultyService {
  async getAll(params?: FacultyQueryParams): Promise<Faculty[]> {
    const response = await apiClient.get<unknown>(`${API_BASE}/faculties`, {
      params,
    });
    return unwrapFaculties(response).map(mapFaculty);
  }

  async getById(id: string): Promise<Faculty> {
    const response = await apiClient.get<FacultyApiResponse>(
      `${API_BASE}/faculties/${encodeURIComponent(id)}`,
    );
    return mapFaculty(response);
  }

  async create(data: CreateFacultyInput): Promise<Faculty> {
    const response = await apiClient.post<FacultyApiResponse>(
      `${API_BASE}/faculties`,
      data,
    );
    return mapFaculty(response);
  }

  async update(id: string, data: UpdateFacultyInput): Promise<Faculty> {
    const response = await apiClient.patch<FacultyApiResponse>(
      `${API_BASE}/faculties/${encodeURIComponent(id)}`,
      data,
    );
    return mapFaculty(response);
  }

  async delete(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(
      `${API_BASE}/faculties/${encodeURIComponent(id)}`,
    );
  }
}

export const facultyService = new FacultyService();
export default facultyService;
export type { Faculty, CreateFacultyInput, UpdateFacultyInput };
