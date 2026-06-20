// ============================================================
// MOCK DATA: Exceptions - Xử lý ngoại lệ
// ============================================================
import type {
  ThesisException,
  ExceptionType,
  ExceptionStatus,
  ExceptionHistory,
} from "../types";

const createHistory = (
  actions: Array<{ action: string; performedBy: string; note?: string }>
): ExceptionHistory[] => {
  return actions.map((a, index) => ({
    action: a.action,
    performedBy: a.performedBy,
    performedAt: new Date(Date.now() - (actions.length - index) * 86400000).toISOString().split("T")[0],
    note: a.note,
  }));
};

export const mockExceptions: ThesisException[] = [
  {
    id: "exc-001",
    registrationId: "reg-004",
    studentId: "sv-004",
    studentName: "Phạm Thị D",
    type: "topic_change",
    status: "pending",
    reason: "Đề tài cũ bị trùng lặp. Xin đổi sang đề tài mới: 'Phân loại bệnh qua ảnh X-quang sử dụng CNN'",
    supportingDocuments: ["don_xin_doi_de_tai.pdf"],
    createdAt: "2024-03-15",
    updatedAt: "2024-03-15",
  },
  {
    id: "exc-002",
    registrationId: "reg-005",
    studentId: "sv-005",
    studentName: "Hoàng Văn E",
    type: "pause_request",
    status: "approved",
    reason: "Gia đình có hoàn cảnh khó khăn, xin bảo lưu 2 tháng",
    supportingDocuments: ["giay_xac_nhan_gia_dinh.pdf"],
    processedBy: "tk-001",
    processedAt: "2024-02-10",
    processedNote: "Đồng ý bảo lưu đến 01/04/2024",
    history: createHistory([
      { action: "SV gửi yêu cầu bảo lưu", performedBy: "sv-005" },
      { action: "Thư ký xem xét và chuyển GV duyệt", performedBy: "tk-001" },
      { action: "GV đồng ý", performedBy: "gv-004", note: "Đồng ý bảo lưu" },
      { action: "Thư ký xác nhận", performedBy: "tk-001" },
    ]),
    createdAt: "2024-02-05",
    updatedAt: "2024-02-10",
  },
  {
    id: "exc-003",
    registrationId: "reg-006",
    studentId: "sv-006",
    studentName: "Vũ Thị F",
    type: "late_submission",
    status: "resolved",
    reason: "Nộp milestone 'Thu thập dữ liệu' muộn 3 ngày do vấn đề kỹ thuật",
    supportingDocuments: [],
    processedBy: "gv-001",
    processedAt: "2024-04-05",
    processedNote: "Cảnh cáo, không trừ điểm do lần đầu",
    history: createHistory([
      { action: "SV nộp muộn milestone", performedBy: "sv-006" },
      { action: "GV nhận thông báo muộn", performedBy: "system" },
      { action: "SV giải thích lý do", performedBy: "sv-006", note: "Server lỗi 3 ngày" },
      { action: "GV xử lý", performedBy: "gv-001" },
    ]),
    createdAt: "2024-04-04",
    updatedAt: "2024-04-05",
  },
  {
    id: "exc-004",
    registrationId: "reg-002",
    studentId: "sv-002",
    studentName: "Trần Thị B",
    type: "score_appeal",
    status: "rejected",
    reason: "Khiếu nại điểm phản biện: cho rằng điểm phương pháp chấm thấp hơn thực tế",
    supportingDocuments: ["don_khieu_nai.pdf", "bang_diem_cham_lai.pdf"],
    processedBy: "hoidong-001",
    processedAt: "2024-05-25",
    processedNote: "Sau khi xem xét lại, điểm chấm đúng theo rubric. Giữ nguyên điểm",
    history: createHistory([
      { action: "SV gửi khiếu nại", performedBy: "sv-002" },
      { action: "Thư ký chuyển hội đồng", performedBy: "tk-001" },
      { action: "Hội đồng xem xét", performedBy: "hoidong-001" },
      { action: "Bác khiếu nại", performedBy: "hoidong-001", note: "Điểm chấm đúng rubric" },
    ]),
    createdAt: "2024-05-22",
    updatedAt: "2024-05-25",
  },
  {
    id: "exc-005",
    registrationId: "reg-008",
    studentId: "sv-008",
    studentName: "Bùi Văn H",
    type: "extension_request",
    status: "pending",
    reason: "Xin gia hạn deadline milestone 'Hoàn thiện báo cáo' thêm 5 ngày do sức khỏe",
    supportingDocuments: ["giay_ra_vien.pdf"],
    createdAt: "2024-06-02",
    updatedAt: "2024-06-02",
  },
  {
    id: "exc-006",
    registrationId: "reg-009",
    studentId: "sv-009",
    studentName: "Ngô Thị I",
    type: "supervisor_change",
    status: "resolved",
    reason: "GV hướng dẫn cũ nghỉ phép dài hạn, xin chuyển sang GV mới",
    supportingDocuments: ["quyet_dinh_nghi_phep.pdf"],
    processedBy: "tk-001",
    processedAt: "2024-03-01",
    processedNote: "Đã chuyển sang TS. Nguyễn Văn X hướng dẫn",
    history: createHistory([
      { action: "SV gửi yêu cầu đổi GV", performedBy: "sv-009" },
      { action: "Thư ký xác nhận lý do", performedBy: "tk-001" },
      { action: "Tìm GV thay thế", performedBy: "tk-001", note: "TS. Nguyễn Văn X nhận" },
      { action: "GV mới xác nhận", performedBy: "gv-001" },
    ]),
    createdAt: "2024-02-28",
    updatedAt: "2024-03-01",
  },
  {
    id: "exc-007",
    registrationId: "reg-010",
    studentId: "sv-010",
    studentName: "Đỗ Văn K",
    type: "revision_request",
    status: "resolved",
    reason: "Hội đồng yêu cầu chỉnh sửa báo cáo và code sau bảo vệ",
    supportingDocuments: [],
    processedBy: "gv-002",
    processedAt: "2024-05-25",
    processedNote: "SV đã hoàn thành chỉnh sửa theo yêu cầu",
    history: createHistory([
      { action: "Hội đồng yêu cầu chỉnh sửa", performedBy: "hoidong-001" },
      { action: "Tạo task chỉnh sửa", performedBy: "tk-001" },
      { action: "SV hoàn thành và nộp", performedBy: "sv-010" },
      { action: "GV xác nhận hoàn tất", performedBy: "gv-002" },
    ]),
    createdAt: "2024-05-23",
    updatedAt: "2024-05-25",
  },
];

export const getExceptionStatusColor = (
  status: ExceptionStatus
): "default" | "warning" | "info" | "success" | "error" => {
  const colors: Record<ExceptionStatus, "default" | "warning" | "info" | "success" | "error"> = {
    pending: "warning",
    approved: "success",
    rejected: "error",
    resolved: "info",
  };
  return colors[status];
};

export const getExceptionTypeLabel = (type: ExceptionType): string => {
  const labels: Record<ExceptionType, string> = {
    late_submission: "Nộp muộn",
    topic_change: "Đổi đề tài",
    supervisor_change: "Đổi GVHD",
    extension_request: "Xin gia hạn",
    pause_request: "Xin bảo lưu",
    score_appeal: "Khiếu nại điểm",
    revision_request: "Yêu cầu chỉnh sửa sau BV",
  };
  return labels[type];
};
