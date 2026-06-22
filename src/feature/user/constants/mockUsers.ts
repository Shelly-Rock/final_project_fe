export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "secretary" | "teacher" | "student";
  department: string;
  status: "active" | "inactive";
  avatar?: string;
  phone?: string;
  createdAt?: string;
}

export const roleColors: Record<
  string,
  "error" | "info" | "success" | "secondary"
> = {
  admin: "error",
  secretary: "info",
  teacher: "success",
  student: "secondary",
};

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Nguyễn Văn Admin",
    email: "admin@hcmus.edu.vn",
    role: "admin",
    department: "CNTT",
    status: "active",
    phone: "0912345678",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Trần Thị Secretary",
    email: "secretary@hcmus.edu.vn",
    role: "secretary",
    department: "CNTT",
    status: "active",
    phone: "0912345679",
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    name: "Lê Văn Giảng",
    email: "lecturer1@hcmus.edu.vn",
    role: "teacher",
    department: "CNTT",
    status: "active",
    phone: "0912345680",
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    name: "Phạm Thị Giảng",
    email: "lecturer2@hcmus.edu.vn",
    role: "teacher",
    department: "KHMT",
    status: "active",
    phone: "0912345681",
    createdAt: "2024-01-22",
  },
  {
    id: "5",
    name: "Hoàng Văn Sinh",
    email: "student1@hcmus.edu.vn",
    role: "student",
    department: "CNTT",
    status: "inactive",
    phone: "0912345682",
    createdAt: "2024-03-01",
  },
  {
    id: "6",
    name: "Mai Thị Nữ",
    email: "student2@hcmus.edu.vn",
    role: "student",
    department: "KHMT",
    status: "active",
    phone: "0912345683",
    createdAt: "2024-03-05",
  },
];

export const departments = [
  "Công nghệ thông tin",
  "Kỹ thuật phần mềm",
  "Khoa học máy tính",
  "Hệ thống thông tin",
  "An toàn thông tin",
  "Mạng máy tính",
];
