// ====================================
// MOCK DATA — Administrative Structure
// Faculty -> Department -> Lecturer
// ====================================

import type {
  Faculty,
  Department,
  Lecturer,
  Topic,
  Specialization,
} from "../types/administrative";

// ====================================
// FACULTIES (Khoa)
// ====================================

export const mockFaculties: Faculty[] = [
  { id: "FAC_01", name: "Khoa Công nghệ thông tin" },
  { id: "FAC_02", name: "Khoa Kỹ thuật máy tính" },
  { id: "FAC_03", name: "Khoa Khoa học dữ liệu" },
];

// ====================================
// DEPARTMENTS (Bộ môn)
// ====================================

export const mockDepartments: Department[] = [
  { id: "DEPT_01", name: "Công nghệ phần mềm", facultyId: "FAC_01" },
  { id: "DEPT_02", name: "Hệ thống thông tin", facultyId: "FAC_01" },
  { id: "DEPT_03", name: "Khoa học máy tính", facultyId: "FAC_01" },
  { id: "DEPT_04", name: "Mạng máy tính", facultyId: "FAC_01" },
  { id: "DEPT_05", name: "An toàn thông tin", facultyId: "FAC_01" },
  { id: "DEPT_06", name: "Trí tuệ nhân tạo", facultyId: "FAC_01" },
  { id: "DEPT_07", name: "Kỹ thuật máy tính", facultyId: "FAC_02" },
  { id: "DEPT_08", name: "IoT & Embedded Systems", facultyId: "FAC_02" },
  { id: "DEPT_09", name: "Khoa học dữ liệu", facultyId: "FAC_03" },
  { id: "DEPT_10", name: "Big Data", facultyId: "FAC_03" },
];

// ====================================
// SPECIALIZATIONS (Chuyên ngành - mapped với Department)
// ====================================

export const mockSpecializations: Specialization[] = [
  { id: "SPEC_01", name: "Công nghệ phần mềm", departmentId: "DEPT_01" },
  { id: "SPEC_02", name: "Hệ thống thông tin", departmentId: "DEPT_02" },
  { id: "SPEC_03", name: "Khoa học máy tính", departmentId: "DEPT_03" },
  { id: "SPEC_04", name: "Mạng máy tính", departmentId: "DEPT_04" },
  { id: "SPEC_05", name: "An toàn thông tin", departmentId: "DEPT_05" },
  { id: "SPEC_06", name: "Trí tuệ nhân tạo", departmentId: "DEPT_06" },
  { id: "SPEC_07", name: "Kỹ thuật máy tính", departmentId: "DEPT_07" },
  { id: "SPEC_08", name: "IoT", departmentId: "DEPT_08" },
  { id: "SPEC_09", name: "Khoa học dữ liệu", departmentId: "DEPT_09" },
  { id: "SPEC_10", name: "Big Data", departmentId: "DEPT_10" },
];

// ====================================
// LECTURERS (Giảng viên)
// ====================================

