// ============================================================
// STUDENT API SERVICE — Real HTTP calls to /students/* endpoints
// ============================================================
import apiClient from "@/core/api";

export interface StudentApiResponse {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  course_id?: number;
  course_name?: string;
  class_id?: number;
  class_name?: string;
  department_id?: number;
  department_name?: string;
  enrollment_year: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface StudentListResponse {
  data: StudentApiResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
  ): Promise<{ created: number; failed: number }> {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post<
      Array<{
        student_id: string;
        first_name: string;
        last_name: string;
        email: string;
      }>
    >("/students/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // Backend returns array of created students
    return { created: Array.isArray(data) ? data.length : 0, failed: 0 };
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
    payload: Partial<StudentImportRow>,
  ): Promise<StudentApiResponse> {
    const { data } = await apiClient.put<StudentApiResponse>(
      `/students/${id}`,
      payload,
    );
    return data;
  }

  async delete(id: number, hardDelete = false): Promise<void> {
    await apiClient.delete(`/students/${id}`, {
      params: { hardDelete: hardDelete ? "true" : "false" },
    });
  }
}

export const studentApiService = new StudentApiService();
export default studentApiService;
