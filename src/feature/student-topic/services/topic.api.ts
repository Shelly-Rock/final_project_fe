import apiClient from "@/core/api";
import type { AvailableTopic, RegistrationRequest } from "../types";

export interface GovernanceStateResponse {
  deadline: string;
  quota?: number;
  stage?: string;
  isOpen?: boolean;
  isExpired: boolean;
}

interface AvailableTopicRow {
  id: number;
  code?: string;
  name: string;
  description?: string;
  maxStudents: number;
  registeredCount?: number;
  remainingSlots?: number;
  status?: string;
  statusLabel?: string;
  registrationStatus?: "OPEN" | "FULL" | "LOCKED";
  teacherName?: string | null;
  teacherEmail?: string | null;
  department?: string | null;
  faculty?: string | null;
  students?: Array<{
    studentCode?: string;
    studentName?: string;
    status?: string;
    statusLabel?: string;
    registeredAt?: string;
  }>;
  createdAt?: string;
}

interface AvailableTopicsResponse {
  items?: AvailableTopicRow[];
  data?: AvailableTopicRow[];
  topics?: AvailableTopicRow[];
  total?: number;
  periodId?: number;
  governance?: GovernanceStateResponse;
  myRegistration?: {
    projectId: number;
    topicId: number;
    status: string;
    statusLabel: string;
  } | null;
}

interface MyRegistrationResponse {
  student?: {
    id: number;
    studentCode: string;
  };
  registration: {
    projectId: number;
    projectCode?: string;
    status: string;
    statusLabel?: string;
    moderatorNote?: string | null;
    registeredAt: string;
    decidedAt?: string | null;
    topic?: {
      id: number;
      code?: string;
      name: string;
      description?: string;
      teachers?: Array<{ name?: string; email?: string }>;
      teacher?: { name?: string; email?: string };
    };
  } | null;
}

function mapFrontendStatus(
  status?: string,
): "Approved" | "Pending" | "Closed" {
  const normalized = (status || "").toUpperCase();
  if (normalized === "APPROVED") return "Approved";
  if (normalized === "PENDING" || normalized === "WAITING_SECRETARY") {
    return "Pending";
  }
  return "Closed";
}

function mapRegistrationUiStatus(
  status?: string,
): "Pending" | "Approved" | "Rejected" {
  const normalized = (status || "").toUpperCase();
  if (normalized === "APPROVED" || normalized === "ASSIGNED") return "Approved";
  if (normalized === "REJECTED") return "Rejected";
  return "Pending";
}

function mapApiToAvailableTopic(api: AvailableTopicRow): AvailableTopic {
  const registeredCount = api.registeredCount ?? api.students?.length ?? 0;
  const isFull = registeredCount >= (api.maxStudents || 0);

  return {
    id: String(api.id),
    name: api.name,
    description: api.description || "",
    teacherName: api.teacherName || "",
    teacherEmail: api.teacherEmail || "",
    department: api.department || api.faculty || "",
    maxStudents: api.maxStudents,
    registeredCount,
    status: mapFrontendStatus(api.status),
    registrationStatus: api.registrationStatus
      ? api.registrationStatus
      : isFull
        ? "FULL"
        : "OPEN",
    registeredStudents:
      api.students?.map((student, idx) => ({
        id: idx + 1,
        studentId: student.studentCode || "",
        studentCode: student.studentCode || "",
        studentName: student.studentName || "",
        order: idx + 1,
        registeredAt: student.registeredAt,
      })) || [],
    createdAt: api.createdAt || "",
  };
}

class TopicApiService {
  async getGovernanceState(periodId?: number): Promise<GovernanceStateResponse> {
    const { data } = await apiClient.get<GovernanceStateResponse>(
      "/topics/governance-state",
      { params: periodId ? { periodId } : undefined },
    );
    return data;
  }

  async getAvailableTopics(params?: {
    periodId?: number;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ topics: AvailableTopic[]; total: number }> {
    const { data } = await apiClient.get<AvailableTopicsResponse>(
      "/topics/available",
      { params },
    );
    const rows = data.items || data.data || data.topics || [];
    return {
      topics: rows.map(mapApiToAvailableTopic),
      total: data.total ?? rows.length,
    };
  }

  async getMyRegistration(): Promise<RegistrationRequest | null> {
    const { data } = await apiClient.get<MyRegistrationResponse>(
      "/topics/my-registration",
    );

    if (!data.registration) return null;

    const registration = data.registration;
    const teacher =
      registration.topic?.teachers?.[0] || registration.topic?.teacher;

    return {
      id: String(registration.projectId),
      topicId: String(registration.topic?.id ?? ""),
      topicName: registration.topic?.name || "",
      teacherName: teacher?.name || "",
      teacherEmail: teacher?.email || "",
      studentId: data.student?.studentCode || "",
      studentName: "",
      requestedAt: registration.registeredAt,
      status: mapRegistrationUiStatus(registration.status),
      rejectionReason: registration.moderatorNote || undefined,
    };
  }

  async registerTopic(topicId: number): Promise<{ success: boolean; message: string }> {
    await apiClient.post(`/topics/${topicId}/registrations`);
    return {
      success: true,
      message: "Yêu cầu đăng ký đã được gửi thành công",
    };
  }
}

export const topicApiService = new TopicApiService();
export default topicApiService;
