// ============ HOMEPAGE DATA ============

export const FACULTY_PROGRESS_DATA = [
  {
    faculty: "Công nghệ thông tin",
    code: "CNTT",
    color: "#2a5bc0",
    HoànThành: 18,
    "Đang thực hiện": 22,
    "Chờ duyệt": 8,
    "Từ chối": 3,
  },
  {
    faculty: "Marketing",
    code: "MKT",
    color: "#7a52cc",
    HoànThành: 12,
    "Đang thực hiện": 15,
    "Chờ duyệt": 6,
    "Từ chối": 2,
  },
  {
    faculty: "Kinh tế",
    code: "KT",
    color: "#40b8d4",
    HoànThành: 8,
    "Đang thực hiện": 11,
    "Chờ duyệt": 5,
    "Từ chối": 1,
  },
  {
    faculty: "IoT",
    code: "IoT",
    color: "#e89b33",
    HoànThành: 5,
    "Đang thực hiện": 9,
    "Chờ duyệt": 3,
    "Từ chối": 2,
  },
  {
    faculty: "Kỹ thuật phần mềm",
    code: "KPM",
    color: "#1dab60",
    HoànThành: 14,
    "Đang thực hiện": 18,
    "Chờ duyệt": 4,
    "Từ chối": 1,
  },
  {
    faculty: "An toàn thông tin",
    code: "ATTT",
    color: "#d13b3b",
    HoànThành: 7,
    "Đang thực hiện": 12,
    "Chờ duyệt": 3,
    "Từ chối": 1,
  },
  {
    faculty: "Khoa học dữ liệu",
    code: "KHDL",
    color: "#8b5cf6",
    HoànThành: 10,
    "Đang thực hiện": 14,
    "Chờ duyệt": 5,
    "Từ chối": 2,
  },
  {
    faculty: "Mạng máy tính",
    code: "MMT",
    color: "#06b6d4",
    HoànThành: 6,
    "Đang thực hiện": 10,
    "Chờ duyệt": 2,
    "Từ chối": 1,
  },
];

export const STATUS_SUMMARY = [
  { name: "Hoàn thành", value: 43, color: "#1dab60" },
  { name: "Đang thực hiện", value: 57, color: "#2a5bc0" },
  { name: "Chờ duyệt", value: 17, color: "#e89b33" },
  { name: "Từ chối", value: 8, color: "#d13b3b" },
];

export const OVERVIEW_STATS = [
  {
    label: "Tổng đồ án",
    value: "156",
    sub: "Quy mô hệ thống",
    icon: "bi-mortarboard",
    color: "#2a5bc0",
    bg: "#e8efff",
  },
  {
    label: "Chờ duyệt",
    value: "23",
    sub: "Cần xử lý ngay",
    icon: "bi-hourglass-split",
    color: "#d13b3b",
    bg: "#ffebeb",
  },
  {
    label: "Đang thực hiện",
    value: "89",
    sub: "Tiến độ chung",
    icon: "bi-gear-wide-connected",
    color: "#e89b33",
    bg: "#fff8e8",
  },
  {
    label: "Hoàn thành",
    value: "44",
    sub: "Kết quả cuối kỳ",
    icon: "bi-check-circle",
    color: "#1dab60",
    bg: "#e8fff5",
  },
];

// ============ TIMELINE / DEADLINE ============
export interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  type: "deadline" | "event" | "defense";
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: 1, date: "15/06/2026", title: "Hạn đăng ký đề tài", type: "deadline" },
  {
    id: 2,
    date: "22/06/2026",
    title: "Hạn nộp báo cáo giữa kỳ",
    type: "deadline",
  },
  { id: 3, date: "05/07/2026", title: "Hạn chấm phản biện", type: "deadline" },
  { id: 4, date: "15/07/2026", title: "Bảo vệ khóa 2022", type: "defense" },
];

// ============ PENDING THESES ============
export interface PendingThesis {
  id: number;
  title: string;
  student: string;
  status: "Chờ duyệt" | "Chờ phân công" | "Chờ phản biện";
}

export const PENDING_THESES: PendingThesis[] = [
  {
    id: 1,
    title: "Hệ thống LMS",
    student: "Nguyễn Văn A",
    status: "Chờ duyệt",
  },
  {
    id: 2,
    title: "Website TMĐT",
    student: "Trần Văn B",
    status: "Chờ phân công",
  },
  { id: 3, title: "AI Chatbot", student: "Lê Văn C", status: "Chờ phản biện" },
];

// ============ STATUS DISTRIBUTION ============
export interface StatusDistribution {
  name: string;
  value: number;
  percent: number;
  color: string;
}

export const STATUS_DISTRIBUTION: StatusDistribution[] = [
  { name: "Đang thực hiện", value: 57, percent: 57, color: "#2a5bc0" },
  { name: "Chờ duyệt", value: 15, percent: 15, color: "#e89b33" },
  { name: "Quá hạn", value: 8, percent: 8, color: "#d13b3b" },
  { name: "Hoàn thành", value: 20, percent: 20, color: "#1dab60" },
];

// ============ OVERLOADED LECTURERS ============
export interface Lecturer {
  id: number;
  name: string;
  thesisCount: number;
  maxThreshold: number;
}

