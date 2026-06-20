// ============================================================
// MOCK DATA: Registrations - Đăng ký đề tài
// ============================================================
import type {
  ThesisRegistration,
  RegistrationStatus,
} from "../types";

export const mockRegistrations: ThesisRegistration[] = [
  {
    id: "reg-001",
    studentId: "sv-001",
    studentName: "Nguyễn Văn A",
    studentMssv: "20200001",
    topicId: "topic-001",
    topicName: "Ứng dụng AI trong chẩn đoán bệnh",
    supervisorId: "gv-001",
    supervisorName: "TS. Nguyễn Văn X",
    status: "in_progress",
    registeredAt: "2024-02-15",
    confirmedAt: "2024-02-20",
    note: "Đăng ký sớm",
  },
  {
    id: "reg-002",
    studentId: "sv-002",
    studentName: "Trần Thị B",
    studentMssv: "20200002",
    topicId: "topic-002",
    topicName: "Hệ thống quản lý học tập LMS",
    supervisorId: "gv-002",
    supervisorName: "ThS. Trần Thị Y",
    status: "completed",
    registeredAt: "2024-01-10",
    confirmedAt: "2024-01-15",
    completedAt: "2024-05-15",
  },
  {
    id: "reg-003",
    studentId: "sv-003",
    studentName: "Lê Văn C",
    studentMssv: "20200003",
    topicId: "topic-003",
    topicName: "Ứng dụng Blockchain trong logistics",
    supervisorId: "gv-003",
    supervisorName: "PGS. Lê Văn Z",
    status: "pending_supervisor",
    registeredAt: "2024-04-01",
  },
  {
    id: "reg-004",
    studentId: "sv-004",
    studentName: "Phạm Thị D",
    studentMssv: "20200004",
    topicId: "topic-004",
    topicName: "Xử lý ảnh y tế bằng Deep Learning",
    supervisorId: "gv-001",
    supervisorName: "TS. Nguyễn Văn X",
    status: "rejected",
    registeredAt: "2024-03-01",
    rejectionReason: "Đề tài trùng với đề tài đã được duyệt của SV khác",
  },
  {
    id: "reg-005",
    studentId: "sv-005",
    studentName: "Hoàng Văn E",
    studentMssv: "20200005",
    topicId: "topic-005",
    topicName: "Chatbot hỗ trợ tuyển sinh",
    supervisorId: "gv-004",
    supervisorName: "TS. Hoàng Văn W",
    status: "paused",
    registeredAt: "2024-02-01",
    confirmedAt: "2024-02-05",
    note: "SV xin bảo lưu do hoàn cảnh gia đình",
  },
  {
    id: "reg-006",
    studentId: "sv-006",
    studentName: "Vũ Thị F",
    studentMssv: "20200006",
    topicId: "topic-001",
    topicName: "Ứng dụng AI trong chẩn đoán bệnh",
    supervisorId: "gv-001",
    supervisorName: "TS. Nguyễn Văn X",
    status: "in_progress",
    registeredAt: "2024-02-20",
    confirmedAt: "2024-02-25",
  },
];

export const getRegistrationStatusColor = (
  status: RegistrationStatus
): "default" | "warning" | "info" | "success" | "error" => {
  const colors: Record<RegistrationStatus, "default" | "warning" | "info" | "success" | "error"> = {
    pending_supervisor: "warning",
    confirmed: "info",
    rejected: "error",
    in_progress: "info",
    paused: "default",
    completed: "success",
    withdrawn: "default",
  };
  return colors[status];
};
