// ============================================================
// STUDENT MANAGEMENT - Service (Mock Data)
// ============================================================

import type { Student, StudentFormData, StudentImportRow } from "../types";

const KHOA_OPTIONS = [
  "Công nghệ thông tin",
  "Khoa học máy tính",
  "Kỹ thuật máy tính",
  "Hệ thống thông tin",
  "An toàn thông tin",
];

const KHOA_HOC_OPTIONS = ["2020", "2021", "2022", "2023", "2024"];

const DE_TAI_EXAMPLES = [
  "Nghiên cứu ứng dụng AI trong y tế",
  "Xây dựng hệ thống quản lý học tập",
  "Phát triển ứng dụng di động",
  "Bảo mật mạng không dây",
  "Học sâu trong nhận dạng hình ảnh",
  "Blockchain trong quản lý chuỗi cung ứng",
  "Xử lý ngôn ngữ tự nhiên cho tiếng Việt",
  null,
];

const GIAO_VIEN_EXAMPLES = [
  "TS. Nguyễn Văn A",
  "ThS. Trần Thị B",
  "PGS. Lê Văn C",
  "TS. Phạm Thị D",
  "GS. Hoàng Văn E",
  null,
];

const HO_VAN = [
  "Nguyễn",
  "Trần",
  "Lê",
  "Phạm",
  "Hoàng",
  "Vũ",
  "Đặng",
  "Bùi",
  "Đỗ",
  "Ngô",
  "Hồ",
  "Phan",
  "Trương",
  "Dương",
  "Đoàn",
  "Cao",
];

const TEN_DEM = [
  "Văn",
  "Thị",
  "Hữu",
  "Minh",
  "Quang",
  "Đức",
  "Anh",
  "Thanh",
  "Thế",
  "Hùng",
  "Cường",
  "Tuấn",
  "Phương",
  "Lan",
  "Hương",
  "Giang",
];

const TEN = [
  "An",
  "Bình",
  "Cường",
  "Dũng",
  "Em",
  "Hùng",
  "Khoa",
  "Lâm",
  "Minh",
  "Nam",
  "Phong",
  "Quang",
  "Sơn",
  "Thắng",
  "Việt",
  "Huy",
  "Hà",
  "Linh",
  "Mai",
  "Ngọc",
  "Phương",
  "Thảo",
  "Trang",
  "Yến",
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateStudent(index: number): Student {
  const ho = randomElement(HO_VAN);
  const dem = randomElement(TEN_DEM);
  const ten = randomElement(TEN);
  const hoTen = `${ho} ${dem} ${ten}`;
  const mssv = `2020${String(index).padStart(4, "0")}`;
  const hasTopic = Math.random() > 0.3;

  return {
    id: `student-${index}`,
    stt: index,
    mssv,
    hoTen,
    khoa: randomElement(KHOA_OPTIONS),
    khoaHoc: randomElement(KHOA_HOC_OPTIONS),
    gmail: `${mssv.toLowerCase()}@student.hcmus.edu.vn`,
    deTai: hasTopic
      ? randomElement(DE_TAI_EXAMPLES.filter(Boolean) as string[])
      : null,
    giaoVienHuongDan: hasTopic
      ? randomElement(GIAO_VIEN_EXAMPLES.filter(Boolean) as string[])
      : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Generate initial mock data
let mockStudents: Student[] = Array.from({ length: 15 }, (_, i) =>
  generateStudent(i + 1),
);

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const studentService = {
  async getAll(): Promise<Student[]> {
    await delay(500);
    return [...mockStudents];
  },

  async getById(id: string): Promise<Student | null> {
    await delay(200);
    return mockStudents.find((s) => s.id === id) ?? null;
  },

  async create(data: StudentFormData): Promise<Student> {
    await delay(300);
    const newStudent: Student = {
      ...data,
      id: `student-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deTai: data.deTai ?? null,
      giaoVienHuongDan: data.giaoVienHuongDan ?? null,
    };
    mockStudents = [...mockStudents, newStudent];
    return newStudent;
  },

  async createMany(data: StudentImportRow[]): Promise<Student[]> {
    await delay(500);
    const startStt = mockStudents.length + 1;
    const newStudents: Student[] = data.map((row, index) => ({
      id: `student-${Date.now()}-${index}`,
      stt: startStt + index,
      mssv: row.mssv,
      hoTen: row.hoTen,
      khoa: row.khoa,
      khoaHoc: row.khoaHoc,
      gmail: row.gmail,
      deTai: row.deTai ?? null,
      giaoVienHuongDan: row.giaoVienHuongDan ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    mockStudents = [...mockStudents, ...newStudents];
    return newStudents;
  },

  async update(
    id: string,
    data: Partial<StudentFormData>,
  ): Promise<Student | null> {
    await delay(300);
    const index = mockStudents.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const updated = {
      ...mockStudents[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    mockStudents = [
      ...mockStudents.slice(0, index),
      updated,
      ...mockStudents.slice(index + 1),
    ];
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    await delay(300);
    const index = mockStudents.findIndex((s) => s.id === id);
    if (index === -1) return false;

    mockStudents = [
      ...mockStudents.slice(0, index),
      ...mockStudents.slice(index + 1),
    ];
    return true;
  },

  async deleteMany(ids: string[]): Promise<number> {
    await delay(400);
    const before = mockStudents.length;
    mockStudents = mockStudents.filter((s) => !ids.includes(s.id));
    return before - mockStudents.length;
  },

  getKhoaOptions(): string[] {
    return KHOA_OPTIONS;
  },

  getKhoaHocOptions(): string[] {
    return KHOA_HOC_OPTIONS;
  },
};
