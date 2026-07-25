// ============================================================
// TYPES — My Topics Feature (Teacher)
// ============================================================

// Trạng thái đề tài của giảng viên
export type TopicStatus =
  | "Draft"
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Waiting_For_Secretary";

// Trạng thái đăng ký của sinh viên
export type RegistrationStatus = "Pending" | "Approved" | "Rejected";

// ============================================================
// INTERFACES
// ============================================================

/**
 * Sinh viên đăng ký đề tài
 */
export interface RegisteredStudent {
  id: number;
  studentId: number;
  studentName: string;
  studentCode: string;
  status: RegistrationStatus;
  registeredAt: string;
  approvedAt?: string;
  approvedBy?: number;
  rejectedAt?: string;
  rejectedBy?: number;
  rejectionReason?: string;
}

/**
 * Sinh viên được gán trước vào đề tài (pre-assigned)
 */
export interface PreAssignedStudent {
  id: number;
  studentId: number;
  studentName: string;
  studentCode: string;
  order: number;
}

/**
 * Đề tài của giảng viên
 */
export interface MyTopic {
  id: number;
  periodId: number;
  periodName: string;
  name: string;
  description: string;
  maxStudents: number;
  status: TopicStatus;
  isException: boolean;
  rejectionReason?: string;
  preAssignedStudents: PreAssignedStudent[];
  registeredStudents: RegisteredStudent[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Yêu cầu đăng ký chờ duyệt
 */
export interface PendingRequest {
  id: number;
  studentId: number;
  studentName: string;
  studentCode: string;
  topicId: number;
  topicName: string;
  requestedAt: string;
  status: "Pending";
}

/**
 * Sinh viên (tìm kiếm)
 */
export interface Student {
  id: number;
  code: string;
  name: string;
  email: string;
  className: string;
}

// ============================================================
// INPUT TYPES
// ============================================================

export interface CreateTopicInput {
  name: string;
  description: string;
  periodId: number;
  maxStudents: number;
  preAssignedStudentIds?: number[];
  isException?: boolean;
}

export interface UpdateTopicInput extends Partial<CreateTopicInput> {
  status?: TopicStatus;
}

export interface ApproveRegistrationInput {
  topicId: number;
  studentId: number;
}

export interface RejectRegistrationInput {
  topicId: number;
  studentId: number;
  reason: string;
}

// ============================================================
// FILTER & PAGINATION
// ============================================================

export interface TopicFilters {
  search: string;
  status: TopicStatus | "all";
}

export interface PaginatedTopics {
  data: MyTopic[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
