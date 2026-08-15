// ============================================================
// SERVICES — My Topics Feature (Teacher)
// ============================================================

import type {
  MyTopic,
  PendingRequest,
  Student,
  CreateTopicInput,
  UpdateTopicInput,
  ApproveRegistrationInput,
  RejectRegistrationInput,
} from "../types";
import { periodService } from "@/feature/registration-period/services";

// Mock data cho sinh viên
const mockStudents: Student[] = [
  {
    id: 1,
    code: "2200000001",
    name: "Nguyễn Văn A",
    email: "a@fpt.edu.vn",
    className: "D21CNPM01",
  },
  {
    id: 2,
    code: "2200000012",
    name: "Trần Thị B",
    email: "b@fpt.edu.vn",
    className: "D21CNPM01",
  },
  {
    id: 3,
    code: "2200000023",
    name: "Lê Văn C",
    email: "c@fpt.edu.vn",
    className: "D21CNPM02",
  },
  {
    id: 4,
    code: "2200000034",
    name: "Phạm Thị D",
    email: "d@fpt.edu.vn",
    className: "D21CNPM02",
  },
  {
    id: 5,
    code: "2200000045",
    name: "Hoàng Văn E",
    email: "e@fpt.edu.vn",
    className: "D21CNPM03",
  },
  {
    id: 6,
    code: "2200000056",
    name: "Ngô Thị F",
    email: "f@fpt.edu.vn",
    className: "D21CNPM03",
  },
  {
    id: 7,
    code: "2200000067",
    name: "Đặng Văn G",
    email: "g@fpt.edu.vn",
    className: "D21CNPM04",
  },
  {
    id: 8,
    code: "2200000078",
    name: "Bùi Thị H",
    email: "h@fpt.edu.vn",
    className: "D21CNPM04",
  },
  {
    id: 9,
    code: "2200000089",
    name: "Vũ Minh I",
    email: "i@fpt.edu.vn",
    className: "D21CNTT01",
  },
  {
    id: 10,
    code: "2200000091",
    name: "Đỗ Thuỳ J",
    email: "j@fpt.edu.vn",
    className: "D21CNTT01",
  },
  {
    id: 11,
    code: "2200000112",
    name: "Bạch Kim K",
    email: "k@fpt.edu.vn",
    className: "D21CNTT02",
  },
  {
    id: 12,
    code: "2200000123",
    name: "Trịnh Lan L",
    email: "l@fpt.edu.vn",
    className: "D21CNTT02",
  },
  {
    id: 13,
    code: "2200000134",
    name: "Hứa Đức M",
    email: "m@fpt.edu.vn",
    className: "D21CNPM05",
  },
  {
    id: 14,
    code: "2200000145",
    name: "Đinh Ngọc N",
    email: "n@fpt.edu.vn",
    className: "D21CNPM05",
  },
  {
    id: 15,
    code: "2200000156",
    name: "Chu Thị O",
    email: "o@fpt.edu.vn",
    className: "D21CNPM06",
  },
  {
    id: 16,
    code: "2200000167",
    name: "Lý Minh P",
    email: "p@fpt.edu.vn",
    className: "D21CNPM06",
  },
  {
    id: 17,
    code: "2200000178",
    name: "Tạ Thuỳ Q",
    email: "q@fpt.edu.vn",
    className: "D21CNPM07",
  },
  {
    id: 18,
    code: "2200000189",
    name: "Phan Văn R",
    email: "r@fpt.edu.vn",
    className: "D21CNPM07",
  },
  {
    id: 19,
    code: "2200000192",
    name: "Nguyễn Hương S",
    email: "s@fpt.edu.vn",
    className: "D21CNPM08",
  },
  {
    id: 20,
    code: "2200000203",
    name: "Trương Đức T",
    email: "t@fpt.edu.vn",
    className: "D21CNPM08",
  },
];

