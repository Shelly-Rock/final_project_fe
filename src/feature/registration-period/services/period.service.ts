// ============================================================
// SERVICES — Registration Period Management API
// ============================================================
import apiClient from "@/shared/services/api-client";
import type {
  RegistrationPeriod,
  TeacherQuota,
  Topic,
  CreatePeriodInput,
  UpdatePeriodInput,
  UpdateTeacherQuotaInput,
  ApproveTopicInput,
  RejectTopicInput,
  PeriodFilters,
  ExceptionRequest,
  DepartmentStudentLimit,
  PeriodStatus,
  QuotaStatus,
  TopicModerationStatus,
} from "../types";

interface ApiEnvelope<T> {
  data: T;
  timestamp?: string;
}

type ApiResponse<T> = ApiEnvelope<T> | T;

type BackendPeriodStatus = "UPCOMING" | "OPEN" | "CLOSED";
type BackendQuotaStatus = "SUFFICIENT" | "INSUFFICIENT";
type BackendTopicStatus = "PENDING" | "APPROVED" | "REJECTED";

interface BackendRegistrationPeriod {
  id: number;
  name: string;
  semester: string;
  school_year: string;
  start_date: string;
  teacher_deadline: string;
  student_deadline: string;
  default_quota: number;
  status: BackendPeriodStatus;
  description: string | null;
  department_student_limits: unknown;
  created_at: string;
  updated_at: string;
}

interface BackendTeacherQuota {
  id: number;
  period_id: number;
  teacher_id: number;
  assigned_quota: number;
  submitted_topics: number;
  max_students: number;
  status: BackendQuotaStatus;
  last_notified_at: string | null;
  teachers?: {
    name: string;
    department_id: string;
  } | null;
}

interface BackendManagedTopic {
  id: number;
  name: string;
  description: string;
  maxStudents: number;
  registeredStudents: number;
  status: BackendTopicStatus;
  moderatorNote: string | null;
  rejectionReason: string | null;
  periodId: number;
  teacher: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendManagedTopicPage {
  items: BackendManagedTopic[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PeriodStats {
  totalTopics: number;
  pendingTopics: number;
  approvedTopics: number;
  rejectedTopics: number;
  totalQuotas: number;
  insufficientTeachers: number;
}

interface BackendNotifyResult {
  sent: number;
}

function unwrap<T>(response: ApiResponse<T>): T {
  if (response !== null && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data;
  }

  return response as T;
}

function mapPeriodStatus(status: BackendPeriodStatus): PeriodStatus {
  switch (status) {
    case "OPEN":
      return "open";
    case "CLOSED":
      return "closed";
    default:
      return "upcoming";
  }
}

function mapQuotaStatus(status: BackendQuotaStatus): QuotaStatus {
  return status === "SUFFICIENT" ? "sufficient" : "insufficient";
}

function mapTopicStatus(status: BackendTopicStatus): TopicModerationStatus {
  switch (status) {
    case "APPROVED":
      return "approved";
    case "REJECTED":
      return "rejected";
    default:
      return "pending";
  }
}

function mapDepartmentStudentLimits(value: unknown): DepartmentStudentLimit[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];

    const record = item as Record<string, unknown>;
    const department = record.department;
    const maxStudents = record.maxStudents ?? record.max_students;

    if (typeof department !== "string" || typeof maxStudents !== "number") {
      return [];
    }

    return [{ department, maxStudents }];
  });
}

function mapPeriod(period: BackendRegistrationPeriod): RegistrationPeriod {
  return {
    id: period.id,
    name: period.name,
    semester: period.semester as RegistrationPeriod["semester"],
    schoolYear: period.school_year,
    startDate: period.start_date,
    teacherDeadline: period.teacher_deadline,
    studentDeadline: period.student_deadline,
    defaultQuota: period.default_quota,
    status: mapPeriodStatus(period.status),
    description: period.description ?? undefined,
    departmentStudentLimits: mapDepartmentStudentLimits(
      period.department_student_limits,
    ),
    createdAt: period.created_at,
    updatedAt: period.updated_at,
  };
}

function mapTeacherQuota(quota: BackendTeacherQuota): TeacherQuota {
  return {
    id: quota.id,
    periodId: quota.period_id,
    teacherId: quota.teacher_id,
    teacherName: quota.teachers?.name ?? "Chưa xác định",
    department: quota.teachers?.department_id ?? "Chưa xác định",
    assignedQuota: quota.assigned_quota,
    submittedTopics: quota.submitted_topics,
    maxStudents: quota.max_students,
    status: mapQuotaStatus(quota.status),
    lastNotifiedAt: quota.last_notified_at ?? undefined,
  };
}