export const mockLecturers: Lecturer[] = [
  {
    id: 1,
    code: "GV001",
    name: "Nguyễn Văn An",
    email: "nv.an@ctu.edu.vn",
    phone: "0912345678",
    facultyId: "FAC_01",
    departmentId: "DEPT_01",
    academicTitle: "Tiến sĩ",
    position: "Trưởng ngành",
    dateOfBirth: "1975-03-15",
    gender: "male",
    status: "active",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-06-20T10:30:00Z",
  },
  {
    id: 2,
    code: "GV002",
    name: "Trần Thị Bình",
    email: "tt.binh@ctu.edu.vn",
    phone: "0923456789",
    facultyId: "FAC_01",
    departmentId: "DEPT_02",
    academicTitle: "Thạc sĩ",
    position: "Phó trưởng ngành",
    dateOfBirth: "1980-07-22",
    gender: "female",
    status: "active",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-06-18T14:20:00Z",
  },
  {
    id: 3,
    code: "GV003",
    name: "Lê Hoàng Cường",
    email: "lh.cuong@ctu.edu.vn",
    facultyId: "FAC_01",
    departmentId: "DEPT_03",
    academicTitle: "Giáo sư",
    position: "Trưởng ngành",
    dateOfBirth: "1968-11-08",
    gender: "male",
    status: "active",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-06-15T09:00:00Z",
  },
  {
    id: 4,
    code: "GV004",
    name: "Phạm Thị Dung",
    email: "pt.dung@ctu.edu.vn",
    phone: "0945678901",
    facultyId: "FAC_01",
    departmentId: "DEPT_04",
    academicTitle: "Thạc sĩ",
    status: "inactive",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-05-10T16:45:00Z",
  },
  {
    id: 5,
    code: "GV005",
    name: "Hoàng Minh Em",
    email: "hm.em@ctu.edu.vn",
    facultyId: "FAC_01",
    departmentId: "DEPT_01",
    academicTitle: "Thạc sĩ",
    position: "Giảng viên",
    dateOfBirth: "1988-05-30",
    gender: "male",
    status: "active",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-06-22T11:15:00Z",
  },
  {
    id: 6,
    code: "GV006",
    name: "Ngô Thị Hương",
    email: "nt.huong@ctu.edu.vn",
    facultyId: "FAC_01",
    departmentId: "DEPT_05",
    academicTitle: "Tiến sĩ",
    position: "Trưởng ngành",
    dateOfBirth: "1979-09-12",
    gender: "female",
    status: "active",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-06-21T08:30:00Z",
  },
  {
    id: 7,
    code: "GV007",
    name: "Võ Đình Phú",
    email: "vd.phu@ctu.edu.vn",
    facultyId: "FAC_02",
    departmentId: "DEPT_07",
    academicTitle: "Tiến sĩ",
    position: "Trưởng ngành",
    dateOfBirth: "1976-04-20",
    gender: "male",
    status: "active",
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-06-20T08:30:00Z",
  },
  {
    id: 8,
    code: "GV008",
    name: "Đặng Thị Lan",
    email: "dt.lan@ctu.edu.vn",
    facultyId: "FAC_03",
    departmentId: "DEPT_09",
    academicTitle: "Thạc sĩ",
    position: "Giảng viên",
    dateOfBirth: "1985-08-15",
    gender: "female",
    status: "active",
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-06-18T14:30:00Z",
  },
];

// ====================================
// REGISTERED STUDENTS (Sinh viên đã đăng ký)
// ====================================

import type { RegisteredStudent } from "@/feature/student-topic/types";

export const mockRegisteredStudents: RegisteredStudent[] = [
  // TOPIC_01: Xây dựng hệ thống quản lý đề tài khóa luận (1/3)
  {
    id: 1,
    studentId: "B21DCCN001",
    studentCode: "B21DCCN001",
    studentName: "Trần Văn Minh",
    order: 1,
    registeredAt: "2024-03-15T10:30:00Z",
  },
  // TOPIC_04: Phát triển ứng dụng di động (3/3 - FULL)
  {
    id: 2,
    studentId: "B21DCCN015",
    studentCode: "B21DCCN015",
    studentName: "Lê Thị Hương",
    order: 1,
    registeredAt: "2024-03-10T08:00:00Z",
  },
  {
    id: 3,
    studentId: "B21DCCN023",
    studentCode: "B21DCCN023",
    studentName: "Phạm Đình Nam",
    order: 2,
    registeredAt: "2024-03-11T14:20:00Z",
  },
  {
    id: 4,
    studentId: "B21DCCN031",
    studentCode: "B21DCCN031",
    studentName: "Nguyễn Thị Lan",
    order: 3,
    registeredAt: "2024-03-12T09:15:00Z",
  },
];

// ====================================
// TOPICS (Đề tài)
// ====================================

