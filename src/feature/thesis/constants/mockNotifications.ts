// ============================================================
// MOCK DATA: Notifications - Thông báo
// ============================================================
import type {
  ThesisNotification,
  NotificationType,
} from "../types";

export const mockNotifications: ThesisNotification[] = [
  // Thông báo cho GV về đề tài được duyệt
  {
    id: "notif-001",
    type: "topic_approved",
    recipientId: "gv-001",
    recipientName: "TS. Nguyễn Văn X",
    recipientRole: "teacher",
    title: "Đề tài đã được duyệt",
    message: "Đề tài 'Ứng dụng AI trong chẩn đoán bệnh' của bạn đã được Thư ký duyệt.",
    relatedId: "topic-001",
    isRead: true,
    readAt: "2024-02-18T10:30:00",
    createdAt: "2024-02-18T10:00:00",
  },
  // Thông báo cho GV có SV đăng ký mới
  {
    id: "notif-002",
    type: "new_registration",
    recipientId: "gv-001",
    recipientName: "TS. Nguyễn Văn X",
    recipientRole: "teacher",
    title: "Có sinh viên đăng ký đề tài mới",
    message: "Sinh viên Nguyễn Văn A (20200001) đã đăng ký đề tài 'Ứng dụng AI trong chẩn đoán bệnh'. Vui lòng xác nhận.",
    relatedId: "reg-001",
    isRead: false,
    createdAt: "2024-02-15T14:00:00",
  },
  // Thông báo cho SV về xác nhận đăng ký
  {
    id: "notif-003",
    type: "registration_confirmed",
    recipientId: "sv-001",
    recipientName: "Nguyễn Văn A",
    recipientRole: "student",
    title: "Đăng ký đề tài đã được xác nhận",
    message: "Đăng ký đề tài 'Ứng dụng AI trong chẩn đoán bệnh' đã được GV xác nhận. Chúc bạn hoàn thành tốt đồ án!",
    relatedId: "reg-001",
    isRead: true,
    readAt: "2024-02-20T09:00:00",
    createdAt: "2024-02-20T08:30:00",
  },
  // Thông báo nhắc deadline
  {
    id: "notif-004",
    type: "deadline_reminder",
    recipientId: "sv-001",
    recipientName: "Nguyễn Văn A",
    recipientRole: "student",
    title: "Nhắc nhở deadline",
    message: "Deadline nộp milestone 'Xây dựng model' là ngày mai (15/05/2024). Hãy đảm bảo hoàn thành đúng hạn!",
    relatedId: "ms-003",
    isRead: false,
    createdAt: "2024-05-14T09:00:00",
  },
  // Thông báo phản hồi báo cáo
  {
    id: "notif-005",
    type: "report_feedback",
    recipientId: "sv-001",
    recipientName: "Nguyễn Văn A",
    recipientRole: "student",
    title: "GV đã phản hồi báo cáo tuần",
    message: "TS. Nguyễn Văn X đã phản hồi báo cáo tuần 3 của bạn. Vui lòng xem và thực hiện theo hướng dẫn.",
    relatedId: "wr-003",
    isRead: true,
    readAt: "2024-03-18T16:00:00",
    createdAt: "2024-03-18T15:30:00",
  },
  // Thông báo đủ điều kiện bảo vệ
  {
    id: "notif-006",
    type: "defense_eligible",
    recipientId: "sv-002",
    recipientName: "Trần Thị B",
    recipientRole: "student",
    title: "Bạn đã đủ điều kiện bảo vệ",
    message: "Chúc mừng! Bạn đã hoàn thành tất cả các milestone và đủ điều kiện tham gia bảo vệ.",
    relatedId: "reg-002",
    isRead: true,
    readAt: "2024-05-15T11:00:00",
    createdAt: "2024-05-15T10:30:00",
  },
  // Thông báo lịch bảo vệ
  {
    id: "notif-007",
    type: "defense_scheduled",
    recipientId: "sv-002",
    recipientName: "Trần Thị B",
    recipientRole: "student",
    title: "Lịch bảo vệ đã được xếp",
    message: "Lịch bảo vệ của bạn: Ngày 20/05/2024, Phòng A101, Ca 08:00-10:00. Hội đồng số 1.",
    relatedId: "dr-001",
    isRead: true,
    readAt: "2024-05-17T09:00:00",
    createdAt: "2024-05-17T08:30:00",
  },
  // Thông báo cho hội đồng
  {
    id: "notif-008",
    type: "defense_scheduled",
    recipientId: "cm-001",
    recipientName: "GS. Trần Văn A",
    recipientRole: "teacher",
    title: "Lịch bảo vệ mới được xếp",
    message: "Bạn có buổi bảo vệ vào ngày 20/05/2024 tại Phòng A101. Vui lòng kiểm tra danh sách SV.",
    relatedId: "ds-001",
    isRead: false,
    createdAt: "2024-05-17T08:30:00",
  },
  // Thông báo công bố điểm
  {
    id: "notif-009",
    type: "final_score_published",
    recipientId: "sv-002",
    recipientName: "Trần Thị B",
    recipientRole: "student",
    title: "Điểm cuối cùng đã được công bố",
    message: "Điểm cuối cùng của bạn: 7.96 (B+). Xem chi tiết tại trang Chấm điểm.",
    relatedId: "reg-002",
    isRead: false,
    createdAt: "2024-05-28T16:00:00",
  },
  // Thông báo cập nhật exception
  {
    id: "notif-010",
    type: "exception_update",
    recipientId: "sv-006",
    recipientName: "Vũ Thị F",
    recipientRole: "student",
    title: "Yêu cầu nộp muộn đã được xử lý",
    message: "Yêu cầu nộp muộn milestone của bạn đã được xử lý: Cảnh cáo, không trừ điểm.",
    relatedId: "exc-003",
    isRead: true,
    readAt: "2024-04-05T14:00:00",
    createdAt: "2024-04-05T13:30:00",
  },
];

export const getNotificationIcon = (type: NotificationType): string => {
  const icons: Record<NotificationType, string> = {
    topic_approved: "bi-check-circle",
    topic_rejected: "bi-x-circle",
    new_registration: "bi-person-plus",
    registration_confirmed: "bi-check-lg",
    registration_rejected: "bi-x-lg",
    deadline_reminder: "bi-clock",
    report_feedback: "bi-chat-left-text",
    defense_eligible: "bi-award",
    defense_scheduled: "bi-calendar-event",
    final_score_published: "bi-star",
    exception_update: "bi-exclamation-circle",
  };
  return icons[type];
};

export const getNotificationColor = (type: NotificationType): string => {
  const colors: Record<NotificationType, string> = {
    topic_approved: "success",
    topic_rejected: "error",
    new_registration: "info",
    registration_confirmed: "success",
    registration_rejected: "error",
    deadline_reminder: "warning",
    report_feedback: "info",
    defense_eligible: "success",
    defense_scheduled: "info",
    final_score_published: "success",
    exception_update: "warning",
  };
  return colors[type];
};

export const getUnreadCount = (notifications: ThesisNotification[]): number => {
  return notifications.filter((n) => !n.isRead).length;
};

export const sortNotificationsByDate = (
  notifications: ThesisNotification[],
  ascending = false
): ThesisNotification[] => {
  return [...notifications].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};
