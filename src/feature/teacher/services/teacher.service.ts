// ====================================
// SERVICE — Teacher Management Feature
// ====================================

import type {
  Teacher,
  CreateTeacherInput,
  UpdateTeacherInput,
  TeacherImportRow,
  ImportResult,
} from "../types";

// Mock data - Danh sách giảng viên mẫu
const mockTeachers: Teacher[] = [
  {
    id: 1,
    code: "GV001",
    firstName: "Nguyễn Văn",
    lastName: "An",
    fullName: "Nguyễn Văn An",
    email: "nv.an@ctu.edu.vn",
    phone: "0912345678",
    department: "Công nghệ phần mềm",
    academicTitle: "Tiến sĩ",
    position: "Trưởng ngành",
    dateOfBirth: "1975-03-15",
    gender: "male",
    status: "active",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-06-20T10:30:00Z",
  },
  {
    id: 2,
    code: "GV002",
    firstName: "Trần Thị",
    lastName: "Bình",
    fullName: "Trần Thị Bình",
    email: "tt.binh@ctu.edu.vn",
    phone: "0923456789",
    department: "Hệ thống thông tin",
    academicTitle: "Thạc sĩ",
    position: "Phó trưởng ngành",
    dateOfBirth: "1980-07-22",
    gender: "female",
    status: "active",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-06-18T14:20:00Z",
  },
  {
    id: 3,
    code: "GV003",
    firstName: "Lê Hoàng",
    lastName: "Cường",
    fullName: "Lê Hoàng Cường",
    email: "lh.cuong@ctu.edu.vn",
    department: "Khoa học máy tính",
    academicTitle: "Giáo sư",
    position: "Trưởng ngành",
    dateOfBirth: "1968-11-08",
    gender: "male",
    status: "active",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-06-15T09:00:00Z",
  },
  {
    id: 4,
    code: "GV004",
    firstName: "Phạm Thị",
    lastName: "Dung",
    fullName: "Phạm Thị Dung",
    email: "pt.dung@ctu.edu.vn",
    phone: "0945678901",
    department: "Mạng máy tính",
    academicTitle: "Thạc sĩ",
    status: "inactive",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-05-10T16:45:00Z",
  },
  {
    id: 5,
    code: "GV005",
    firstName: "Hoàng Minh",
    lastName: "Em",
    fullName: "Hoàng Minh Em",
    email: "hm.em@ctu.edu.vn",
    department: "Công nghệ phần mềm",
    academicTitle: "Thạc sĩ",
    position: "Giảng viên",
    dateOfBirth: "1988-05-30",
    gender: "male",
    status: "active",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-06-22T11:15:00Z",
  },
  {
    id: 6,
    code: "GV006",
    firstName: "Ngô Thị",
    lastName: "Hương",
    fullName: "Ngô Thị Hương",
    email: "nt.huong@ctu.edu.vn",
    department: "An toàn thông tin",
    academicTitle: "Tiến sĩ",
    position: "Trưởng ngành",
    dateOfBirth: "1979-09-12",
    gender: "female",
    status: "active",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-06-21T08:30:00Z",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Current teachers state (in-memory)
let teachers = [...mockTeachers];

export const teacherService = {
  /**
   * Lấy danh sách tất cả giảng viên
   */
  async getAll(): Promise<Teacher[]> {
    await delay(300);
    return [...teachers];
  },

  /**
   * Lấy thông tin giảng viên theo ID
   */
  async getById(id: number): Promise<Teacher | undefined> {
    await delay(200);
    return teachers.find((t) => t.id === id);
  },

  /**
   * Tạo mới giảng viên
   */
  async create(data: CreateTeacherInput): Promise<Teacher> {
    await delay(400);
    const now = new Date().toISOString();
    const newTeacher: Teacher = {
      ...data,
      id: Math.max(...teachers.map((t) => t.id), 0) + 1,
      fullName: `${data.firstName} ${data.lastName}`,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
    teachers.push(newTeacher);
    return newTeacher;
  },

  /**
   * Cập nhật thông tin giảng viên
   */
  async update(id: number, data: UpdateTeacherInput): Promise<Teacher> {
    await delay(400);
    const index = teachers.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Không tìm thấy giảng viên");
    }
    const updated: Teacher = {
      ...teachers[index],
      ...data,
      fullName:
        data.firstName && data.lastName
          ? `${data.firstName} ${data.lastName}`
          : teachers[index].fullName,
      updatedAt: new Date().toISOString(),
    };
    teachers[index] = updated;
    return updated;
  },

  /**
   * Chuyển đổi trạng thái giảng viên (Soft Toggle)
   */
  async toggleStatus(id: number): Promise<Teacher> {
    await delay(300);
    const index = teachers.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Không tìm thấy giảng viên");
    }
    const currentStatus = teachers[index].status;
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    teachers[index] = {
      ...teachers[index],
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    return teachers[index];
  },

  /**
   * Xóa giảng viên (Hard Delete - chỉ dùng khi cần)
   */
  async delete(id: number): Promise<void> {
    await delay(300);
    const index = teachers.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Không tìm thấy giảng viên");
    }
    teachers = teachers.filter((t) => t.id !== id);
  },

  /**
   * Import danh sách giảng viên từ Excel
   */
  async importFromExcel(rows: TeacherImportRow[]): Promise<ImportResult> {
    await delay(500);
    let success = 0;
    const errors: string[] = [];

    for (const row of rows) {
      try {
        // Validate required fields
        if (
          !row.code ||
          !row.firstName ||
          !row.lastName ||
          !row.email ||
          !row.department
        ) {
          errors.push(`Thiếu thông tin bắt buộc: ${row.code || "unknown"}`);
          continue;
        }

        // Check duplicate code
        if (teachers.some((t) => t.code === row.code)) {
          errors.push(`Mã giảng viên đã tồn tại: ${row.code}`);
          continue;
        }

        const now = new Date().toISOString();
        const newTeacher: Teacher = {
          id: Math.max(...teachers.map((t) => t.id), 0) + 1,
          code: row.code,
          firstName: row.firstName,
          lastName: row.lastName,
          fullName: `${row.firstName} ${row.lastName}`,
          email: row.email,
          phone: row.phone,
          department: row.department,
          academicTitle: row.academicTitle,
          position: row.position,
          status: "active",
          createdAt: now,
          updatedAt: now,
        };
        teachers.push(newTeacher);
        success++;
      } catch {
        errors.push(`Lỗi khi xử lý: ${row.code || "unknown"}`);
      }
    }

    return { success, failed: rows.length - success, errors };
  },

  /**
   * Lấy danh sách chuyên ngành duy nhất
   */
  async getDepartments(): Promise<string[]> {
    await delay(100);
    const departments = [...new Set(teachers.map((t) => t.department))];
    return departments.sort();
  },
};