export const mockTopics: Topic[] = [
  {
    id: "TOPIC_01",
    name: "Xây dựng hệ thống quản lý đề tài khóa luận tốt nghiệp",
    englishName: "Graduation Thesis Management System",
    description:
      "Nghiên cứu và xây dựng hệ thống quản lý đề tài khóa luận tốt nghiệp cho trường đại học.",
    objectives: "Quản lý đề tài, phân công hướng dẫn, theo dõi tiến độ",
    technologies: "React, Node.js, PostgreSQL",
    lecturerId: 1,
    lecturerName: "Nguyễn Văn An",
    lecturerEmail: "nv.an@ctu.edu.vn",
    allowedSpecializationIds: ["SPEC_01", "SPEC_02"], // CNPM, HTTT
    maxStudents: 3,
    registeredCount: 1,
    status: "Approved",
    registrationStatus: "OPEN", // 1/3 sinh viên - đang mở
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "TOPIC_02",
    name: "Ứng dụng AI trong nhận diện khuôn mặt",
    englishName: "AI Application in Face Recognition",
    description: "Xây dựng ứng dụng nhận diện khuôn mặt sử dụng Deep Learning.",
    objectives: "Nhận diện khuôn mặt chính xác, ứng dụng thực tế",
    technologies: "Python, TensorFlow, OpenCV",
    lecturerId: 3,
    lecturerName: "Lê Hoàng Cường",
    lecturerEmail: "lh.cuong@ctu.edu.vn",
    allowedSpecializationIds: ["SPEC_03", "SPEC_06"], // KHMT, AI
    maxStudents: 2,
    registeredCount: 2,
    status: "Approved",
    registrationStatus: "FULL", // 2/2 sinh viên - đã đầy
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "TOPIC_03",
    name: "Hệ thống giám sát an ninh mạng",
    englishName: "Network Security Monitoring System",
    description: "Xây dựng hệ thống giám sát và phát hiện xâm nhập mạng.",
    objectives: "Phát hiện xâm nhập sớm, cảnh báo tự động",
    technologies: "Python, Snort, ELK Stack",
    lecturerId: 6,
    lecturerName: "Ngô Thị Hương",
    lecturerEmail: "nt.huong@ctu.edu.vn",
    allowedSpecializationIds: ["SPEC_04", "SPEC_05"], // Mạng, ATTT
    maxStudents: 2,
    registeredCount: 0,
    status: "Approved",
    registrationStatus: "OPEN", // 0/2 sinh viên - đang mở
    createdAt: "2024-02-01T08:00:00Z",
  },
  {
    id: "TOPIC_04",
    name: "Phát triển ứng dụng di động cho thương mại điện tử",
    englishName: "Mobile E-commerce Application Development",
    description: "Xây dựng ứng dụng di động cho nền tảng thương mại điện tử.",
    objectives: "Mua bán trực tuyến, tích hợp thanh toán",
    technologies: "React Native, Firebase",
    lecturerId: 2,
    lecturerName: "Trần Thị Bình",
    lecturerEmail: "tt.binh@ctu.edu.vn",
    allowedSpecializationIds: ["SPEC_01"], // CNPM
    maxStudents: 3,
    registeredCount: 3,
    status: "Approved",
    registrationStatus: "FULL", // 3/3 sinh viên - đã đầy
    createdAt: "2024-02-10T10:00:00Z",
  },
  {
    id: "TOPIC_05",
    name: "Ứng dụng IoT trong nông nghiệp thông minh",
    englishName: "IoT Application in Smart Agriculture",
    description:
      "Xây dựng hệ thống IoT giám sát và điều khiển môi trường trồng trọt.",
    objectives: "Tự động hóa tưới tiêu, giám sát cây trồng",
    technologies: "Arduino, ESP32, MQTT",
    lecturerId: 7,
    lecturerName: "Võ Đình Phú",
    lecturerEmail: "vd.phu@ctu.edu.vn",
    allowedSpecializationIds: ["SPEC_07", "SPEC_08"], // Kỹ thuật máy tính, IoT
    maxStudents: 2,
    registeredCount: 1,
    status: "Approved",
    registrationStatus: "LOCKED", // 1/2 sinh viên - giảng viên đã chốt danh sách
    createdAt: "2024-02-15T08:00:00Z",
  },
  {
    id: "TOPIC_06",
    name: "Phân tích dữ liệu lớn cho dự đoán xu hướng thị trường",
    englishName: "Big Data Analysis for Market Trend Prediction",
    description: "Ứng dụng Big Data và Machine Learning để dự đoán xu hướng.",
    objectives: "Phân tích dữ liệu lớn, dự đoán xu hướng tiêu dùng",
    technologies: "Spark, Hadoop, Python",
    lecturerId: 8,
    lecturerName: "Đặng Thị Lan",
    lecturerEmail: "dt.lan@ctu.edu.vn",
    allowedSpecializationIds: ["SPEC_09", "SPEC_10"], // KHDL, Big Data
    maxStudents: 2,
    registeredCount: 0,
    status: "Approved",
    registrationStatus: "OPEN", // 0/2 sinh viên - đang mở
    createdAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "TOPIC_07",
    name: "Xây dựng chatbot hỗ trợ sinh viên",
    englishName: "Student Support Chatbot Development",
    description:
      "Xây dựng chatbot AI hỗ trợ sinh viên về thông tin tuyển sinh.",
    objectives: "Tự động trả lời câu hỏi thường gặp",
    technologies: "Python, Dialogflow, Flask",
    lecturerId: 5,
    lecturerName: "Hoàng Minh Em",
    lecturerEmail: "hm.em@ctu.edu.vn",
    allowedSpecializationIds: ["SPEC_01", "SPEC_06"], // CNPM, AI
    maxStudents: 2,
    registeredCount: 0,
    status: "Pending",
    registrationStatus: "OPEN", // Đang chờ duyệt
    createdAt: "2024-03-10T10:00:00Z",
  },
];

