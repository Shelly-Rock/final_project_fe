import { apiClient } from "@/shared/services/api-client";

export interface DepartmentSummary {
  department_id: string;
  department_name: string;
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

export interface DepartmentProgressStats {
  department: {
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

export interface TopicItem {
  id: string;
  name: string;
  code: string;
  instructorName: string;
  instructorRole: string;
  completionPercentage: number;
  status: "completed" | "pending" | "delayed";
}

export interface DepartmentSecretaryDetail {
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  totalTeachers: number;
  totalTopics: number;
  completedTopics: number;
  pendingApprovalTopics: number;
  delayedTopics: number;
  totalReports: number;
  pendingApprovals: number;
  topics: TopicItem[];
}

class DepartmentService {
  async getDepartments(): Promise<DepartmentSummary[]> {
    const response = await apiClient.get<{ data: DepartmentSummary[] }>(
      "/dashboard/department",
    );
    return response.data;
  }

  async getDepartmentDetail(departmentId: string): Promise<DepartmentSummary> {
    const response = await apiClient.get<{ data: DepartmentSummary }>(
      `/dashboard/department/${encodeURIComponent(departmentId)}`,
    );
    return response.data;
  }

  async getDepartmentProgressStats(
    departmentId: string,
  ): Promise<DepartmentProgressStats> {
    const response = await apiClient.get<{ data: DepartmentProgressStats }>(
      `/dashboard/department/${encodeURIComponent(departmentId)}/progress-reports`,
    );
    return response.data;
  }

  async getDepartmentSecretaryDetail(
    departmentId: string,
  ): Promise<DepartmentSecretaryDetail> {
    const response = await apiClient.get<{ data: DepartmentSecretaryDetail }>(
      `/dashboard/department/${encodeURIComponent(departmentId)}/secretary-detail`,
    );
    return response.data;
  }

  async getSecretaryDepartmentOverview(): Promise<SecretaryDepartmentOverview> {
    const response = await apiClient.get<{ data: SecretaryDepartmentOverview }>(
      `/dashboard/secretary/department-overview`,
    );
    return response.data;
  }

  async getSecretaryDepartmentTopics(): Promise<DepartmentTopic[]> {
    const response = await apiClient.get<{ data: DepartmentTopic[] }>(
      `/dashboard/secretary/department-topics`,
    );
    return response.data;
  }
}

export interface SecretaryDepartmentOverview {
  department: {
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

export interface DepartmentTopic {
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

export const departmentService = new DepartmentService();
