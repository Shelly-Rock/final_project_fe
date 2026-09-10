import apiClient from "@/shared/services/api-client";
import type {
  BulkModerationInput,
  BulkModerationResult,
  CreateSupplementalTopicInput,
  ForceUpdateTopicInput,
  GenerateCodesResult,
  GenerateTopicCodesInput,
  GovernanceView,
  ManagedTopicPage,
  ManagedTopicRow,
  ManualAssignInput,
  ManualAssignResult,
  Paginated,
  SearchPeriodEntityParams,
  StudentWithoutTopic,
  SupplementalTopicResult,
  TeacherWithQuotaPage,
  TopicAuditResponse,
  TopicManageParams,
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

class TopicManageService {
  async listManaged(params: TopicManageParams): Promise<ManagedTopicPage> {
    const response = await apiClient.get<ApiResponse<ManagedTopicPage>>(
      "/topics/manage",
      { params: { ...params } as QueryParams },
    );
    return unwrap(response);
  }

  async exportExcel(params: TopicManageParams): Promise<string> {
    const { blob, filename } = await apiClient.downloadBlob(
      "/topics/manage/export",
      { params: { ...params } as QueryParams },
    );
    const downloadName = filename || "danh-sach-de-tai.xlsx";

    if (typeof window !== "undefined") {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = downloadName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    }

    return downloadName;
  }

  async bulkModeration(
    input: BulkModerationInput,
  ): Promise<BulkModerationResult> {
    const response = await apiClient.post<ApiResponse<BulkModerationResult>>(
      "/topics/bulk-moderation",
      input,
    );
    return unwrap(response);
  }

  async forceUpdate(
    topicId: number,
    input: ForceUpdateTopicInput,
  ): Promise<ManagedTopicRow> {
    const response = await apiClient.put<ApiResponse<ManagedTopicRow>>(
      `/topics/${topicId}/force-update`,
      input,
    );
    return unwrap(response);
  }

  async manualAssign(input: ManualAssignInput): Promise<ManualAssignResult> {
    const response = await apiClient.post<ApiResponse<ManualAssignResult>>(
      "/topics/manual-assign",
      input,
    );
    return unwrap(response);
  }

  async createSupplemental(
    input: CreateSupplementalTopicInput,
  ): Promise<SupplementalTopicResult> {
    const response = await apiClient.post<ApiResponse<SupplementalTopicResult>>(
      "/topics/supplemental",
      input,
    );
    return unwrap(response);
  }

  async generateCodes(
    input: GenerateTopicCodesInput,
  ): Promise<GenerateCodesResult> {
    const response = await apiClient.post<ApiResponse<GenerateCodesResult>>(
      "/topics/generate-codes",
      input,
    );
    return unwrap(response);
  }

  async getAudits(topicId: number): Promise<TopicAuditResponse> {
    const response = await apiClient.get<ApiResponse<TopicAuditResponse>>(
      `/topics/${topicId}/audits`,
    );
    return unwrap(response);
  }

  async studentsWithoutTopic(
    params: SearchPeriodEntityParams,
  ): Promise<Paginated<StudentWithoutTopic>> {
    const response = await apiClient.get<
      ApiResponse<Paginated<StudentWithoutTopic>>
    >("/topics/manage/students-without-topic", {
      params: { ...params } as QueryParams,
    });
    return unwrap(response);
  }

  async teachersWithQuota(
    params: SearchPeriodEntityParams,
  ): Promise<TeacherWithQuotaPage> {
    const response = await apiClient.get<ApiResponse<TeacherWithQuotaPage>>(
      "/topics/manage/teachers-with-quota",
      { params: { ...params } as QueryParams },
    );
    return unwrap(response);
  }

  async governanceState(periodId?: number): Promise<GovernanceView> {
    const response = await apiClient.get<ApiResponse<GovernanceView>>(
      "/topics/governance-state",
      { params: { periodId } },
    );
    return unwrap(response);
  }
}

export const topicManageService = new TopicManageService();
