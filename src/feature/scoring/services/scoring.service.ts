/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
// SCORING — Service
// Giai đoạn 4: Chấm điểm độc lập (Phiếu chấm)
// ============================================================

import { apiClient } from "@/shared/services/api-client";

const API_BASE = "/scores";

// ---------- Type Definitions ----------

export type ScoringType = "GVHD" | "COMMITTEE";
export type ScoringStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "FAILED"
  | "PASSED";
export type CommitteeRole =
  | "CHAIRMAN"
  | "SECRETARY"
  | "INTERNAL_REVIEWER"
  | "EXTERNAL_REVIEWER";

export const ScoringTypeLabels: Record<ScoringType, string> = {
  GVHD: "Giảng viên hướng dẫn",
  COMMITTEE: "Hội đồng chấm",
};

export const ScoringStatusLabels: Record<ScoringStatus, string> = {
  PENDING: "Chưa chấm",
  IN_PROGRESS: "Đang chấm",
  SUBMITTED: "Đã nộp",
  FAILED: "Rớt",
  PASSED: "Đạt",
};

export const CommitteeRoleLabels: Record<CommitteeRole, string> = {
  CHAIRMAN: "Chủ tịch",
  SECRETARY: "Thư ký",
  INTERNAL_REVIEWER: "Phản biện trong",
  EXTERNAL_REVIEWER: "Phản biện ngoài",
};

// Criteria for scoring
export const ScoringCriteria = [
  { key: "content", label: "Nội dung", weight: 30 },
  { key: "methodology", label: "Phương pháp nghiên cứu", weight: 25 },
  { key: "results", label: "Kết quả đạt được", weight: 20 },
  { key: "presentation", label: "Trình bày", weight: 15 },
  { key: "references", label: "Tài liệu tham khảo", weight: 10 },
];

export interface Score {
  id: number;
  projectId: number;
  studentId: number;
  teacherId: number;
  scoringType: ScoringType;
  role: CommitteeRole | null;
  score: number | null;
  maxScore: number;
  criteriaScores: Record<string, number> | null;
  status: ScoringStatus;
  deadline: string | null;
  submittedAt: string | null;
  notes: string | null;
  strengths: string | null;
  weaknesses: string | null;
  createdAt: string;
  updatedAt: string;
  project?: {
    projectId: string;
    projectCode: string;
    projectName: string;
  };
  student?: {
    studentId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    className: string;
  };
  teacher?: {
    teacherId: string;
    name: string;
  };
}

export interface ScoringResult {
  id: number;
  projectId: number;
  studentId: number;
  gvhdScore: number | null;
  gvhdPassed: boolean;
  committeeScores: CommitteeScore[];
  totalCommitteeScores: number;
  failedCount: number;
  isEliminated: boolean;
  isGvhdFailed: boolean;
  finalStatus: string | null;
  scoreSheetUrl: string | null;
  project?: {
    projectId: string;
    projectCode: string;
    projectName: string;
  };
  student?: {
    studentId: string;
    firstName: string;
    middleName: string;
    lastName: string;
  };
}

export interface CommitteeScore {
  role: CommitteeRole;
  teacherId: number;
  teacherName: string;
  score: number | null;
  passed: boolean;
}

export interface ScoringStats {
  total: number;
  pending: number;
  submitted: number;
  failed: number;
  passed: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ---------- API Functions ----------

// Get my assigned scores (for teachers)
export const getMyScores = async (
  params?: Partial<{
    page: number;
    limit: number;
    status: ScoringStatus;
    scoringType: ScoringType;
  }>,
): Promise<PaginatedResponse<Score>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.limit) queryParams.set("limit", params.limit.toString());
  if (params?.status) queryParams.set("status", params.status);
  if (params?.scoringType) queryParams.set("scoringType", params.scoringType);

  return apiClient.get(`${API_BASE}/my?${queryParams.toString()}`);
};

// Get my scoring statistics
export const getMyStats = async (): Promise<ScoringStats> => {
  return apiClient.get(`${API_BASE}/my/stats`);
};

// Get my score by ID
export const getMyScoreById = async (id: number): Promise<Score> => {
  return apiClient.get(`${API_BASE}/my/${id}`);
};

// Update my score (draft)
export const updateMyScore = async (
  id: number,
  data: {
    score?: number;
    maxScore?: number;
    criteriaScores?: Record<string, number>;
    status?: ScoringStatus;
    notes?: string;
    strengths?: string;
    weaknesses?: string;
  },
): Promise<Score> => {
  return apiClient.put(`${API_BASE}/my/${id}`, data);
};

// Submit my score
export const submitMyScore = async (
  id: number,
  data: {
    score: number;
    maxScore?: number;
    criteriaScores?: Record<string, number>;
    notes?: string;
    strengths?: string;
    weaknesses?: string;
  },
): Promise<Score> => {
  return apiClient.post(`${API_BASE}/my/${id}/submit`, data);
};

// ============ ADMIN FUNCTIONS ============

// Get all scores
export const getAllScores = async (
  params?: Partial<{
    page: number;
    limit: number;
    scoringType: ScoringType;
    status: ScoringStatus;
    teacherId: number;
    projectId: number;
    studentId: number;
  }>,
): Promise<PaginatedResponse<Score>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.limit) queryParams.set("limit", params.limit.toString());
  if (params?.scoringType) queryParams.set("scoringType", params.scoringType);
  if (params?.status) queryParams.set("status", params.status);
  if (params?.teacherId)
    queryParams.set("teacherId", params.teacherId.toString());
  if (params?.projectId)
    queryParams.set("projectId", params.projectId.toString());
  if (params?.studentId)
    queryParams.set("studentId", params.studentId.toString());

  return apiClient.get(`${API_BASE}?${queryParams.toString()}`);
};

// Get all scoring results
export const getAllResults = async (
  params?: Partial<{ page: number; limit: number }>,
): Promise<
  PaginatedResponse<ScoringResult & { project?: any; student?: any }>
> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.limit) queryParams.set("limit", params.limit.toString());

  return apiClient.get(`${API_BASE}/results?${queryParams.toString()}`);
};

// Get scoring result by project
export const getResultByProject = async (
  projectId: number,
): Promise<ScoringResult | null> => {
  return apiClient.get(`${API_BASE}/results/${projectId}`);
};

// Get scores by project
export const getScoresByProject = async (
  projectId: number,
): Promise<Score[]> => {
  return apiClient.get(`${API_BASE}/project/${projectId}`);
};

// Get score by ID
export const getScoreById = async (id: number): Promise<Score> => {
  return apiClient.get(`${API_BASE}/${id}`);
};

// Create score assignment
export const createScore = async (data: {
  projectId: number;
  studentId: number;
  teacherId: number;
  scoringType: ScoringType;
  role?: CommitteeRole;
}): Promise<Score> => {
  return apiClient.post(API_BASE, data);
};

// Delete score
export const deleteScore = async (id: number): Promise<void> => {
  return apiClient.delete(`${API_BASE}/${id}`);
};

// Assign scores to committee members
export const assignScoresToCommittee = async (
  sessionProjectId: number,
  committeeId: number,
): Promise<void> => {
  return apiClient.post(`${API_BASE}/assign/${sessionProjectId}`, {
    committeeId,
  });
};
