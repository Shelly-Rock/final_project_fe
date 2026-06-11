export interface Major {
  id: string;
  name: string;
  code: string;
  department: string;
  studentCount: number;
  status: "active" | "inactive";
}

export const mockMajors: Major[] = [
  {
    id: "1",
    name: "Công nghệ phần mềm",
    code: "CTPM",
    department: "CNTT",
    studentCount: 150,
    status: "active",
  },
  {
    id: "2",
    name: "Mạng máy tính",
    code: "MMT",
    department: "CNTT",
    studentCount: 120,
    status: "active",
  },
  {
    id: "3",
    name: "Trí tuệ nhân tạo",
    code: "AI",
    department: "KHMT",
    studentCount: 80,
    status: "active",
  },
  {
    id: "4",
    name: "Khoa học dữ liệu",
    code: "KHDL",
    department: "KHMT",
    studentCount: 90,
    status: "active",
  },
  {
    id: "5",
    name: "An toàn không gian mạng",
    code: "ATKM",
    department: "ATTT",
    studentCount: 75,
    status: "inactive",
  },
];
