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
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface DepartmentStats {
  id: string;
  name: string;
  department_id?: string;
  department_name?: string;
  faculty: string;
  faculty_id?: string | null;
  secretary: string;
  teacherCount?: number;
  teachers?: number;
  projects: DepartmentProjectStats;
  topics?: number;
  reports?: number;
}

export interface FacultyStats {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  department_count: number;
  teacher_count: number;
  topic_count: number;
  department_ids: string[];
  projects: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  reports: number;
}

export interface FacultyDetail {
  faculty: {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
  };
  summary: {
    department_count: number;
    teacher_count: number;
    topic_count: number;
    report_count: number;
    projects: {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
    };
  };
  departments: DepartmentStats[];
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

  async getFacultyStats(): Promise<FacultyStats[]> {
    return apiClient.get<FacultyStats[]>("/dashboard/admin/faculties");
  }

  async getFacultyDetail(facultyId: string): Promise<FacultyDetail> {
    return apiClient.get<FacultyDetail>(
      `/dashboard/admin/faculties/${encodeURIComponent(facultyId)}`,
    );
  }
}

export const adminDashboardService = new AdminDashboardService();
