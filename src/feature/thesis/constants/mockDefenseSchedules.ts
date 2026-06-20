// ============================================================
// MOCK DATA: Defense Schedules - Lịch bảo vệ & Hội đồng
// ============================================================
import type {
  DefenseSchedule,
  CouncilMember,
  DefenseRecord,
  CouncilScore,
} from "../types";

export const mockCouncilMembers: CouncilMember[] = [
  { id: "cm-001", name: "GS. Trần Văn A", role: "chairman", department: "CNTT" },
  { id: "cm-002", name: "PGS. Lê Thị B", role: "secretary", department: "CNTT" },
  { id: "cm-003", name: "TS. Hoàng Văn C", role: "member", department: "KHMT" },
  { id: "cm-004", name: "TS. Nguyễn Thị D", role: "member", department: "ATTT" },
  { id: "cm-005", name: "PGS. Phạm Văn E", role: "chairman", department: "KTMT" },
  { id: "cm-006", name: "TS. Vũ Văn F", role: "secretary", department: "KTMT" },
  { id: "cm-007", name: "TS. Đặng Thị G", role: "member", department: "CNTT" },
];

export const mockDefenseSchedules: DefenseSchedule[] = [
  {
    id: "ds-001",
    room: "A101",
    date: "2024-05-20",
    timeSlot: "08:00 - 10:00",
    councilId: "council-001",
    councilName: "Hội đồng chấm bảo vệ số 1",
    councilMembers: [
      mockCouncilMembers[0],
      mockCouncilMembers[1],
      mockCouncilMembers[2],
    ],
    defenses: [],
  },
  {
    id: "ds-002",
    room: "A102",
    date: "2024-05-20",
    timeSlot: "08:00 - 10:00",
    councilId: "council-002",
    councilName: "Hội đồng chấm bảo vệ số 2",
    councilMembers: [
      mockCouncilMembers[4],
      mockCouncilMembers[5],
      mockCouncilMembers[6],
    ],
    defenses: [],
  },
  {
    id: "ds-003",
    room: "A101",
    date: "2024-05-21",
    timeSlot: "14:00 - 16:00",
    councilId: "council-001",
    councilName: "Hội đồng chấm bảo vệ số 1",
    councilMembers: [
      mockCouncilMembers[0],
      mockCouncilMembers[1],
      mockCouncilMembers[3],
    ],
    defenses: [],
  },
];

export const mockDefenseRecords: DefenseRecord[] = [
  {
    id: "dr-001",
    registrationId: "reg-002",
    studentId: "sv-002",
    studentName: "Trần Thị B",
    studentMssv: "20200002",
    thesisTitle: "Hệ thống quản lý học tập LMS",
    scheduleId: "ds-001",
    status: "completed",
    presentationTime: 20,
    defenseStartedAt: "2024-05-20T08:05:00",
    defenseEndedAt: "2024-05-20T08:32:00",
  },
  {
    id: "dr-002",
    registrationId: "reg-006",
    studentId: "sv-006",
    studentName: "Vũ Thị F",
    studentMssv: "20200006",
    thesisTitle: "Xử lý ảnh y tế bằng Deep Learning",
    scheduleId: "ds-002",
    status: "defending",
    presentationTime: 20,
    defenseStartedAt: "2024-05-20T08:10:00",
  },
  {
    id: "dr-003",
    registrationId: "reg-007",
    studentId: "sv-007",
    studentName: "Đặng Văn G",
    studentMssv: "20200007",
    thesisTitle: "Ứng dụng IoT trong nông nghiệp",
    scheduleId: "ds-003",
    status: "scheduled",
    presentationTime: 20,
  },
];

export const mockCouncilScores: CouncilScore[] = [
  {
    defenseId: "dr-001",
    councilMemberId: "cm-001",
    councilMemberName: "GS. Trần Văn A",
    contentQuality: 8,
    methodology: 8,
    resultContribution: 7.5,
    qaPerformance: 7,
    presentation: 8,
    totalScore: 7.7,
    comment: "Hệ thống hoạt động tốt, cần cải thiện phần demo trực tiếp",
    scoredAt: "2024-05-20T09:00:00",
  },
  {
    defenseId: "dr-001",
    councilMemberId: "cm-002",
    councilMemberName: "PGS. Lê Thị B",
    contentQuality: 7.5,
    methodology: 8,
    resultContribution: 7,
    qaPerformance: 7.5,
    presentation: 7.5,
    totalScore: 7.5,
    comment: "Tài liệu đầy đủ, code sạch",
    scoredAt: "2024-05-20T09:05:00",
  },
  {
    defenseId: "dr-001",
    councilMemberId: "cm-003",
    councilMemberName: "TS. Hoàng Văn C",
    contentQuality: 7,
    methodology: 7.5,
    resultContribution: 7,
    qaPerformance: 7,
    presentation: 7,
    totalScore: 7.1,
    comment: "Cơ bản đạt yêu cầu",
    scoredAt: "2024-05-20T09:10:00",
  },
];

// Helper functions
export const getCouncilRoleLabel = (role: CouncilMember["role"]): string => {
  const labels: Record<CouncilMember["role"], string> = {
    chairman: "Chủ tịch",
    secretary: "Thư ký",
    member: "Thành viên",
  };
  return labels[role];
};

export const getDefenseStatusColor = (
  status: DefenseRecord["status"]
): "default" | "warning" | "info" | "success" | "error" => {
  const colors: Record<DefenseRecord["status"], "default" | "warning" | "info" | "success" | "error"> = {
    not_ready: "error",
    ready: "success",
    scheduled: "info",
    defending: "warning",
    defended: "info",
    completed: "success",
    retake: "error",
  };
  return colors[status];
};

export const calculateCouncilAverageScore = (
  defenseId: string,
  scores: CouncilScore[]
): number | null => {
  const defenseScores = scores.filter((s) => s.defenseId === defenseId);
  if (defenseScores.length === 0) return null;
  
  const totalScore = defenseScores.reduce((sum, s) => sum + s.totalScore, 0);
  return Math.round((totalScore / defenseScores.length) * 100) / 100;
};
