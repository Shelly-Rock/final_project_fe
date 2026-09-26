import { apiClient } from "@/shared/services/api-client";

export interface AdminDashboardStats {
  summary: {
    totalStudents: number;
    totalTeachers: number;
    totalProjects: number;
    totalUsers?: number;
    totalDepartments: number;
    totalFaculties?: number;
  };
  overview?: {
    students: number;
    teachers: number;
    projects: number;
    departments: number;
    topics: number;
    alerts: number;
  };
  reports?: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
  reportStats?: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
  projectStatus?: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
  projectStats?: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
}

export interface DepartmentProjectStats {
  total?: number;
  pending?: number;
  approved?: number;
  rejected?: number;
}

export interface DepartmentStats {
  id: string;
  name: string;
  faculty: string;
  secretary: string;
  teacherCount?: number;
  teachers?: number;
  projects: number | DepartmentProjectStats;
  topics?: number;
}

class AdminDashboardService {
  async getAdminStats(): Promise<AdminDashboardStats> {
    const response =
      await apiClient.get<AdminDashboardStats>("/dashboard/admin");
    if (response.summary) return response;

    const overview = response.overview;
    return {
      ...response,
      summary: {
        totalStudents: overview?.students ?? 0,
        totalTeachers: overview?.teachers ?? 0,
        totalProjects: overview?.projects ?? 0,
        totalDepartments: overview?.departments ?? 0,
      },
      reports: response.reports ??
        response.reportStats ?? {
          pending: 0,
          approved: 0,
          rejected: 0,
          total: 0,
        },
      projectStatus: response.projectStatus ??
        response.projectStats ?? {
          pending: 0,
          approved: 0,
          rejected: 0,
          total: 0,
        },
    };
  }

  async getDepartmentStats(): Promise<DepartmentStats[]> {
    return apiClient.get<DepartmentStats[]>("/dashboard/admin/departments");
  }
}

export const adminDashboardService = new AdminDashboardService();
