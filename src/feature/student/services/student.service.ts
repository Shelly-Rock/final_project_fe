// ============================================================
// SERVICES — Student Management API
// Real HTTP calls to backend /students/* endpoints
// ============================================================
import * as XLSX from "xlsx";
import type {
  Student,
  CreateStudentInput,
  UpdateStudentInput,
  StudentImportRow,
} from "../types";
import { mockStudents } from "../constants";
import { studentApiService } from "./student.api";

// Map API response → frontend Student type
function mapApiToStudent(apiStudent: {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  department_name?: string;
  enrollment_year: number;
  status: string;
  class_name?: string;
}): Student {
  return {
    id: apiStudent.id,
    mssv: apiStudent.student_id,
    hoTen: `${apiStudent.last_name} ${apiStudent.first_name}`.trim(),
    gmail: apiStudent.email,
    khoa: apiStudent.department_name || "",
    khoaHoc: String(apiStudent.enrollment_year),
    lop: apiStudent.class_name || "",
    soDienThoai: apiStudent.phone,
    ngaySinh: apiStudent.date_of_birth,
    diaChi: apiStudent.address,
    trangThai:
      apiStudent.status === "ACTIVE"
        ? "active"
        : apiStudent.status === "GRADUATED"
          ? "graduated"
          : "inactive",
  };
}

// Fallback to mock data when API is unavailable
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class StudentService {
  private useApi = false; // Toggle to false to use mock data

  async getAll(): Promise<Student[]> {
    if (!this.useApi) {
      await delay(300);
      return [...mockStudents];
    }

    try {
      const resp = await studentApiService.getAll({ limit: 1000 });
      return resp.data.map(mapApiToStudent);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[StudentService] API unavailable, using mock data:", err);
      await delay(300);
      return [...mockStudents];
    }
  }

  async getById(id: number): Promise<Student | undefined> {
    if (!this.useApi) {
      await delay(200);
      return mockStudents.find((s) => s.id === id);
    }

    try {
      const data = await studentApiService.getById(id);
      return mapApiToStudent(data);
    } catch {
      return mockStudents.find((s) => s.id === id);
    }
  }

  async create(data: CreateStudentInput): Promise<Student> {
    if (!this.useApi) {
      await delay(500);
      const newStudent: Student = {
        id: Math.max(...mockStudents.map((s) => s.id), 0) + 1,
        ...data,
        trangThai: "active",
      };
      return newStudent;
    }

    const created = await studentApiService.create({
      student_id: data.mssv,
      first_name: data.hoTen.split(" ").slice(-1)[0] || data.hoTen,
      last_name: data.hoTen.split(" ").slice(0, -1).join(" ") || data.hoTen,
      email: data.gmail,
      phone: data.soDienThoai,
      date_of_birth: data.ngaySinh,
      address: data.diaChi,
      class_name: data.lop,
      department_name: data.khoa,
      enrollment_year: parseInt(data.khoaHoc) || new Date().getFullYear(),
    });
    return mapApiToStudent(created);
  }

  async createMany(
    data: StudentImportRow[],
  ): Promise<{ success: number; failed: number }> {
    if (!this.useApi) {
      await delay(800);
      let success = 0;
      let failed = 0;
      for (const row of data) {
        const exists = mockStudents.find(
          (s) => s.mssv === row.mssv || s.gmail === row.gmail,
        );
        if (exists) {
          failed++;
          continue;
        }
        success++;
      }
      return { success, failed };
    }

    // Convert CSV rows to Excel File and upload
    const file = buildExcelFile(data);
    const result = await studentApiService.importFromFile(file);
    return { success: result.created, failed: result.failed };
  }

  async update(
    id: number,
    data: UpdateStudentInput,
  ): Promise<Student | undefined> {
    if (!this.useApi) {
      await delay(400);
      const index = mockStudents.findIndex((s) => s.id === id);
      if (index === -1) return undefined;
      const updated = { ...mockStudents[index], ...data };
      return updated;
    }

    try {
      const [firstName, ...lastParts] = (data.hoTen || "").split(" ");
      const lastName = lastParts.join(" ");
      const updated = await studentApiService.update(id, {
        student_id: data.mssv,
        first_name: firstName,
        last_name: lastName,
        email: data.gmail,
        phone: data.soDienThoai,
        date_of_birth: data.ngaySinh,
        address: data.diaChi,
        class_name: data.lop,
        department_name: data.khoa,
        enrollment_year: data.khoaHoc ? parseInt(data.khoaHoc) : undefined,
      });
      return mapApiToStudent(updated);
    } catch {
      return undefined;
    }
  }

  async delete(id: number): Promise<boolean> {
    if (!this.useApi) {
      await delay(300);
      return true;
    }

    try {
      await studentApiService.delete(id);
      return true;
    } catch {
      return false;
    }
  }

  async updateStatus(
    id: number,
    status: Student["trangThai"],
  ): Promise<Student | undefined> {
    return this.update(id, { trangThai: status });
  }

  getKhoaOptions(): string[] {
    const khoas = [...new Set(mockStudents.map((s) => s.khoa))];
    return khoas.sort();
  }

  getKhoaHocOptions(): string[] {
    const khoaHocs = [...new Set(mockStudents.map((s) => s.khoaHoc))];
    return khoaHocs.sort().reverse();
  }

  getLopOptions(): string[] {
    const lops = [...new Set(mockStudents.map((s) => s.lop))];
    return lops.sort();
  }
}

// ── Helpers ────────────────────────────────────────────────────────
function buildExcelFile(rows: StudentImportRow[]): File {
  const data = rows.map((r) => {
    const parts = r.hoTen.trim().split(" ");
    const firstName = parts.length > 1 ? parts[parts.length - 1] : r.hoTen;
    const lastName = parts.length > 1 ? parts.slice(0, -1).join(" ") : r.hoTen;
    return {
      student_id: r.mssv,
      first_name: firstName,
      last_name: lastName,
      email: r.gmail,
      phone: r.soDienThoai || "",
      date_of_birth: r.ngaySinh || "",
      address: r.diaChi || "",
      class_name: r.lop,
      department_name: r.khoa,
      enrollment_year: r.khoaHoc,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return new File([excelBuffer], "students_import.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export const studentService = new StudentService();
