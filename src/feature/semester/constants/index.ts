import type { Semester, PhaseConfig } from "../types";

export const mockSemesters: Semester[] = [
  {
    id: "sem-001",
    name: "Học kỳ 2 - 2023-2024",
    code: "2023-2024-HK2",
    startDate: "2024-01-15",
    endDate: "2024-05-31",
    registrationDeadline: "2024-02-15",
    topicDeadline: "2024-02-01",
    defenseDate: "2024-05-20",
    status: "completed",
    createdAt: "2023-12-01",
    updatedAt: "2024-05-31",
  },
  {
    id: "sem-002",
    name: "Học kỳ 1 - 2024-2025",
    code: "2024-2025-HK1",
    startDate: "2024-09-01",
    endDate: "2025-01-15",
    registrationDeadline: "2024-09-30",
    topicDeadline: "2024-09-15",
    defenseDate: "2025-01-10",
    status: "completed",
    createdAt: "2024-08-01",
    updatedAt: "2025-01-15",
  },
  {
    id: "sem-003",
    name: "Học kỳ 2 - 2024-2025",
    code: "2024-2025-HK2",
    startDate: "2025-02-01",
    endDate: "2025-06-30",
    registrationDeadline: "2025-02-28",
    topicDeadline: "2025-02-15",
    defenseDate: "2025-06-15",
    status: "in_progress",
    createdAt: "2024-12-01",
    updatedAt: "2025-06-01",
  },
];

export const mockPhaseConfigs: PhaseConfig[] = [
  {
    id: "phase-001",
    semesterId: "sem-003",
    phaseName: "Đăng ký đề tài",
    startDate: "2025-02-01",
    endDate: "2025-02-28",
    description: "Sinh viên đăng ký đề tài khóa luận",
  },
  {
    id: "phase-002",
    semesterId: "sem-003",
    phaseName: "Phản biện đề cương",
    startDate: "2025-03-01",
    endDate: "2025-03-31",
    description: "GV phản biện duyệt đề cương cho sinh viên",
  },
  {
    id: "phase-003",
    semesterId: "sem-003",
    phaseName: "Thực hiện khóa luận",
    startDate: "2025-04-01",
    endDate: "2025-05-31",
    description: "Sinh viên thực hiện và nộp báo cáo tiến độ",
  },
  {
    id: "phase-004",
    semesterId: "sem-003",
    phaseName: "Bảo vệ",
    startDate: "2025-06-01",
    endDate: "2025-06-15",
    description: "Hội đồng bảo vệ khóa luận",
  },
];

export const getSemesterStatusColor = (status: Semester["status"]) => {
  const colors: Record<Semester["status"], "default" | "info" | "warning" | "success"> = {
    planning: "default",
    registration: "info",
    in_progress: "warning",
    completed: "success",
    archived: "default",
  };
  return colors[status] || "default";
};

export const getSemesterStatusLabel = (status: Semester["status"]) => {
  const labels = {
    planning: "Lên kế hoạch",
    registration: "Đăng ký",
    in_progress: "Đang thực hiện",
    completed: "Hoàn thành",
    archived: "Lưu trữ",
  };
  return labels[status] || status;
};
