export type NotificationType =
  | "STATUS_CHANGED"
  | "REPORT_SUBMITTED"
  | "REPORT_APPROVED"
  | "REPORT_REJECTED"
  | "BAN_APPLIED"
  | "BAN_WARNING";

export interface INotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  senderId?: number;
  recipientId: number;
  relatedStudentId?: number;
  relatedReportId?: number;
  createdAt: string;
}

export interface INotificationResponse {
  notifications: INotification[];
  total: number;
  unreadCount: number;
}
