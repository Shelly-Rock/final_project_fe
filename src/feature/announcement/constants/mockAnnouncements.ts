import type { Announcement } from "../types";

export { Announcement };

export const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Thông báo lịch bảo vệ đồ án HK2 2023-2024",
    content:
      "Lịch bảo vệ đồ án sẽ diễn ra từ ngày 15/05/2024 đến 30/05/2024...",
    author: "Thư ký Khoa",
    date: "2024-05-01",
    pinned: true,
    important: true,
  },
  {
    id: "2",
    title: "Hạn nộp đề tài đồ án HK2",
    content:
      "Các sinh viên cần hoàn thành đăng ký đề tài trước ngày 20/04/2024...",
    author: "Thư ký Khoa",
    date: "2024-04-15",
    pinned: false,
    important: true,
  },
  {
    id: "3",
    title: "Thông báo về việc chấm điểm đồ án",
    content:
      "Giảng viên cần hoàn thành chấm điểm đồ án trước ngày 10/05/2024...",
    author: "Quản trị viên",
    date: "2024-04-20",
    pinned: false,
    important: false,
  },
  {
    id: "4",
    title: "Cập nhật danh sách giảng viên hướng dẫn",
    content: "Danh sách giảng viên hướng dẫn đã được cập nhật trên hệ thống...",
    author: "Quản trị viên",
    date: "2024-04-10",
    pinned: false,
    important: false,
  },
];
