// ============================================================
// CONSTANTS & MOCK DATA — Registration Period Feature
// ============================================================
import type { RegistrationPeriod, TeacherQuota, Topic } from "../types";

// ============================================================
// MOCK REGISTRATION PERIODS
// ============================================================
export const mockPeriods: RegistrationPeriod[] = [
  {
    id: 1,
    name: "Đợt đăng ký HK1 2025-2026",
    semester: "1",
    schoolYear: "2025-2026",
    startDate: "2025-08-01",
    teacherDeadline: "2025-08-15",
    studentDeadline: "2025-08-31",
    defaultQuota: 3,
    status: "closed",
    description:
      "Đợt đăng ký đề tài khóa luận tốt nghiệp học kỳ 1 năm học 2025-2026",
    createdAt: "2025-07-15T08:00:00Z",
    updatedAt: "2025-09-01T10:00:00Z",
  },
  {
    id: 2,
    name: "Đợt đăng ký HK2 2025-2026",
    semester: "2",
    schoolYear: "2025-2026",
    startDate: "2026-01-15",
    teacherDeadline: "2026-01-30",
    studentDeadline: "2026-02-15",
    defaultQuota: 3,
    status: "open",
    description:
      "Đợt đăng ký đề tài khóa luận tốt nghiệp học kỳ 2 năm học 2025-2026",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-15T08:00:00Z",
  },
  {
    id: 3,
    name: "Đợt đăng ký HK2 2024-2025",
    semester: "2",
    schoolYear: "2024-2025",
    startDate: "2025-01-10",
    teacherDeadline: "2025-01-25",
    studentDeadline: "2025-02-10",
    defaultQuota: 3,
    status: "closed",
    description: "Đợt đăng ký HK2 năm học 2024-2025",
    createdAt: "2025-01-05T08:00:00Z",
    updatedAt: "2025-02-15T10:00:00Z",
  },
  {
    id: 4,
    name: "Đợt đăng ký HK1 2026-2027",
    semester: "1",
    schoolYear: "2026-2027",
    startDate: "2026-08-01",
    teacherDeadline: "2026-08-15",
    studentDeadline: "2026-08-31",
    defaultQuota: 3,
    status: "upcoming",
    description: "Đợt đăng ký dự kiến cho học kỳ 1 năm học 2026-2027",
    createdAt: "2026-07-01T08:00:00Z",
    updatedAt: "2026-07-01T08:00:00Z",
  },
];

// ============================================================
// MOCK TEACHER QUOTAS (cho tất cả các đợt)
// ============================================================

// Period 1 - HK1 2025-2026 (closed)
const period1Quotas: TeacherQuota[] = [
  {
    id: 101,
    periodId: 1,
    teacherId: 201,
    teacherName: "TS. Phạm Hùng Anh",
    department: "Công nghệ phần mềm",
    assignedQuota: 3,
    submittedTopics: 3,
    maxStudents: 3,
    status: "sufficient",
    lastNotifiedAt: "2025-08-10T10:00:00Z",
  },
  {
    id: 102,
    periodId: 1,
    teacherId: 202,
    teacherName: "PGS.TS. Ngô Thu Hà",
    department: "Hệ thống thông tin",
    assignedQuota: 4,
    submittedTopics: 4,
    maxStudents: 4,
    status: "sufficient",
  },
  {
    id: 103,
    periodId: 1,
    teacherId: 203,
    teacherName: "TS. Lê Nam Khánh",
    department: "Khoa học máy tính",
    assignedQuota: 3,
    submittedTopics: 2,
    maxStudents: 3,
    status: "insufficient",
    lastNotifiedAt: "2025-08-14T14:00:00Z",
  },
  {
    id: 104,
    periodId: 1,
    teacherId: 204,
    teacherName: "ThS. Trần Gia Bảo",
    department: "Mạng máy tính",
    assignedQuota: 3,
    submittedTopics: 3,
    maxStudents: 3,
    status: "sufficient",
  },
];

