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
  teacherId: number | null;
  topicId: number | null;
  topicName: string | null;
  topicCode: string | null;
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

export interface AvailableGroupForDefense {
  key: string;
  topicId: number | null;
  id: number;
  projectCode?: string;
  name: string;
  projectIds: number[];
  supervisorIds: number[];
  studentNames: string;
  studentMssvs: string;
  students: { name: string; mssv: string }[];
}

interface AvailableGroupRaw {
  key: string;
  topicId: number | null;
  id: number;
  projectCode?: string;
  name: string;
  projectIds: number[];
  supervisorIds: number[];
  studentNames: string;
  studentMssvs: string;
  students: { name: string; mssv: string }[];
}

interface DefenseSessionsEnvelope {
  data?: DefenseSessionEnvelope[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

interface DefenseSessionEnvelope {
  id: number;
  committee_id: number;
  committee_name: string;
  defense_date: string;
  start_time: string;
  end_time: string | null;
  room: string;
  duration_minutes: number;
  status: DefenseSessionStatus;
  projects?: DefenseProjectEnvelope[];
  project_count?: number;
  estimated_end_time?: string | null;
  created_at: string;
  updated_at: string;
}

interface DefenseProjectEnvelope {
  project_id: number;
  project_code: string;
  project_name: string;
  student_name: string;
  student_mssv: string;
  teacher_id?: number | null;
  topic_id?: number | null;
  topic_name?: string | null;
  topic_code?: string | null;
  order_index: number;
  scheduled_time: string;
  score: number | null;
  defense_notes?: string | null;
  defended_at?: string | null;
}

interface ScheduleExportEnvelope {
  document_type: string;
  session_id: number;
  committee_name: string;
  date: string;
  room: string;
  start_time: string;
  end_time: string | null;
  duration_per_topic: number;
  projects: {
    order: number;
    time: string;
    project_code: string;
    project_name: string;
    student_name: string;
    student_mssv: string;
  }[];
}

// ---------- API Response Mappers ----------

function mapDefenseProject(raw: Record<string, unknown>): DefenseProject {
  return {
    projectId: raw.project_id as number,
    projectCode: raw.project_code as string,
    projectName: raw.project_name as string,
    studentName: raw.student_name as string,
    studentMssv: raw.student_mssv as string,
    teacherId: (raw.teacher_id as number | null) ?? null,
    topicId: (raw.topic_id as number | null) ?? null,
    topicName: (raw.topic_name as string | null) ?? null,
    topicCode: (raw.topic_code as string | null) ?? null,
    orderIndex: raw.order_index as number,
    scheduledTime: raw.scheduled_time as string,
    score: raw.score as number | null,
    defenseNotes: (raw.defense_notes as string | null) ?? null,
    defendedAt: (raw.defended_at as string | null) ?? null,
  };
}

function mapDefenseSession(raw: Record<string, unknown>): DefenseSession {
  const projects =
    (raw.projects as Record<string, unknown>[] | undefined) ?? [];
  return {
    id: raw.id as number,
    committeeId: raw.committee_id as number,
    committeeName: raw.committee_name as string,
    defenseDate: raw.defense_date as string,
    startTime: raw.start_time as string,
    endTime: (raw.end_time as string | null) ?? null,
    room: raw.room as string,
    durationMinutes: raw.duration_minutes as number,
    status: raw.status as DefenseSessionStatus,
    projects: projects.map(mapDefenseProject),
    projectCount: (raw.project_count as number) || 0,
    estimatedEndTime: (raw.estimated_end_time as string | null) ?? null,
    createdAt: raw.created_at as string,
    updatedAt: raw.updated_at as string,
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
    facultyId?: string;
    periodId?: number;
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
    if (params?.facultyId) searchParams.set("faculty_id", params.facultyId);
    if (params?.periodId)
      searchParams.set("period_id", String(params.periodId));

    const response = await apiClient.get<DefenseSessionsEnvelope>(
      `${API_BASE}?${searchParams.toString()}`,
    );
    return {
      data: (response.data ?? []).map((item) =>
        mapDefenseSession(item as unknown as Record<string, unknown>),
      ),
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 20,
      totalPages: response.totalPages || 1,
    };
  }

  async getDefenseSessionById(id: number): Promise<DefenseSession> {
    const response = await apiClient.get<DefenseSessionEnvelope>(
      `${API_BASE}/${id}`,
    );
    return mapDefenseSession(response as unknown as Record<string, unknown>);
  }

  async getAvailableProjects(
    facultyId?: string,
    periodId?: number,
    committeeId?: number,
  ): Promise<AvailableGroupForDefense[]> {
    try {
      const searchParams = new URLSearchParams();
      if (facultyId) searchParams.set("faculty_id", facultyId);
      if (periodId) searchParams.set("period_id", String(periodId));
      if (committeeId) searchParams.set("committee_id", String(committeeId));
      const query = searchParams.toString();
      const response = await apiClient.get<
        AvailableGroupRaw[] | AvailableGroupRaw
      >(`/defense-sessions/projects/available${query ? `?${query}` : ""}`);
      if (Array.isArray(response)) return response;
      return response ? [response] : [];
    } catch {
      return [];
    }
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
      projectIds?: number[];
    },
  ): Promise<DefenseSession> {
    const response: any = await apiClient.put(`${API_BASE}/${id}`, {
      defense_date: data.defenseDate,
      start_time: data.startTime,
      end_time: data.endTime,
      room: data.room,
      status: data.status,
      duration_minutes: data.durationMinutes,
      ...(data.projectIds !== undefined
        ? { project_ids: data.projectIds }
        : {}),
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

  /**
   * Tải file Word lịch bảo vệ về máy dưới dạng Blob.
   * FE sẽ tạo một thẻ <a> tạm thời để trình duyệt kích hoạt tải file.
   */
  async downloadScheduleWord(sessionId: number): Promise<void> {
    const { blob, filename } = await apiClient.downloadBlob(
      `${API_BASE}/${sessionId}/export/word`,
    );
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename ?? `lich-bao-ve-${sessionId}.docx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  // ==================== STATISTICS ====================

  async getStats(facultyId?: string, periodId?: number): Promise<DefenseStats> {
    const query = facultyId
      ? `?faculty_id=${encodeURIComponent(facultyId)}`
      : "";
    const response: any = await apiClient.get(
      `${API_BASE}/stats/summary${query}`,
    );
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
