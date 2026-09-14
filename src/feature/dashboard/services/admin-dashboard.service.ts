import axios from "axios";

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
    const response = await axios.get("/api/dashboard/admin");
    return response.data;
  }

  async getDepartmentStats(): Promise<DepartmentStats[]> {
    const response = await axios.get("/api/dashboard/admin/departments");
    return response.data;
  }
}

export const adminDashboardService = new AdminDashboardService();
