export interface Document {
  id: string;
  name: string;
  type: "pdf" | "docx" | "xlsx" | string;
  size: string;
  category: string;
  uploadDate: string;
  downloadCount: number;
}

export const typeColors: Record<
  string,
  "error" | "info" | "success" | "default"
> = {
  pdf: "error",
  docx: "info",
  xlsx: "success",
};

export const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Quy chế đào tạo",
    type: "pdf",
    size: "2.5 MB",
    category: "Quy định",
    uploadDate: "2024-01-15",
    downloadCount: 1250,
  },
  {
    id: "2",
    name: "Mẫu báo cáo đồ án",
    type: "docx",
    size: "150 KB",
    category: "Mẫu",
    uploadDate: "2024-02-01",
    downloadCount: 890,
  },
  {
    id: "3",
    name: "Hướng dẫn sử dụng hệ thống",
    type: "pdf",
    size: "5.2 MB",
    category: "Hướng dẫn",
    uploadDate: "2024-03-10",
    downloadCount: 560,
  },
  {
    id: "4",
    name: "Biểu mẫu đăng ký đề tài",
    type: "xlsx",
    size: "80 KB",
    category: "Mẫu",
    uploadDate: "2024-04-05",
    downloadCount: 420,
  },
  {
    id: "5",
    name: "Quy định chấm điểm",
    type: "pdf",
    size: "1.8 MB",
    category: "Quy định",
    uploadDate: "2024-01-20",
    downloadCount: 780,
  },
];
