import type {
  AlertEvent,
  AlertRecipientRole,
  AlertStatus,
  DeadlineType,
  GovernanceStageState,
  ProjectStatus,
  TopicAuditAction,
  TopicStatus,
} from "../types";

/** Trần tuyệt đối của chỉ tiêu đề tài mỗi giảng viên (đồng bộ BE). */
export const MAX_TOPIC_LIMIT_CEILING = 10;
/** Sĩ số tối đa mỗi đề tài (đồng bộ BE). */
export const MAX_STUDENTS_PER_TOPIC_CEILING = 3;
/** Offset alert được phép: 3 ngày, 1 ngày, đúng lúc hết hạn. */
export const ALLOWED_ALERT_OFFSETS = [0, 1, 3] as const;

export const DEADLINE_TYPES: DeadlineType[] = [
  "TOPIC_CREATION",
  "STUDENT_REGISTRATION",
  "TEACHER_APPROVAL",
  "PERIODIC_REPORT",
  "FINAL_SUBMISSION",
];

export const DEADLINE_TYPE_LABELS: Record<DeadlineType, string> = {
  TOPIC_CREATION: "Tạo / chỉnh sửa đề tài",
  STUDENT_REGISTRATION: "Sinh viên đăng ký đề tài",
  TEACHER_APPROVAL: "Giảng viên duyệt đăng ký",
  PERIODIC_REPORT: "Báo cáo tiến độ định kỳ",
  FINAL_SUBMISSION: "Nộp đồ án cuối kỳ",
};

export const DEADLINE_TYPE_HINTS: Record<DeadlineType, string> = {
  TOPIC_CREATION:
    "Sau mốc này giảng viên không thể tự tạo hoặc chỉnh sửa đề tài; Thư ký vẫn có thể điều chỉnh khi nêu rõ lý do.",
  STUDENT_REGISTRATION:
    "Sau mốc này sinh viên không tự đăng ký đề tài được nữa.",
  TEACHER_APPROVAL:
    "Sau mốc này, các đăng ký chưa được giảng viên xử lý sẽ chuyển sang chờ Thư ký.",
  PERIODIC_REPORT:
    "Cho phép nhiều mốc theo thứ tự; báo cáo chưa nộp sẽ được đánh dấu là thiếu.",
  FINAL_SUBMISSION: "Sau mốc này sinh viên không nộp đồ án cuối kỳ được nữa.",
};

/** Thứ tự nghiệp vụ bắt buộc giữa các giai đoạn một-mốc (đồng bộ BE). */
export const MAIN_DEADLINE_ORDERING: DeadlineType[] = [
  "TOPIC_CREATION",
  "STUDENT_REGISTRATION",
  "TEACHER_APPROVAL",
  "FINAL_SUBMISSION",
];

export const ALERT_OFFSET_LABELS: Record<number, string> = {
  3: "Trước 3 ngày",
  1: "Trước 1 ngày",
  0: "Đúng lúc hết hạn",
};

export const ALERT_EVENT_LABELS: Record<AlertEvent, string> = {
  DUE_IN_3_DAYS: "Còn 3 ngày",
  DUE_IN_1_DAY: "Còn 1 ngày",
  EXPIRED: "Đã hết hạn",
};

export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  PROCESSING: "Đang gửi",
  SENT: "Đã gửi",
  FAILED: "Thất bại",
};

export const ALERT_STATUS_COLORS: Record<
  AlertStatus,
  "info" | "success" | "error"
> = {
  PROCESSING: "info",
  SENT: "success",
  FAILED: "error",
};

export const RECIPIENT_ROLE_LABELS: Record<AlertRecipientRole, string> = {
  TEACHER: "Giảng viên",
  STUDENT: "Sinh viên",
  SECRETARY: "Thư ký",
};

export const RECIPIENT_ROLES: AlertRecipientRole[] = [
  "TEACHER",
  "STUDENT",
  "SECRETARY",
];

export const TOPIC_STATUS_LABELS: Record<TopicStatus, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Bị từ chối",
};

export const TOPIC_STATUS_COLORS: Record<
  TopicStatus,
  "warning" | "success" | "error"
> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "error",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  PENDING: "Chờ GV duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Bị từ chối",
  WAITING_SECRETARY: "Chờ Thư ký",
  ASSIGNED: "Được gán",
};

export const PROJECT_STATUS_COLORS: Record<
  ProjectStatus,
  "warning" | "success" | "error" | "info" | "secondary"
> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "error",
  WAITING_SECRETARY: "info",
  ASSIGNED: "secondary",
};

export const AUDIT_ACTION_LABELS: Record<TopicAuditAction, string> = {
  FORCE_UPDATE: "Sửa cưỡng bức",
  BULK_APPROVE: "Duyệt hàng loạt",
  BULK_REJECT: "Từ chối hàng loạt",
  MANUAL_ASSIGN: "Gán sinh viên",
  SUPPLEMENTAL_CREATE: "Tạo đề tài bổ sung",
  CODE_GENERATE: "Sinh mã đề tài",
  CREATE: "Tạo đề tài",
  UPDATE: "Cập nhật đề tài",
  REGISTRATION_APPROVE: "Duyệt đăng ký",
  REGISTRATION_REJECT: "Từ chối đăng ký",
  DELETE: "Xóa đề tài",
};

export const STAGE_STATE_LABELS: Record<GovernanceStageState, string> = {
  DISABLED: "Tắt",
  CLOSED: "Đã đóng",
  UPCOMING: "Sắp mở",
  OPEN: "Đang mở",
};

export const STAGE_STATE_COLORS: Record<
  GovernanceStageState,
  "default" | "error" | "info" | "success"
> = {
  DISABLED: "default",
  CLOSED: "error",
  UPCOMING: "info",
  OPEN: "success",
};

/**
 * Số ngày lệch mặc định khi đợt chưa có deadline nào được cấu hình.
 * Giá trị chỉ là điểm khởi đầu để người dùng chỉnh lại.
 */
export const DEFAULT_DEADLINE_OFFSET_DAYS: Record<DeadlineType, number> = {
  TOPIC_CREATION: 7,
  STUDENT_REGISTRATION: 21,
  TEACHER_APPROVAL: 28,
  PERIODIC_REPORT: 49,
  FINAL_SUBMISSION: 70,
};