// Period 2 - HK2 2025-2026 (open) - đã có data phía trên
const period2Quotas: TeacherQuota[] = [
  {
    id: 1,
    periodId: 2,
    teacherId: 101,
    teacherName: "TS. Nguyễn Văn An",
    department: "Công nghệ phần mềm",
    assignedQuota: 3,
    submittedTopics: 3,
    maxStudents: 3,
    status: "sufficient",
    lastNotifiedAt: "2026-01-28T10:00:00Z",
  },
  {
    id: 2,
    periodId: 2,
    teacherId: 102,
    teacherName: "PGS.TS. Trần Thị Bình",
    department: "Hệ thống thông tin",
    assignedQuota: 3,
    submittedTopics: 1,
    maxStudents: 3,
    status: "insufficient",
    lastNotifiedAt: "2026-01-28T10:00:00Z",
  },
  {
    id: 3,
    periodId: 2,
    teacherId: 103,
    teacherName: "TS. Lê Hoàng Cường",
    department: "Khoa học máy tính",
    assignedQuota: 4,
    submittedTopics: 4,
    maxStudents: 4,
    status: "sufficient",
  },
  {
    id: 4,
    periodId: 2,
    teacherId: 104,
    teacherName: "ThS. Phạm Minh Đức",
    department: "Mạng máy tính",
    assignedQuota: 3,
    submittedTopics: 2,
    maxStudents: 3,
    status: "insufficient",
    lastNotifiedAt: "2026-01-29T14:00:00Z",
  },
  {
    id: 5,
    periodId: 2,
    teacherId: 105,
    teacherName: "TS. Hoàng Thị Lan",
    department: "An toàn thông tin",
    assignedQuota: 3,
    submittedTopics: 0,
    maxStudents: 3,
    status: "insufficient",
  },
  {
    id: 6,
    periodId: 2,
    teacherId: 106,
    teacherName: "PGS.TS. Vũ Quang Duy",
    department: "Khoa học dữ liệu",
    assignedQuota: 5,
    submittedTopics: 5,
    maxStudents: 5,
    status: "sufficient",
    lastNotifiedAt: "2026-01-20T09:00:00Z",
  },
  {
    id: 7,
    periodId: 2,
    teacherId: 107,
    teacherName: "TS. Đặng Thị Mai",
    department: "Công nghệ phần mềm",
    assignedQuota: 3,
    submittedTopics: 2,
    maxStudents: 3,
    status: "insufficient",
  },
];

// Period 3 - HK2 2024-2025 (closed)
const period3Quotas: TeacherQuota[] = [
  {
    id: 301,
    periodId: 3,
    teacherId: 301,
    teacherName: "TS. Trần Minh Tuấn",
    department: "Công nghệ phần mềm",
    assignedQuota: 4,
    submittedTopics: 4,
    maxStudents: 4,
    status: "sufficient",
  },
  {
    id: 302,
    periodId: 3,
    teacherId: 302,
    teacherName: "PGS.TS. Lê Thị Hương",
    department: "Hệ thống thông tin",
    assignedQuota: 3,
    submittedTopics: 3,
    maxStudents: 3,
    status: "sufficient",
  },
  {
    id: 303,
    periodId: 3,
    teacherId: 303,
    teacherName: "TS. Bùi Đức Mạnh",
    department: "Khoa học máy tính",
    assignedQuota: 3,
    submittedTopics: 1,
    maxStudents: 3,
    status: "insufficient",
    lastNotifiedAt: "2025-01-24T10:00:00Z",
  },
  {
    id: 304,
    periodId: 3,
    teacherId: 304,
    teacherName: "ThS. Nguyễn Thị Lan",
    department: "An toàn thông tin",
    assignedQuota: 3,
    submittedTopics: 0,
    maxStudents: 3,
    status: "insufficient",
  },
];

