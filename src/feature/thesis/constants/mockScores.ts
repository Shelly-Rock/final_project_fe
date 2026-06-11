export interface ThesisScore {
  id: string;
  student: string;
  thesis: string;
  processScore: number | null;
  reportScore: number | null;
  defenseScore: number | null;
  finalScore: number | null;
}

export const mockScores: ThesisScore[] = [
  {
    id: "1",
    student: "Nguyễn Văn A",
    thesis: "Ứng dụng AI trong y tế",
    processScore: 8,
    reportScore: 9,
    defenseScore: 8.5,
    finalScore: 8.5,
  },
  {
    id: "2",
    student: "Trần Thị B",
    thesis: "Hệ thống LMS",
    processScore: 7,
    reportScore: 8,
    defenseScore: 7.5,
    finalScore: 7.5,
  },
  {
    id: "3",
    student: "Lê Văn C",
    thesis: "Blockchain logistics",
    processScore: 9,
    reportScore: 9,
    defenseScore: 9,
    finalScore: 9,
  },
  {
    id: "4",
    student: "Phạm Thị D",
    thesis: "NLP tiếng Việt",
    processScore: null,
    reportScore: null,
    defenseScore: null,
    finalScore: null,
  },
  {
    id: "5",
    student: "Hoàng Văn E",
    thesis: "Bảo mật 5G",
    processScore: 8,
    reportScore: 8,
    defenseScore: null,
    finalScore: null,
  },
];

export function getGradeColor(
  score: number | null,
): "default" | "success" | "info" | "warning" | "error" {
  if (score === null) return "default";
  if (score >= 8.5) return "success";
  if (score >= 7) return "info";
  if (score >= 5) return "warning";
  return "error";
}
