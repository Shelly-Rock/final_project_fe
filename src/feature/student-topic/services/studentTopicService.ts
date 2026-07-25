"use client";

import type { AvailableTopic, RegistrationRequest } from "../types";

const mockAvailableTopics: AvailableTopic[] = [
  {
    id: "topic-001",
    name: "Nghiên cứu và xây dựng hệ thống quản lý học tập trực tuyến",
    teacherName: "TS. Nguyễn Văn An",
    teacherEmail: "nv.an@university.edu.vn",
    department: "Khoa Công nghệ Thông tin",
    maxStudents: 3,
    registeredCount: 1,
    status: "Approved",
    description:
      "Xây dựng một nền tảng LMS hoàn chỉnh với các tính năng quản lý khóa học, bài tập, và đánh giá.",
    objectives: "Thiết kế và triển khai hệ thống LMS sử dụng React và Node.js",
    technicalRequirements: "React, Node.js, PostgreSQL, WebSocket",
    expectedOutcome: "Hoàn thành prototype và tài liệu kỹ thuật",
    createdAt: "2026-06-15",
  },
  {
    id: "topic-002",
    name: "Ứng dụng AI trong nhận diện cảm xúc khuôn mặt",
    teacherName: "PGS.TS. Trần Thị Bình",
    teacherEmail: "tt.binh@university.edu.vn",
    department: "Khoa Công nghệ Thông tin",
    maxStudents: 2,
    registeredCount: 2,
    status: "Approved",
    description:
      "Nghiên cứu và phát triển ứng dụng nhận diện cảm xúc từ khuôn mặt người sử dụng Deep Learning.",
    objectives: "Xây dựng mô hình CNN để nhận diện 7 loại cảm xúc cơ bản",
    technicalRequirements: "Python, TensorFlow/PyTorch, OpenCV",
    expectedOutcome: "Ứng dụng demo với độ chính xác > 85%",
    createdAt: "2026-06-20",
  },
  {
    id: "topic-003",
    name: "Phát triển ứng dụng di động cho quản lý tài chính cá nhân",
    teacherName: "ThS. Lê Minh Cường",
    teacherEmail: "lm.cuong@university.edu.vn",
    department: "Khoa Công nghệ Phần mềm",
    maxStudents: 2,
    registeredCount: 0,
    status: "Approved",
    description:
      "Thiết kế và phát triển ứng dụng giúp người dùng theo dõi chi tiêu, tiết kiệm và đầu tư.",
    objectives:
      "Xây dựng ứng dụng đa nền tảng với tính năng theo dõi tài chính",
    technicalRequirements: "React Native, Firebase, Charts",
    expectedOutcome: "Ứng dụng hoàn chỉnh trên iOS và Android",
    createdAt: "2026-07-01",
  },
  {
    id: "topic-004",
    name: "Bảo mật API RESTful sử dụng JWT và OAuth 2.0",
    teacherName: "TS. Hoàng Đức Dũng",
    teacherEmail: "hd.dung@university.edu.vn",
    department: "Khoa An toàn Thông tin",
    maxStudents: 3,
    registeredCount: 1,
    status: "Approved",
    description:
      "Nghiên cứu và triển khai giải pháp bảo mật API RESTful cho các ứng dụng web hiện đại.",
    objectives: "Xây dựng hệ thống xác thực và phân quyền an toàn",
    technicalRequirements: "Node.js, JWT, OAuth 2.0, HTTPS",
    expectedOutcome: "Framework bảo mật có thể tái sử dụng",
    createdAt: "2026-07-05",
  },
  {
    id: "topic-005",
    name: "Hệ thống gợi ý sản phẩm thương mại điện tử",
    teacherName: "PGS.TS. Phạm Thị Hương",
    teacherEmail: "pt.huong@university.edu.vn",
    department: "Khoa Khoa học Dữ liệu",
    maxStudents: 2,
    registeredCount: 0,
    status: "Approved",
    description:
      "Xây dựng hệ thống gợi ý sản phẩm dựa trên hành vi người dùng và Collaborative Filtering.",
    objectives: "Triển khai thuật toán Recommendation Engine hiệu quả",
    technicalRequirements: "Python, Machine Learning, Redis, MongoDB",
    expectedOutcome:
      "Module gợi ý tích hợp được vào hệ thống thương mại điện tử",
    createdAt: "2026-07-10",
  },
];

const mockRegistrationHistory: RegistrationRequest[] = [
  {
    id: "reg-001",
    topicId: "topic-001",
    topicName: "Nghiên cứu và xây dựng hệ thống quản lý học tập trực tuyến",
    teacherName: "TS. Nguyễn Văn An",
    teacherEmail: "nv.an@university.edu.vn",
    studentId: "student-001",
    studentName: "Nguyễn Văn Sinh",
    requestedAt: "2026-07-15T10:30:00Z",
    status: "Approved",
  },
  {
    id: "reg-002",
    topicId: "topic-006",
    topicName: "Ứng dụng Blockchain trong quản lý chuỗi cung ứng",
    teacherName: "TS. Trần Văn Em",
    teacherEmail: "tv.em@university.edu.vn",
    studentId: "student-001",
    studentName: "Nguyễn Văn Sinh",
    requestedAt: "2026-07-10T14:20:00Z",
    status: "Pending",
  },
  {
    id: "reg-003",
    topicId: "topic-007",
    topicName: "Phát triển game 2D với Unity",
    teacherName: "ThS. Lê Thị Mai",
    teacherEmail: "lt.mai@university.edu.vn",
    studentId: "student-001",
    studentName: "Nguyễn Văn Sinh",
    requestedAt: "2026-06-25T09:15:00Z",
    status: "Rejected",
    rejectionReason:
      "Đề tài đã có quá nhiều sinh viên đăng ký, vui lòng chọn đề tài khác.",
  },
];

export const studentTopicService = {
  async getAvailableTopics(): Promise<AvailableTopic[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAvailableTopics.filter(
      (t) => t.status === "Approved" && t.registeredCount < t.maxStudents,
    );
  },

  async getRegistrationHistory(): Promise<RegistrationRequest[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockRegistrationHistory;
  },

  async registerTopic(
    topicId: string,
  ): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const topic = mockAvailableTopics.find((t) => t.id === topicId);
    if (!topic) {
      throw new Error("Không tìm thấy đề tài");
    }

    if (topic.registeredCount >= topic.maxStudents) {
      throw new Error("Đề tài đã đầy");
    }

    return {
      success: true,
      message: "Yêu cầu đăng ký đã được gửi thành công",
    };
  },

  async exportConfirmationPdf(registrationId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(`Exporting PDF for registration: ${registrationId}`);
  },
};