// Period 4 - HK1 2026-2027 (upcoming)
const period4Quotas: TeacherQuota[] = [
  {
    id: 401,
    periodId: 4,
    teacherId: 401,
    teacherName: "TS. Hoàng Văn Minh",
    department: "Công nghệ phần mềm",
    assignedQuota: 3,
    submittedTopics: 0,
    maxStudents: 3,
    status: "insufficient",
  },
  {
    id: 402,
    periodId: 4,
    teacherId: 402,
    teacherName: "PGS.TS. Đỗ Thị Thu",
    department: "Hệ thống thông tin",
    assignedQuota: 4,
    submittedTopics: 0,
    maxStudents: 4,
    status: "insufficient",
  },
  {
    id: 403,
    periodId: 4,
    teacherId: 403,
    teacherName: "TS. Vũ Đức Long",
    department: "Khoa học máy tính",
    assignedQuota: 3,
    submittedTopics: 0,
    maxStudents: 3,
    status: "insufficient",
  },
];

export const mockTeacherQuotas: TeacherQuota[] = [
  ...period1Quotas,
  ...period2Quotas,
  ...period3Quotas,
  ...period4Quotas,
];

// ============================================================
// MOCK TOPICS (cho tất cả các đợt)
// ============================================================

// Period 1 - HK1 2025-2026 (closed) - 8 topics
const period1Topics: Topic[] = [
  {
    id: 101,
    periodId: 1,
    teacherId: 201,
    teacherName: "TS. Phạm Hùng Anh",
    name: "Xây dựng ứng dụng học tiếng Anh online",
    description:
      "Phát triển ứng dụng web/mobile hỗ trợ học tiếng Anh với AI chatbot và personalized learning.",
    maxStudents: 2,
    registeredStudents: 2,
    status: "approved",
    createdAt: "2025-08-02T09:00:00Z",
    updatedAt: "2025-08-05T10:00:00Z",
  },
  {
    id: 102,
    periodId: 1,
    teacherId: 201,
    teacherName: "TS. Phạm Hùng Anh",
    name: "Nền tảng thi trực tuyến với anti-cheat",
    description:
      "Xây dựng hệ thống thi trực tuyến có tính năng phát hiện gian lận bằng AI.",
    maxStudents: 2,
    registeredStudents: 1,
    status: "approved",
    createdAt: "2025-08-03T10:00:00Z",
    updatedAt: "2025-08-06T14:00:00Z",
  },
  {
    id: 103,
    periodId: 1,
    teacherId: 201,
    teacherName: "TS. Phạm Hùng Anh",
    name: "Hệ thống quản lý thư viện số",
    description:
      "Xây dựng hệ thống quản lý thư viện với OCR và tìm kiếm thông minh.",
    maxStudents: 1,
    registeredStudents: 0,
    status: "pending",
    createdAt: "2025-08-08T11:00:00Z",
    updatedAt: "2025-08-08T11:00:00Z",
  },
  {
    id: 104,
    periodId: 1,
    teacherId: 202,
    teacherName: "PGS.TS. Ngô Thu Hà",
    name: "Ứng dụng IoT trong nông nghiệp thông minh",
    description:
      "Xây dựng hệ thống giám sát và điều khiển nông nghiệp thông qua IoT.",
    maxStudents: 2,
    registeredStudents: 2,
    status: "approved",
    createdAt: "2025-08-02T08:00:00Z",
    updatedAt: "2025-08-04T09:00:00Z",
  },
  {
    id: 105,
    periodId: 1,
    teacherId: 202,
    teacherName: "PGS.TS. Ngô Thu Hà",
    name: "Smart home system với Raspberry Pi",
    description:
      "Xây dựng hệ thống nhà thông minh sử dụng Raspberry Pi và các cảm biến.",
    maxStudents: 2,
    registeredStudents: 2,
    status: "approved",
    createdAt: "2025-08-03T09:00:00Z",
    updatedAt: "2025-08-05T11:00:00Z",
  },
  {
    id: 106,
    periodId: 1,
    teacherId: 203,
    teacherName: "TS. Lê Nam Khánh",
    name: "Game mobile education",
    description: "Phát triển game mobile mang tính giáo dục cho trẻ em.",
    maxStudents: 1,
    registeredStudents: 1,
    status: "approved",
    createdAt: "2025-08-05T10:00:00Z",
    updatedAt: "2025-08-07T15:00:00Z",
  },
  {
    id: 107,
    periodId: 1,
    teacherId: 203,
    teacherName: "TS. Lê Nam Khánh",
    name: "AR application cho du lịch",
    description: "Ứng dụng AR hỗ trợ du khách tham quan di tích lịch sử.",
    maxStudents: 1,
    registeredStudents: 0,
    status: "rejected",
    rejectionReason:
      "Phạm vi nghiên cứu chưa rõ ràng, cần thu hẹp địa điểm cụ thể.",
    createdAt: "2025-08-06T14:00:00Z",
    updatedAt: "2025-08-10T09:00:00Z",
  },
  {
    id: 108,
    periodId: 1,
    teacherId: 204,
    teacherName: "ThS. Trần Gia Bảo",
    name: "Hệ thống VPN doanh nghiệp",
    description:
      "Xây dựng và triển khai hệ thống VPN cho doanh nghiệp vừa và nhỏ.",
    maxStudents: 2,
    registeredStudents: 2,
    status: "approved",
    createdAt: "2025-08-04T08:30:00Z",
    updatedAt: "2025-08-06T10:00:00Z",
  },
  {
    id: 109,
    periodId: 1,
    teacherId: 204,
    teacherName: "ThS. Trần Gia Bảo",
    name: "Load balancer cho web server",
    description:
      "Thiết kế và triển khai hệ thống cân bằng tải cho ứng dụng web.",
    maxStudents: 1,
    registeredStudents: 1,
    status: "approved",
    createdAt: "2025-08-04T09:00:00Z",
    updatedAt: "2025-08-07T11:00:00Z",
  },
];