function mapTopic(topic: BackendManagedTopic): Topic {
  return {
    id: topic.id,
    periodId: topic.periodId,
    teacherId: topic.teacher?.id ?? 0,
    teacherName: topic.teacher?.name ?? "Chưa xác định",
    name: topic.name,
    description: topic.description,
    maxStudents: topic.maxStudents,
    registeredStudents: topic.registeredStudents,
    status: mapTopicStatus(topic.status),
    moderatorNote: topic.moderatorNote ?? undefined,
    rejectionReason: topic.rejectionReason ?? undefined,
    createdAt: topic.createdAt,
    updatedAt: topic.updatedAt,
  };
}

class PeriodService {
  private periods: RegistrationPeriod[] = [];
  private teacherQuotas: TeacherQuota[] = [];
  private topics: Topic[] = [];
  private periodStats = new Map<number, PeriodStats>();
  private pendingStatsRequests = new Map<number, Promise<PeriodStats>>();

  // ============================================================
  // REGISTRATION PERIOD CRUD
  // ============================================================

  async getAll(filters?: PeriodFilters): Promise<RegistrationPeriod[]> {
    const response = await apiClient.get<
      ApiResponse<BackendRegistrationPeriod[]>
    >("/registration-periods", {
      params: {
        search: filters?.search || undefined,
        semester:
          filters?.semester && filters.semester !== "all"
            ? filters.semester
            : undefined,
        schoolYear:
          filters?.schoolYear && filters.schoolYear !== "all"
            ? filters.schoolYear
            : undefined,
        status:
          filters?.status && filters.status !== "all"
            ? filters.status.toUpperCase()
            : undefined,
      },
    });

    this.periods = unwrap(response)
      .map(mapPeriod)
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      );

