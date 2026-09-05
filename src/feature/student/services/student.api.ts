// ============================================================
// STUDENT API SERVICE — Real HTTP calls to /students/* endpoints
// ============================================================
import apiClient from "@/core/api";

export interface StudentApiResponse {
  id: number;
  studentId: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  className?: string;
  major?: string;
  courseYear?: number;
  academicYear?: string;
  extraData?: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface StudentListResponse {
  students: StudentApiResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StudentImportRow {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  class_name?: string;
  department_name?: string;
  enrollment_year: number;
}

export interface StudentUpdatePayload {
  email?: string;
  phone?: string;
  address?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  className?: string;
  major?: string;
  courseYear?: number;
  academicYear?: string;
  extraData?: Record<string, unknown>;
}

class StudentApiService {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<StudentListResponse> {
    const { data } = await apiClient.get<StudentListResponse>("/students", {
      params,
    });
    return data;
  }

  async getById(id: number): Promise<StudentApiResponse> {
    const { data } = await apiClient.get<StudentApiResponse>(`/students/${id}`);
    return data;
  }

  async getByStudentId(studentId: string): Promise<StudentApiResponse> {
    const { data } = await apiClient.get<StudentApiResponse>(
      `/students/code/${studentId}`,
    );
    return data;
  }

  async importFromFile(
    file: File,
  ): Promise<{ success: boolean; message: string; count: number }> {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post<{
      success: boolean;
      message: string;
      count: number;
    }>("/students/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  }

  async exportToFile(): Promise<Blob> {
    const { data } = await apiClient.get<Blob>("/students/export", {
      responseType: "blob",
    });
    return data;
  }

  async create(
    payload: Omit<StudentImportRow, never>,
  ): Promise<StudentApiResponse> {
    const { data } = await apiClient.post<StudentApiResponse>(
      "/students",
      payload,
    );
    return data;
  }

  async update(
    id: number,
    payload: StudentUpdatePayload,
  ): Promise<StudentApiResponse> {
    const { data } = await apiClient.put<StudentApiResponse>(
      `/students/${id}`,
      payload,
    );
    return data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/students/${id}`);
  }

  async deleteMany(ids: number[]): Promise<void> {
    await apiClient.delete("/students", {
      data: { ids },
    });
  }
}

export const studentApiService = new StudentApiService();
export default studentApiService;
