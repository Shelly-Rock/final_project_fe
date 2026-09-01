// ============================================================
// PROGRESS TRACKING — Domain Types
// Giai đoạn 2: Theo dõi tiến trình thực hiện
// ============================================================

// ---------- Enums ----------

/** Trạng thái tiến độ của đề tài */
export type ProgressStatus =
  | "ON_TRACK"
  | "EXTENDED"
  | "TOPIC_CHANGED"
  | "BANNED";

/** Trạng thái báo cáo */
export type ReportStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "REVISION_REQUESTED";

/** Loại template */
export type TemplateType =
  | "MONTHLY_REPORT"
  | "MIDTERM_REPORT"
  | "FINAL_REPORT"
  | "PROPOSAL"
  | "PRESENTATION";

/** Loại thông báo */
export type NotificationType =
  | "STATUS_CHANGED"
  | "REPORT_SUBMITTED"
  | "REPORT_APPROVED"
  | "REPORT_REJECTED"
  | "BAN_APPLIED"
  | "BAN_WARNING";

// ---------- Core Entities ----------

/** Thông tin template do giảng viên cung cấp */
export interface Template {
  id: number;
  name: string;
  description: string | null;
  type: TemplateType;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  teacherId: number;
  createdAt: string;
  updatedAt: string;
}

/** Báo cáo tiến độ do sinh viên nộp */
export interface ProgressReport {
  id: number;
  title: string;
  content: string;
  fileUrl: string | null;
  fileName: string | null;
  month: number;
  year: number;
  status: ReportStatus;
  feedback: string | null;
  score: number | null;
  studentId: number;
  teacherId: number;
  studentName?: string;
  teacherName?: string;
  reviewedBy: number | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Tiến độ theo dõi của sinh viên */
export interface StudentProgress {
  id: number;
  studentId: number;
  studentName?: string;
  studentMssv?: string;
  topicName?: string;
  teacherId: number;
  teacherName?: string;
  status: ProgressStatus;
  isBanned: boolean;
  banReason: string | null;
  bannedAt: string | null;
  totalReportsRequired: number;
  totalReportsSubmitted: number;
  nextDeadline: string | null;
  lastReportDate: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Thông báo */
export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  senderId: number | null;
  recipientId: number;
  relatedStudentId: number | null;
  relatedReportId: number | null;
  createdAt: string;
}

/** Cảnh báo sắp cấm thi */
export interface BanWarning {
  studentId: number;
  studentName: string;
  daysUntilBan: number;
  reportsSubmitted: number;
  reportsRequired: number;
}

// ---------- Statistics ----------

export interface ProgressStatistics {
  totalStudents: number;
  onTrackStudents: number;
  extendedStudents: number;
  topicChangedStudents: number;
  bannedStudents: number;
  pendingReports: number;
  overdueReports: number;
  averageReportsPerStudent: number;
  complianceRate: number;
}

// ---------- Pagination ----------

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
