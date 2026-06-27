export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface ChatFAQ {
  keywords: string[];
  answer: string;
  suggestions?: string[];
}

export const CHAT_FAQS: ChatFAQ[] = [
  {
    keywords: [
      "xin chào",
      "chào",
      "hi",
      "hello",
      "hey",
      "chào buổi sáng",
      "chào buổi chiều",
    ],
    answer:
      "Xin chào! Mình là chatbot hỗ trợ của hệ thống QNQ. Mình có thể giúp bạn:\n\n• Tìm hiểu về quy trình đăng ký đề tài\n• Xem tiến độ đồ án\n• Thông tin về các role trong hệ thống\n• Hướng dẫn sử dụng các chức năng\n\nBạn cần hỗ trợ gì hôm nay?",
    suggestions: [
      "Quy trình đăng ký đề tài",
      "Các role trong hệ thống",
      "Cách theo dõi tiến độ",
    ],
  },
  {
    keywords: [
      "đăng ký đề tài",
      "dang ky de tai",
      "đăng ký",
      "đăng ký đồ án",
      "chọn đề tài",
      "quy trình đăng ký",
    ],
    answer:
      '## Quy trình đăng ký đề tài\n\n**Bước 1:** Xem danh sách đề tài khả dụng\n• Vào trang Dashboard → chọn "Xem đề tài khả dụng"\n\n**Bước 2:** Chọn đề tài phù hợp\n• Xem thông tin: tên đề tài, GVHD, yêu cầu, số lượng sinh viên tối đa\n\n**Bước 3:** Gửi yêu cầu đăng ký\n• Nhấn "Đăng ký" đề tài đã chọn\n• Chờ giảng viên và thư ký khoa phê duyệt\n\n**Bước 4:** Nhận kết quả\n• Đề tài được duyệt → bạn sẽ được gán nhóm và GVHD\n• Đề tài bị từ chối → bạn có thể chọn đề tài khác',
    suggestions: ["GVHD là gì?", "Deadline đăng ký", "Liên hệ hỗ trợ"],
  },
  {
    keywords: [
      "tiến độ",
      "tien do",
      "theo dõi tiến độ",
      "xem tiến độ",
      "cập nhật tiến độ",
      "progress",
      "trạng thái đồ án",
    ],
    answer:
      "## Theo dõi tiến độ đồ án\n\nBạn có thể xem tiến độ đồ án tại:\n\n**Trang Dashboard** (khi đã đăng ký đề tài)\n• Tiến độ tổng thể (% hoàn thành)\n• Các mốc tiến độ (Đề cương, Thiết kế, Code, Báo cáo...)\n• Ngày deadline còn lại\n• Đánh giá từ GVHD\n\n**Trạng thái đồ án:**\n• 🟡 Đang thực hiện - Đồ án đang trong quá trình thực hiện\n• 🟠 Chờ duyệt - Chờ phê duyệt từ thư ký khoa\n• 🔵 Chờ phân công - Chờ phân công GVHD/phản biện\n• 🟢 Hoàn thành - Đồ án đã hoàn thành",
    suggestions: ["Deadline đồ án", "Các mốc tiến độ", "Liên hệ GVHD"],
  },
  {
    keywords: [
      "gvhd",
      "giảng viên hướng dẫn",
      "giang vien",
      "teacher",
      "supervisor",
      "hướng dẫn",
    ],
    answer:
      '## Giảng viên hướng dẫn (GVHD)\n\nGVHD là giảng viên được phân công hướng dẫn sinh viên thực hiện đồ án.\n\n**Vai trò của GVHD:**\n• Hướng dẫn nội dung và phương pháp nghiên cứu\n• Theo dõi tiến độ thực hiện\n• Đánh giá và nhận xét báo cáo\n• Phản biện đồ án\n\n**Liên hệ GVHD:**\n• Xem thông tin GVHD trong phần "Đồ án của tôi" trên Dashboard\n• Gửi báo cáo tiến độ định kỳ cho GVHD\n• Thông tin liên hệ: xem trong trang thông tin cá nhân',
    suggestions: ["Phản biện là gì?", "Đánh giá đồ án", "Deadline nộp báo cáo"],
  },
  {
    keywords: [
      "deadline",
      "hạn nộp",
      "han nop",
      "ngày hết hạn",
      "thời hạn",
      "due date",
      "ngày cuối",
    ],
    answer:
      "## Deadline & Hạn nộp\n\n**Các mốc deadline quan trọng:**\n\n📅 **Đăng ký đề tài:** 15/06/2026\n• Sau ngày này không thể đăng ký đề tài mới\n\n📅 **Nộp báo cáo giữa kỳ:** 22/06/2026\n• Báo cáo tiến độ và kết quả đạt được\n\n📅 **Chấm phản biện:** 05/07/2026\n• GV phản biện gửi nhận xét\n\n📅 **Bảo vệ khóa 2022:** 15/07/2026\n• Ngày bảo vệ đồ án tốt nghiệp\n\n*Bạn có thể xem chi tiết các mốc thời gian trong phần Timeline trên Dashboard.*",
    suggestions: ["Xem tiến độ", "Quy trình bảo vệ", "Liên hệ hỗ trợ"],
  },
  {
    keywords: [
      "bảo vệ",
      "bao ve",
      "bảo vệ đồ án",
      "defense",
      "bảo vệ khóa luận",
      "thuyết trình",
      "trình bày",
    ],
    answer:
      '## Bảo vệ đồ án\n\n**Quy trình bảo vệ:**\n\n**1. Chuẩn bị:**\n• Hoàn thành báo cáo và code theo đúng deadline\n• Chuẩn bị slide trình bày\n• Tập trình bày trước GVHD\n\n**2. Ngày bảo vệ:**\n• Sinh viên trình bày trước hội đồng\n• Trả lời câu hỏi từ giảng viên phản biện\n• Hội đồng chấm điểm\n\n**3. Kết quả:**\n• Điểm được công bố sau khi họp hội đồng\n• Xem điểm tại trang "Chấm điểm"\n\n**Lưu ý:** Ngày bảo vệ khóa hiện tại: **15/07/2026**',
    suggestions: ["Deadline bảo vệ", "Chấm điểm", "Đánh giá đồ án"],
  },
  {
    keywords: [
      "chấm điểm",
      "cham diem",
      "điểm",
      "điểm số",
      "đánh giá",
      "điểm đồ án",
      "score",
      "grade",
      "grading",
    ],
    answer:
      '## Chấm điểm đồ án\n\n**Thành phần điểm:**\n\n| Thành phần | Tỷ lệ |\n|------------|--------|\n| Chất lượng báo cáo | 30% |\n| Kết quả thực hiện (code/sản phẩm) | 30% |\n| Trình bày bảo vệ | 20% |\n| Phản biện | 15% |\n| Quá trình thực hiện | 5% |\n\n**Xem điểm:**\n• Vào trang "Chấm điểm" trên menu\n• Xem chi tiết từng thành phần điểm\n• Xem nhận xét từ GVHD và giảng viên phản biện\n\n**Thang điểm:** 10 điểm (điểm liệt: < 4.0)',
    suggestions: ["Deadline bảo vệ", "Phản biện là gì?", "Liên hệ hỗ trợ"],
  },
  {
    keywords: [
      "phản biện",
      "phan bien",
      "review",
      "reviewer",
      "gvpb",
      "giảng viên phản biện",
      "hội đồng",
    ],
    answer:
      "## Giảng viên phản biện (GVPB)\n\nGVPB là giảng viên được chỉ định đánh giá độc lập đồ án của bạn.\n\n**Vai trò GVPB:**\n• Đọc và đánh giá báo cáo đồ án\n• Đặt câu hỏi phản biện trong buổi bảo vệ\n• Cho nhận xét về nội dung và phương pháp\n\n**Quy trình phản biện:**\n1. Thư ký khoa phân công GVPB\n2. GVPB nhận báo cáo và đánh giá\n3. Gửi nhận xét trước ngày bảo vệ\n4. Tham gia buổi bảo vệ và đặt câu hỏi\n\n**Lưu ý:** GVPB khác với GVHD - GVPB đánh giá độc lập, không hướng dẫn trực tiếp.",
    suggestions: [
      "Deadline chấm phản biện",
      "Quy trình bảo vệ",
      "Đánh giá đồ án",
    ],
  },
  {
    keywords: [
      "role",
      "vai trò",
      "vai tro",
      "admin",
      "secretary",
      "thư ký",
      "thu ky",
      "giáo viên",
      "giang vien",
      "sinh viên",
      "sinh vien",
    ],
    answer:
      "## Các vai trò trong hệ thống\n\n**👑 Admin (Quản trị viên)**\n• Toàn quyền quản lý hệ thống\n• Quản lý người dùng, khoa, lớp, khóa\n• Xem thống kê tổng quát\n\n**📋 Secretary (Thư ký khoa)**\n• Duyệt đề tài từ giảng viên\n• Phân công GVHD và GVPB\n• Quản lý đồ án của khoa\n\n**👨‍🏫 Teacher (Giảng viên)**\n• Đăng ký và quản lý đề tài\n• Hướng dẫn sinh viên\n• Chấm phản biện đồ án\n\n**🎓 Student (Sinh viên)**\n• Đăng ký đề tài\n• Theo dõi tiến độ\n• Nộp báo cáo và bảo vệ",
    suggestions: ["Đăng ký đề tài", "Xem tiến độ", "Quy trình bảo vệ"],
  },
  {
    keywords: [
      "thành viên",
      "thanh vien",
      "nhóm",
      "nhom",
      "group",
      "team",
      "thành viên nhóm",
      "nhóm trưởng",
      "leader",
    ],
    answer:
      '## Thành viên nhóm đồ án\n\n**Quy định nhóm:**\n• Mỗi nhóm có 1 Nhóm trưởng và các thành viên\n• Số lượng thành viên tối đa: tùy theo đề tài (thường 1-3 sv)\n• Nhóm trưởng chịu trách nhiệm phân công công việc\n\n**Vai trò Nhóm trưởng:**\n• Đại diện nhóm liên hệ với GVHD\n• Phân công công việc cho các thành viên\n• Nộp báo cáo và theo dõi tiến độ\n\n**Xem thông tin nhóm:**\n• Vào Dashboard → "Đồ án của tôi"\n• Xem danh sách thành viên, MSSV, vai trò\n• Thông tin được cập nhật sau khi đăng ký đề tài',
    suggestions: ["Đăng ký đề tài", "Xem tiến độ", "Liên hệ GVHD"],
  },
  {
    keywords: [
      "bộ môn",
      "bo mon",
      "khoa",
      "department",
      "major",
      "ngành",
      "nganh",
      "chuyên ngành",
    ],
    answer:
      '## Bộ môn & Khoa\n\n**Các khoa trong hệ thống:**\n• CNTT - Công nghệ thông tin\n• KPM - Kỹ thuật phần mềm\n• MKT - Marketing\n• KT - Kinh tế\n• IoT - Internet of Things\n• ATTT - An toàn thông tin\n• KHDL - Khoa học dữ liệu\n• MMT - Mạng máy tính\n\n**Bộ môn:** Là đơn vị quản lý chuyên môn trong khoa, nơi GVHD công tác.\n\n**Xem thông tin:**\n• Khoa/Bộ môn của đồ án xem trong phần "Đồ án của tôi" trên Dashboard',
    suggestions: ["GVHD là gì?", "Xem tiến độ", "Đăng ký đề tài"],
  },
  {
    keywords: [
      "học kỳ",
      "hoc ky",
      "semester",
      "năm học",
      "nam hoc",
      "hk",
      "2025",
      "2026",
    ],
    answer:
      '## Học kỳ & Năm học\n\n**Năm học hiện tại:** 2025-2026\n**Học kỳ hiện tại:** Học kỳ 2\n\n**Các mốc thời gian:**\n• Đầu HK2: Bắt đầu đăng ký đề tài\n• Giữa HK2: Nộp báo cáo giữa kỳ\n• Cuối HK2: Bảo vệ đồ án\n\n**Thông tin HK của đồ án:**\n• Xem trong phần "Đồ án của tôi" trên Dashboard\n• Thông tin gồm: HK2 - 2025-2026',
    suggestions: ["Deadline", "Xem tiến độ", "Quy trình bảo vệ"],
  },
  {
    keywords: [
      "trạng thái",
      "trang thai",
      "status",
      "state",
      "tình trạng",
      "tinh trang",
      "đang thực hiện",
      "hoàn thành",
      "chờ duyệt",
    ],
    answer:
      '## Trạng thái đồ án\n\n**Các trạng thái trong hệ thống:**\n\n🟡 **Đang thực hiện**\n• Đồ án đã được duyệt và đang trong quá trình thực hiện\n• Sinh viên cần cập nhật tiến độ định kỳ\n\n🟠 **Chờ duyệt**\n• Đề tài/chỉ mục mới gửi, chờ thư ký khoa duyệt\n\n🔵 **Chờ phân công**\n• Đề tài đã duyệt, chờ phân công GVHD/GVPB\n\n🟢 **Hoàn thành**\n• Đồ án đã bảo vệ thành công\n\n🔴 **Từ chối**\n• Đề tài không được duyệt, cần chọn đề tài khác\n\n**Xem trạng thái:** Dashboard → "Đồ án của tôi"',
    suggestions: ["Xem tiến độ", "Đăng ký đề tài", "Deadline"],
  },
  {
    keywords: [
      "liên hệ",
      "lien he",
      "hỗ trợ",
      "ho tro",
      "support",
      "help",
      "contact",
      "cần giúp đỡ",
      "giúp đỡ",
    ],
    answer:
      "## Liên hệ & Hỗ trợ\n\n**Kênh hỗ trợ:**\n\n📧 **Email:** support@qnu.edu.vn\n📞 **Điện thoại:** (0292) 123-4567\n🏢 **Phòng đào tạo:** Tầng 3, Nhà A\n\n**Thời gian làm việc:**\n• Thứ 2 - Thứ 6: 7h30 - 17h00\n• Thứ 7: 7h30 - 11h30\n\n**Hỗ trợ nhanh:**\n• Vấn đề kỹ thuật → Liên hệ Phòng IT\n• Vấn đề đăng ký đề tài → Liên hệ Thư ký khoa\n• Vấn đề về điểm → Liên hệ Phòng đào tạo\n\n*Mình có thể giúp bạn giải đáp các thắc mắc thường gặp. Bạn cần hỗ trợ gì thêm?*",
    suggestions: [
      "Quy trình đăng ký đề tài",
      "Các role trong hệ thống",
      "Xem tiến độ",
    ],
  },
];

