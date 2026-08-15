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
  teacherName: string;
  teacherEmail: string;
  studentId: string;
  studentName: string;
  requestedAt: string;
  status: "Pending" | "Approved" | "Rejected";
  rejectionReason?: string;
}

export interface StudentTopicRegistrationState {
  availableTopics: AvailableTopic[];
  registrationHistory: RegistrationRequest[];
}
