// ============================================================
// MOCK DATA: Milestones - Giai đoạn thực hiện
// ============================================================
import type {
  Milestone,
  MilestoneStatus,
} from "../types";

export const mockMilestones: Milestone[] = [
  // Milestones cho Registration reg-001
  {
    id: "ms-001",
    thesisId: "reg-001",
    name: "Hoàn thành đề cương",
    description: "Hoàn thành và nộp đề cương chi tiết cho đồ án",
    deadline: "2024-03-15",
    weight: 15,
    status: "completed",
    attachments: ["de_cuong_v1.docx"],
    submittedAt: "2024-03-14",
    approvedAt: "2024-03-16",
    createdBy: "gv-001",
    createdAt: "2024-02-20",
    updatedAt: "2024-03-16",
  },
  {
    id: "ms-002",
    thesisId: "reg-001",
    name: "Thu thập dữ liệu",
    description: "Thu thập và tiền xử lý dữ liệu huấn luyện",
    deadline: "2024-04-15",
    weight: 20,
    status: "completed",
    attachments: ["dataset_v1.zip"],
    submittedAt: "2024-04-14",
    approvedAt: "2024-04-16",
    createdBy: "gv-001",
    createdAt: "2024-03-16",
    updatedAt: "2024-04-16",
  },
  {
    id: "ms-003",
    thesisId: "reg-001",
    name: "Xây dựng model",
    description: "Huấn luyện và tối ưu mô hình AI",
    deadline: "2024-05-15",
    weight: 30,
    status: "submitted",
    attachments: ["model_v1.pth", "training_log.xlsx"],
    submittedAt: "2024-05-14",
    createdBy: "gv-001",
    createdAt: "2024-04-16",
    updatedAt: "2024-05-14",
  },
  {
    id: "ms-004",
    thesisId: "reg-001",
    name: "Hoàn thiện báo cáo",
    description: "Viết và hoàn thiện báo cáo tổng kết",
    deadline: "2024-06-01",
    weight: 20,
    status: "in_progress",
    createdBy: "gv-001",
    createdAt: "2024-05-15",
    updatedAt: "2024-05-15",
  },
  {
    id: "ms-005",
    thesisId: "reg-001",
    name: "Nộp sản phẩm cuối cùng",
    description: "Nộp code, tài liệu và sản phẩm hoàn chỉnh",
    deadline: "2024-06-10",
    weight: 15,
    status: "not_started",
    createdBy: "gv-001",
    createdAt: "2024-06-01",
    updatedAt: "2024-06-01",
  },
  // Milestones cho Registration reg-002
  {
    id: "ms-006",
    thesisId: "reg-002",
    name: "Hoàn thành đề cương",
    description: "Hoàn thành đề cương chi tiết",
    deadline: "2024-02-01",
    weight: 15,
    status: "completed",
    submittedAt: "2024-01-30",
    approvedAt: "2024-02-02",
    createdBy: "gv-002",
    createdAt: "2024-01-15",
    updatedAt: "2024-02-02",
  },
  {
    id: "ms-007",
    thesisId: "reg-002",
    name: "Triển khai hệ thống",
    description: "Phát triển và triển khai hệ thống LMS",
    deadline: "2024-04-01",
    weight: 40,
    status: "completed",
    submittedAt: "2024-03-30",
    approvedAt: "2024-04-02",
    createdBy: "gv-002",
    createdAt: "2024-02-02",
    updatedAt: "2024-04-02",
  },
  {
    id: "ms-008",
    thesisId: "reg-002",
    name: "Kiểm thử & hoàn thiện",
    description: "Kiểm thử hệ thống và hoàn thiện tài liệu",
    deadline: "2024-05-10",
    weight: 45,
    status: "completed",
    submittedAt: "2024-05-08",
    approvedAt: "2024-05-10",
    createdBy: "gv-002",
    createdAt: "2024-04-02",
    updatedAt: "2024-05-10",
  },
  // Milestone bị trễ hạn
  {
    id: "ms-009",
    thesisId: "reg-006",
    name: "Thu thập dữ liệu",
    description: "Thu thập dữ liệu y tế cho model",
    deadline: "2024-04-01",
    weight: 20,
    status: "overdue",
    createdBy: "gv-001",
    createdAt: "2024-02-25",
    updatedAt: "2024-04-01",
  },
];

export const getMilestoneStatusColor = (
  status: MilestoneStatus
): "default" | "warning" | "info" | "success" | "error" => {
  const colors: Record<MilestoneStatus, "default" | "warning" | "info" | "success" | "error"> = {
    not_started: "default",
    in_progress: "info",
    overdue: "error",
    submitted: "warning",
    approved: "success",
    revision: "warning",
    completed: "success",
  };
  return colors[status];
};

export const calculateOverallProgress = (milestones: Milestone[]): number => {
  if (milestones.length === 0) return 0;
  
  const completedMilestones = milestones.filter(
    (m) => m.status === "completed" || m.status === "approved"
  );
  
  const totalWeight = milestones.reduce((sum, m) => sum + m.weight, 0);
  const completedWeight = completedMilestones.reduce((sum, m) => sum + m.weight, 0);
  
  return Math.round((completedWeight / totalWeight) * 100);
};