// Mock data cho đề tài
const mockTopics: MyTopic[] = [
  {
    id: 1,
    periodId: 1,
    periodName: "HK1 2025-2026",
    name: "Xây dựng hệ thống quản lý thư viện",
    description:
      "Phát triển ứng dụng web quản lý thư viện với các chức năng mượn/trả sách, quản lý độc giả",
    maxStudents: 3,
    status: "Approved",
    isException: false,
    registrationStatus: "OPEN", // 1/3 sinh viên - đang mở
    preAssignedStudents: [
      {
        id: 1,
        studentId: 1,
        studentName: "Nguyễn Văn A",
        studentCode: "2200000001",
        order: 1,
      },
    ],
    registeredStudents: [
      {
        id: 1,
        studentId: 1,
        studentName: "Nguyễn Văn A",
        studentCode: "2200000001",
        status: "Approved",
        registeredAt: "2025-09-15T10:00:00Z",
        approvedAt: "2025-09-16T14:00:00Z",
        approvedBy: 1,
      },
      {
        id: 2,
        studentId: 2,
        studentName: "Trần Thị B",
        studentCode: "2200000012",
        status: "Pending",
        registeredAt: "2025-09-16T09:00:00Z",
      },
    ],
    createdAt: "2025-08-01T08:00:00Z",
    updatedAt: "2025-09-16T14:00:00Z",
  },
  {
    id: 2,
    periodId: 1,
    periodName: "HK1 2025-2026",
    name: "Ứng dụng AI trong phát hiện bệnh qua ảnh X-quang",
    description:
      "Sử dụng deep learning để phân loại bệnh lao từ ảnh X-quang lồng ngực",
    maxStudents: 2,
    status: "Approved",
    isException: false,
    registrationStatus: "LOCKED", // 2/2 sinh viên - giảng viên đã chốt
    preAssignedStudents: [],
    registeredStudents: [
      {
        id: 3,
        studentId: 3,
        studentName: "Lê Văn C",
        studentCode: "2200000023",
        status: "Approved",
        registeredAt: "2025-09-14T11:00:00Z",
        approvedAt: "2025-09-15T10:00:00Z",
        approvedBy: 1,
      },
      {
        id: 4,
        studentId: 4,
        studentName: "Phạm Thị D",
        studentCode: "2200000034",
        status: "Approved",
        registeredAt: "2025-09-14T14:00:00Z",
        approvedAt: "2025-09-15T10:00:00Z",
        approvedBy: 1,
      },
    ],
    createdAt: "2025-08-05T09:00:00Z",
    updatedAt: "2025-09-15T10:00:00Z",
  },
  {
    id: 3,
    periodId: 1,
    periodName: "HK1 2025-2026",
    name: "Hệ thống IoT giám sát chất lượng không khí",
    description:
      "Thu thập dữ liệu từ cảm biến và hiển thị chỉ số AQI theo thời gian thực",
    maxStudents: 2,
    status: "Pending",
    isException: false,
    registrationStatus: "OPEN", // 0/2 sinh viên - đang mở
    preAssignedStudents: [],
    registeredStudents: [],
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2025-09-01T10:00:00Z",
  },
  {
    id: 4,
    periodId: 1,
    periodName: "HK1 2025-2026",
    name: "Ứng dụng giao hàng nhanh cho startup",
    description:
      "Nền tảng giao hàng nhanh với tracking thời gian thực (Đề xuất ngoại lệ)",
    maxStudents: 4,
    status: "Waiting_For_Secretary",
    isException: true,
    rejectionReason: "Cần Thư ký phê duyệt do vượt quá sĩ số cho phép",
    registrationStatus: "FULL", // Đề tài đầy
    preAssignedStudents: [
      {
        id: 5,
        studentId: 5,
        studentName: "Hoàng Văn E",
        studentCode: "2200000045",
        order: 1,
      },
      {
        id: 6,
        studentId: 6,
        studentName: "Ngô Thị F",
        studentCode: "2200000056",
        order: 2,
      },
    ],
    registeredStudents: [],
    createdAt: "2025-09-10T15:00:00Z",
    updatedAt: "2025-09-10T15:00:00Z",
  },
];

// Mock data cho yêu cầu chờ duyệt
let mockPendingRequests: PendingRequest[] = [
  {
    id: 1,
    studentId: 2,
    studentName: "Trần Thị B",
    studentCode: "2200000012",
    topicId: 1,
    topicName: "Xây dựng hệ thống quản lý thư viện",
    requestedAt: "2025-09-16T09:00:00Z",
    status: "Pending",
  },
  {
    id: 2,
    studentId: 7,
    studentName: "Đặng Văn G",
    studentCode: "2200000067",
    topicId: 2,
    topicName: "Ứng dụng AI trong phát hiện bệnh qua ảnh X-quang",
    requestedAt: "2025-09-17T08:00:00Z",
    status: "Pending",
  },
  {
    id: 3,
    studentId: 8,
    studentName: "Bùi Thị H",
    studentCode: "2200000078",
    topicId: 3,
    topicName: "Hệ thống IoT giám sát chất lượng không khí",
    requestedAt: "2025-09-17T10:00:00Z",
    status: "Pending",
  },
];

// Helper function to get student code from mockStudents
function getStudentCode(studentId: number): string {
  const student = mockStudents.find((s) => s.id === studentId);
  return student?.code || `220000${String(studentId).padStart(4, "0")}`;
}

class MyTopicService {
  private topics = [...mockTopics];

