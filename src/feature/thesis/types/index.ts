// ============================================================
// THESIS TYPES - Mở rộng theo thiết kế luồng xử lý 4 giai đoạn
// ============================================================

// ---------- 1. GIAI ĐOẠN A: Khởi tạo & Đăng ký Đề tài ----------

export type TopicStatus =
  | "draft"           // Nháp
  | "pending"         // Chờ duyệt
  | "approved"        // Đã duyệt
  | "rejected"        // Từ chối
  | "has_registrations" // Đã có SV đăng ký
  | "full"            // Đầy slot
  | "in_progress"     // Đang thực hiện
  | "completed"       // Hoàn thành
  | "cancelled";     // Hủy

export interface ThesisTopic {
  id: string;
  code: string;                    // Mã đề tài
  name: string;                    // Tên đề tài (VN)
  nameEn?: string;                  // Tên tiếng Anh
  field: string;                    // Lĩnh vực
  department: string;               // Khoa
  lecturer: string;                 // GV hướng dẫn
  lecturerId: string;               // ID GV
  maxStudents: number;              // Số SV tối đa
  registeredStudents: string[];     // Danh sách SV đã đăng ký
  description: string;              // Mô tả/yêu cầu đầu vào
  requirements?: string;            // Yêu cầu kỹ thuật
  attachments?: string[];           // File đính kèm
  semester: string;                 // Đợt khóa luận
  status: TopicStatus;
  rejectionReason?: string;         // Lý do từ chối (nếu có)
  createdAt: string;
  updatedAt: string;
}

// ---------- 2. ĐĂNG KÝ CỦA SV ----------

export type RegistrationStatus =
  | "pending_supervisor"   // Chờ GV xác nhận
  | "confirmed"            // Đã xác nhận
  | "rejected"             // Từ chối
  | "in_progress"          // Đang thực hiện
  | "paused"               // Tạm ngưng (xin gia hạn, bảo lưu)
  | "completed"            // Hoàn thành
  | "withdrawn";           // Rút đăng ký

export interface ThesisRegistration {
  id: string;
  studentId: string;               // ID sinh viên
  studentName: string;             // Tên SV
  studentMssv: string;             // MSSV
  topicId: string;                 // ID đề tài
  topicName: string;              // Tên đề tài
  supervisorId: string;           // ID GV hướng dẫn
  supervisorName: string;         // Tên GV
  status: RegistrationStatus;
  registeredAt: string;            // Ngày đăng ký
  confirmedAt?: string;            // Ngày xác nhận
  completedAt?: string;            // Ngày hoàn thành
  rejectionReason?: string;        // Lý do từ chối
  note?: string;                   // Ghi chú
}

// ---------- 3. GIAI ĐOẠN B: Thực hiện - Milestone/Task ----------

export type MilestoneStatus =
  | "not_started"   // Chưa bắt đầu
  | "in_progress"   // Đang thực hiện
  | "overdue"       // Trễ hạn
  | "submitted"     // Đã nộp
  | "approved"      // GV duyệt
  | "revision"     // Yêu cầu chỉnh sửa
  | "completed";   // Hoàn thành

export interface Milestone {
  id: string;
  thesisId: string;                // ID đồ án
  name: string;                   // Tên milestone
  description: string;            // Mô tả chi tiết
  deadline: string;                 // Hạn nộp
  weight: number;                  // % trọng số trong tổng tiến độ (0-100)
  status: MilestoneStatus;
  attachments?: string[];           // File sản phẩm đính kèm
  submittedAt?: string;            // Ngày nộp
  approvedAt?: string;             // Ngày duyệt
  revisionNote?: string;           // Ghi chú yêu cầu chỉnh sửa
  createdBy: string;               // Người tạo (GV)
  createdAt: string;
  updatedAt: string;
}

// ---------- 4. BÁO CÁO TUẦN ----------

export type WeeklyReportStatus =
  | "draft"        // Nháp
  | "submitted"    // Đã nộp
  | "waiting_feedback" // Đang chờ phản hồi
  | "approved"     // Đã duyệt
  | "revision";    // Yêu cầu nộp lại

