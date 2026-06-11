export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "secretary" | "teacher" | "student";
  department: string;
  status: "active" | "inactive";
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
  },
  {
    id: "2",
    name: "Trần Thị Secretary",
    email: "secretary@hcmus.edu.vn",
    role: "secretary",
    department: "CNTT",
    status: "active",
  },
  {
    id: "3",
    name: "Lê Văn Giảng",
    email: "lecturer1@hcmus.edu.vn",
    role: "teacher",
    department: "CNTT",
    status: "active",
  },
  {
    id: "4",
    name: "Phạm Thị Giảng",
    email: "lecturer2@hcmus.edu.vn",
    role: "teacher",
    department: "KHMT",
    status: "active",
  },
  {
    id: "5",
    name: "Hoàng Văn Sinh",
    email: "student1@hcmus.edu.vn",
    role: "student",
    department: "CNTT",
    status: "inactive",
  },
];
