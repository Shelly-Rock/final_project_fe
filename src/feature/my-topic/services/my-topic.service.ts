import apiClient from "@/core/api";
import type {
  MyTopic,
  PendingRequest,
  Student,
  CreateTopicInput,
  UpdateTopicInput,
  ApproveRegistrationInput,
  RejectRegistrationInput,
  TopicStatus,
  RegistrationStatus,
} from "../types";

interface BackendStudent {
  projectId?: number;
  id?: number;
  studentId?: number;
  student_id?: number;
  studentName?: string;
  student_name?: string;
  studentCode?: string;
  student_code?: string;
  status?: string;
  registeredAt?: string;
  registered_at?: string;
  approvedAt?: string;
  approved_at?: string;
  approvedBy?: string;
  approved_by?: string;
  rejectedAt?: string;
  rejected_at?: string;
  rejectedBy?: string;
  rejected_by?: string;
  rejectionReason?: string;
  rejection_reason?: string;
}

interface BackendTopic {
  id: number;
  code: string;
  name: string;
  english_name?: string;
  description: string;
  objectives?: string;
  technologies?: string;
  max_students: number;
  status: string;
  is_exception: boolean;
  period_id: number;
  period_name?: string;
  teacher_id: number;
  teacher_name?: string;
  department_name?: string;
  rejection_reason?: string;
  pre_assigned_students?: BackendStudent[];
  registered_students?: BackendStudent[];
  registrations?: BackendStudent[];
  registration_status?: string;
  created_at: string;
  updated_at: string;
}

interface BackendProject {
  id: number;
  student_id: number;
  student_name: string;
  student_code: string;
  topic_id: number;
  topic_name: string;
  status: string;
  registered_at: string;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
}

function mapBackendStatusToTopicStatus(status: string): TopicStatus {
  const map: Record<string, TopicStatus> = {
    DRAFT: "Draft",
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    WAITING_SECRETARY: "Waiting_For_Secretary",
  };
  return map[status] || "Pending";
}

function mapBackendStatusToRegistrationStatus(
  status: string,
): RegistrationStatus {
  const map: Record<string, RegistrationStatus> = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  };
  return map[status] || "Pending";
}

function mapBackendToMyTopic(backend: BackendTopic): MyTopic {
  const registrations: BackendStudent[] =
    backend.registrations || backend.registered_students || [];
  return {
    id: backend.id,
    periodId: backend.period_id,
    periodName: backend.period_name || "",
    name: backend.name,
    englishName: backend.english_name,
    description: backend.description,
    objectives: backend.objectives,
    technologies: backend.technologies,
    maxStudents: backend.max_students,
    status: mapBackendStatusToTopicStatus(backend.status),
    isException: backend.is_exception || false,
    department: backend.department_name,
    rejectionReason: backend.rejection_reason,
    preAssignedStudents: [],
    registeredStudents: registrations.map((s: BackendStudent) => ({
      id: s.projectId || s.id || 0,
      studentId: s.studentId || s.student_id || 0,
      studentName: s.studentName || s.student_name || "",
      studentCode: s.studentCode || s.student_code || "",
      status: mapBackendStatusToRegistrationStatus(s.status || ""),
      registeredAt: s.registeredAt || s.registered_at || "",
      approvedAt: s.approvedAt || s.approved_at,
      approvedBy: s.approvedBy
        ? Number(s.approvedBy)
        : s.approved_by
          ? Number(s.approved_by)
          : undefined,
      rejectedAt: s.rejectedAt || s.rejected_at,
      rejectedBy: s.rejectedBy
        ? Number(s.rejectedBy)
        : s.rejected_by
          ? Number(s.rejected_by)
          : undefined,
      rejectionReason: s.rejectionReason || s.rejection_reason,
    })),
    registrationStatus: (backend.registration_status || "OPEN") as
      | "OPEN"
      | "FULL"
      | "LOCKED",
    createdAt: backend.created_at,
    updatedAt: backend.updated_at,
  };
}

function _mapBackendToPendingRequest(project: BackendProject): PendingRequest {
  return {
    id: project.id,
    studentId: project.student_id,
    studentName: project.student_name,
    studentCode: project.student_code,
    topicId: project.topic_id,
    topicName: project.topic_name,
    requestedAt: project.registered_at,
    status: "Pending",
  };
}

interface GetMyTopicsResponse {
  periodId: number;
  quota: number;
  governance: Record<string, unknown>;
  pendingApprovals: number;
  items: BackendTopic[];
  total: number;
}