// Period 2 - HK2 2025-2026 (open) - đã có 17 topics ở trên
const period2Topics: Topic[] = [
  // TS. Nguyễn Văn An - 3 đề tài (đủ)
  {
    id: 1,
    periodId: 2,
    teacherId: 101,
    teacherName: "TS. Nguyễn Văn An",
    name: "Xây dựng hệ thống quản lý đồ án trực tuyến",
    description:
      "Nghiên cứu và xây dựng hệ thống quản lý đồ án cho sinh viên với các tính năng: quản lý tiến độ, nộp bài, phản hồi của giảng viên, chấm điểm tự động.",
    maxStudents: 2,
    registeredStudents: 1,
    status: "approved",
    moderatorNote: "Đề tài phù hợp, cần bổ sung tài liệu tham khảo.",
    createdAt: "2026-01-16T08:30:00Z",
    updatedAt: "2026-01-18T10:00:00Z",
  },
  {
    id: 2,
    periodId: 2,
    teacherId: 101,
    teacherName: "TS. Nguyễn Văn An",
    name: "Phát triển ứng dụng di động quản lý công việc cá nhân",
    description:
      "Xây dựng ứng dụng mobile cross-platform để quản lý công việc cá nhân với các tính năng: kanban board, reminder, thống kê năng suất.",
    maxStudents: 1,
    registeredStudents: 1,
    status: "approved",
    createdAt: "2026-01-16T09:00:00Z",
    updatedAt: "2026-01-17T14:00:00Z",
  },
  {
    id: 3,
    periodId: 2,
    teacherId: 101,
    teacherName: "TS. Nguyễn Văn An",
    name: "Ứng dụng AI trong phát hiện xâm nhập mạng",
    description:
      "Nghiên cứu và triển khai mô hình Machine Learning để phát hiện xâm nhập mạng sử dụng các thuật toán như Random Forest, SVM.",
    maxStudents: 1,
    registeredStudents: 0,
    status: "pending",
    createdAt: "2026-01-17T10:00:00Z",
    updatedAt: "2026-01-17T10:00:00Z",
  },

  // PGS.TS. Trần Thị Bình - 1 đề tài (thiếu)
  {
    id: 4,
    periodId: 2,
    teacherId: 102,
    teacherName: "PGS.TS. Trần Thị Bình",
    name: "Thiết kế hệ thống ERP cho doanh nghiệp vừa và nhỏ",
    description:
      "Phân tích, thiết kế và triển khai hệ thống ERP đơn giản phù hợp với doanh nghiệp vừa và nhỏ tại Việt Nam.",
    maxStudents: 2,
    registeredStudents: 1,
    status: "approved",
    moderatorNote: "Đề tài có tính ứng dụng cao.",
    createdAt: "2026-01-18T08:00:00Z",
    updatedAt: "2026-01-20T11:00:00Z",
  },

  // TS. Lê Hoàng Cường - 4 đề tài (đủ)
  {
    id: 5,
    periodId: 2,
    teacherId: 103,
    teacherName: "TS. Lê Hoàng Cường",
    name: "Xây dựng chatbot AI hỗ trợ tuyển sinh",
    description:
      "Phát triển chatbot sử dụng NLP để trả lời các câu hỏi tuyển sinh tự động, tích hợp với website trường đại học.",
    maxStudents: 1,
    registeredStudents: 1,
    status: "approved",
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-01-16T15:00:00Z",
  },
  {
    id: 6,
    periodId: 2,
    teacherId: 103,
    teacherName: "TS. Lê Hoàng Cường",
    name: "Nhận diện khuôn mặt ứng dụng trong điểm danh",
    description:
      "Xây dựng hệ thống điểm danh tự động sử dụng công nghệ nhận diện khuôn mặt với độ chính xác cao.",
    maxStudents: 2,
    registeredStudents: 1,
    status: "pending",
    createdAt: "2026-01-15T10:30:00Z",
    updatedAt: "2026-01-15T10:30:00Z",
  },
  {
    id: 7,
    periodId: 2,
    teacherId: 103,
    teacherName: "TS. Lê Hoàng Cường",
    name: "Phân tích cảm xúc văn bản Tiếng Việt",
    description:
      "Nghiên cứu và xây dựng mô hình phân tích cảm xúc cho văn bản Tiếng Việt sử dụng BERT và các transformer models.",
    maxStudents: 1,
    registeredStudents: 1,
    status: "approved",
    createdAt: "2026-01-16T14:00:00Z",
    updatedAt: "2026-01-19T09:00:00Z",
  },
  {
    id: 8,
    periodId: 2,
    teacherId: 103,
    teacherName: "TS. Lê Hoàng Cường",
    name: "Dịch máy neural cho ngôn ngữ bản địa",
    description:
      "Phát triển hệ thống dịch máy sử dụng Neural Machine Translation cho các cặp ngôn ngữ liên quan đến các dân tộc Việt Nam.",
    maxStudents: 1,
    registeredStudents: 0,
    status: "rejected",
    rejectionReason: "Phạm vi quá rộng, cần thu hẹp đối tượng nghiên cứu.",
    moderatorNote: "GV cần điều chỉnh lại đề tài.",
    createdAt: "2026-01-17T08:00:00Z",
    updatedAt: "2026-01-22T16:00:00Z",
  },

  // ThS. Phạm Minh Đức - 2 đề tài (thiếu)
  {
    id: 9,
    periodId: 2,
    teacherId: 104,
    teacherName: "ThS. Phạm Minh Đức",
    name: "Giám sát và cảnh báo an ninh mạng",
    description:
      "Xây dựng hệ thống giám sát an ninh mạng theo thời gian thực với khả năng cảnh báo sớm các cuộc tấn công.",
    maxStudents: 1,
    registeredStudents: 1,
    status: "approved",
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-01-21T14:00:00Z",
  },
  {
    id: 10,
    periodId: 2,
    teacherId: 104,
    teacherName: "ThS. Phạm Minh Đức",
    name: "Tối ưu hóa cấu hình firewall cho doanh nghiệp",
    description:
      "Nghiên cứu và đề xuất phương pháp tối ưu cấu hình firewall dựa trên nhu cầu thực tế của doanh nghiệp.",
    maxStudents: 1,
    registeredStudents: 0,
    status: "pending",
    createdAt: "2026-01-21T08:30:00Z",
    updatedAt: "2026-01-21T08:30:00Z",
  },

  // TS. Hoàng Thị Lan - 0 đề tài (thiếu nghiêm trọng)

  // PGS.TS. Vũ Quang Duy - 5 đề tài (đủ)
  {
    id: 11,
    periodId: 2,
    teacherId: 106,
    teacherName: "PGS.TS. Vũ Quang Duy",
    name: "Phân tích dữ liệu lớn trong y tế",
    description:
      "Ứng dụng các kỹ thuật Big Data để phân tích dữ liệu bệnh viện, hỗ trợ quyết định lâm sàng.",
    maxStudents: 2,
    registeredStudents: 2,
    status: "approved",
    createdAt: "2026-01-16T07:00:00Z",
    updatedAt: "2026-01-18T11:00:00Z",
  },
  {
    id: 12,
    periodId: 2,
    teacherId: 106,
    teacherName: "PGS.TS. Vũ Quang Duy",
    name: "Dự đoán xu hướng thị trường chứng khoán",
    description:
      "Xây dựng mô hình dự đoán xu hướng thị trường chứng khoán Việt Nam sử dụng LSTM và các mô hình Time Series.",
    maxStudents: 1,
    registeredStudents: 1,
    status: "approved",
    createdAt: "2026-01-16T08:00:00Z",
    updatedAt: "2026-01-17T16:00:00Z",
  },
  {
    id: 13,
    periodId: 2,
    teacherId: 106,
    teacherName: "PGS.TS. Vũ Quang Duy",
    name: "Khai phá dữ liệu trong thương mại điện tử",
    description:
      "Áp dụng các kỹ thuật Data Mining để phân tích hành vi khách hàng và gợi ý sản phẩm cá nhân hóa.",
    maxStudents: 1,
    registeredStudents: 1,
    status: "pending",
    createdAt: "2026-01-17T09:00:00Z",
    updatedAt: "2026-01-17T09:00:00Z",
  },
  {
    id: 14,
    periodId: 2,
    teacherId: 106,
    teacherName: "PGS.TS. Vũ Quang Duy",
    name: "Hệ thống gợi ý phim dựa trên học sâu",
    description:
      "Xây dựng hệ thống recommendation cho nền tảng streaming video sử dụng Collaborative Filtering và Deep Learning.",
    maxStudents: 1,
    registeredStudents: 0,
    status: "pending",
    createdAt: "2026-01-18T10:00:00Z",
    updatedAt: "2026-01-18T10:00:00Z",
  },
  {
    id: 15,
    periodId: 2,
    teacherId: 106,
    teacherName: "PGS.TS. Vũ Quang Duy",
    name: "Phân cụm khách hàng cho marketing",
    description:
      "Sử dụng K-means và các thuật toán phân cụm để phân khúc khách hàng, hỗ trợ chiến lược marketing.",
    maxStudents: 1,
    registeredStudents: 1,
    status: "approved",
    createdAt: "2026-01-19T11:00:00Z",
    updatedAt: "2026-01-20T13:00:00Z",
  },

  // TS. Đặng Thị Mai - 2 đề tài (thiếu)
  {
    id: 16,
    periodId: 2,
    teacherId: 107,
    teacherName: "TS. Đặng Thị Mai",
    name: "DevOps pipeline cho ứng dụng microservices",
    description:
      "Thiết kế và triển khai CI/CD pipeline cho hệ thống microservices sử dụng Docker, Kubernetes và GitHub Actions.",
    maxStudents: 2,
    registeredStudents: 1,
    status: "approved",
    createdAt: "2026-01-22T08:00:00Z",
    updatedAt: "2026-01-23T10:00:00Z",
  },
  {
    id: 17,
    periodId: 2,
    teacherId: 107,
    teacherName: "TS. Đặng Thị Mai",
    name: "Kiểm thử tự động với Selenium và Cypress",
    description:
      "Xây dựng framework kiểm thử tự động cho ứng dụng web sử dụng Selenium WebDriver và Cypress.",
    maxStudents: 1,
    registeredStudents: 0,
    status: "pending",
    createdAt: "2026-01-23T09:00:00Z",
    updatedAt: "2026-01-23T09:00:00Z",
  },
];

