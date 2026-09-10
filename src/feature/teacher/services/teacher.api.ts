// ============================================================
// TEACHER API SERVICE — Real HTTP calls to /teachers/* endpoints
// ============================================================
import apiClient from "@/core/api";
import type {
  Lecturer,
  CreateLecturerInput,
  UpdateLecturerInput,
} from "@/feature/admin/types";

// Backend DTO response structure
export interface TeacherApiResponse {
  id: number;
  teacher_id: string;
  name: string;
  email: string;
  phone?: string;
  faculty_id: string;
  department_id: string;
  faculty_name: string;
  department_name: string;
  academic_title?: string;
  position?: string;
  date_of_birth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  address?: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  updated_at: string;
}

export interface TeacherListResponse {
  data: TeacherApiResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Map backend response to frontend Lecturer type
function mapApiToLecturer(api: TeacherApiResponse): Lecturer {
  return {
    id: api.id,
    code: api.teacher_id,
    name: api.name,
    email: api.email,
    phone: api.phone,
    facultyId: api.faculty_id,
    departmentId: api.department_id,
    academicTitle: api.academic_title,
    position: api.position,
    dateOfBirth: api.date_of_birth,
    gender:
      api.gender === "MALE"
        ? "male"
        : api.gender === "FEMALE"
          ? "female"
          : "other",
    address: api.address,
    status: api.status === "ACTIVE" ? "active" : "inactive",
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}

// Map frontend input to backend payload
function mapLecturerToCreatePayload(input: CreateLecturerInput) {
  return {
    code: input.code,
    name: input.name,
    email: input.email,
    phone: input.phone,
    facultyId: input.facultyId,
    departmentId: input.departmentId,
    academicTitle: input.academicTitle,
    position: input.position,
    dateOfBirth: input.dateOfBirth,
    gender:
      input.gender === "male"
        ? "MALE"
        : input.gender === "female"
          ? "FEMALE"
          : "OTHER",
    address: input.address,
  };
}

function mapLecturerToUpdatePayload(input: UpdateLecturerInput) {
  const payload: Record<string, unknown> = {};
  if (input.name !== undefined) payload.name = input.name;
  if (input.email !== undefined) payload.email = input.email;
  if (input.phone !== undefined) payload.phone = input.phone;
  if (input.facultyId !== undefined) payload.facultyId = input.facultyId;
  if (input.departmentId !== undefined)
    payload.departmentId = input.departmentId;
  if (input.academicTitle !== undefined)
    payload.academicTitle = input.academicTitle;
  if (input.position !== undefined) payload.position = input.position;
  if (input.dateOfBirth !== undefined) payload.dateOfBirth = input.dateOfBirth;
  if (input.gender !== undefined) {
    payload.gender =
      input.gender === "male"
        ? "MALE"
        : input.gender === "female"
          ? "FEMALE"
          : "OTHER";
  }
  if (input.address !== undefined) payload.address = input.address;
  return payload;
}

class TeacherApiService {
  async getAll(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    facultyId?: string;
    departmentId?: string;
    status?: "active" | "inactive";
  }): Promise<{ teachers: Lecturer[]; total: number; page: number; limit: number; totalPages: number }> {
    const mappedParams = {
      ...params,
      status: params?.status === "active" ? "ACTIVE" : params?.status === "inactive" ? "INACTIVE" : undefined,
    };
    const { data } = await apiClient.get<TeacherListResponse>("/teachers", {
      params: mappedParams,
    });
    return {
      teachers: (data.data || []).map(mapApiToLecturer),
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages,
    };
  }

  async getByCode(code: string): Promise<Lecturer> {
    const { data } = await apiClient.get<TeacherApiResponse>(
      `/teachers/${code}`,
    );
    return mapApiToLecturer(data);
  }

  async create(payload: CreateLecturerInput): Promise<Lecturer> {
    const backendPayload = mapLecturerToCreatePayload(payload);
    const { data } = await apiClient.post<TeacherApiResponse>(
      "/teachers",
      backendPayload,
    );
    return mapApiToLecturer(data);
  }

  async update(code: string, payload: UpdateLecturerInput): Promise<Lecturer> {
    const backendPayload = mapLecturerToUpdatePayload(payload);
    const { data } = await apiClient.patch<TeacherApiResponse>(
      `/teachers/${code}`,
      backendPayload,
    );
    return mapApiToLecturer(data);
  }

  async toggleStatus(
    code: string,
    desiredStatus: "active" | "inactive",
  ): Promise<Lecturer> {
    const backendStatus = desiredStatus === "active" ? "ACTIVE" : "INACTIVE";
    const { data } = await apiClient.patch<TeacherApiResponse>(
      `/teachers/${code}/toggle-status`,
      { status: backendStatus },
    );
    return mapApiToLecturer(data);
  }

  async remove(code: string): Promise<void> {
    await apiClient.delete(`/teachers/${code}`);
  }

  async getNextCode(): Promise<string> {
    const { data } = await apiClient.get<{ nextCode: string }>(
      "/teachers/next-code",
    );
    return data.nextCode;
  }
}

export const teacherApiService = new TeacherApiService();
export default teacherApiService;
