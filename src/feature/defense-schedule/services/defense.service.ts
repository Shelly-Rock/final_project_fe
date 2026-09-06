/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
// DEFENSE SCHEDULE — Service
// Giai đoạn 3: Xếp lịch bảo vệ
// ============================================================

import { apiClient } from "@/shared/services/api-client";

const API_BASE = "/defense-sessions";

// ---------- Type Definitions ----------

export type DefenseSessionStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "RESCHEDULED";
export type CommitteeRole =
  | "CHAIRMAN"
  | "SECRETARY"
  | "INTERNAL_REVIEWER"
  | "EXTERNAL_REVIEWER";

export interface DefenseProject {
  projectId: number;
  projectCode: string;
  projectName: string;
  studentName: string;
  studentMssv: string;
  orderIndex: number;
  scheduledTime: string;
  score: number | null;
  defenseNotes: string | null;
  defendedAt: string | null;
}

export interface DefenseSession {
  id: number;
  committeeId: number;
  committeeName: string;
  defenseDate: string;
  startTime: string;
  endTime: string | null;
  room: string;
  durationMinutes: number;
  status: DefenseSessionStatus;
  projects: DefenseProject[];
  projectCount: number;
  estimatedEndTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleExport {
  documentType: string;
  sessionId: number;
  committeeName: string;
  date: string;
  room: string;
  startTime: string;
  endTime: string | null;
  durationPerTopic: number;
  projects: {
    order: number;
    time: string;
    projectCode: string;
    projectName: string;
    studentName: string;
    studentMssv: string;
  }[];
}

export interface DefenseStats {
  totalSessions: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  totalProjectsDefended: number;
  averageScore: number | null;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------- API Response Mappers ----------

function mapDefenseProject(raw: any): DefenseProject {
  return {
    projectId: raw.project_id,
    projectCode: raw.project_code,
    projectName: raw.project_name,
    studentName: raw.student_name,
    studentMssv: raw.student_mssv,
    orderIndex: raw.order_index,
    scheduledTime: raw.scheduled_time,
    score: raw.score,
    defenseNotes: raw.defense_notes,
    defendedAt: raw.defended_at,
  };
}

function mapDefenseSession(raw: any): DefenseSession {
  return {
    id: raw.id,
    committeeId: raw.committee_id,
    committeeName: raw.committee_name,
    defenseDate: raw.defense_date,
    startTime: raw.start_time,
    endTime: raw.end_time,
    room: raw.room,
    durationMinutes: raw.duration_minutes,
    status: raw.status,
    projects: (raw.projects || []).map(mapDefenseProject),
    projectCount: raw.project_count || 0,
    estimatedEndTime: raw.estimated_end_time,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

// ---------- Defense Service ----------

class DefenseService {
  // ==================== DEFENSE SESSIONS ====================

  async getDefenseSessions(params?: {
    page?: number;
    limit?: number;
    committeeId?: number;
    status?: DefenseSessionStatus;
    defenseDate?: string;
    room?: string;
  }): Promise<PaginatedResult<DefenseSession>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.committeeId)
      searchParams.set("committee_id", String(params.committeeId));
    if (params?.status) searchParams.set("status", params.status);
    if (params?.defenseDate)
      searchParams.set("defense_date", params.defenseDate);
    if (params?.room) searchParams.set("room", params.room);

    const response: any = await apiClient.get(
      `${API_BASE}?${searchParams.toString()}`,
    );
    return {
      data: (response.data || []).map(mapDefenseSession),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 20,
      totalPages: response.totalPages || 1,
    };
  }

  async getDefenseSessionById(id: number): Promise<DefenseSession> {
    const response: any = await apiClient.get(`${API_BASE}/${id}`);
    return mapDefenseSession(response);
  }

  async createDefenseSession(data: {
    committeeId: number;
    defenseDate: string;
    startTime: string;
    room: string;
    durationMinutes?: number;
    projectIds?: number[];
  }): Promise<DefenseSession> {
    const response: any = await apiClient.post(API_BASE, {
      committee_id: data.committeeId,
      defense_date: data.defenseDate,
      start_time: data.startTime,
      room: data.room,
      duration_minutes: data.durationMinutes || 15,
      project_ids: data.projectIds,
    });
    return mapDefenseSession(response);
  }

  async updateDefenseSession(
    id: number,
    data: {
      defenseDate?: string;
      startTime?: string;
      endTime?: string;
      room?: string;
      status?: DefenseSessionStatus;
      durationMinutes?: number;
    },
  ): Promise<DefenseSession> {
    const response: any = await apiClient.put(`${API_BASE}/${id}`, {
      defense_date: data.defenseDate,
      start_time: data.startTime,
      end_time: data.endTime,
      room: data.room,
      status: data.status,
      duration_minutes: data.durationMinutes,
    });
    return mapDefenseSession(response);
  }

  async addProjectsToSession(
    id: number,
    projectIds: number[],
  ): Promise<DefenseSession> {
    const response: any = await apiClient.post(`${API_BASE}/${id}/projects`, {
      project_ids: projectIds,
    });
    return mapDefenseSession(response);
  }

  async removeProjectFromSession(
    id: number,
    projectId: number,
  ): Promise<DefenseSession> {
    const response: any = await apiClient.delete(`${API_BASE}/${id}/projects`, {
      data: { project_id: projectId },
    } as any);
    return mapDefenseSession(response);
  }

  async scoreProject(
    sessionProjectId: number,
    data: {
      teacherId: number;
      role: CommitteeRole;
      score: number;
      notes?: string;
    },
  ): Promise<any> {
    const response: any = await apiClient.post(
      `${API_BASE}/${sessionProjectId}/score`,
      {
        teacher_id: data.teacherId,
        role: data.role,
        score: data.score,
        notes: data.notes,
      },
    );
    return response;
  }

  async completeDefenseSession(id: number): Promise<DefenseSession> {
    const response: any = await apiClient.put(`${API_BASE}/${id}/complete`);
    return mapDefenseSession(response);
  }

  async deleteDefenseSession(id: number): Promise<void> {
    await apiClient.delete(`${API_BASE}/${id}`);
  }

  // ==================== EXPORT ====================

  async exportScheduleWord(sessionId: number): Promise<ScheduleExport> {
    const response: any = await apiClient.get(
      `${API_BASE}/${sessionId}/export`,
    );
    return {
      documentType: response.document_type,
      sessionId: response.session_id,
      committeeName: response.committee_name,
      date: response.date,
      room: response.room,
      startTime: response.start_time,
      endTime: response.end_time,
      durationPerTopic: response.duration_per_topic,
      projects: response.projects.map((p: any) => ({
        order: p.order,
        time: p.time,
        projectCode: p.project_code,
        projectName: p.project_name,
        studentName: p.student_name,
        studentMssv: p.student_mssv,
      })),
    };
  }

  // ==================== STATISTICS ====================

  async getStats(): Promise<DefenseStats> {
    const response: any = await apiClient.get(`${API_BASE}/stats/summary`);
    return {
      totalSessions: response.total_sessions || 0,
      scheduled: response.scheduled || 0,
      completed: response.completed || 0,
      cancelled: response.cancelled || 0,
      totalProjectsDefended: response.total_projects_defended || 0,
      averageScore: response.average_score,
    };
  }
}

// ---------- Singleton Export ----------
export const defenseService = new DefenseService();
export default defenseService;