  async getAll(): Promise<MyTopic[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...this.topics];
  }

  async getById(id: number): Promise<MyTopic | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return this.topics.find((t) => t.id === id) || null;
  }

  async create(data: CreateTopicInput): Promise<MyTopic> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validate sĩ số với giới hạn của ngành (nếu có)
    if (data.teacherDepartment) {
      const validation = periodService.validateTopicMaxStudents(
        data.periodId,
        data.teacherDepartment,
        data.maxStudents,
      );
      if (!validation.valid) {
        throw new Error(validation.message || "Sĩ số không hợp lệ");
      }
    }

    const newTopic: MyTopic = {
      id: Math.max(...this.topics.map((t) => t.id)) + 1,
      periodId: data.periodId,
      periodName: "HK1 2025-2026",
      name: data.name,
      description: data.description,
      maxStudents: data.maxStudents,
      status: data.isException ? "Waiting_For_Secretary" : "Pending",
      isException: data.isException || false,
      registrationStatus: "OPEN", // Mặc định là mở đăng ký
      preAssignedStudents:
        data.preAssignedStudentIds?.map((studentId, index) => ({
          id: index + 1,
          studentId,
          studentName: `Sinh viên ${studentId}`,
          studentCode: getStudentCode(studentId),
          order: index + 1,
        })) || [],
      registeredStudents:
        data.preAssignedStudentIds?.map((studentId, index) => {
          const allRequestIds = this.topics.flatMap(
            (t) => t.registeredStudents?.map((r) => r.id) || [],
          );
          const maxRequestId =
            allRequestIds.length > 0 ? Math.max(...allRequestIds) : 0;
          return {
            id: maxRequestId + index + 1,
            studentId,
            studentName: `Sinh viên ${studentId}`,
            studentCode: getStudentCode(studentId),
            status: data.isException ? "Pending" : "Approved",
            registeredAt: new Date().toISOString(),
            approvedAt: data.isException ? undefined : new Date().toISOString(),
            approvedBy: data.isException ? undefined : 1,
          };
        }) || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.topics.push(newTopic);
    return newTopic;
  }

  async update(id: number, data: UpdateTopicInput): Promise<MyTopic> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = this.topics.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Topic not found");

    this.topics[index] = {
      ...this.topics[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return this.topics[index];
  }

  async delete(id: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = this.topics.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Topic not found");
    this.topics.splice(index, 1);
  }

  // Lấy tất cả yêu cầu chờ duyệt
  async getPendingRequests(): Promise<PendingRequest[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...mockPendingRequests];
  }

  // Duyệt đăng ký
  async approveRegistration(data: ApproveRegistrationInput): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Cập nhật registeredStudents trong topic
    const topic = this.topics.find((t) => t.id === data.topicId);
    if (!topic) throw new Error("Topic not found");

    const student = topic.registeredStudents.find(
      (s) => s.studentId === data.studentId,
    );
    if (student) {
      student.status = "Approved";
      student.approvedAt = new Date().toISOString();
      student.approvedBy = 1;
    }

    // Xóa khỏi pending requests
    mockPendingRequests = mockPendingRequests.filter(
      (r) => !(r.topicId === data.topicId && r.studentId === data.studentId),
    );
  }

  // Từ chối đăng ký
  async rejectRegistration(data: RejectRegistrationInput): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Cập nhật registeredStudents trong topic
    const topic = this.topics.find((t) => t.id === data.topicId);
    if (!topic) throw new Error("Topic not found");

    const student = topic.registeredStudents.find(
      (s) => s.studentId === data.studentId,
    );
    if (student) {
      student.status = "Rejected";
      student.rejectedAt = new Date().toISOString();
      student.rejectedBy = 1;
      student.rejectionReason = data.reason;
    }

    // Xóa khỏi pending requests
    mockPendingRequests = mockPendingRequests.filter(
      (r) => !(r.topicId === data.topicId && r.studentId === data.studentId),
    );
  }

  // Tìm kiếm sinh viên theo mã SV
  async searchStudents(query: string): Promise<Student[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();
    return mockStudents.filter(
      (s) =>
        s.code.toLowerCase().includes(lowerQuery) ||
        s.name.toLowerCase().includes(lowerQuery),
    );
  }

  // Lấy sĩ số hiện tại của đề tài
  getTopicEnrollment(topicId: number): number {
    const topic = this.topics.find((t) => t.id === topicId);
    if (!topic) return 0;
    return topic.registeredStudents.filter((s) => s.status === "Approved")
      .length;
  }

  // Lấy sĩ số tối đa cho một ngành trong đợt
  getMaxStudentsForDepartment(periodId: number, department: string): number {
    return periodService.getMaxStudentsForDepartment(periodId, department);
  }

  // Lấy tất cả cấu hình sĩ số theo ngành của đợt
  getDepartmentStudentLimits(
    periodId: number,
  ): { department: string; maxStudents: number }[] {
    return periodService.getDepartmentStudentLimits(periodId);
  }
}

export const myTopicService = new MyTopicService();
