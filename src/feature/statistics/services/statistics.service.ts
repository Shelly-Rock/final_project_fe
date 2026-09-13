// ============================================================
// STATISTICS — Service (Giai đoạn 8: Thống kê và Báo cáo)
// ============================================================
import { apiClient } from "@/shared/services/api-client";
import { downloadBlob as saveBlob } from "@/shared/utils/file.utils";

const API_BASE = "/statistics";

interface ApiEnvelope<T> {
  data: T;
  timestamp?: string;
}

type ApiResponse<T> = ApiEnvelope<T> | T;

function unwrap<T>(response: ApiResponse<T>): T {
  if (
    response !== null &&
    typeof response === "object" &&
    "data" in response &&
    !Array.isArray(response)
  ) {
    return (response as ApiEnvelope<T>).data;
  }
  return response as T;
}

// ---------- Types ----------

export interface AcademicReport {
  total: number;
  published: number;
  passed: number;
  failed: number;
  rejectedDefense: number;
  rejectedGvhd: number;
  passRate: number;
  failRate: number;
  avgFinalScore: number;
}

export interface TeacherProductivityRow {
  teacherId: number;
  teacherCode: string;
  name: string;
  topics: number;
  studentsGuided: number;
  committeeSeats: number;
  committeeAsChairman: number;
  committeeAsSecretary: number;
  committeeAsInternal: number;
  committeeAsExternal: number;
}

// ---------- API ----------

export const getAcademicReport = async (
  periodId?: number,
): Promise<AcademicReport> => {
  const query = periodId ? `?periodId=${periodId}` : "";
  const response = await apiClient.get<ApiResponse<AcademicReport>>(
    `${API_BASE}/academic${query}`,
  );
  return unwrap(response);
};

export const getTeacherProductivity = async (
  periodId?: number,
): Promise<TeacherProductivityRow[]> => {
  const query = periodId ? `?periodId=${periodId}` : "";
  const response = await apiClient.get<ApiResponse<TeacherProductivityRow[]>>(
    `${API_BASE}/teacher-productivity${query}`,
  );
  return unwrap(response);
};

export const exportStatisticsExcel = async (
  periodId?: number,
): Promise<void> => {
  const { blob, filename } = await apiClient.downloadBlob(
    `${API_BASE}/export`,
    {
      params: periodId ? { periodId } : undefined,
    },
  );
  saveBlob(blob, filename || "thong_ke_giai_doan_8.xlsx");
};
