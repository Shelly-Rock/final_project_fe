// ============================================================
// TYPES — Student Management Feature
// ============================================================

export type StudentStatus = "all" | "has_topic" | "no_topic";

export interface Student {
  id: number;
  mssv: string;
  hoTen: string;
  gmail: string;
  khoa: string;
  khoaHoc: string;
  lop: string;
  soDienThoai?: string;
  deTai?: string;
  giangVienHuongDan?: string;
  trangThai: "active" | "inactive" | "graduated";
  ngaySinh?: string;
  diaChi?: string;
  extraData?: Record<string, unknown>;
}

export interface StudentFilters {
  search: string;
  khoa: string;
  khoaHoc: string;
  status: StudentStatus;
}

export interface StudentImportRow {
  mssv: string;
  hoTen: string;
  gmail: string;
  khoa: string;
  khoaHoc: string;
  lop: string;
  soDienThoai?: string;
  ngaySinh?: string;
  diaChi?: string;
  extraData?: Record<string, unknown>;
}

export interface CreateStudentInput {
  mssv: string;
  hoTen: string;
  gmail: string;
  khoa: string;
  khoaHoc: string;
  lop: string;
  soDienThoai?: string;
  ngaySinh?: string;
  diaChi?: string;
  extraData?: Record<string, unknown>;
}

export type UpdateStudentStatus = "active" | "inactive" | "graduated";

export interface UpdateStudentInput extends Partial<CreateStudentInput> {
  trangThai?: UpdateStudentStatus;
}
