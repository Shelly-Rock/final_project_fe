export interface Thesis {
  id: string;
  title: string;
  student: string;
  mssv: string;
  status: "pending" | "in_progress" | "completed";
  submittedAt: string;
}

export type ThesisStatus = "all" | "pending" | "in_progress" | "completed";

export const statusConfig: Record<
  string,
  { label: string; color: "default" | "warning" | "info" | "success" }
> = {
  pending: { label: "Chờ duyệt", color: "warning" },
  in_progress: { label: "Đang thực hiện", color: "info" },
  completed: { label: "Hoàn thành", color: "success" },
};

export const mockTheses: Thesis[] = [
  {
    id: "1",
    title: "Ứng dụng AI trong chẩn đoán bệnh",
    student: "Nguyễn Văn A",
    mssv: "20200001",
    status: "in_progress",
    submittedAt: "2024-03-15",
  },
  {
    id: "2",
    title: "Hệ thống quản lý học tập LMS",
    student: "Trần Thị B",
    mssv: "20200002",
    status: "completed",
    submittedAt: "2024-02-20",
  },
  {
    id: "3",
    title: "Ứng dụng Blockchain trong logistics",
    student: "Lê Văn C",
    mssv: "20200003",
    status: "pending",
    submittedAt: "2024-04-01",
  },
  {
    id: "4",
    title: "Xử lý ảnh y tế bằng Deep Learning",
    student: "Phạm Thị D",
    mssv: "20200004",
    status: "in_progress",
    submittedAt: "2024-03-10",
  },
  {
    id: "5",
    title: "Chatbot hỗ trợ tuyển sinh",
    student: "Hoàng Văn E",
    mssv: "20200005",
    status: "completed",
    submittedAt: "2024-01-25",
  },
];
