// ====================================
// TYPES — Teacher Management Feature
// ====================================

// Trạng thái giảng viên
export type TeacherStatus = "active" | "inactive";

// Giới tính
export type Gender = "male" | "female" | "other";

// ====================================
// INTERFACES
// ====================================

/**
 * Giảng viên
 */
export interface Teacher {
  id: number;
  code: string; // Mã giảng viên (VD: GV001)
  firstName: string;
  lastName: string;
  fullName: string; // Họ và tên đầy đủ
  email: string;
  phone?: string;
  department: string; // Chuyên ngành
  academicTitle?: string; // Học hàm, học vị (ThS, TS, PGS, GS...)
  position?: string; // Chức vụ (Trưởng ngành, Phó trưởng ngành...)
  dateOfBirth?: string; // Ngày sinh
  gender?: Gender;
  address?: string;
  status: TeacherStatus;
  createdAt: string;
  updatedAt: string;
}

// ====================================
// INPUT TYPES (Create/Update)
// ====================================

export interface CreateTeacherInput {
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  academicTitle?: string;
  position?: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
}

export interface UpdateTeacherInput extends Partial<CreateTeacherInput> {
  status?: TeacherStatus;
}

// ====================================
// FILTER TYPES
// ====================================

export interface TeacherFilters {
  search: string;
  department: string;
  status: TeacherStatus | "all";
}

// ====================================
// IMPORT TYPES
// ====================================

export interface TeacherImportRow {
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  academicTitle?: string;
  position?: string;
}

export interface ImportResult {
  success: number;
  failed: number;
  errors?: string[];
}

// ====================================
// UTILITY TYPES
// ====================================

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
