"use client";

export interface RegisteredStudent {
  id: number;
  studentId: string;
  studentCode: string;
  studentName: string;
  order: number;
  registeredAt?: string;
}

export interface AvailableTopic {
  id: string;
  name: string;
  englishName?: string; // Tên tiếng Anh
  description: string;
  objectives?: string; // Mục tiêu đề tài
  technologies?: string; // Công nghệ sử dụng
  teacherName: string;
  teacherEmail: string;
  department: string;
  maxStudents: number;
  registeredCount: number;
  status: "Approved" | "Pending" | "Closed";
  registrationStatus: "OPEN" | "FULL" | "LOCKED"; // Trạng thái đăng ký
  registeredStudents: RegisteredStudent[]; // Danh sách sinh viên đã đăng ký
  createdAt: string;
}

export interface RegistrationRequest {
  id: string;
  topicId: string;
  topicName: string;
  topicCode?: string; // mã đề tài, ví dụ: DT001
  topicDescription?: string; // mô tả đề tài
  topicRejectionReason?: string; // lý do từ chối của đề tài (nếu bị reject)
  teacherName: string;
  teacherEmail: string;
  periodName?: string; // tên đợt đăng ký
  studentId: string;
  studentName: string;
  requestedAt: string;
  status: "Pending" | "Approved" | "Rejected";
  rejectionReason?: string; // lý do từ chối đăng ký (moderator note)
}

export interface StudentTopicRegistrationState {
  availableTopics: AvailableTopic[];
  registrationHistory: RegistrationRequest[];
}
