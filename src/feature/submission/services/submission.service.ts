/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
// SUBMISSION — Service
// Giai đoạn 3: Nộp bài cuối kỳ
// ============================================================

import { apiClient } from "@/shared/services/api-client";

const API_BASE = "/submissions";

// ---------- Type Definitions ----------

export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";
export type SubmissionType = "WORD" | "PDF" | "POWERPOINT";

export interface Submission {
  id: number;
  studentId: number;
  projectId: number;
  fileUrl: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  fileType: SubmissionType;
  status: SubmissionStatus;
  submittedAt: string;
  reviewedBy: number | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  studentName?: string;
  studentMssv?: string;
  projectCode?: string;
  projectName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EligibleStudent {
  id: number;
  studentId: string;
  name: string;
  className: string;
  projectCode: string;
  projectName: string;
  email: string;
}

export interface SubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------- API Response Mappers ----------

function mapSubmission(raw: any): Submission {
  return {
    id: raw.id,
    studentId: raw.student_id,
    projectId: raw.project_id,
    fileUrl: raw.file_url,
    fileName: raw.file_name,
    originalName: raw.original_name,
    fileSize: raw.file_size,
    fileType: raw.file_type,
    status: raw.status,
    submittedAt: raw.submitted_at,
    reviewedBy: raw.reviewed_by,
    reviewedAt: raw.reviewed_at,
    rejectionReason: raw.rejection_reason,
    studentName: raw.student_name,
    studentMssv: raw.student_mssv,
    projectCode: raw.project_code,
    projectName: raw.project_name,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

// ---------- Submission Service ----------

class SubmissionService {
  // ==================== SUBMISSIONS ====================

  async getSubmissions(params?: {
    page?: number;
    limit?: number;
    status?: SubmissionStatus;
    studentId?: number;
    projectId?: number;
  }): Promise<PaginatedResult<Submission>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    if (params?.studentId)
      searchParams.set("student_id", String(params.studentId));
    if (params?.projectId)
      searchParams.set("project_id", String(params.projectId));

    const response: any = await apiClient.get(
      `${API_BASE}?${searchParams.toString()}`,
    );
    return {
      data: (response.data || []).map(mapSubmission),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 20,
      totalPages: response.totalPages || 1,
    };
  }

  async getSubmissionById(id: number): Promise<Submission> {
    const response: any = await apiClient.get(`${API_BASE}/${id}`);
    return mapSubmission(response);
  }

  async createSubmission(data: {
    studentId: number;
    projectId: number;
    fileUrl: string;
    fileName: string;
    originalName: string;
    fileSize: number;
    fileType: SubmissionType;
  }): Promise<Submission> {
    const response: any = await apiClient.post(API_BASE, {
      student_id: data.studentId,
      project_id: data.projectId,
      file_url: data.fileUrl,
      file_name: data.fileName,
      original_name: data.originalName,
      file_size: data.fileSize,
      file_type: data.fileType,
    });
    return mapSubmission(response);
  }

  async reviewSubmission(
    id: number,
    reviewerId: number,
    data: {
      status: SubmissionStatus;
      rejectionReason?: string;
    },
  ): Promise<Submission> {
    const response: any = await apiClient.put(`${API_BASE}/${id}/review`, {
      reviewer_id: reviewerId,
      status: data.status,
      rejection_reason: data.rejectionReason,
    });
    return mapSubmission(response);
  }

  // ==================== ELIGIBLE STUDENTS ====================

  async getEligibleStudents(): Promise<EligibleStudent[]> {
    const response: any = await apiClient.get(`${API_BASE}/eligible-students`);
    const students = Array.isArray(response) ? response : response.data || [];
    return students.map((raw: any) => ({
      id: raw.id,
      studentId: raw.student_id,
      name: raw.name,
      className: raw.class_name,
      projectCode: raw.project_code,
      projectName: raw.project_name,
      email: raw.email,
    }));
  }

  // ==================== STATISTICS ====================

  async getStats(): Promise<SubmissionStats> {
    const response: any = await apiClient.get(`${API_BASE}/stats/summary`);
    return {
      total: response.total || 0,
      pending: response.pending || 0,
      approved: response.approved || 0,
      rejected: response.rejected || 0,
    };
  }
}

// ---------- Singleton Export ----------
export const submissionService = new SubmissionService();
export default submissionService;
