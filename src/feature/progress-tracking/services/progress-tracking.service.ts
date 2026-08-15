/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
// PROGRESS TRACKING — Service
// Giai đoạn 2: Theo dõi tiến trình thực hiện
// ============================================================

import { apiClient } from "@/shared/services/api-client";

const API_BASE = "/progress-tracking";

// ---------- Type Definitions ----------

export type TemplateType =
  | "MONTHLY_REPORT"
  | "MIDTERM_REPORT"
  | "FINAL_REPORT"
  | "PROPOSAL"
  | "PRESENTATION";
export type ReportStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "REVISION_REQUESTED";
export type ProgressStatus =
  | "ON_TRACK"
  | "EXTENDED"
  | "TOPIC_CHANGED"
  | "BANNED";
export type NotificationType =
  | "STATUS_CHANGED"
  | "REPORT_SUBMITTED"
  | "REPORT_APPROVED"
  | "REPORT_REJECTED"
  | "BAN_APPLIED"
  | "BAN_WARNING";

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

export interface BanWarning {
  studentId: number;
  studentName: string;
  daysUntilBan: number;
  reportsSubmitted: number;
  reportsRequired: number;
}

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

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------- API Response Mappers ----------

function mapTemplate(raw: any): Template {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    type: raw.type,
    fileUrl: raw.file_url,
    fileName: raw.file_name,
    fileSize: raw.file_size,
    teacherId: raw.teacher_id,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function mapReport(raw: any): ProgressReport {
  return {
    id: raw.id,
    title: raw.title,
    content: raw.content,
    fileUrl: raw.file_url,
    fileName: raw.file_name,
    month: raw.month,
    year: raw.year,
    status: raw.status,
    feedback: raw.feedback,
    score: raw.score,
    studentId: raw.student_id,
    teacherId: raw.teacher_id,
    studentName: raw.student_name,
    teacherName: raw.teacher_name,
    reviewedBy: raw.reviewed_by,
    reviewedAt: raw.reviewed_at,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function mapProgress(raw: any): StudentProgress {
  return {
    id: raw.id,
    studentId: raw.student_id,
    studentName: raw.student_name,
    studentMssv: raw.student_mssv,
    topicName: raw.topic_name,
    teacherId: raw.teacher_id,
    teacherName: raw.teacher_name,
    status: raw.status,
    isBanned: raw.is_banned,
    banReason: raw.ban_reason,
    bannedAt: raw.banned_at,
    totalReportsRequired: raw.total_reports_required,
    totalReportsSubmitted: raw.total_reports_submitted,
    nextDeadline: raw.next_deadline,
    lastReportDate: raw.last_report_date,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function mapNotification(raw: any): Notification {
  return {
    id: raw.id,
    type: raw.type,
    title: raw.title,
    message: raw.message,
    isRead: raw.is_read,
    senderId: raw.sender_id,
    recipientId: raw.recipient_id,
    relatedStudentId: raw.related_student_id,
    relatedReportId: raw.related_report_id,
    createdAt: raw.created_at,
  };
}

function mapStats(raw: any): ProgressStatistics {
  return {
    totalStudents: raw.total_students || 0,
    onTrackStudents: raw.on_track || 0,
    extendedStudents: raw.extended || 0,
    topicChangedStudents: raw.topic_changed || 0,
    bannedStudents: raw.banned || 0,
    pendingReports: raw.pending_reports || 0,
    overdueReports: 0,
    averageReportsPerStudent: 0,
    complianceRate: 0,
  };
}

// ---------- Progress Tracking Service ----------

class ProgressTrackingService {
  // ==================== TEMPLATES ====================

  async getTemplates(params?: {
    page?: number;
    limit?: number;
    type?: TemplateType;
    teacherId?: number;
  }): Promise<PaginatedResult<Template>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.type) searchParams.set("type", params.type);
    if (params?.teacherId)
      searchParams.set("teacher_id", String(params.teacherId));

    const response: any = await apiClient.get(
      `${API_BASE}/templates?${searchParams.toString()}`,
    );
    return {
      data: (response.data || []).map(mapTemplate),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 20,
      totalPages: response.totalPages || 1,
    };
  }

  async getTemplateById(id: number): Promise<Template> {
    const response: any = await apiClient.get(`${API_BASE}/templates/${id}`);
    return mapTemplate(response);
  }

  async createTemplate(data: {
    teacherId: number;
    name: string;
    description?: string;
    type: TemplateType;
    fileUrl: string;
    fileName: string;
    fileSize: number;
  }): Promise<Template> {
    const response: any = await apiClient.post(`${API_BASE}/templates`, {
      teacher_id: data.teacherId,
      name: data.name,
      description: data.description,
      type: data.type,
      file_url: data.fileUrl,
      file_name: data.fileName,
      file_size: data.fileSize,
    });
    return mapTemplate(response);
  }

  async deleteTemplate(id: number): Promise<void> {
    await apiClient.delete(`${API_BASE}/templates/${id}`);
  }

  // ==================== REPORTS ====================

  async getReports(params?: {
    page?: number;
    limit?: number;
    status?: ReportStatus;
    studentId?: number;
    teacherId?: number;
  }): Promise<PaginatedResult<ProgressReport>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    if (params?.studentId)
      searchParams.set("student_id", String(params.studentId));
    if (params?.teacherId)
      searchParams.set("teacher_id", String(params.teacherId));

    const response: any = await apiClient.get(
      `${API_BASE}/reports?${searchParams.toString()}`,
    );
    return {
      data: (response.data || []).map(mapReport),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 20,
      totalPages: response.totalPages || 1,
    };
  }

  async getReportById(id: number): Promise<ProgressReport> {
    const response: any = await apiClient.get(`${API_BASE}/reports/${id}`);
    return mapReport(response);
  }

  async submitReport(data: {
    studentId: number;
    title: string;
    content: string;
    month: number;
    year: number;
    fileUrl?: string;
    fileName?: string;
  }): Promise<ProgressReport> {
    const response: any = await apiClient.post(`${API_BASE}/reports`, {
      student_id: data.studentId,
      title: data.title,
      content: data.content,
      month: data.month,
      year: data.year,
      file_url: data.fileUrl,
      file_name: data.fileName,
    });
    return mapReport(response);
  }

  async reviewReport(data: {
    reportId: number;
    reviewerId: number;
    status: ReportStatus;
    feedback?: string;
    score?: number;
  }): Promise<ProgressReport> {
    const response: any = await apiClient.put(
      `${API_BASE}/reports/${data.reportId}/review`,
      {
        reviewer_id: data.reviewerId,
        status: data.status,
        feedback: data.feedback,
        score: data.score,
      },
    );
    return mapReport(response);
  }

  // ==================== STUDENT PROGRESS ====================

  async getStudentProgress(params?: {
    page?: number;
    limit?: number;
    status?: ProgressStatus;
    isBanned?: boolean;
    teacherId?: number;
  }): Promise<PaginatedResult<StudentProgress>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    if (params?.isBanned !== undefined)
      searchParams.set("is_banned", String(params.isBanned));
    if (params?.teacherId)
      searchParams.set("teacher_id", String(params.teacherId));

    const response: any = await apiClient.get(
      `${API_BASE}/students/progress?${searchParams.toString()}`,
    );
    return {
      data: (response.data || []).map(mapProgress),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 20,
      totalPages: response.totalPages || 1,
    };
  }

  async getStudentProgressById(studentId: number): Promise<StudentProgress> {
    const response: any = await apiClient.get(
      `${API_BASE}/students/${studentId}/progress`,
    );
    return mapProgress(response);
  }

  async updateStudentProgress(
    studentId: number,
    data: {
      status?: ProgressStatus;
      banReason?: string;
      totalReportsRequired?: number;
      nextDeadline?: string;
    },
  ): Promise<StudentProgress> {
    const response: any = await apiClient.put(
      `${API_BASE}/students/${studentId}/progress`,
      {
        status: data.status,
        ban_reason: data.banReason,
        total_reports_required: data.totalReportsRequired,
        next_deadline: data.nextDeadline,
      },
    );
    return mapProgress(response);
  }

  async getOrCreateStudentProgress(
    studentId: number,
  ): Promise<StudentProgress> {
    const response: any = await apiClient.get(
      `${API_BASE}/students/${studentId}/progress`,
    );
    return mapProgress(response);
  }

  // ==================== NOTIFICATIONS ====================

  async getNotifications(params: {
    recipientId: number;
    page?: number;
    limit?: number;
    isRead?: boolean;
    type?: NotificationType;
  }): Promise<PaginatedResult<Notification>> {
    const searchParams = new URLSearchParams();
    searchParams.set("recipient_id", String(params.recipientId));
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.isRead !== undefined)
      searchParams.set("is_read", String(params.isRead));
    if (params?.type) searchParams.set("type", params.type);

    const response: any = await apiClient.get(
      `${API_BASE}/notifications?${searchParams.toString()}`,
    );
    return {
      data: (response.data || []).map(mapNotification),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 20,
      totalPages: response.totalPages || 1,
    };
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await apiClient.put(`${API_BASE}/notifications/${id}/read`);
  }

  async markAllNotificationsAsRead(recipientId: number): Promise<void> {
    await apiClient.put(
      `${API_BASE}/notifications/read-all?recipient_id=${recipientId}`,
    );
  }

  async getUnreadNotificationCount(recipientId: number): Promise<number> {
    const response: any = await apiClient.get(
      `${API_BASE}/notifications/unread-count?recipient_id=${recipientId}`,
    );
    return typeof response === "number" ? response : 0;
  }

  async createNotification(data: {
    type: NotificationType;
    title: string;
    message: string;
    senderId?: number;
    recipientId: number;
    relatedStudentId?: number;
    relatedReportId?: number;
  }): Promise<Notification> {
    const response: any = await apiClient.post(`${API_BASE}/notifications`, {
      type: data.type,
      title: data.title,
      message: data.message,
      sender_id: data.senderId,
      recipient_id: data.recipientId,
      related_student_id: data.relatedStudentId,
      related_report_id: data.relatedReportId,
    });
    return mapNotification(response);
  }

  // ==================== STATISTICS ====================

  async getStatistics(): Promise<ProgressStatistics> {
    const response: any = await apiClient.get(`${API_BASE}/stats`);
    return mapStats(response);
  }

  async getBanWarnings(): Promise<BanWarning[]> {
    const response: any = await apiClient.get(`${API_BASE}/stats/ban-warnings`);
    const warnings = Array.isArray(response) ? response : response.data || [];
    return warnings.map((raw: any) => ({
      studentId: raw.student_id,
      studentName: raw.student_name,
      daysUntilBan: raw.days_until_ban,
      reportsSubmitted: raw.reports_submitted,
      reportsRequired: raw.reports_required,
    }));
  }

  async getBannedStudents(): Promise<StudentProgress[]> {
    const response: any = await apiClient.get(
      `${API_BASE}/stats/banned-students`,
    );
    const students = Array.isArray(response) ? response : response.data || [];
    return students.map(mapProgress);
  }

  // ==================== ADMIN ACTIONS ====================

  async checkAndBanInactiveStudents(): Promise<number[]> {
    const response: any = await apiClient.post(`${API_BASE}/admin/check-bans`);
    return Array.isArray(response) ? response : [];
  }
}

// ---------- Singleton Export ----------
export const progressTrackingService = new ProgressTrackingService();
export default progressTrackingService;
