// ============================================================
// MOCK DATA: Statistics - Thống kê
// ============================================================
import type { ThesisStatistics } from "../types";

export const mockThesisStatistics: ThesisStatistics = {
  totalTopics: 45,
  approvedTopics: 38,
  rejectedTopics: 7,
  totalStudents: 52,
  completedStudents: 38,
  inProgressStudents: 14,
  
  averageScore: 7.8,
  scoreDistribution: {
    "A+": 5,
    "A": 8,
    "B+": 12,
    "B": 10,
    "C+": 3,
    "C": 0,
    "D": 0,
    "F": 0,
  },
  
  onTimeRate: 0.82,
  lateRate: 0.18,
  retakeRate: 0.05,
  
  avgRegistrationToConfirmation: 5,
  avgReadyToDefense: 7,
};

// Thống kê theo khoa
export const departmentStatistics = [
  {
    department: "CNTT",
    totalTopics: 18,
    completedStudents: 15,
    inProgressStudents: 3,
    avgScore: 8.1,
  },
  {
    department: "KHMT",
    totalTopics: 12,
    completedStudents: 10,
    inProgressStudents: 2,
    avgScore: 7.9,
  },
  {
    department: "KTMT",
    totalTopics: 8,
    completedStudents: 7,
    inProgressStudents: 1,
    avgScore: 7.5,
  },
  {
    department: "ATTT",
    totalTopics: 7,
    completedStudents: 6,
    inProgressStudents: 1,
    avgScore: 8.0,
  },
];

// Thống kê theo GV
export const lecturerStatistics = [
  {
    lecturerId: "gv-001",
    lecturerName: "TS. Nguyễn Văn X",
    totalStudents: 12,
    completedStudents: 10,
    inProgressStudents: 2,
    avgScore: 8.2,
    onTimeRate: 0.85,
  },
  {
    lecturerId: "gv-002",
    lecturerName: "ThS. Trần Thị Y",
    totalStudents: 8,
    completedStudents: 7,
    inProgressStudents: 1,
    avgScore: 7.6,
    onTimeRate: 0.90,
  },
  {
    lecturerId: "gv-003",
    lecturerName: "PGS. Lê Văn Z",
    totalStudents: 6,
    completedStudents: 5,
    inProgressStudents: 1,
    avgScore: 7.8,
    onTimeRate: 0.75,
  },
  {
    lecturerId: "gv-004",
    lecturerName: "TS. Hoàng Văn W",
    totalStudents: 5,
    completedStudents: 4,
    inProgressStudents: 1,
    avgScore: 7.4,
    onTimeRate: 0.80,
  },
];

// Thống kê theo tháng
export const monthlyStatistics = [
  { month: "01/2024", registrations: 5, completions: 0 },
  { month: "02/2024", registrations: 15, completions: 2 },
  { month: "03/2024", registrations: 20, completions: 5 },
  { month: "04/2024", registrations: 10, completions: 12 },
  { month: "05/2024", registrations: 2, completions: 18 },
  { month: "06/2024", registrations: 0, completions: 6 },
];

// Lý do từ chối phổ biến
export const rejectionReasons = [
  { reason: "Trùng với đề tài đã duyệt", count: 3 },
  { reason: "Mô tả không rõ ràng", count: 2 },
  { reason: "Không khả thi về kỹ thuật", count: 1 },
  { reason: "Không phù hợp với chuyên ngành", count: 1 },
];

// Helper functions
export const getCompletionRate = (
  completed: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const getScoreDistributionPercentages = (
  distribution: Record<string, number>
): Record<string, number> => {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  if (total === 0) return {};
  
  return Object.fromEntries(
    Object.entries(distribution).map(([grade, count]) => [
      grade,
      Math.round((count / total) * 100),
    ])
  );
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value * 100)}%`;
};
