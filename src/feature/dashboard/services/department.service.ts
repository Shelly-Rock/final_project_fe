import { apiClient } from "@/shared/services/api-client";

export interface FacultySummary {
  faculty_id: string;
  faculty_name: string;
  teachers: number;
  projects: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export interface ProgressReportSeries {
  year: number;
  month: number;
  label: string;
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface FacultyProgressStats {
  faculty: {
    id: string;
    name: string;
  };
  summary: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  series: ProgressReportSeries[];
}

export interface FacultyUpcomingEvent {
  id: string;
  at: string;
  title: string;
  detail: string;
}

export interface TopicItem {
  id: string;
  name: string;
  code: string;
  instructorName: string;
  instructorRole: string;
  completionPercentage: number;
  status: "completed" | "pending" | "delayed";
}

export interface FacultySecretaryDetail {
  facultyId: string;
  facultyName: string;
  facultyCode: string;
  totalTeachers: number;
  totalTopics: number;
  completedTopics: number;
  pendingApprovalTopics: number;
  delayedTopics: number;
  totalReports: number;
  pendingApprovals: number;
  topics: TopicItem[];
}

class FacultyService {
  async getFaculties(): Promise<FacultySummary[]> {
    const response = await apiClient.get<{ data: FacultySummary[] }>(
      "/dashboard/faculty",
    );
    return response.data;
  }

  async getFacultyDetail(facultyId: string): Promise<FacultySummary> {
    const response = await apiClient.get<{ data: FacultySummary }>(
      `/dashboard/faculty/${encodeURIComponent(facultyId)}`,
    );
    return response.data;
  }

  async getFacultyProgressStats(
    facultyId: string,
  ): Promise<FacultyProgressStats> {
    const response = await apiClient.get<{ data: FacultyProgressStats }>(
      `/dashboard/faculty/${encodeURIComponent(facultyId)}/progress-reports`,
    );
    return response.data;
  }

  async getFacultyUpcomingEvents(
    facultyId: string,
  ): Promise<FacultyUpcomingEvent[]> {
    const response = await apiClient.get<{ data: FacultyUpcomingEvent[] }>(
      `/dashboard/faculty/${encodeURIComponent(facultyId)}/upcoming-events`,
    );
    return response.data;
  }

  async getFacultySecretaryDetail(
    facultyId: string,
  ): Promise<FacultySecretaryDetail> {
    const response = await apiClient.get<{ data: FacultySecretaryDetail }>(
      `/dashboard/faculty/${encodeURIComponent(facultyId)}/secretary-detail`,
    );
    return response.data;
  }

  async getSecretaryFacultyOverview(): Promise<SecretaryFacultyOverview> {
    const response = await apiClient.get<{ data: SecretaryFacultyOverview }>(
      `/dashboard/secretary/faculty-overview`,
    );
    return response.data;
  }

  async getSecretaryFacultyTopics(): Promise<FacultyTopic[]> {
    const response = await apiClient.get<{ data: FacultyTopic[] }>(
      `/dashboard/secretary/faculty-topics`,
    );
    return response.data;
  }
}

export interface SecretaryFacultyOverview {
  faculty: {
    id: string;
    name: string;
    code: string;
    status: "active" | "inactive";
  };
  stats: {
    teachers: number;
    topics: number;
    completedTopics: number;
    pendingReviews: number;
  };
  topicsBreakdown: {
    completed: number;
    pending: number;
    late: number;
  };
  teachers: Array<{
    id: string;
    name: string;
    position?: string;
    projectsCount: number;
  }>;
}

export interface FacultyTopic {
  id: string;
  name: string;
  code: string;
  leadTeacher: {
    id: string;
    name: string;
  };
  status: "completed" | "pending" | "late";
  completionRate: number;
}

export const facultyService = new FacultyService();
