export interface ThesisDefense {
  id: string;
  student: string;
  thesis: string;
  room: string;
  date: string;
  time: string;
  status: "pending" | "scheduled" | "completed";
  score: number | null;
}

export const mockDefenses: ThesisDefense[] = [
  {
    id: "1",
    student: "Nguyễn Văn A",
    thesis: "Ứng dụng AI trong y tế",
    room: "A101",
    date: "2024-05-20",
    time: "08:00",
    status: "scheduled",
    score: 8.5,
  },
  {
    id: "2",
    student: "Trần Thị B",
    thesis: "Hệ thống LMS",
    room: "A101",
    date: "2024-05-20",
    time: "08:30",
    status: "scheduled",
    score: 7.5,
  },
  {
    id: "3",
    student: "Lê Văn C",
    thesis: "Blockchain logistics",
    room: "A102",
    date: "2024-05-20",
    time: "09:00",
    status: "completed",
    score: 9,
  },
  {
    id: "4",
    student: "Phạm Thị D",
    thesis: "NLP tiếng Việt",
    room: "A102",
    date: "2024-05-20",
    time: "09:30",
    status: "pending",
    score: null,
  },
  {
    id: "5",
    student: "Hoàng Văn E",
    thesis: "Bảo mật 5G",
    room: "A103",
    date: "2024-05-21",
    time: "10:00",
    status: "pending",
    score: null,
  },
];
