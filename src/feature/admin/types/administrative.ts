// ====================================
// ADMINISTRATIVE STRUCTURE TYPES
// Faculty -> Department -> Lecturer
// ====================================

/**
 * Khoa (Faculty)
 */
export interface Faculty {
  id: string;
  name: string;
}

/**
 * Bộ môn (Department)
 */
export interface Department {
  id: string;
  name: string;
  facultyId: string; // FK to Faculty
}

// ====================================
// LECTURER TYPES
// ====================================

export type LecturerStatus = "active" | "inactive";

/**
 * Giảng viên (Lecturer)
 */
export interface Lecturer {
  id: number;
  code: string;
  name: string;
  email: string;
  phone?: string;
  facultyId: string;
  departmentId: string;
  academicTitle?: string; // Học hàm, học vị (ThS, TS, PGS, GS)
  position?: string; // Chức vụ (Trưởng ngành, Phó trưởng ngành...)
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  status: LecturerStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input type for creating lecturer
 */
export interface CreateLecturerInput {
  code: string;
  name: string;
  email: string;
  phone?: string;
  facultyId: string;
  departmentId: string;
  academicTitle?: string;
  position?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
}

/**
 * Input type for updating lecturer
 */
export interface UpdateLecturerInput extends Partial<CreateLecturerInput> {
  status?: LecturerStatus;
}

// ====================================
// TOPIC TYPES
// ====================================

export type TopicStatus = "Approved" | "Pending" | "Closed";

/**
 * Trạng thái đăng ký của đề tài
 * - OPEN: Mở đăng ký (cho phép sinh viên đăng ký)
 * - FULL: Đã đầy sinh viên
 * - LOCKED: Giảng viên đã khóa/chốt danh sách
 */
export type TopicRegistrationStatus = "OPEN" | "FULL" | "LOCKED";

/**
 * Chuyên ngành (Specialization) - map với Department
 */
export interface Specialization {
  id: string;
  name: string;
  departmentId: string;
}

/**
 * Đề tài (Topic)
 */
export interface Topic {
  id: string;
  name: string;
  englishName?: string;
  description: string;
  objectives?: string;
  technologies?: string;
  lecturerId: number;
  lecturerName: string;
  lecturerEmail: string;
  allowedSpecializationIds: string[]; // Mảng ID chuyên ngành được phép đăng ký
  maxStudents: number;
  registeredCount: number;
  status: TopicStatus;
  registrationStatus: TopicRegistrationStatus; // Trạng thái đăng ký: OPEN, FULL, LOCKED
  createdAt: string;
}

/**
 * Input type for creating topic
 */
export interface CreateTopicInput {
  name: string;
  englishName?: string;
  description: string;
  objectives?: string;
  technologies?: string;
  lecturerId: number;
  allowedSpecializationIds: string[];
  maxStudents: number;
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
