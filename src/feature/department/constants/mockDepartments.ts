export interface Department {
  id: string;
  name: string;
  code: string;
  lecturerCount: number;
  studentCount: number;
  status: "active" | "inactive";
}

export const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Công nghệ thông tin",
    code: "CNTT",
    lecturerCount: 25,
    studentCount: 450,
    status: "active",
  },
  {
    id: "2",
    name: "Khoa học máy tính",
    code: "KHMT",
    lecturerCount: 18,
    studentCount: 320,
    status: "active",
  },
  {
    id: "3",
    name: "Kỹ thuật máy tính",
    code: "KTMT",
    lecturerCount: 15,
    studentCount: 280,
    status: "active",
  },
  {
    id: "4",
    name: "Hệ thống thông tin",
    code: "HTTT",
    lecturerCount: 12,
    studentCount: 200,
    status: "active",
  },
  {
    id: "5",
    name: "An toàn thông tin",
    code: "ATTT",
    lecturerCount: 10,
    studentCount: 150,
    status: "inactive",
  },
];
