/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
// COMMITTEE — Service
// Giai đoạn 3: Thành lập Hội đồng
// ============================================================

import { apiClient } from "@/shared/services/api-client";

const API_BASE = "/committees";

// ---------- Type Definitions ----------

export type CommitteeRole =
  | "CHAIRMAN"
  | "SECRETARY"
  | "INTERNAL_REVIEWER"
  | "EXTERNAL_REVIEWER";

export const CommitteeRoleLabels: Record<CommitteeRole, string> = {
  CHAIRMAN: "Chủ tịch",
  SECRETARY: "Thư ký",
  INTERNAL_REVIEWER: "Phản biện trong",
  EXTERNAL_REVIEWER: "Phản biện ngoài",
};

export interface ExternalReviewer {
  id: number;
  teacherId: string;
  name: string;
  email: string;
}

export interface CommitteeMember {
  id: number;
  name: string;
  teacherId: string;
  role: CommitteeRole;
  roleLabel: string;
}

export interface Committee {
  id: number;
  name: string;
  chairmanId: number | null;
  chairmanName: string | null;
  secretaryId: number | null;
  secretaryName: string | null;
  internal1Id: number | null;
  internal1Name: string | null;
  internal2Id: number | null;
  internal2Name: string | null;
  externalReviewers: ExternalReviewer[];
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherBasic {
  id: number;
  teacherId: string;
  name: string;
  email: string;
  department: string | null;
  faculty: string | null;
}

export interface CommitteeStats {
  totalCommittees: number;
  committeesWithFullMembers: number;
  committeesMissingMembers: number;
  totalExternalReviewers: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------- API Response Mappers ----------

function mapCommittee(raw: any): Committee {
  return {
    id: raw.id,
    name: raw.name,
    chairmanId: raw.chairman_id,
    chairmanName: raw.chairman_name,
    secretaryId: raw.secretary_id,
    secretaryName: raw.secretary_name,
    internal1Id: raw.internal_1_id,
    internal1Name: raw.internal_1_name,
    internal2Id: raw.internal_2_id,
    internal2Name: raw.internal_2_name,
    externalReviewers: (raw.external_reviewers || []).map((er: any) => ({
      id: er.id,
      teacherId: er.teacher_id,
      name: er.name,
      email: er.email,
    })),
    memberCount: raw.member_count || 0,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function mapTeacher(raw: any): TeacherBasic {
  return {
    id: raw.id,
    teacherId: raw.teacher_id,
    name: raw.name,
    email: raw.email,
    department: raw.department,
    faculty: raw.faculty,
  };
}

// ---------- Committee Service ----------

class CommitteeService {
  // ==================== COMMITTEES ====================

  async getCommittees(params?: {
    page?: number;
    limit?: number;
    name?: string;
  }): Promise<PaginatedResult<Committee>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.name) searchParams.set("name", params.name);

    const response: any = await apiClient.get(
      `${API_BASE}?${searchParams.toString()}`,
    );
    return {
      data: (response.data || []).map(mapCommittee),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 20,
      totalPages: response.totalPages || 1,
    };
  }

  async getCommitteeById(id: number): Promise<Committee> {
    const response: any = await apiClient.get(`${API_BASE}/${id}`);
    return mapCommittee(response);
  }

  async createCommittee(data: {
    name: string;
    chairmanId?: number;
    secretaryId?: number;
    internal1Id?: number;
    internal2Id?: number;
    externalReviewerIds?: number[];
  }): Promise<Committee> {
    const response: any = await apiClient.post(API_BASE, {
      name: data.name,
      chairman_id: data.chairmanId,
      secretary_id: data.secretaryId,
      internal_1_id: data.internal1Id,
      internal_2_id: data.internal2Id,
      external_reviewer_ids: data.externalReviewerIds,
    });
    return mapCommittee(response);
  }

  async updateCommittee(
    id: number,
    data: {
      name?: string;
      chairmanId?: number;
      secretaryId?: number;
      internal1Id?: number;
      internal2Id?: number;
      externalReviewerIds?: number[];
    },
  ): Promise<Committee> {
    const response: any = await apiClient.put(`${API_BASE}/${id}`, {
      name: data.name,
      chairman_id: data.chairmanId,
      secretary_id: data.secretaryId,
      internal_1_id: data.internal1Id,
      internal_2_id: data.internal2Id,
      external_reviewer_ids: data.externalReviewerIds,
    });
    return mapCommittee(response);
  }

  async deleteCommittee(id: number): Promise<void> {
    await apiClient.delete(`${API_BASE}/${id}`);
  }

  // ==================== TEACHERS ====================

  async getAvailableTeachers(): Promise<TeacherBasic[]> {
    const response: any = await apiClient.get(`${API_BASE}/teachers/available`);
    const teachers = Array.isArray(response) ? response : response.data || [];
    return teachers.map(mapTeacher);
  }

  async getExternalReviewers(): Promise<TeacherBasic[]> {
    const response: any = await apiClient.get(
      `${API_BASE}/teachers/external-reviewers`,
    );
    const teachers = Array.isArray(response) ? response : response.data || [];
    return teachers.map(mapTeacher);
  }

  async getExcludedTeachers(committeeId?: number): Promise<number[]> {
    const url = committeeId
      ? `${API_BASE}/teachers/excluded?committee_id=${committeeId}`
      : `${API_BASE}/teachers/excluded`;
    const response: any = await apiClient.get(url);
    return Array.isArray(response) ? response : [];
  }

  // ==================== STATISTICS ====================

  async getStats(): Promise<CommitteeStats> {
    const response: any = await apiClient.get(`${API_BASE}/stats/summary`);
    return {
      totalCommittees: response.total_committees || 0,
      committeesWithFullMembers: response.committees_with_full_members || 0,
      committeesMissingMembers: response.committees_missing_members || 0,
      totalExternalReviewers: response.total_external_reviewers || 0,
    };
  }
}

// ---------- Singleton Export ----------
export const committeeService = new CommitteeService();
export default committeeService;
