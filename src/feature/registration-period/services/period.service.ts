// ============================================================
// SERVICES — Registration Period Management API
// ============================================================
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
} from "../types";
import { mockPeriods, mockTeacherQuotas, mockTopics } from "../constants";

// Mock data cho exception requests
const mockExceptionRequests: ExceptionRequest[] = [
  {
    id: 1,
    topicId: 10,
    topicName: "Ứng dụng giao hàng nhanh cho startup",
    teacherId: 5,
    teacherName: "TS. Phạm Văn Minh",
    maxStudents: 4,
    students: [
      {
        id: 1,
        studentId: 5,
        studentCode: "2200000045",
        studentName: "Hoàng Văn E",
        order: 1,
      },
      {
        id: 2,
        studentId: 6,
        studentCode: "2200000056",
        studentName: "Ngô Thị F",
        order: 2,
      },
    ],
    requestedAt: "2025-09-18T10:00:00Z",
    status: "pending",
  },
  {
    id: 2,
    topicId: 11,
    topicName: "Hệ thống IoT giám sát chất lượng không khí",
    teacherId: 3,
    teacherName: "PGS.TS. Nguyễn Thị Lan",
    maxStudents: 4,
    students: [
      {
        id: 3,
        studentId: 9,
        studentCode: "2200000089",
        studentName: "Vũ Minh I",
        order: 1,
      },
      {
        id: 4,
        studentId: 10,
        studentCode: "2200000091",
        studentName: "Đỗ Thuỳ J",
        order: 2,
      },
      {
        id: 5,
        studentId: 11,
        studentCode: "2200000112",
        studentName: "Bạch Kim K",
        order: 3,
      },
    ],
    requestedAt: "2025-09-19T14:30:00Z",
    status: "pending",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class PeriodService {
  private periods: RegistrationPeriod[] = [...mockPeriods];
  private teacherQuotas: TeacherQuota[] = [...mockTeacherQuotas];
  private topics: Topic[] = [...mockTopics];

  // ============================================================
  // REGISTRATION PERIOD CRUD
  // ============================================================

  async getAll(filters?: PeriodFilters): Promise<RegistrationPeriod[]> {
    await delay(300);

    let result = [...this.periods];

    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.schoolYear.includes(searchLower),
        );
      }
      if (filters.semester && filters.semester !== "all") {
        result = result.filter((p) => p.semester === filters.semester);
      }
      if (filters.schoolYear && filters.schoolYear !== "all") {
        result = result.filter((p) => p.schoolYear === filters.schoolYear);
      }
      if (filters.status && filters.status !== "all") {
        result = result.filter((p) => p.status === filters.status);
      }
    }

    return result.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );
  }

  async getById(id: number): Promise<RegistrationPeriod | undefined> {
    await delay(200);
    return this.periods.find((p) => p.id === id);
  }

  async create(data: CreatePeriodInput): Promise<RegistrationPeriod> {
    await delay(500);

    const newPeriod: RegistrationPeriod = {
      id: Math.max(...this.periods.map((p) => p.id), 0) + 1,
      ...data,
      status: "upcoming",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.periods.push(newPeriod);
    return newPeriod;
  }

  async update(
    id: number,
    data: UpdatePeriodInput,
  ): Promise<RegistrationPeriod | undefined> {
    await delay(400);
    const index = this.periods.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    this.periods[index] = {
      ...this.periods[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.periods[index];
  }

  async delete(id: number): Promise<boolean> {
    await delay(300);
    const index = this.periods.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.periods.splice(index, 1);
    // Also delete related quotas and topics
    this.teacherQuotas = this.teacherQuotas.filter((q) => q.periodId !== id);
    this.topics = this.topics.filter((t) => t.periodId !== id);
    return true;
  }

  async closePeriod(id: number): Promise<RegistrationPeriod | undefined> {
    return this.update(id, { status: "closed" });
  }

  async openPeriod(id: number): Promise<RegistrationPeriod | undefined> {
    return this.update(id, { status: "open" });
  }

  // ============================================================
  // TEACHER QUOTA MANAGEMENT
  // ============================================================

  async getTeacherQuotas(periodId: number): Promise<TeacherQuota[]> {
    await delay(250);
    return this.teacherQuotas
      .filter((q) => q.periodId === periodId)
      .sort((a, b) => a.teacherName.localeCompare(b.teacherName));
  }

  async updateTeacherQuota(
    periodId: number,
    teacherId: number,
    data: UpdateTeacherQuotaInput,
  ): Promise<TeacherQuota | undefined> {
    await delay(300);
    const index = this.teacherQuotas.findIndex(
      (q) => q.periodId === periodId && q.teacherId === teacherId,
    );
    if (index === -1) return undefined;

    this.teacherQuotas[index] = {
      ...this.teacherQuotas[index],
      assignedQuota: data.assignedQuota,
      maxStudents: data.assignedQuota,
      status:
        this.teacherQuotas[index].submittedTopics >= data.assignedQuota
          ? "sufficient"
          : "insufficient",
    };
    return this.teacherQuotas[index];
  }

  async notifyTeachers(periodId: number): Promise<{ notified: number }> {
    await delay(500);
    const now = new Date().toISOString();
    let notified = 0;

    this.teacherQuotas = this.teacherQuotas.map((q) => {
      if (q.periodId === periodId && q.status === "insufficient") {
        notified++;
        return { ...q, lastNotifiedAt: now };
      }
      return q;
    });

    return { notified };
  }

  // ============================================================
  // TOPIC MODERATION
  // ============================================================

  async getTopics(periodId: number): Promise<Topic[]> {
    await delay(250);
    return this.topics
      .filter((t) => t.periodId === periodId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  async approveTopic(
    topicId: number,
    data?: ApproveTopicInput,
  ): Promise<Topic | undefined> {
    await delay(300);
    const index = this.topics.findIndex((t) => t.id === topicId);
    if (index === -1) return undefined;

    this.topics[index] = {
      ...this.topics[index],
      status: "approved",
      moderatorNote: data?.moderatorNote,
      updatedAt: new Date().toISOString(),
    };
    return this.topics[index];
  }

  async rejectTopic(
    topicId: number,
    data: RejectTopicInput,
  ): Promise<Topic | undefined> {
    await delay(300);
    const index = this.topics.findIndex((t) => t.id === topicId);
    if (index === -1) return undefined;

    this.topics[index] = {
      ...this.topics[index],
      status: "rejected",
      rejectionReason: data.rejectionReason,
      moderatorNote: data.moderatorNote,
      updatedAt: new Date().toISOString(),
    };
    return this.topics[index];
  }

  async updateTopic(
    topicId: number,
    data: Partial<Topic>,
  ): Promise<Topic | undefined> {
    await delay(300);
    const index = this.topics.findIndex((t) => t.id === topicId);
    if (index === -1) return undefined;

    this.topics[index] = {
      ...this.topics[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.topics[index];
  }

  // ============================================================
  // HELPER METHODS
  // ============================================================

  async getExceptionRequests(periodId: number): Promise<ExceptionRequest[]> {
    await delay(250);
    // Filter by periodId if topics have periodId
    return mockExceptionRequests.filter((r) => {
      const topic = this.topics.find((t) => t.id === r.topicId);
      return topic?.periodId === periodId || r.topicId <= 5; // For demo: first 5 topics belong to period 1
    });
  }

  async approveException(
    periodId: number,
    requestId: number,
  ): Promise<ExceptionRequest | undefined> {
    await delay(400);
    const index = mockExceptionRequests.findIndex((r) => r.id === requestId);
    if (index === -1) return undefined;

    mockExceptionRequests[index] = {
      ...mockExceptionRequests[index],
      status: "approved",
    };

    // Also update the topic status
    const topicIndex = this.topics.findIndex(
      (t) => t.id === mockExceptionRequests[index].topicId,
    );
    if (topicIndex !== -1) {
      this.topics[topicIndex] = {
        ...this.topics[topicIndex],
        status: "approved",
        updatedAt: new Date().toISOString(),
      };
    }

    return mockExceptionRequests[index];
  }

  async rejectException(
    periodId: number,
    requestId: number,
    reason: string,
  ): Promise<ExceptionRequest | undefined> {
    await delay(400);
    const index = mockExceptionRequests.findIndex((r) => r.id === requestId);
    if (index === -1) return undefined;

    mockExceptionRequests[index] = {
      ...mockExceptionRequests[index],
      status: "rejected",
      rejectionReason: reason,
    };

    return mockExceptionRequests[index];
  }

  getSemesterOptions(): { value: string; label: string }[] {
    const semesters = [...new Set(this.periods.map((p) => p.semester))];
    return semesters.map((s) => ({
      value: s,
      label: s === "1" ? "Học kỳ 1" : s === "2" ? "Học kỳ 2" : "Học kỳ 3",
    }));
  }

  getSchoolYearOptions(): string[] {
    return [...new Set(this.periods.map((p) => p.schoolYear))].sort().reverse();
  }

  getPeriodStats(periodId: number): {
    totalTopics: number;
    pendingTopics: number;
    approvedTopics: number;
    rejectedTopics: number;
    totalQuotas: number;
    insufficientTeachers: number;
  } {
    const topics = this.topics.filter((t) => t.periodId === periodId);
    const quotas = this.teacherQuotas.filter((q) => q.periodId === periodId);

    return {
      totalTopics: topics.length,
      pendingTopics: topics.filter((t) => t.status === "pending").length,
      approvedTopics: topics.filter((t) => t.status === "approved").length,
      rejectedTopics: topics.filter((t) => t.status === "rejected").length,
      totalQuotas: quotas.length,
      insufficientTeachers: quotas.filter((q) => q.status === "insufficient")
        .length,
    };
  }
}

export const periodService = new PeriodService();
