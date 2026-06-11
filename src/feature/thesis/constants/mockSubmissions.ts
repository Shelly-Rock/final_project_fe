export interface ThesisSubmission {
  id: string;
  name: string;
  status: "submitted" | "pending";
  deadline: string;
  file: string | null;
}

export const mockSubmissions: ThesisSubmission[] = [
  {
    id: "1",
    name: "Báo cáo tiến độ",
    status: "submitted",
    deadline: "2024-04-15",
    file: "report_progress.pdf",
  },
  {
    id: "2",
    name: "Code nguồn",
    status: "pending",
    deadline: "2024-05-01",
    file: null,
  },
  {
    id: "3",
    name: "Tài liệu kỹ thuật",
    status: "submitted",
    deadline: "2024-04-20",
    file: "tech_doc.pdf",
  },
  {
    id: "4",
    name: "Báo cáo cuối kỳ",
    status: "pending",
    deadline: "2024-05-15",
    file: null,
  },
];