export function findAnswer(userMessage: string): ChatFAQ | null {
  const lowerMsg = userMessage.toLowerCase().trim();

  for (const faq of CHAT_FAQS) {
    for (const keyword of faq.keywords) {
      if (lowerMsg.includes(keyword.toLowerCase())) {
        return faq;
      }
    }
  }

  return null;
}

export const DEFAULT_ANSWER =
  "Mình chưa hiểu rõ câu hỏi của bạn. Bạn có thể thử:\n\n• Hỏi về **quy trình đăng ký đề tài**\n• Hỏi về **tiến độ đồ án**\n• Hỏi về **các role** trong hệ thống\n• Hỏi về **deadline** và **bảo vệ**\n• Hỏi về **GVHD** và **phản biện**\n\nHoặc nhấn vào một gợi ý bên dưới nhé!";

export const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  text: "Xin chào! Mình là **chatbot hỗ trợ** của hệ thống QNQ 🌟\n\nMình có thể giúp bạn tìm hiểu về:\n\n• Quy trình đăng ký và thực hiện đồ án\n• Tiến độ, deadline và các mốc quan trọng\n• Vai trò của GVHD, GVPB và các bộ phận liên quan\n• Cách sử dụng các chức năng trong hệ thống\n\nBạn cần hỗ trợ gì hôm nay?",
  isBot: true,
  timestamp: new Date(),
};