    return [...this.periods];
  }

  async getById(id: number): Promise<RegistrationPeriod | undefined> {
    const response = await apiClient.get<
      ApiResponse<BackendRegistrationPeriod>
    >(`/registration-periods/${id}`);
    const period = mapPeriod(unwrap(response));
    this.upsertPeriod(period);
    return period;
  }

  async create(data: CreatePeriodInput): Promise<RegistrationPeriod> {
    const response = await apiClient.post<
      ApiResponse<BackendRegistrationPeriod>
    >("/registration-periods", data);
    const period = mapPeriod(unwrap(response));
    this.upsertPeriod(period);
    return period;
  }

  async update(
    id: number,
    data: UpdatePeriodInput,
  ): Promise<RegistrationPeriod | undefined> {
    const { status, ...payload } = data;
    void status;

    const response = await apiClient.put<
      ApiResponse<BackendRegistrationPeriod>
    >(`/registration-periods/${id}`, payload);
    const period = mapPeriod(unwrap(response));
    this.upsertPeriod(period);
    return period;
  }

  async delete(id: number): Promise<boolean> {
    await apiClient.delete<ApiResponse<BackendRegistrationPeriod>>(
      `/registration-periods/${id}`,
    );

    this.periods = this.periods.filter((period) => period.id !== id);
    this.teacherQuotas = this.teacherQuotas.filter(
      (quota) => quota.periodId !== id,
    );
    this.topics = this.topics.filter((topic) => topic.periodId !== id);
    this.periodStats.delete(id);
    return true;
  }

  async closePeriod(id: number): Promise<RegistrationPeriod | undefined> {
    const response = await apiClient.post<
      ApiResponse<BackendRegistrationPeriod>
    >(`/registration-periods/${id}/close`);
    const period = mapPeriod(unwrap(response));
    this.upsertPeriod(period);
    return period;
  }

  async openPeriod(id: number): Promise<RegistrationPeriod | undefined> {
    const response = await apiClient.post<
      ApiResponse<BackendRegistrationPeriod>
    >(`/registration-periods/${id}/open`);
    const period = mapPeriod(unwrap(response));
    this.upsertPeriod(period);
    return period;
  }

  // ============================================================
  // TEACHER QUOTA MANAGEMENT
  // ============================================================

  async getTeacherQuotas(periodId: number): Promise<TeacherQuota[]> {
    const response = await apiClient.get<ApiResponse<BackendTeacherQuota[]>>(
      `/registration-periods/${periodId}/teacher-quotas`,
    );
    const quotas = unwrap(response)
      .map(mapTeacherQuota)
      .sort((a, b) => a.teacherName.localeCompare(b.teacherName));

    this.teacherQuotas = [
      ...this.teacherQuotas.filter((quota) => quota.periodId !== periodId),
      ...quotas,
    ];
    await this.refreshPeriodStatsSafely(periodId);
    return quotas;
  }

  async updateTeacherQuota(
    periodId: number,
    teacherId: number,
    data: UpdateTeacherQuotaInput,
  ): Promise<TeacherQuota | undefined> {
    const response = await apiClient.put<ApiResponse<BackendTeacherQuota>>(
      `/registration-periods/${periodId}/teacher-quotas/${teacherId}`,
      { assignedQuota: data.assignedQuota },
    );
    const quota = mapTeacherQuota(unwrap(response));
    this.upsertTeacherQuota(quota);
    await this.refreshPeriodStatsSafely(periodId);
    return quota;
  }

  async notifyTeachers(periodId: number): Promise<{ notified: number }> {
    const response = await apiClient.post<ApiResponse<BackendNotifyResult>>(
      `/registration-periods/${periodId}/notify-teachers`,
    );
    const result = unwrap(response);

    return { notified: result.sent };
  }

  // ============================================================
  // TOPIC MODERATION
  // ============================================================

  async getTopics(periodId: number): Promise<Topic[]> {
    const topics = await this.loadAllManagedTopics(periodId);
    this.topics = [
      ...this.topics.filter((topic) => topic.periodId !== periodId),
      ...topics,
    ];
    await this.refreshPeriodStatsSafely(periodId);
    return topics;
  }

  async approveTopic(
    topicId: number,
    data?: ApproveTopicInput,
  ): Promise<Topic | undefined> {
    await apiClient.post<ApiResponse<unknown>>("/topics/bulk-moderation", {
      topicIds: [topicId],
      action: "APPROVE",
      reason: data?.moderatorNote?.trim() || undefined,
    });

    const topic = this.updateCachedTopic(topicId, {
      status: "approved",
      moderatorNote: data?.moderatorNote,
      rejectionReason: undefined,
    });
    if (topic) await this.refreshPeriodStatsSafely(topic.periodId);
    return topic;
  }

  async rejectTopic(
    topicId: number,
    data: RejectTopicInput,
  ): Promise<Topic | undefined> {
    await apiClient.post<ApiResponse<unknown>>("/topics/bulk-moderation", {
      topicIds: [topicId],
      action: "REJECT",
      reason: data.rejectionReason,
    });

    const topic = this.updateCachedTopic(topicId, {
      status: "rejected",
      moderatorNote: data.rejectionReason,
      rejectionReason: data.rejectionReason,
    });
    if (topic) await this.refreshPeriodStatsSafely(topic.periodId);
    return topic;
  }

  async updateTopic(
    topicId: number,
    data: Partial<Topic>,
  ): Promise<Topic | undefined> {
    void topicId;
    void data;
    throw new Error(
      "Chỉnh sửa cưỡng bức đề tài yêu cầu lý do bắt buộc. Vui lòng thực hiện tại màn Cấu hình & Duyệt đề tài.",
    );
  }

  // ============================================================
  // LEGACY EXCEPTION REQUESTS
  // ============================================================

  async getExceptionRequests(periodId: number): Promise<ExceptionRequest[]> {
    void periodId;
    return [];
  }

  async approveException(
    periodId: number,
    requestId: number,
  ): Promise<ExceptionRequest | undefined> {
    void periodId;
    void requestId;
    throw new Error(
      "Luồng duyệt yêu cầu ngoại lệ cũ chưa có API nghiệp vụ tương ứng.",
    );
  }

  async rejectException(
    periodId: number,
    requestId: number,
    reason: string,
  ): Promise<ExceptionRequest | undefined> {
    void periodId;
    void requestId;
    void reason;
    throw new Error(
      "Luồng từ chối yêu cầu ngoại lệ cũ chưa có API nghiệp vụ tương ứng.",
    );
  }

  // ============================================================
  // SYNCHRONOUS CACHE HELPERS
  // ============================================================

  getSemesterOptions(): { value: string; label: string }[] {
    const semesters = [
      ...new Set(this.periods.map((period) => period.semester)),
    ];
    return semesters.map((semester) => ({
      value: semester,
      label:
        semester === "1"
          ? "Học kỳ 1"
          : semester === "2"
            ? "Học kỳ 2"
            : "Học kỳ 3",
    }));
  }

  getSchoolYearOptions(): string[] {
    return [...new Set(this.periods.map((period) => period.schoolYear))]
      .sort()
      .reverse();
  }

  getDepartmentStudentLimits(periodId: number): DepartmentStudentLimit[] {
    const period = this.periods.find((item) => item.id === periodId);
    return period?.departmentStudentLimits ?? [];
  }

  getMaxStudentsForDepartment(periodId: number, department: string): number {
    const limit = this.getDepartmentStudentLimits(periodId).find(
      (item) => item.department === department,
    );
    return limit?.maxStudents ?? 3;
  }

  validateTopicMaxStudents(
    periodId: number,
    department: string,
    requestedMaxStudents: number,
  ): { valid: boolean; message?: string } {
    const maxAllowed = this.getMaxStudentsForDepartment(periodId, department);

    if (requestedMaxStudents > maxAllowed) {
      return {
        valid: false,
        message: `Sĩ số tối đa cho ngành "${department}" là ${maxAllowed} sinh viên. Vượt quá giới hạn cho phép.`,
      };
    }

    return { valid: true };
  }

  getPeriodStats(periodId: number): PeriodStats {
    const cached = this.periodStats.get(periodId);
    if (cached) return cached;

    const topics = this.topics.filter((topic) => topic.periodId === periodId);
    const quotas = this.teacherQuotas.filter(
      (quota) => quota.periodId === periodId,
    );

    return {
      totalTopics: topics.length,
      pendingTopics: topics.filter((topic) => topic.status === "pending")
        .length,
      approvedTopics: topics.filter((topic) => topic.status === "approved")
        .length,
      rejectedTopics: topics.filter((topic) => topic.status === "rejected")
        .length,
      totalQuotas: quotas.reduce(
        (total, quota) => total + quota.assignedQuota,
        0,
      ),
      insufficientTeachers: quotas.filter(
        (quota) => quota.status === "insufficient",
      ).length,
    };
  }

  private async loadAllManagedTopics(periodId: number): Promise<Topic[]> {
    const firstPage = await this.getManagedTopicPage(periodId, 1);
    const topics = firstPage.items.map(mapTopic);

    for (let page = 2; page <= firstPage.totalPages; page += 1) {
      const nextPage = await this.getManagedTopicPage(periodId, page);
      topics.push(...nextPage.items.map(mapTopic));
    }

    return topics.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  private async getManagedTopicPage(
    periodId: number,
    page: number,
  ): Promise<BackendManagedTopicPage> {
    const response = await apiClient.get<ApiResponse<BackendManagedTopicPage>>(
      "/topics/manage",
      {
        params: {
          periodId,
          page,
          limit: 100,
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      },
    );
    return unwrap(response);
  }

  private async refreshPeriodStats(periodId: number): Promise<PeriodStats> {
    const pending = this.pendingStatsRequests.get(periodId);
    if (pending) return pending;

    const request = apiClient
      .get<ApiResponse<PeriodStats>>(`/registration-periods/${periodId}/stats`)
      .then(unwrap)
      .then((stats) => {
        this.periodStats.set(periodId, stats);
        return stats;
      });

    this.pendingStatsRequests.set(periodId, request);
    try {
      return await request;
    } finally {
      if (this.pendingStatsRequests.get(periodId) === request) {
        this.pendingStatsRequests.delete(periodId);
      }
    }
  }

  private async refreshPeriodStatsSafely(periodId: number): Promise<void> {
    try {
      await this.refreshPeriodStats(periodId);
    } catch {
      // Dữ liệu danh sách chính vẫn dùng được; giữ thống kê cache gần nhất.
    }
  }

  private upsertPeriod(period: RegistrationPeriod): void {
    const index = this.periods.findIndex((item) => item.id === period.id);
    if (index === -1) {
      this.periods.push(period);
      return;
    }
    this.periods[index] = period;
  }

  private upsertTeacherQuota(quota: TeacherQuota): void {
    const index = this.teacherQuotas.findIndex(
      (item) =>
        item.periodId === quota.periodId && item.teacherId === quota.teacherId,
    );
    if (index === -1) {
      this.teacherQuotas.push(quota);
      return;
    }
    this.teacherQuotas[index] = quota;
  }

  private updateCachedTopic(
    topicId: number,
    updates: Partial<Topic>,
  ): Topic | undefined {
    const index = this.topics.findIndex((topic) => topic.id === topicId);
    if (index === -1) return undefined;

    this.topics[index] = { ...this.topics[index], ...updates };
    return this.topics[index];
  }
}

export const periodService = new PeriodService();
