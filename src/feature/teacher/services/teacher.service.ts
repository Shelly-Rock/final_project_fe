// ====================================
// SERVICE — Teacher Management Feature
// ====================================
import type {
  Lecturer,
  CreateLecturerInput,
  UpdateLecturerInput,
} from "@/feature/admin/types";
import { teacherApiService } from "./teacher.api";

export const teacherService = {
  /**
   * Lấy danh sách tất cả giảng viên
   */
  async getAll(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    facultyId?: string;
    departmentId?: string;
    status?: "active" | "inactive";
  }): Promise<{ teachers: Lecturer[]; total: number }> {
    const result = await teacherApiService.getAll(params);
    return { teachers: result.teachers, total: result.total };
  },

  /**
   * Lấy thông tin giảng viên theo code
   */
  async getByCode(code: string): Promise<Lecturer> {
    return teacherApiService.getByCode(code);
  },

  /**
   * Tạo mới giảng viên
   */
  async create(data: CreateLecturerInput): Promise<Lecturer> {
    const payload = {
      code: data.code,
      name: data.name,
      email: data.email,
      phone: data.phone,
      facultyId: data.facultyId,
      departmentId: data.departmentId,
      academicTitle: data.academicTitle,
      position: data.position,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      address: data.address,
    };
    return teacherApiService.create(payload);
  },

  /**
   * Cập nhật thông tin giảng viên
   */
  async update(code: string, data: UpdateLecturerInput): Promise<Lecturer> {
    return teacherApiService.update(code, data);
  },

  /**
   * Chuyển đổi trạng thái giảng viên
   */
  async toggleStatus(
    code: string,
    newStatus: "active" | "inactive",
  ): Promise<Lecturer> {
    return teacherApiService.toggleStatus(code, newStatus);
  },

  /**
   * Xóa giảng viên (Soft delete)
   */
  async delete(code: string): Promise<void> {
    await teacherApiService.remove(code);
  },
};
