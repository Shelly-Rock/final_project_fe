// ============================================================
// SERVICES — Student Management API
// ============================================================
import type {
  Student,
  CreateStudentInput,
  UpdateStudentInput,
  StudentImportRow,
} from "../types";
import { mockStudents } from "../constants";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class StudentService {
  private students: Student[] = [...mockStudents];

  async getAll(): Promise<Student[]> {
    await delay(300);
    return [...this.students];
  }

  async getById(id: number): Promise<Student | undefined> {
    await delay(200);
    return this.students.find((s) => s.id === id);
  }

  async create(data: CreateStudentInput): Promise<Student> {
    await delay(500);
    const newStudent: Student = {
      id: Math.max(...this.students.map((s) => s.id), 0) + 1,
      ...data,
      trangThai: "active",
    };
    this.students.push(newStudent);
    return newStudent;
  }

  async createMany(
    data: StudentImportRow[],
  ): Promise<{ success: number; failed: number }> {
    await delay(800);
    let success = 0;
    let failed = 0;

    for (const row of data) {
      try {
        const exists = this.students.find(
          (s) => s.mssv === row.mssv || s.gmail === row.gmail,
        );
        if (exists) {
          failed++;
          continue;
        }

        const newStudent: Student = {
          id: Math.max(...this.students.map((s) => s.id), 0) + 1,
          ...row,
          trangThai: "active",
        };
        this.students.push(newStudent);
        success++;
      } catch {
        failed++;
      }
    }

    return { success, failed };
  }

  async update(
    id: number,
    data: UpdateStudentInput,
  ): Promise<Student | undefined> {
    await delay(400);
    const index = this.students.findIndex((s) => s.id === id);
    if (index === -1) return undefined;

    this.students[index] = { ...this.students[index], ...data };
    return this.students[index];
  }

  async delete(id: number): Promise<boolean> {
    await delay(300);
    const index = this.students.findIndex((s) => s.id === id);
    if (index === -1) return false;

    this.students.splice(index, 1);
    return true;
  }

  async updateStatus(
    id: number,
    status: Student["trangThai"],
  ): Promise<Student | undefined> {
    return this.update(id, { trangThai: status });
  }

  getKhoaOptions(): string[] {
    const khoas = [...new Set(this.students.map((s) => s.khoa))];
    return khoas.sort();
  }

  getKhoaHocOptions(): string[] {
    const khoaHocs = [...new Set(this.students.map((s) => s.khoaHoc))];
    return khoaHocs.sort().reverse();
  }

  getLopOptions(): string[] {
    const lops = [...new Set(this.students.map((s) => s.lop))];
    return lops.sort();
  }
}

export const studentService = new StudentService();
