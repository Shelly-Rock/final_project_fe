// ============================================================
// TYPES — Registration Period Management Feature
// ============================================================

// Trạng thái đợt đăng ký
export type PeriodStatus = "upcoming" | "open" | "closed";

// Trạng thái đề tài
export type TopicModerationStatus = "pending" | "approved" | "rejected";

// Trạng thái chỉ tiêu GV
export type QuotaStatus = "sufficient" | "insufficient";

// Trạng thái tham gia của GV
export type TeacherParticipationStatus = "assigned" | "accepted" | "declined";

// ============================================================
// INTERFACES
// ============================================================

/**
 * Đợt đăng ký đề tài
 */
export interface RegistrationPeriod {
  id: number;
  name: string;
  semester: "1" | "2" | "3"; // Học kỳ 1, 2, hoặc hè (3)
  schoolYear: string; // Ví dụ: "2025-2026"
  startDate: string; // ISO date string
  teacherDeadline: string; // Hạn nộp đề tài của GV
  studentDeadline: string; // Hạn đăng ký của SV
  defaultQuota: number; // Chỉ tiêu mặc định cho mỗi GV (thường là 3)
  status: PeriodStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Chỉ tiêu của một giảng viên trong đợt
 */
export interface TeacherQuota {
  id: number;
  periodId: number;
  teacherId: number;
  teacherName: string;
  department: string; // Khoa
  assignedQuota: number; // Chỉ tiêu được gán (có thể khác default)
  submittedTopics: number; // Số đề tài đã nộp
  maxStudents: number; // Tổng SV tối đa (thường = assignedQuota)
  status: QuotaStatus;
  lastNotifiedAt?: string;
}

/**
 * Đề tài trong đợt
 */
export interface Topic {
  id: number;
  periodId: number;
  teacherId: number;
  teacherName: string;
  name: string;
  description: string;
  maxStudents: number; // Số lượng SV tối đa đăng ký
  registeredStudents: number; // Số SV đã đăng ký
  status: TopicModerationStatus;
  moderatorNote?: string; // Ghi chú của thư ký
  rejectionReason?: string; // Lý do từ chối
  createdAt: string;
  updatedAt: string;
}

/**
 * GV tham gia đợt
 */
export interface TeacherParticipation {
  id: number;
  periodId: number;
  teacherId: number;
  teacherName: string;
  department: string;
  email: string;
  assignedQuota: number;
  status: TeacherParticipationStatus;
  invitedAt: string;
  respondedAt?: string;
}

// ============================================================
// INPUT TYPES (Create/Update)
// ============================================================

export interface CreatePeriodInput {
  name: string;
  semester: "1" | "2" | "3";
  schoolYear: string;
  startDate: string;
  teacherDeadline: string;
  studentDeadline: string;
  defaultQuota: number;
  description?: string;
}

export interface UpdatePeriodInput extends Partial<CreatePeriodInput> {
  status?: PeriodStatus;
}

export interface UpdateTeacherQuotaInput {
  assignedQuota: number;
}

export interface ApproveTopicInput {
  moderatorNote?: string;
}

export interface RejectTopicInput {
  rejectionReason: string;
  moderatorNote?: string;
}

// ============================================================
// FILTER TYPES
// ============================================================

export interface PeriodFilters {
  search: string;
  semester: string;
  schoolYear: string;
  status: PeriodStatus | "all";
}

// ============================================================
// UTILITY TYPES
// ============================================================

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ImportResult {
  success: number;
  failed: number;
  errors?: string[];
}

// ============================================================
// EXCEPTION REQUEST TYPES
// ============================================================

/**
 * Sinh viên được chỉ định trong yêu cầu ngoại lệ
 */
export interface ExceptionStudent {
  id: number;
  studentId: number;
  studentCode: string;
  studentName: string;
  order: number;
}

/**
 * Yêu cầu ngoại lệ cần Thư ký duyệt
 */
export interface ExceptionRequest {
  id: number;
  topicId: number;
  topicName: string;
  teacherId: number;
  teacherName: string;
  maxStudents: number;
  students: ExceptionStudent[];
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}