export interface WeeklyReport {
  id: string;
  registrationId: string;          // ID đăng ký
  studentId: string;               // ID SV
  studentName: string;             // Tên SV
  weekNumber: number;              // Tuần số
  year: number;                    // Năm học
  semester: string;                // Học kỳ
  
  // Nội dung báo cáo
  completedWork: string;           // Công việc đã làm
  obstacles: string;               // Vướng mắc
  nextWeekPlan: string;            // Kế hoạch tuần sau
  selfProgress: number;            // % hoàn thành tự đánh giá (0-100)
  attachments?: string[];           // File/link demo
  
  // Phản hồi GV
  status: WeeklyReportStatus;
  supervisorFeedback?: string;      // Phản hồi của GV
  progressScore?: number;          // Điểm tiến độ (nếu chấm theo tuần)
  feedbackAt?: string;             // Ngày phản hồi
  
  // Version tracking - lưu lịch sử các lần nộp lại
  version: number;                  // Số lần nộp
  previousVersions?: WeeklyReport[]; // Các phiên bản trước
  
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ---------- 5. GIAI ĐOẠN C: Đánh giá trước bảo vệ ----------

// Điểm của GV hướng dẫn - 4 tiêu chí
export interface SupervisorScore {
  registrationId: string;
  supervisorId: string;
  
  // 4 tiêu chí chấm điểm (configurable)
  progressScore: number;           // Tiến độ thực hiện (0-10)
  skillScore: number;              // Kỹ năng/kỹ thuật (0-10)
  attitudeScore: number;           // Tinh thần/thái độ (0-10)
  reportScore: number;             // Chất lượng báo cáo (0-10)
  
  totalScore: number;              // Tổng điểm (sau khi tính trọng số)
  supervisorComment?: string;      // Nhận xét
  scoredAt: string;
}

// Điểm của GV phản biện
export interface ReviewerScore {
  registrationId: string;
  reviewerId: string;              // ID GV phản biện
  reviewerName: string;
  
  // Các tiêu chí phản biện (rubric riêng)
  contentScore: number;           // Nội dung (0-10)
  methodologyScore: number;        // Phương pháp nghiên cứu (0-10)
  resultScore: number;             // Kết quả đạt được (0-10)
  presentationScore: number;        // Trình bày (0-10)
  
  totalScore: number;              // Tổng điểm
  reviewerComment?: string;        // Nhận xét phản biện
  scoredAt: string;
}

// ---------- 6. HỒ SƠ BẢO VỆ ----------

export type DefenseStatus =
  | "not_ready"      // Chưa đủ điều kiện
  | "ready"          // Đủ điều kiện
  | "scheduled"      // Đã lên lịch
  | "defending"      // Đang bảo vệ
  | "defended"       // Đã bảo vệ - chờ tổng hợp điểm
  | "completed"      // Hoàn thành
  | "retake";        // Phải bảo vệ lại

export interface DefenseSchedule {
  id: string;
  room: string;                    // Phòng
  date: string;                     // Ngày
  timeSlot: string;                  // Ca (VD: "08:00 - 08:30")
  councilId: string;                // ID hội đồng
  councilName: string;              // Tên hội đồng
  councilMembers: CouncilMember[];  // Thành viên hội đồng
  defenses: DefenseRecord[];        // Danh sách bảo vệ trong ca
}

export interface CouncilMember {
  id: string;
  name: string;
  role: "chairman" | "secretary" | "member";  // Chủ tịch, Thư ký, Thành viên
  department: string;
}

export interface DefenseRecord {
  id: string;
  registrationId: string;
  studentId: string;
  studentName: string;
  studentMssv: string;
  thesisTitle: string;
  scheduleId: string;
  status: DefenseStatus;
  presentationTime?: number;       // Thời gian trình bày (phút)
  defenseStartedAt?: string;
  defenseEndedAt?: string;
}

// Legacy alias for DefenseRecord
export interface ThesisDefense extends DefenseRecord {
  score?: number | null;
  student?: string;
  thesis?: string;
  date?: string;
  room?: string;
  time?: string;
}

// Điểm hội đồng
export interface CouncilScore {
  defenseId: string;
  councilMemberId: string;
  councilMemberName: string;
  
