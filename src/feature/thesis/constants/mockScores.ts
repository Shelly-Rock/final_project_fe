import type { ThesisScore, ScoreWeightConfig } from "../types";

export type { ThesisScore };

const defaultWeightConfig: ScoreWeightConfig = {
  id: "W001",
  semester: "HK1-2024",
  supervisorWeight: 0.4,
  reviewerWeight: 0.2,
  councilWeight: 0.4,
  createdBy: "ADMIN",
  createdAt: "2024-01-01",
};

export const mockScores: ThesisScore[] = [
  {
    registrationId: "REG001",
    studentName: "Nguyễn Văn A",
    mssv: "20210001",
    thesisTitle: "Ứng dụng AI trong y tế",
    supervisorScore: 8.5,
    reviewerScore: 8,
    councilScore: 8.5,
    weightConfig: defaultWeightConfig,
    finalScore: 8.4,
    letterGrade: "A",
    isAppealed: false,
  },
  {
    registrationId: "REG002",
    studentName: "Trần Thị B",
    mssv: "20210002",
    thesisTitle: "Hệ thống LMS",
    supervisorScore: 7.5,
    reviewerScore: 7,
    councilScore: 7.5,
    weightConfig: defaultWeightConfig,
    finalScore: 7.3,
    letterGrade: "B",
    isAppealed: false,
  },
  {
    registrationId: "REG003",
    studentName: "Lê Văn C",
    mssv: "20210003",
    thesisTitle: "Blockchain logistics",
    supervisorScore: 9,
    reviewerScore: 9,
    councilScore: 9,
    weightConfig: defaultWeightConfig,
    finalScore: 9,
    letterGrade: "A+",
    isAppealed: false,
  },
  {
    registrationId: "REG004",
    studentName: "Phạm Thị D",
    mssv: "20210004",
    thesisTitle: "NLP tiếng Việt",
    supervisorScore: 0,
    reviewerScore: 0,
    councilScore: 0,
    weightConfig: defaultWeightConfig,
    finalScore: 0,
    letterGrade: undefined,
    isAppealed: false,
  },
  {
    registrationId: "REG005",
    studentName: "Hoàng Văn E",
    mssv: "20210005",
    thesisTitle: "Bảo mật 5G",
    supervisorScore: 8,
    reviewerScore: 8,
    councilScore: 0,
    weightConfig: defaultWeightConfig,
    finalScore: 0,
    letterGrade: undefined,
    isAppealed: false,
  },
];

export function getGradeColor(
  score: number | undefined | null,
): "default" | "success" | "info" | "warning" | "error" {
  if (score == null || score === 0) return "default";
  if (score >= 8.5) return "success";
  if (score >= 7) return "info";
  if (score >= 5) return "warning";
  return "error";
}