// ====================================
// HELPER FUNCTIONS
// ====================================

/**
 * Get faculty name by ID
 */
export function getFacultyName(facultyId: string): string {
  return (
    mockFaculties.find((f) => f.id === facultyId)?.name ?? "Không xác định"
  );
}

/**
 * Get department name by ID
 */
export function getDepartmentName(departmentId: string): string {
  return (
    mockDepartments.find((d) => d.id === departmentId)?.name ?? "Không xác định"
  );
}

/**
 * Get departments by faculty ID (for cascading dropdown)
 */
export function getDepartmentsByFaculty(facultyId: string): Department[] {
  return mockDepartments.filter((d) => d.facultyId === facultyId);
}

/**
 * Get lecturer by ID
 */
export function getLecturerById(lecturerId: number): Lecturer | undefined {
  return mockLecturers.find((l) => l.id === lecturerId);
}

/**
 * Filter topics by specialization (for student registration)
 */
export function filterTopicsBySpecialization(
  specializationId: string,
): Topic[] {
  return mockTopics.filter(
    (t) =>
      t.status === "Approved" &&
      t.allowedSpecializationIds.includes(specializationId),
  );
}

/**
 * Get registered students by topic ID
 */
export function getRegisteredStudentsByTopic(
  topicId: string,
): RegisteredStudent[] {
  return mockRegisteredStudents.filter((rs) => {
    // Find the topic to check if this student is registered for it
    const topic = mockTopics.find((t) => t.id === topicId);
    if (!topic) return false;
    return true; // In real app, would check registration table
  });
}

/**
 * Get registered students count for a topic
 */
export function getRegisteredStudentsCount(topicId: string): number {
  // This would be based on actual registrations in real app
  const topic = mockTopics.find((t) => t.id === topicId);
  return topic?.registeredCount ?? 0;
}

// ====================================
// MOCK API SERVICES
// ====================================

/**
 * Mock API: Lấy mã giảng viên tiếp theo
 * @returns Promise<string> - Mã giảng viên mới (VD: "GV010")
 *
 * // TODO: Thay thế bằng API GET /api/lecturers/next-code từ Backend
 */
export async function fetchNextLecturerCode(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get all existing codes
      const existingCodes = mockLecturers.map((l) => l.code);

      // Find the highest numeric suffix
      let maxNum = 0;
      existingCodes.forEach((code) => {
        const match = code.match(/^GV(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) {
            maxNum = num;
          }
        }
      });

      // Generate next code with zero-padded number
      const nextNum = maxNum + 1;
      const nextCode = `GV${String(nextNum).padStart(3, "0")}`;

      resolve(nextCode);
    }, 500); // Simulate network delay
  });
}
