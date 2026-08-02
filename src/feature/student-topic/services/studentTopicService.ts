"use client";

import type { AvailableTopic, RegistrationRequest } from "../types";

const mockAvailableTopics: AvailableTopic[] = [
  {
    id: "topic-001",
    name: "Nghiên cứu và xây dựng hệ thống quản lý học tập trực tuyến",
    englishName: "Research and Build an Online Learning Management System",
    teacherName: "TS. Nguyễn Văn An",
    teacherEmail: "nv.an@university.edu.vn",
    department: "Khoa Công nghệ Thông tin",
    maxStudents: 3,
    registeredCount: 1,
    status: "Approved",
    registrationStatus: "OPEN",
    description:
      "Xây dựng một nền tảng LMS hoàn chỉnh với các tính năng quản lý khóa học, bài tập, và đánh giá. Hệ thống hỗ trợ nhiều người dùng với các vai trò khác nhau như giảng viên, sinh viên và quản trị viên.",
    objectives:
      "Thiết kế và triển khai hệ thống LMS sử dụng React và Node.js. Đảm bảo hệ thống có thể mở rộng, bảo mật và dễ sử dụng.",
    technologies: "React, Node.js, PostgreSQL, WebSocket, Docker",
    registeredStudents: [
      {
        id: 1,
        studentId: "student-002",
        studentCode: "20210001",
        studentName: "Trần Văn A",
        order: 1,
        registeredAt: "2026-06-16T10:00:00Z",
      },
    ],
    createdAt: "2026-06-15",
  },
  {
    id: "topic-002",
    name: "Ứng dụng AI trong nhận diện cảm xúc khuôn mặt",
    englishName: "AI Application for Facial Emotion Recognition",
    teacherName: "PGS.TS. Trần Thị Bình",
    teacherEmail: "tt.binh@university.edu.vn",
    department: "Khoa Công nghệ Thông tin",
    maxStudents: 2,
    registeredCount: 2,
    status: "Approved",
    registrationStatus: "FULL", // 2/2 sinh viên - đã đầy
    description:
      "Nghiên cứu và phát triển ứng dụng nhận diện cảm xúc từ khuôn mặt người sử dụng Deep Learning. Ứng dụng có thể nhận diện 7 loại cảm xúc cơ bản: vui, buồn, giận, sợ, ngạc nhiên, ghê tởm và bình thường.",
    objectives:
      "Xây dựng mô hình CNN để nhận diện 7 loại cảm xúc cơ bản với độ chính xác cao. Triển khai thành ứng dụng web có thể sử dụng thực tế.",
    technologies: "Python, TensorFlow, OpenCV, Flask, React",
    registeredStudents: [
      {
        id: 2,
        studentId: "student-003",
        studentCode: "20210002",
        studentName: "Lê Thị B",
        order: 1,
        registeredAt: "2026-06-21T14:30:00Z",
      },
      {
        id: 3,
        studentId: "student-004",
        studentCode: "20210003",
        studentName: "Phạm Văn C",
        order: 2,
        registeredAt: "2026-06-22T09:15:00Z",
      },
    ],
    createdAt: "2026-06-20",
  },
  {
    id: "topic-003",
    name: "Phát triển ứng dụng di động cho quản lý tài chính cá nhân",
    englishName: "Mobile App Development for Personal Finance Management",
    teacherName: "ThS. Lê Minh Cường",
    teacherEmail: "lm.cuong@university.edu.vn",
    department: "Khoa Công nghệ Phần mềm",
    maxStudents: 2,
    registeredCount: 0,
    status: "Approved",
    registrationStatus: "OPEN", // 0/2 sinh viên - đang mở
    description:
      "Thiết kế và phát triển ứng dụng giúp người dùng theo dõi chi tiêu, tiết kiệm và đầu tư. Ứng dụng hỗ trợ phân loại chi tiêu tự động, lập ngân sách và đặt mục tiêu tài chính.",
    objectives:
      "Xây dựng ứng dụng đa nền tảng với tính năng theo dõi tài chính cá nhân. Tích hợp các API ngân hàng để tự động cập nhật giao dịch.",
    technologies: "React Native, Firebase, Redux, TypeScript",
    registeredStudents: [],
    createdAt: "2026-07-01",
  },
  {
    id: "topic-004",
    name: "Bảo mật API RESTful sử dụng JWT và OAuth 2.0",
    englishName: "Securing RESTful APIs with JWT and OAuth 2.0",
    teacherName: "TS. Hoàng Đức Dũng",
    teacherEmail: "hd.dung@university.edu.vn",
    department: "Khoa An toàn Thông tin",
    maxStudents: 3,
    registeredCount: 1,
    status: "Approved",
    registrationStatus: "LOCKED", // Giảng viên đã chốt danh sách
    description:
      "Nghiên cứu và triển khai giải pháp bảo mật API RESTful cho các ứng dụng web hiện đại. Tập trung vào việc xác thực, phân quyền và bảo vệ dữ liệu.",
    objectives:
      "Xây dựng hệ thống xác thực và phân quyền an toàn. Triển khai refresh token, rate limiting và bảo vệ against common attacks.",
    technologies: "Node.js, JWT, OAuth 2.0, HTTPS, Redis",
    registeredStudents: [
      {
        id: 4,
        studentId: "student-005",
        studentCode: "20210004",
        studentName: "Nguyễn Thị D",
        order: 1,
        registeredAt: "2026-07-06T11:00:00Z",
      },
    ],
    createdAt: "2026-07-05",
  },
  {
    id: "topic-005",
    name: "Hệ thống gợi ý sản phẩm thương mại điện tử",
    englishName: "Product Recommendation System for E-commerce",
    teacherName: "PGS.TS. Phạm Thị Hương",
    teacherEmail: "pt.huong@university.edu.vn",
    department: "Khoa Khoa học Dữ liệu",
    maxStudents: 2,
    registeredCount: 0,
    status: "Approved",
    registrationStatus: "OPEN", // 0/2 sinh viên - đang mở
    description:
      "Xây dựng hệ thống gợi ý sản phẩm dựa trên hành vi người dùng và Collaborative Filtering. Hệ thống phân tích lịch sử mua hàng, đánh giá và thói quen duyệt web để đề xuất sản phẩm phù hợp.",
    objectives:
      "Triển khai thuật toán Recommendation Engine hiệu quả. Tối ưu hóa độ chính xác của gợi ý và cải thiện trải nghiệm người dùng.",
    technologies: "Python, Machine Learning, Redis, MongoDB, FastAPI",
    registeredStudents: [],
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
