// ============================================================
// STUDENT MANAGEMENT - Types
// ============================================================

export interface Student {
  id: string;
  stt: number;
  mssv: string;
  hoTen: string;
  khoa: string;
  khoaHoc: string;
  gmail: string;
  deTai: string | null;
  giaoVienHuongDan: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentImportRow {
  stt: number;
  khoa: string;
  khoaHoc: string;
  mssv: string;
  hoTen: string;
  gmail: string;
  deTai?: string;
  giaoVienHuongDan?: string;
}

export interface StudentFormData {
  stt: number;
  mssv: string;
  hoTen: string;
  khoa: string;
  khoaHoc: string;
  gmail: string;
  deTai?: string;
  giaoVienHuongDan?: string;
}

export type StudentStatus = "all" | "has_topic" | "no_topic";

export interface StudentFilters {
  search: string;
  khoa: string;
  khoaHoc: string;
  status: StudentStatus;
}