// Period 3 - HK2 2024-2025 (closed)
const period3Topics: Topic[] = [
  {
    id: 301,
    periodId: 3,
    teacherId: 301,
    teacherName: "TS. Trần Minh Tuấn",
    name: "Ứng dụng Blockchain trong xác thực tài liệu",
    description:
      "Xây dựng hệ thống xác thực và lưu trữ tài liệu sử dụng Blockchain.",
    maxStudents: 2,
    registeredStudents: 2,
    status: "approved",
    createdAt: "2025-01-12T09:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 302,
    periodId: 3,
    teacherId: 301,
    teacherName: "TS. Trần Minh Tuấn",
    name: "Hệ thống voting online với smart contract",
    description:
      "Xây dựng hệ thống bỏ phiếu trực tuyến sử dụng Ethereum smart contract.",
    maxStudents: 2,
    registeredStudents: 2,
    status: "approved",
    createdAt: "2025-01-13T10:00:00Z",
    updatedAt: "2025-01-16T11:00:00Z",
  },
  {
    id: 303,
    periodId: 3,
    teacherId: 302,
    teacherName: "PGS.TS. Lê Thị Hương",
    name: "Quản lý chuỗi cung ứng với AI",
    description:
      "Ứng dụng AI vào quản lý chuỗi cung ứng cho doanh nghiệp sản xuất.",
    maxStudents: 2,
    registeredStudents: 2,
    status: "approved",
    createdAt: "2025-01-11T08:00:00Z",
    updatedAt: "2025-01-14T09:00:00Z",
  },
  {
    id: 304,
    periodId: 3,
    teacherId: 302,
    teacherName: "PGS.TS. Lê Thị Hương",
    name: "Dashboard phân tích kinh doanh",
    description: "Xây dựng dashboard BI cho doanh nghiệp với các chỉ số KPI.",
    maxStudents: 1,
    registeredStudents: 1,
    status: "approved",
    createdAt: "2025-01-12T11:00:00Z",
    updatedAt: "2025-01-15T14:00:00Z",
  },
  {
    id: 305,
    periodId: 3,
    teacherId: 303,
    teacherName: "TS. Bùi Đức Mạnh",
    name: "Ứng dụng VR trong đào tạo",
    description: "Phát triển ứng dụng thực tế ảo phục vụ đào tạo kỹ năng.",
    maxStudents: 1,
    registeredStudents: 0,
    status: "pending",
    createdAt: "2025-01-20T10:00:00Z",
    updatedAt: "2025-01-20T10:00:00Z",
  },
  {
    id: 306,
    periodId: 3,
    teacherId: 304,
    teacherName: "ThS. Nguyễn Thị Lan",
    name: "Security audit cho web application",
    description: "Đánh giá bảo mật và đề xuất giải pháp cho ứng dụng web.",
    maxStudents: 2,
    registeredStudents: 0,
    status: "rejected",
    rejectionReason: "Cần có đối tác doanh nghiệp cung cấp ứng dụng thực tế.",
    createdAt: "2025-01-22T09:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
  },
];

// Period 4 - HK1 2026-2027 (upcoming) - chưa có đề tài
const period4Topics: Topic[] = [];

export const mockTopics: Topic[] = [
  ...period1Topics,
  ...period2Topics,
  ...period3Topics,
  ...period4Topics,
];

// ============================================================
// HELPER DATA
// ============================================================

export const semesters = [
  { value: "1", label: "Học kỳ 1" },
  { value: "2", label: "Học kỳ 2" },
  { value: "3", label: "Học kỳ 3" },
];

export const schoolYears = [
  { value: "2026-2027", label: "2026-2027" },
  { value: "2025-2026", label: "2025-2026" },
  { value: "2024-2025", label: "2024-2025" },
  { value: "2023-2024", label: "2023-2024" },
];
