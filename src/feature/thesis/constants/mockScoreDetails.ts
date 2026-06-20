// ============================================================
// MOCK DATA: Score Details - Chi tiết điểm
// ============================================================
import type {
  SupervisorScore,
  ReviewerScore,
  ScoreWeightConfig,
  FinalScore,
} from "../types";

export { getScoreColorSafe as getScoreColor } from "./index";

// getLetterGrade defined here to avoid circular dependency
export function getLetterGrade(score: number | undefined | null): string {
  const s = score ?? 0;
  if (s >= 9) return "A+";
  if (s >= 8.5) return "A";
  if (s >= 8) return "B+";
  if (s >= 7) return "B";
  if (s >= 6) return "C+";
  if (s >= 5.5) return "C";
  if (s >= 5) return "D+";
  if (s >= 4) return "D";
  return "F";
}

export const mockScoreWeightConfigs: ScoreWeightConfig[] = [
  {
    id: "weight-001",
    semester: "2023-2024-HK2",
    supervisorWeight: 0.4,
    reviewerWeight: 0.2,
    councilWeight: 0.4,
    createdBy: "admin-001",
    createdAt: "2024-01-01",
  },
];

export const mockSupervisorScores: SupervisorScore[] = [
  {
    registrationId: "reg-002",
    supervisorId: "gv-002",
    progressScore: 8,
    skillScore: 8.5,
    attitudeScore: 9,
    reportScore: 7.5,
    totalScore: 8.25,
    supervisorComment: "SV làm việc nghiêm túc, có sáng tạo trong thiết kế hệ thống",
    scoredAt: "2024-05-20",
  },
  {
    registrationId: "reg-006",
    supervisorId: "gv-001",
    progressScore: 6,
    skillScore: 7,
    attitudeScore: 7.5,
    reportScore: 6.5,
    totalScore: 6.75,
    supervisorComment: "Tiến độ chậm, cần cải thiện",
    scoredAt: "2024-06-01",
  },
];

export const mockReviewerScores: ReviewerScore[] = [
  {
    registrationId: "reg-002",
    reviewerId: "gv-003",
    reviewerName: "PGS. Lê Văn Z",
    contentScore: 8,
    methodologyScore: 8.5,
    resultScore: 8,
    presentationScore: 8,
    totalScore: 8.125,
    reviewerComment: "Nội dung tốt, phương pháp phù hợp, kết quả đáng tin cậy",
    scoredAt: "2024-05-22",
  },
  {
    registrationId: "reg-006",
    reviewerId: "gv-004",
    reviewerName: "TS. Hoàng Văn W",
    contentScore: 7,
    methodologyScore: 7.5,
    resultScore: 7,
    presentationScore: 7,
    totalScore: 7.125,
    reviewerComment: "Cơ bản đạt yêu cầu, cần bổ sung phần thực nghiệm",
    scoredAt: "2024-06-02",
  },
];

export const mockFinalScores: FinalScore[] = [
  {
    registrationId: "reg-002",
    supervisorScore: 8.25,
    reviewerScore: 8.125,
    councilScore: 7.5,
    weightConfig: mockScoreWeightConfigs[0],
    finalScore: 7.96,
    letterGrade: "B+",
    isAppealed: false,
    finaledAt: "2024-05-28",
  },
  {
    registrationId: "reg-006",
    supervisorScore: 6.75,
    reviewerScore: 7.125,
    councilScore: null as unknown as number,
    weightConfig: mockScoreWeightConfigs[0],
    finalScore: null as unknown as number,
    letterGrade: undefined,
    isAppealed: false,
  },
];

// Tiêu chí chấm điểm mặc định (có thể cấu hình)
export const defaultSupervisorCriteria = [
  { id: "progress", name: "Tiến độ thực hiện", weight: 25, maxScore: 10 },
  { id: "skill", name: "Kỹ năng/Kỹ thuật", weight: 25, maxScore: 10 },
  { id: "attitude", name: "Tinh thần/Thái độ", weight: 25, maxScore: 10 },
  { id: "report", name: "Chất lượng báo cáo", weight: 25, maxScore: 10 },
];

export const defaultReviewerCriteria = [
  { id: "content", name: "Nội dung", weight: 30, maxScore: 10 },
  { id: "methodology", name: "Phương pháp nghiên cứu", weight: 25, maxScore: 10 },
  { id: "result", name: "Kết quả đạt được", weight: 25, maxScore: 10 },
  { id: "presentation", name: "Trình bày", weight: 20, maxScore: 10 },
];

export const defaultCouncilCriteria = [
  { id: "content_quality", name: "Chất lượng nội dung", weight: 25, maxScore: 10 },
  { id: "methodology", name: "Phương pháp", weight: 20, maxScore: 10 },
  { id: "result_contribution", name: "Đóng góp kết quả", weight: 25, maxScore: 10 },
  { id: "qa_performance", name: "Trả lời câu hỏi", weight: 15, maxScore: 10 },
  { id: "presentation", name: "Trình bày", weight: 15, maxScore: 10 },
];
