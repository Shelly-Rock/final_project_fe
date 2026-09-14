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
}

export const departmentService = new DepartmentService();
