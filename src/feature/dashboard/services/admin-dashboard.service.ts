import { apiClient } from "@/shared/services/api-client";

export interface AdminDashboardStats {
  summary: {
    totalStudents: number;
    totalTeachers: number;
    totalProjects: number;
    totalUsers: number;
    totalDepartments: number;
    totalFaculties: number;
  };
  reports: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
  projectStatus: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
}

export interface DepartmentStats {
  id: string;
  name: string;
  faculty: string;
  secretary: string;
  teacherCount: number;
  projects: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

class AdminDashboardService {
  async getAdminStats(): Promise<AdminDashboardStats> {
    return apiClient.get<AdminDashboardStats>("/dashboard/admin");
  }

  async getDepartmentStats(): Promise<DepartmentStats[]> {
    return apiClient.get<DepartmentStats[]>("/dashboard/admin/departments");
  }
}

export const adminDashboardService = new AdminDashboardService();
