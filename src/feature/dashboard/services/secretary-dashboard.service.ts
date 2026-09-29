import axios from "axios";

export interface SecretaryDashboardStats {
  department: {
    id: string;
    name: string;
  };
  summary: {
    totalStudents: number;
    totalTeachers: number;
    totalProjects: number;
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

export interface TeacherInfo {
  id: number;
  name: string;
  email: string;
  position: string;
  projects: {
    total: number;
    byStatus: {
      pending: number;
      approved: number;
      rejected: number;
    };
  };
}

export interface SecretaryDepartmentDetails {
  department: {
    id: string;
    name: string;
  };
  teachers: TeacherInfo[];
}

export interface SecretaryActionItem {
  id: string;
  title: string;
  subtitle: string;
  tone: "due" | "later";
  href?: string;
}

export interface SecretaryFacultyActions {
  faculty: { id: string; name: string };
  periodId: number | null;
  items: SecretaryActionItem[];
}

class SecretaryDashboardService {
  async getSecretaryStats(): Promise<SecretaryDashboardStats> {
    const response = await axios.get("/api/dashboard/secretary");
    return response.data;
  }

  async getSecretaryDepartmentDetails(): Promise<SecretaryDepartmentDetails> {
    const response = await axios.get(
      "/api/dashboard/secretary/department-details",
    );
    return response.data;
  }

  async getSecretaryFacultyActions(): Promise<SecretaryFacultyActions> {
    const response = await axios.get(
      "/api/dashboard/secretary/faculty-actions",
    );
    return response.data?.data ?? response.data;
  }
}

export const secretaryDashboardService = new SecretaryDashboardService();
