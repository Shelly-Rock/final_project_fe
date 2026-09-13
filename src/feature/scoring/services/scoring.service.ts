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

export type MeetingFinalStatus =
  | "PASSED"
  | "REJECTED_DEFENSE"
  | "REJECTED_GVHD";

export interface MeetingListItem {
  projectId: number;
  projectCode: string;
  projectName: string;
  student: {
    studentId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    className: string;
  } | null;
  scoredCount: number;
  totalCount: number;
  defenseAverage: number | null;
  finalScore: number | null;
  finalStatus: string | null;
  isFinalized: boolean;
}

export interface MeetingCommitteeScore {
  id: number;
  teacherId: number;
  teacherName: string;
  teacherCode: string;
  role: CommitteeRole | null;
  score: number | null;
  maxScore: number;
  criteriaScores: Record<string, number> | null;
  status: ScoringStatus;
  notes: string | null;
  strengths: string | null;
  weaknesses: string | null;
  submittedAt: string | null;
  canEdit: boolean;
}

export interface MeetingDetail {
  projectId: number;
  projectCode: string;
  projectName: string;
  student: {
    studentId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    className: string;
  } | null;
  gvhdScore: {
    id: number;
    teacherId: number;
    teacherName: string;
    score: number | null;
    status: ScoringStatus;
    notes: string | null;
  } | null;
  committeeScores: MeetingCommitteeScore[];
  defenseAverage: number | null;
  finalScorePreview: number | null;
  gvhdPassed: boolean | null;
  finalStatus: string | null;
  isFinalPassed: boolean;
  isFinalized: boolean;
  canEditAll: boolean;
  canFinalize: boolean;
  currentTeacherId: number | null;
}

export const getMeetings = async (
  params?: Partial<{ page: number; limit: number; finalized: boolean }>,
): Promise<PaginatedResponse<MeetingListItem>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.limit) queryParams.set("limit", params.limit.toString());
  if (params?.finalized !== undefined) {
    queryParams.set("finalized", String(params.finalized));
  }
  return apiClient.get(`${API_BASE}/meetings?${queryParams.toString()}`);
};

export const getMeeting = async (projectId: number): Promise<MeetingDetail> => {
  return apiClient.get(`${API_BASE}/meetings/${projectId}`);
};

export const adjustMeetingScore = async (
  scoreId: number,
  data: {
    score: number;
    maxScore?: number;
    criteriaScores?: Record<string, number>;
    notes?: string;
    strengths?: string;
    weaknesses?: string;
  },
): Promise<MeetingCommitteeScore> => {
  return apiClient.put(`${API_BASE}/meetings/${scoreId}`, data);
};

export const finalizeMeeting = async (
  projectId: number,
): Promise<{
  projectId: number;
  defenseScore: number | null;
  finalScore: number | null;
  isFinalPassed: boolean;
  finalStatus: string | null;
  isFinalized: boolean;
}> => {
  return apiClient.post(`${API_BASE}/meetings/${projectId}/finalize`);
};

export interface TranscriptComment {
  teacherName: string;
  role: CommitteeRole | null;
  notes: string | null;
  strengths: string | null;
  weaknesses: string | null;
}

export interface TranscriptDetail {
  projectId: number;
  projectCode: string;
  projectName: string;
  student: {
    studentId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    className: string;
  } | null;
  isFinalized: boolean;
  finalStatus: string | null;
  isFinalPassed: boolean;
  gvhdScore: number;
  gvhdPassed: boolean;
  externalScore: number;
  externalTeacherName: string;
  otherScores: Array<{
    teacherName: string;
    teacherCode: string;
    role: CommitteeRole | null;
    score: number | null;
  }>;
  othersAverage: number;
  defenseAverage: number;
  failedCount: number;
  weightedScore: number;
  bonusScore: number;
  bonusNote: string | null;
  finalScore: number;
  comments: TranscriptComment[];
  isPublished: boolean;
  publishedAt: string | null;
  canAwardBonus?: boolean;
  canPublish?: boolean;
}

export const getTranscripts = async (
  params?: Partial<{ page: number; limit: number; published: boolean }>,
): Promise<PaginatedResponse<TranscriptDetail>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.limit) queryParams.set("limit", params.limit.toString());
  if (params?.published !== undefined) {
    queryParams.set("published", String(params.published));
  }
  return apiClient.get(`${API_BASE}/transcripts?${queryParams.toString()}`);
};

export const getTranscript = async (
  projectId: number,
): Promise<TranscriptDetail> => {
  return apiClient.get(`${API_BASE}/transcripts/${projectId}`);
};

export const updateBonusScore = async (
  projectId: number,
  data: { bonusScore: number; bonusNote?: string },
): Promise<TranscriptDetail> => {
  return apiClient.put(`${API_BASE}/transcripts/${projectId}/bonus`, data);
};

export const publishTranscript = async (
  projectId: number,
): Promise<TranscriptDetail> => {
  return apiClient.post(`${API_BASE}/transcripts/${projectId}/publish`);
};

export const getMyTranscript = async (): Promise<TranscriptDetail> => {
  return apiClient.get(`${API_BASE}/transcripts/me`);
};

export interface PostDefenseRow {
  projectId: number;
  projectCode: string;
  projectName: string;
  student: {
    studentId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    className: string;
  } | null;
  finalScore: number | null;
  bonusScore: number;
  rank: number | null;
  rankOverride: number | null;
  rankNote: string | null;
  revisionDeadline: string;
  revisionCount: number;
  latestRevisionFile: string | null;
}

export interface StudentRevisionDetail extends TranscriptDetail {
  revisionDeadline: string;
  canSubmitRevision: boolean;
  revision: {
    id: number;
    fileName: string;
    fileUrl: string;
    submittedAt: string;
    note: string | null;
  } | null;
}

export const getPostDefenseList = async (
  params?: Partial<{ page: number; limit: number }>,
): Promise<PaginatedResponse<PostDefenseRow>> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.limit) queryParams.set("limit", params.limit.toString());
  return apiClient.get(`${API_BASE}/post-defense?${queryParams.toString()}`);
};

export const computeRankings = async (): Promise<{
  total: number;
  rankedAt: string;
}> => {
  return apiClient.post(`${API_BASE}/post-defense/rank`);
};

export const updateRank = async (
  projectId: number,
  data: { rankOverride: number; rankNote?: string },
): Promise<{ projectId: number; rank: number; rankOverride: number }> => {
  return apiClient.put(`${API_BASE}/post-defense/${projectId}/rank`, data);
};

export const setRevisionWindow = async (
  projectId: number,
  revisionDeadline: string,
): Promise<{ projectId: number; revisionDeadline: string }> => {
  return apiClient.put(
    `${API_BASE}/post-defense/${projectId}/revision-window`,
    { revisionDeadline },
  );
};

export const getPrintSheet = async (): Promise<{
  data: PostDefenseRow[];
  generatedAt: string;
}> => {
  return apiClient.get(`${API_BASE}/post-defense/print`);
};

export const getMyRevision = async (): Promise<StudentRevisionDetail> => {
  return apiClient.get(`${API_BASE}/revisions/me`);
};

export const submitRevision = async (data: {
  fileUrl: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  note?: string;
}): Promise<unknown> => {
  return apiClient.post(`${API_BASE}/revisions/me`, data);
};
