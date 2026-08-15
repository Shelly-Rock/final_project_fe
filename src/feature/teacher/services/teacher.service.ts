// ====================================
// SERVICE — Teacher Management Feature
// ====================================
// NOTE: This service is kept for backward compatibility.
// All data operations are now handled in the page component with mock data.

import type {
  Lecturer,
  CreateLecturerInput,
  UpdateLecturerInput,
} from "@/feature/admin/types";
import { mockLecturers } from "@/feature/admin/mockData";

// Current lecturers state (in-memory)
let lecturers = [...mockLecturers];

export const teacherService = {
  /**
   * Lấy danh sách tất cả giảng viên
   */
  async getAll(): Promise<Lecturer[]> {
    return [...lecturers];
  },

  /**
   * Lấy thông tin giảng viên theo ID
   */
  async getById(id: number): Promise<Lecturer | undefined> {
    return lecturers.find((t) => t.id === id);
  },

  /**
   * Tạo mới giảng viên
   */
  async create(data: CreateLecturerInput): Promise<Lecturer> {
    const now = new Date().toISOString();
    const newTeacher: Lecturer = {
      ...data,
      id: Math.max(...lecturers.map((t) => t.id), 0) + 1,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
    lecturers.push(newTeacher);
    return newTeacher;
  },

  /**
   * Cập nhật thông tin giảng viên
   */
  async update(id: number, data: UpdateLecturerInput): Promise<Lecturer> {
    const index = lecturers.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Không tìm thấy giảng viên");
    }
    const updated: Lecturer = {
      ...lecturers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    lecturers[index] = updated;
    return updated;
  },

  /**
   * Chuyển đổi trạng thái giảng viên (Soft Toggle)
   */
  async toggleStatus(id: number): Promise<Lecturer> {
    const index = lecturers.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Không tìm thấy giảng viên");
    }
    const currentStatus = lecturers[index].status;
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    lecturers[index] = {
      ...lecturers[index],
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    return lecturers[index];
  },

  /**
   * Xóa giảng viên (Hard Delete - chỉ dùng khi cần)
   */
  async delete(id: number): Promise<void> {
    const index = lecturers.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Không tìm thấy giảng viên");
    }
    lecturers = lecturers.filter((t) => t.id !== id);
  },
};