  // Tiêu chí chấm điểm của hội đồng
  contentQuality: number;           // Chất lượng nội dung (0-10)
  methodology: number;             // Phương pháp (0-10)
  resultContribution: number;      // Đóng góp kết quả (0-10)
  qaPerformance: number;          // Trả lời câu hỏi (0-10)
  presentation: number;            // Trình bày (0-10)
  
  totalScore: number;
  comment?: string;
  scoredAt: string;
}

// ---------- 7. TỔNG HỢP ĐIỂM ----------

// Trọng số cấu hình được (Admin set)
export interface ScoreWeightConfig {
  id: string;
  semester: string;
  supervisorWeight: number;        // VD: 0.4 (40%)
  reviewerWeight: number;          // VD: 0.2 (20%)
  councilWeight: number;           // VD: 0.4 (40%)
  createdBy: string;
  createdAt: string;
}

export interface FinalScore {
  registrationId: string;

  // Các thành phần điểm
  supervisorScore: number;         // Điểm GVHD
  reviewerScore: number;           // Điểm phản biện
  councilScore: number;            // Điểm hội đồng (trung bình các thành viên)

  // Trọng số
  weightConfig: ScoreWeightConfig;

  // Điểm cuối
  finalScore: number;
  letterGrade?: string;            // A, B, C, D, F

  // Trạng thái
  isAppealed: boolean;             // Có khiếu nại không
  appealNote?: string;            // Ghi chú khiếu nại
  finaledAt?: string;              // Ngày chốt điểm
}

// Legacy alias
export interface ThesisScore extends FinalScore {
  // Legacy fields for UI compatibility
  id?: string;
  student?: string;
  studentId?: string;
  studentName?: string;
  mssv?: string;
  thesis?: string;
  thesisTitle?: string;
  // Individual rubric scores (used in UI)
  processScore?: number;
  reportScore?: number;
  defenseScore?: number;
}

// ---------- 8. THỐNG KÊ ----------

export interface ThesisStatistics {
  totalTopics: number;
  approvedTopics: number;
  rejectedTopics: number;
  totalStudents: number;
  completedStudents: number;
  inProgressStudents: number;
  
  // Thống kê điểm
  averageScore: number;
  scoreDistribution: Record<string, number>;  // Phân bố điểm
  
  // Thống kê tiến độ
  onTimeRate: number;              // Tỷ lệ đúng hạn
  lateRate: number;                // Tỷ lệ trễ hạn
  retakeRate: number;               // Tỷ lệ bảo vệ lại
  
  // Thời gian xử lý trung bình (ngày)
  avgRegistrationToConfirmation: number;
  avgReadyToDefense: number;
}

// ---------- 9. NGOẠI LỆ ----------

export type ExceptionType =
  | "late_submission"        // Nộp muộn
  | "topic_change"           // Đổi đề tài
  | "supervisor_change"      // Đổi GVHD
  | "extension_request"      // Xin gia hạn
  | "pause_request"          // Xin bảo lưu
  | "score_appeal"           // Khiếu nại điểm
  | "revision_request";      // Yêu cầu chỉnh sửa sau BV

export type ExceptionStatus = "pending" | "approved" | "rejected" | "resolved";

export interface ThesisException {
  id: string;
  registrationId: string;
  studentId: string;
  studentName: string;
  
  type: ExceptionType;
  status: ExceptionStatus;
  
  // Chi tiết
  reason: string;
  supportingDocuments?: string[];
  
  // Xử lý
  processedBy?: string;            // Người xử lý
  processedAt?: string;
  processedNote?: string;
  resolvedAt?: string;
  
  // Lịch sử
  history?: ExceptionHistory[];
  
