export interface ThesisReview {
  id: string;
  thesisTitle: string;
  student: string;
  status: "pending" | "reviewed";
  rating: number | null;
  comment: string;
}

export const mockReviews: ThesisReview[] = [
  {
    id: "1",
    thesisTitle: "Ứng dụng AI trong y tế",
    student: "Nguyễn Văn A",
    status: "pending",
    rating: null,
    comment: "",
  },
  {
    id: "2",
    thesisTitle: "Hệ thống LMS",
    student: "Trần Thị B",
    status: "reviewed",
    rating: 4,
    comment: "Cần bổ sung phần thực nghiệm",
  },
  {
    id: "3",
    thesisTitle: "Blockchain logistics",
    student: "Lê Văn C",
    status: "pending",
    rating: null,
    comment: "",
  },
  {
    id: "4",
    thesisTitle: "NLP tiếng Việt",
    student: "Phạm Thị D",
    status: "reviewed",
    rating: 5,
    comment: "Xuất sắc!",
  },
];