class MyTopicService {
  async getAll(): Promise<MyTopic[]> {
    const { data } = await apiClient.get<GetMyTopicsResponse>("/topics/mine");
    const items = data.items || [];
    return items.map(mapBackendToMyTopic);
  }

  async getById(id: number): Promise<MyTopic | null> {
    try {
      const { data } = await apiClient.get<BackendTopic>(`/topics/${id}`);
      return mapBackendToMyTopic(data);
    } catch {
      return null;
    }
  }

  async create(input: CreateTopicInput): Promise<MyTopic> {
    const payload: Record<string, unknown> = {
      periodId: input.periodId,
      name: input.name,
      description: input.description,
      maxStudents: input.maxStudents,
    };
    if (input.englishName) payload.englishName = input.englishName;
    if (input.objectives) payload.objectives = input.objectives;
    if (input.technologies) payload.technologies = input.technologies;
    if (input.preAssignedStudentIds)
      payload.preAssignedStudentIds = input.preAssignedStudentIds;
    if (input.isException !== undefined)
      payload.isException = input.isException;

    const { data } = await apiClient.post<BackendTopic>("/topics", payload);
    return mapBackendToMyTopic(data);
  }

  async update(id: number, input: UpdateTopicInput): Promise<MyTopic> {
    const payload: Record<string, unknown> = {};
    if (input.periodId !== undefined) payload.periodId = input.periodId;
    if (input.name !== undefined) payload.name = input.name;
    if (input.englishName !== undefined)
      payload.englishName = input.englishName;
    if (input.description !== undefined)
      payload.description = input.description;
    if (input.objectives !== undefined) payload.objectives = input.objectives;
    if (input.technologies !== undefined)
      payload.technologies = input.technologies;
    if (input.maxStudents !== undefined)
      payload.maxStudents = input.maxStudents;
    if (input.preAssignedStudentIds !== undefined)
      payload.preAssignedStudentIds = input.preAssignedStudentIds;
    if (input.isException !== undefined)
      payload.isException = input.isException;

    const { data } = await apiClient.put<BackendTopic>(
      `/topics/${id}`,
      payload,
    );
    return mapBackendToMyTopic(data);
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/topics/${id}`);
  }

  async toggleLock(id: number, locked: boolean): Promise<MyTopic> {
    const { data } = await apiClient.put(`/topics/${id}`, { locked });
    return mapBackendToMyTopic(data);
  }

  async getPendingRequests(): Promise<PendingRequest[]> {
    const topics = await this.getAll();
    const pending: PendingRequest[] = [];
    topics.forEach((topic) => {
      topic.registeredStudents
        .filter((s) => s.status === "Pending")
        .forEach((s) => {
          pending.push({
            id: s.id,
            studentId: s.studentId,
            studentName: s.studentName,
            studentCode: s.studentCode,
            topicId: topic.id,
            topicName: topic.name,
            requestedAt: s.registeredAt,
            status: "Pending",
          });
        });
    });
    return pending;
  }

  async approveRegistration(input: ApproveRegistrationInput): Promise<void> {
    const allTopics = await this.getAll();
    const topic = allTopics.find((t) => t.id === input.topicId);
    if (!topic) throw new Error("Topic not found");

    const registration = topic.registeredStudents.find(
      (s) => s.studentId === input.studentId,
    );
    if (!registration) throw new Error("Registration not found");

    await apiClient.post(
      `/topics/${input.topicId}/approvals/${registration.id}`,
      {
        decision: "APPROVE",
      },
    );
  }

  async rejectRegistration(input: RejectRegistrationInput): Promise<void> {
    const allTopics = await this.getAll();
    const topic = allTopics.find((t) => t.id === input.topicId);
    if (!topic) throw new Error("Topic not found");

    const registration = topic.registeredStudents.find(
      (s) => s.studentId === input.studentId,
    );
    if (!registration) throw new Error("Registration not found");

    await apiClient.post(
      `/topics/${input.topicId}/approvals/${registration.id}`,
      {
        decision: "REJECT",
        note: input.reason,
      },
    );
  }

  async searchStudents(_query: string): Promise<Student[]> {
    return [];
  }

  getTopicEnrollment(_topicId: number): number {
    return 0;
  }

  getMaxStudentsForDepartment(_periodId: number, _department: string): number {
    return 3;
  }

  getDepartmentStudentLimits(
    _periodId: number,
  ): { department: string; maxStudents: number }[] {
    return [];
  }
}

export const myTopicService = new MyTopicService();