  createdAt: string;
  updatedAt: string;
}

export interface ExceptionHistory {
  action: string;
  performedBy: string;
  performedAt: string;
  note?: string;
}

// ---------- 10. THÔNG BÁO ----------

export type NotificationType =
  | "topic_approved"
  | "topic_rejected"
  | "new_registration"
  | "registration_confirmed"
  | "registration_rejected"
  | "deadline_reminder"
  | "report_feedback"
  | "defense_eligible"
  | "defense_scheduled"
  | "final_score_published"
  | "exception_update";

export interface ThesisNotification {
  id: string;
  type: NotificationType;
  recipientId: string;
  recipientName: string;
  recipientRole: string;
  
  title: string;
  message: string;
  relatedId?: string;              // ID liên quan (registrationId, milestoneId, etc.)
  
  isRead: boolean;
  readAt?: string;
  
  createdAt: string;
}

// ---------- HELPER FUNCTIONS ----------

export const topicStatusConfig: Record<TopicStatus, { label: string; color: string }> = {
  draft: { label: "Nháp", color: "default" },
  pending: { label: "Chờ duyệt", color: "warning" },
  approved: { label: "Đã duyệt", color: "success" },
  rejected: { label: "Từ chối", color: "error" },
  has_registrations: { label: "Có đăng ký", color: "info" },
  full: { label: "Đã đầy", color: "error" },
  in_progress: { label: "Đang thực hiện", color: "info" },
  completed: { label: "Hoàn thành", color: "success" },
  cancelled: { label: "Đã hủy", color: "default" },
};

export const registrationStatusConfig: Record<RegistrationStatus, { label: string; color: string }> = {
  pending_supervisor: { label: "Chờ GV xác nhận", color: "warning" },
  confirmed: { label: "Đã xác nhận", color: "info" },
  rejected: { label: "Từ chối", color: "error" },
  in_progress: { label: "Đang thực hiện", color: "info" },
  paused: { label: "Tạm ngưng", color: "default" },
  completed: { label: "Hoàn thành", color: "success" },
  withdrawn: { label: "Rút đăng ký", color: "default" },
};

export const milestoneStatusConfig: Record<MilestoneStatus, { label: string; color: string }> = {
  not_started: { label: "Chưa bắt đầu", color: "default" },
  in_progress: { label: "Đang thực hiện", color: "info" },
  overdue: { label: "Trễ hạn", color: "error" },
  submitted: { label: "Đã nộp", color: "warning" },
  approved: { label: "Đã duyệt", color: "success" },
  revision: { label: "Yêu cầu chỉnh sửa", color: "warning" },
  completed: { label: "Hoàn thành", color: "success" },
};

export const weeklyReportStatusConfig: Record<WeeklyReportStatus, { label: string; color: string }> = {
  draft: { label: "Nháp", color: "default" },
  submitted: { label: "Đã nộp", color: "info" },
  waiting_feedback: { label: "Chờ phản hồi", color: "warning" },
  approved: { label: "Đã duyệt", color: "success" },
  revision: { label: "Yêu cầu nộp lại", color: "error" },
};

export const defenseStatusConfig: Record<DefenseStatus, { label: string; color: string }> = {
  not_ready: { label: "Chưa đủ điều kiện", color: "error" },
  ready: { label: "Đủ điều kiện", color: "success" },
  scheduled: { label: "Đã lên lịch", color: "info" },
  defending: { label: "Đang bảo vệ", color: "warning" },
  defended: { label: "Đã bảo vệ", color: "info" },
  completed: { label: "Hoàn thành", color: "success" },
  retake: { label: "Phải bảo vệ lại", color: "error" },
};

export const exceptionTypeConfig: Record<ExceptionType, { label: string; color: string }> = {
  late_submission: { label: "Nộp muộn", color: "warning" },
  topic_change: { label: "Đổi đề tài", color: "info" },
  supervisor_change: { label: "Đổi GVHD", color: "info" },
  extension_request: { label: "Xin gia hạn", color: "warning" },
  pause_request: { label: "Xin bảo lưu", color: "warning" },
  score_appeal: { label: "Khiếu nại điểm", color: "error" },
  revision_request: { label: "Yêu cầu chỉnh sửa", color: "warning" },
};
