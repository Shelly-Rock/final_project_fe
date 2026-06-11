export interface AuditLog {
  id: string;
  action: string;
  user: string;
  resource: string;
  ip: string;
  timestamp: string;
  status: "success" | "failed";
}

export const actionColors: Record<
  string,
  "success" | "warning" | "error" | "info" | "default"
> = {
  create: "success",
  update: "info",
  delete: "error",
  login: "default",
  logout: "default",
  export: "warning",
  import: "warning",
};

export const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    action: "login",
    user: "admin@hcmus.edu.vn",
    resource: "Hệ thống",
    ip: "192.168.1.1",
    timestamp: "2024-05-10 08:30:15",
    status: "success",
  },
  {
    id: "2",
    action: "create",
    user: "secretary@hcmus.edu.vn",
    resource: "Sinh viên",
    ip: "192.168.1.2",
    timestamp: "2024-05-10 09:15:22",
    status: "success",
  },
  {
    id: "3",
    action: "update",
    user: "admin@hcmus.edu.vn",
    resource: "Người dùng",
    ip: "192.168.1.1",
    timestamp: "2024-05-10 10:00:45",
    status: "success",
  },
  {
    id: "4",
    action: "delete",
    user: "admin@hcmus.edu.vn",
    resource: "Đề tài",
    ip: "192.168.1.1",
    timestamp: "2024-05-10 11:30:10",
    status: "success",
  },
  {
    id: "5",
    action: "login",
    user: "student@hcmus.edu.vn",
    resource: "Hệ thống",
    ip: "192.168.1.5",
    timestamp: "2024-05-10 12:00:00",
    status: "failed",
  },
  {
    id: "6",
    action: "export",
    user: "secretary@hcmus.edu.vn",
    resource: "Báo cáo",
    ip: "192.168.1.2",
    timestamp: "2024-05-10 14:20:33",
    status: "success",
  },
  {
    id: "7",
    action: "import",
    user: "admin@hcmus.edu.vn",
    resource: "Sinh viên",
    ip: "192.168.1.1",
    timestamp: "2024-05-10 15:45:18",
    status: "success",
  },
];