export const OVERLOADED_LECTURERS: Lecturer[] = [
  { id: 1, name: "Nguyễn Văn A", thesisCount: 18, maxThreshold: 15 },
  { id: 2, name: "Trần Văn B", thesisCount: 17, maxThreshold: 15 },
  { id: 3, name: "Lê Văn C", thesisCount: 16, maxThreshold: 15 },
];

// ============ UNREGISTERED STUDENTS ============
export interface UnregisteredStats {
  total: number;
  registered: number;
  unregistered: number;
}

export const UNREGISTERED_STATS: UnregisteredStats = {
  total: 320,
  registered: 290,
  unregistered: 30,
};

// ============ THESIS TREND ============
export interface ThesisTrend {
  year: number;
  count: number;
}

export const THESIS_TREND: ThesisTrend[] = [
  { year: 2020, count: 45 },
  { year: 2021, count: 68 },
  { year: 2022, count: 89 },
  { year: 2023, count: 112 },
  { year: 2024, count: 134 },
  { year: 2025, count: 156 },
];

// ============ RECENT ACTIVITIES ============
export interface ActivityItem {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  avatar: string;
  color: string;
}

export const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    action: "nộp đề cương.",
    target: "Đồ án #45",
    time: "10:30",
    avatar: "A",
    color: "#2a5bc0",
  },
  {
    id: 2,
    user: "Đề tài",
    action: "AI Chatbot được duyệt.",
    target: "",
    time: "09:45",
    avatar: "D",
    color: "#1dab60",
  },
  {
    id: 3,
    user: "GV Trần Văn B",
    action: "chấm phản biện.",
    target: "Đồ án #32",
    time: "09:20",
    avatar: "B",
    color: "#7a52cc",
  },
  {
    id: 4,
    user: "Lê Thị D",
    action: "đăng ký đề tài mới.",
    target: "Đề tài #78",
    time: "08:55",
    avatar: "D",
    color: "#e89b33",
  },
  {
    id: 5,
    user: "Hệ thống",
    action: "gửi nhắc nhở deadline.",
    target: "15/06/2026",
    time: "08:30",
    avatar: "H",
    color: "#40b8d4",
  },
];

// ============ LEGACY DATA (for backwards compatibility) ============
export const RECENT_THESES = [
  {
    id: 1,
    title: "Xây dựng hệ thống quản lý đồ án sinh viên",
    student: "Nguyễn Văn A",
    teacher: "TS. Trần Minh",
    major: "CNTT",
    status: "Đang thực hiện",
    progress: 60,
    due: "15/07/2026",
  },
  {
    id: 2,
    title: "Ứng dụng AI trong phát hiện gian lận thi cử",
    student: "Trần Thị B",
    teacher: "PGS. Lê Hoàng",
    major: "CNTT",
    status: "Chờ phản biện",
    progress: 80,
    due: "20/07/2026",
  },
  {
    id: 3,
    title: "Phát triển ứng dụng học tiếng Anh trên di động",
    student: "Lê Minh C",
    teacher: "TS. Phạm Lan",
    major: "CNTT",
    status: "Hoàn thành",
    progress: 100,
    due: "01/06/2026",
  },
  {
    id: 4,
    title: "Hệ thống giám sát chất lượng không khí IoT",
    student: "Phạm Thu D",
    teacher: "TS. Nguyễn Đức",
    major: "IoT",
    status: "Đang thực hiện",
    progress: 35,
    due: "30/08/2026",
  },
  {
    id: 5,
    title: "Nền tảng thương mại điện tử cho sản phẩm OCOP",
    student: "Hoàng Văn E",
    teacher: "TS. Trần Minh",
    major: "Marketing",
    status: "Chờ duyệt",
    progress: 10,
    due: "01/09/2026",
  },
];

export const ACTIVITY_FEED = [
  {
    id: 1,
    user: "TS. Trần Minh",
    action: "đã nộp điểm phản biện",
    target: "Đồ án #23",
    time: "5 phút trước",
    avatar: "T",
    color: "#2a5bc0",
  },
  {
    id: 2,
    user: "Nguyễn Văn A",
    action: "đã nộp bài báo cáo",
    target: "Đồ án #01",
    time: "23 phút trước",
    avatar: "A",
    color: "#e89b33",
  },
  {
    id: 3,
    user: "PGS. Lê Hoàng",
    action: "đã duyệt đề tài mới",
    target: "Đề tài #56",
    time: "1 giờ trước",
    avatar: "L",
    color: "#7a52cc",
  },
  {
    id: 4,
    user: "Trần Thị B",
    action: "đăng ký đề tài",
    target: "Đề tài #67",
    time: "2 giờ trước",
    avatar: "B",
    color: "#40b8d4",
  },
  {
    id: 5,
    user: "Hệ thống",
    action: "tự động gia hạn deadline",
    target: "Đồ án #12",
    time: "3 giờ trước",
    avatar: "H",
    color: "#1dab60",
  },
];

export const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  "Đang thực hiện": { bg: "#fff8e8", color: "#e89b33" },
  "Chờ phản biện": { bg: "#f3eeff", color: "#7a52cc" },
  "Chờ duyệt": { bg: "#ffebeb", color: "#d13b3b" },
  "Hoàn thành": { bg: "#e8fff5", color: "#1dab60" },
  "Chờ phân công": { bg: "#e8f3ff", color: "#2a5bc0" },
};
