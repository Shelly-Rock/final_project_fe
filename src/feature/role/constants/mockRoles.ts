export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  color: "error" | "info" | "success" | "secondary";
}

export const mockRoles: Role[] = [
  {
    id: "admin",
    name: "Quản trị viên",
    description: "Toàn quyền truy cập hệ thống",
    userCount: 2,
    permissions: ["Tất cả quyền"],
    color: "error",
  },
  {
    id: "secretary",
    name: "Thư ký",
    description: "Quản lý học tập, thông báo",
    userCount: 3,
    permissions: [
      "Quản lý sinh viên",
      "Quản lý khoa",
      "Quản lý ngành",
      "Tạo thông báo",
      "Xem báo cáo",
    ],
    color: "info",
  },
  {
    id: "teacher",
    name: "Giảng viên",
    description: "Hướng dẫn và chấm điểm",
    userCount: 25,
    permissions: [
      "Xem đồ án",
      "Hướng dẫn sinh viên",
      "Chấm điểm",
      "Phản biện",
      "Xem lịch bảo vệ",
    ],
    color: "success",
  },
  {
    id: "student",
    name: "Sinh viên",
    description: "Sinh viên đăng ký đề tài và nộp bài",
    userCount: 450,
    permissions: [
      "Xem đề tài",
      "Đăng ký đề tài",
      "Nộp bài",
      "Xem điểm",
      "Xem lịch bảo vệ",
    ],
    color: "secondary",
  },
];
