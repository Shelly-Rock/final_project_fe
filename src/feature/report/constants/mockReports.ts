export interface Report {
  id: string;
  title: string;
  type: string;
  generatedDate: string;
  period: string;
  status: "completed" | "pending";
}

export const mockReports: Report[] = [
  {
    id: "1",
    title: "Báo cáo tổng quan học kỳ",
    type: "summary",
    generatedDate: "2024-05-01",
    period: "HK2 2023-2024",
    status: "completed",
  },
  {
    id: "2",
    title: "Báo cáo thống kê sinh viên",
    type: "student",
    generatedDate: "2024-05-05",
    period: "HK2 2023-2024",
    status: "completed",
  },
  {
    id: "3",
    title: "Báo cáo điểm đồ án",
    type: "score",
    generatedDate: "2024-05-10",
    period: "HK2 2023-2024",
    status: "completed",
  },
  {
    id: "4",
    title: "Báo cáo tỷ lệ hoàn thành",
    type: "progress",
    generatedDate: "2024-04-15",
    period: "HK1 2023-2024",
    status: "completed",
  },
];
