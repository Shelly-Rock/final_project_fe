export interface ThesisTopic {
  id: string;
  name: string;
  department: string;
  lecturer: string;
  slots: number;
  registered: number;
}

export const mockTopics: ThesisTopic[] = [
  {
    id: "1",
    name: "Ứng dụng AI trong y tế",
    department: "CNTT",
    lecturer: "TS. Nguyễn Văn A",
    slots: 3,
    registered: 2,
  },
  {
    id: "2",
    name: "Hệ thống IoT cho nông nghiệp thông minh",
    department: "KTMT",
    lecturer: "ThS. Trần Thị B",
    slots: 2,
    registered: 1,
  },
  {
    id: "3",
    name: "Blockchain trong quản lý chuỗi cung ứng",
    department: "KHMT",
    lecturer: "PGS. Lê Văn C",
    slots: 4,
    registered: 4,
  },
  {
    id: "4",
    name: "Xử lý ngôn ngữ tự nhiên cho tiếng Việt",
    department: "KHMT",
    lecturer: "TS. Phạm Thị D",
    slots: 2,
    registered: 0,
  },
  {
    id: "5",
    name: "Bảo mật mạng không dây 5G",
    department: "ATTT",
    lecturer: "GS. Hoàng Văn E",
    slots: 3,
    registered: 1,
  },
  {
    id: "6",
    name: "Ứng dụng AR/VR trong giáo dục",
    department: "CNTT",
    lecturer: "TS. Đặng Thị F",
    slots: 2,
    registered: 2,
  },
];
