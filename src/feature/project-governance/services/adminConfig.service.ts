import apiClient from "@/shared/services/api-client";
import type {
  AlertDispatchResult,
  AlertLogPage,
  GovernanceConfigResponse,
  ListAlertLogsParams,
  ListTeacherOverridesParams,
  SendDeadlineAlertsInput,
  TeacherOverridePage,
  TeacherQuotaRecord,
  UpdateGovernanceConfigInput,
  UpsertTeacherOverridesInput,
  UpsertTeacherOverridesResult,
} from "../types";

interface ApiEnvelope<T> {
  data: T;
  timestamp?: string;
}

type ApiResponse<T> = ApiEnvelope<T> | T;

type QueryParams = Record<string, string | number | boolean | undefined>;

function unwrap<T>(response: ApiResponse<T>): T {
  if (response !== null && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data;
  }
  return response as T;
}

class AdminConfigService {
  async getConfig(periodId: number): Promise<GovernanceConfigResponse> {
    const response = await apiClient.get<ApiResponse<GovernanceConfigResponse>>(
      "/admin/configs",
      { params: { periodId } },
    );
    return unwrap(response);
  }

  async saveConfig(
    input: UpdateGovernanceConfigInput,
  ): Promise<GovernanceConfigResponse> {
    const response = await apiClient.put<ApiResponse<GovernanceConfigResponse>>(
      "/admin/configs",
      input,
    );
    return unwrap(response);
  }

  async listTeacherOverrides(
    params: ListTeacherOverridesParams,
  ): Promise<TeacherOverridePage> {
    const response = await apiClient.get<ApiResponse<TeacherOverridePage>>(
      "/admin/configs/teacher-overrides",
      { params: { ...params } as QueryParams },
    );
    return unwrap(response);
  }

  async upsertTeacherOverrides(
    input: UpsertTeacherOverridesInput,
  ): Promise<UpsertTeacherOverridesResult> {
    const response = await apiClient.put<
      ApiResponse<UpsertTeacherOverridesResult>
    >("/admin/configs/teacher-overrides", input);
    return unwrap(response);
  }

  async deleteTeacherOverride(
    teacherId: number,
    periodId: number,
  ): Promise<TeacherQuotaRecord> {
    const response = await apiClient.delete<ApiResponse<TeacherQuotaRecord>>(
      `/admin/configs/teacher-overrides/${teacherId}`,
      { params: { periodId } },
    );
    return unwrap(response);
  }

  async sendAlerts(
    input: SendDeadlineAlertsInput,
  ): Promise<AlertDispatchResult> {
    const response = await apiClient.post<ApiResponse<AlertDispatchResult>>(
      "/admin/configs/send-alerts",
      input,
    );
    return unwrap(response);
  }

  async listAlertLogs(params: ListAlertLogsParams): Promise<AlertLogPage> {
    const response = await apiClient.get<ApiResponse<AlertLogPage>>(
      "/admin/configs/alert-logs",
      { params: { ...params } as QueryParams },
    );
    return unwrap(response);
  }
}

export const adminConfigService = new AdminConfigService();
