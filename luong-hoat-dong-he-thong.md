# Luồng hoạt động hệ thống quản lý khóa luận

## Mục lục
1. [Tổng quan](#1-tổng-quan)
2. [Các vai trò trong hệ thống](#2-các-vai-trò-trong-hệ-thống)
3. [Luồng 4 giai đoạn chính](#3-luồng-4-giai-đoạn-chính)
4. [Chi tiết từng giai đoạn](#4-chi-tiết-từng-giai-đoạn)
5. [Các trạng thái và chuyển đổi](#5-các-trạng-thái-và-chuyển-đổi)
6. [Hệ thống thông báo tự động](#6-hệ-thống-thông-báo-tự-động)
7. [Xử lý ngoại lệ](#7-xử-lý-ngoại-lệ)
8. [Thống kê và báo cáo](#8-thống-kê-và-báo-cáo)

---

## 1. Tổng quan

Hệ thống quản lý khóa luận được thiết kế theo luồng xử lý 4 giai đoạn chính:

```
GV tạo đề tài → Thư ký duyệt → SV đăng ký → GV xác nhận
        ↓
Gán Milestone/Task → SV nộp báo cáo → GV phản hồi
        ↓
GVHD chấm điểm → GV phản biện → Lên lịch bảo vệ
        ↓
SV bảo vệ → Hội đồng chấm điểm → Tổng hợp điểm → Hoàn thành
```

---

## 2. Các vai trò trong hệ thống

| Vai trò | Quyền hạn chính |
|---------|-------------------|
| **Admin** | Cấu hình kỳ khóa luận, phân quyền, set trọng số điểm, quản lý hội đồng |
| **Thư ký khoa** | Duyệt đề tài, kiểm tra trùng lặp, xác nhận điều kiện, lên lịch bảo vệ, tổng hợp điểm |
| **GV hướng dẫn** | Tạo đề tài, xác nhận SV, gán milestone, phản hồi báo cáo, chấm điểm quá trình |
| **GV phản biện** | Đọc báo cáo, chấm độc lập theo rubric riêng (không nhìn điểm GVHD trước) |
| **Sinh viên** | Đăng ký đề tài, nộp báo cáo tuần, nộp sản phẩm, bảo vệ |
| **Hội đồng bảo vệ** | Chấm điểm trong buổi bảo vệ |

---

## 3. Luồng 4 giai đoạn chính

### Giai đoạn A: Khởi tạo & Đăng ký Đề tài

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  GV tạo     │ ──→ │  Thư ký    │ ──→ │  SV đăng ký │ ──→ │  GV xác nhận │
│  đề tài     │     │  duyệt     │     │             │     │              │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### Giai đoạn B: Thực hiện

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  GV gán     │ ──→ │  SV nộp     │ ──→ │  GV phản    │
│  Milestone  │     │  báo cáo    │     │  hồi        │
└─────────────┘     └─────────────┘     └─────────────┘
        ↓                  ↓                  ↓
   [Cảnh báo nếu SV nộp muộn hoặc tiến độ trễ]
```

### Giai đoạn C: Đánh giá trước bảo vệ

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  GVHD chấm  │ ──→ │  GV phản    │ ──→ │  Thư ký    │
│  điểm       │     │  biện       │     │  lên lịch   │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Giai đoạn D: Bảo vệ & Hoàn thành

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  SV bảo vệ  │ ──→ │  Hội đồng  │ ──→ │  Tổng hợp  │ ──→ │  Hoàn thành │
│             │     │  chấm điểm  │     │  điểm       │     │  & Lưu HS   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

---

## 4. Chi tiết từng giai đoạn

### 4.1. Giai đoạn A: Khởi tạo & Đăng ký

#### 4.1.1. GV tạo đề tài
```
Input: Thông tin đề tài (tên, mô tả, yêu cầu, số SV tối đa...)
Process:
  1. GV điền thông tin đề tài
  2. System tạo mã đề tài tự động
  3. Trạng thái = "Nháp" hoặc "Chờ duyệt"
  4. Gửi thông báo cho Thư ký
Output: Đề tài mới được tạo
```

#### 4.1.2. Thư ký duyệt đề tài
```
Input: Đề tài chờ duyệt
Process:
  1. Thư ký xem danh sách đề tài chờ duyệt
  2. Kiểm tra trùng lặp nội dung
  3. Duyệt hoặc từ chối kèm lý do
  4. Nếu duyệt → Trạng thái = "Đã duyệt"
  5. Gửi thông báo cho GV
Output: Đề tài được duyệt/từ chối
```

#### 4.1.3. SV đăng ký đề tài
```
Input: Đề tài đã duyệt, thông tin SV
Process:
  1. SV xem danh sách đề tài khả dụng
  2. SV chọn đề tài và đăng ký
  3. System kiểm tra slot còn trống
  4. Tạo Registration mới → Trạng thái = "Chờ GV xác nhận"
  5. Gửi thông báo cho GVHD
Output: Đăng ký mới được tạo
```

#### 4.1.4. GV xác nhận đăng ký
```
Input: Đăng ký chờ xác nhận
Process:
  1. GV xem đề tài và thông tin SV
  2. GV xác nhận hoặc từ chối
  3. Nếu xác nhận:
     - Trạng thái Registration = "Đã xác nhận"
     - Tạo các Milestone mặc định
     - Gửi thông báo cho SV
  4. Nếu từ chối → Trạng thái = "Từ chối"
Output: Registration được xác nhận
```

---

### 4.2. Giai đoạn B: Thực hiện

#### 4.2.1. GV gán Milestone/Task
```
Input: Registration đã xác nhận
Process:
  1. GV tạo các mốc (milestone) cho đồ án
  2. Mỗi milestone có:
     - Tên, mô tả
     - Deadline (hạn nộp)
     - Trọng số (%) trong tổng tiến độ
     - Trạng thái ban đầu = "Chưa bắt đầu"
  3. System tính tổng trọng số = 100%
Output: Danh sách Milestone được gán cho SV
```

#### 4.2.2. SV nộp báo cáo tuần
```
Input: Milestone, thông tin báo cáo
Process:
  1. SV nộp báo cáo theo tuần
  2. Nội dung báo cáo gồm:
     - Công việc đã làm
     - Vướng mắc gặp phải
     - Kế hoạch tuần sau
     - % tiến độ tự đánh giá
  3. Có thể đính kèm file
  4. System lưu version (để track lịch sử nộp lại)
  5. Trạng thái = "Đã nộp" / "Chờ phản hồi"
Output: Báo cáo tuần được nộp
```

#### 4.2.3. GV phản hồi báo cáo
```
Input: Báo cáo tuần của SV
Process:
  1. GV xem báo cáo
  2. GV nhập phản hồi:
     - Nhận xét
     - Điểm tiến độ (nếu có)
  3. Có thể yêu cầu nộp lại
  4. Trạng thái = "Đã duyệt" / "Yêu cầu nộp lại"
  5. Gửi thông báo cho SV
Output: Báo cáo được phản hồi
```

#### 4.2.4. Cập nhật Milestone
```
Input: Tiến độ thực tế
Process:
  1. Khi SV nộp sản phẩm milestone:
     - Trạng thái = "Đã nộp"
  2. GV kiểm tra và duyệt:
     - Trạng thái = "Hoàn thành"
     - Cập nhật ngày duyệt
  3. Hoặc yêu cầu chỉnh sửa:
     - Trạng thái = "Yêu cầu chỉnh sửa"
     - Ghi chú cần sửa
  4. System tự động đổi trạng thái "Trễ hạn"
     nếu quá deadline chưa nộp
Output: Milestone được cập nhật
```

---

### 4.3. Giai đoạn C: Đánh giá trước bảo vệ

#### 4.3.1. GVHD chấm điểm quá trình
```
Input: Registration, tiến độ thực hiện
Process:
  1. GVHD chấm theo 4 tiêu chí:
     ┌─────────────────┬────────┐
     │ Tiêu chí        │ Trọng số │
     ├─────────────────┼────────┤
     │ Tiến độ         │ 25%     │
     │ Kỹ năng/KT      │ 25%     │
     │ Tinh thần        │ 25%     │
     │ Chất lượng BC    │ 25%     │
     └─────────────────┴────────┘
  2. Mỗi tiêu chí: 0-10 điểm
  3. Tổng điểm = trung bình có trọng số
  4. Nhập nhận xét (nếu có)
Output: SupervisorScore
```

#### 4.3.2. GV phản biện chấm điểm
```
Input: Báo cáo/Sản phẩm của SV
Process:
  1. GV phản biện nhận báo cáo
  2. Chấm độc lập theo rubric riêng:
     (KHÔNG nhìn điểm GVHD trước - tránh bias)
     ┌──────────────────────┬────────┐
     │ Tiêu chí             │ Trọng số │
     ├──────────────────────┼────────┤
     │ Nội dung             │ 30%     │
     │ Phương pháp NC      │ 25%     │
     │ Kết quả đạt được    │ 25%     │
     │ Trình bày           │ 20%     │
     └──────────────────────┴────────┘
  3. Nhập nhận xét phản biện
Output: ReviewerScore
```

#### 4.3.3. Thư ký kiểm tra điều kiện
```
Input: Registration, điểm thành phần
Process:
  1. Kiểm tra tất cả milestone đã hoàn thành
  2. Kiểm tra điểm thành phần đã đủ
  3. Xác nhận đủ điều kiện bảo vệ
  4. Trạng thái = "Đủ điều kiện"
  5. Gửi thông báo cho SV
Output: SV đủ điều kiện bảo vệ
```

#### 4.3.4. Lên lịch bảo vệ
```
Input: Danh sách SV đủ điều kiện
Process:
  1. Thư ký tạo lịch bảo vệ:
     - Chọn ngày, phòng
     - Chọn ca (khung giờ)
  2. Thư ký chọn/cấu hình hội đồng:
     - Chủ tịch
     - Thư ký
     - Thành viên (tối thiểu 3 người)
  3. Kiểm tra xung đột:
     - Không trùng GV trong 2 hội đồng cùng giờ
  4. Gán SV vào ca bảo vệ
  5. Gửi thông báo cho SV, GV, hội đồng
Output: Lịch bảo vệ được tạo
```

---

### 4.4. Giai đoạn D: Bảo vệ & Hoàn thành

#### 4.4.1. SV bảo vệ
```
Input: Lịch bảo vệ, sản phẩm
Process:
  1. SV chuẩn bị:
     - Slide trình bày
     - Demo sản phẩm
  2. SV trình bày (thời gian quy định)
  3. Hội đồng hỏi và SV trả lời
  4. Ghi nhận thời gian bắt đầu/kết thúc
  5. Trạng thái = "Đang bảo vệ" → "Đã bảo vệ"
Output: Buổi bảo vệ hoàn thành
```

#### 4.4.2. Hội đồng chấm điểm
```
Input: Buổi bảo vệ
Process:
  1. Mỗi thành viên hội đồng chấm riêng:
     ┌──────────────────────┬────────┐
     │ Tiêu chí             │ Trọng số │
     ├──────────────────────┼────────┤
     │ Chất lượng nội dung  │ 25%     │
     │ Phương pháp          │ 20%     │
     │ Đóng góp kết quả    │ 25%     │
     │ Trả lời câu hỏi      │ 15%     │
     │ Trình bày            │ 15%     │
     └──────────────────────┴────────┘
  2. Nhập nhận xét
  3. Tính điểm trung bình hội đồng
Output: CouncilScore
```

#### 4.4.3. Tổng hợp điểm cuối
```
Input: 3 thành phần điểm
Process:
  1. Áp dụng công thức trọng số (Admin cấu hình):
  
     Điểm cuối = (Điểm GVHD × 40%) + 
                 (Điểm phản biện × 20%) + 
                 (Điểm hội đồng × 40%)

  2. Quy đổi điểm → Điểm chữ:
     - 9.0 - 10: A+
     - 8.5 - 8.9: A
     - 8.0 - 8.4: B+
     - 7.0 - 7.9: B
     - 6.5 - 6.9: C+
     - 5.5 - 6.4: C
     - 5.0 - 5.4: D+
     - 4.0 - 4.9: D
     - < 4.0: F
  3. Lưu FinalScore
  4. Trạng thái = "Hoàn thành"
Output: Điểm cuối cùng
```

#### 4.4.4. Hoàn thành & Lưu hồ sơ
```
Input: FinalScore
Process:
  1. Cập nhật trạng thái Registration = "Hoàn thành"
  2. Lưu toàn bộ hồ sơ:
     - Báo cáo tuần (tất cả versions)
     - Sản phẩm milestone
     - Điểm thành phần
     - Biên bản bảo vệ
  3. Gửi thông báo điểm cho SV
  4. Cập nhật thống kê
Output: Hồ sơ hoàn chỉnh
```

---

## 5. Các trạng thái và chuyển đổi

### 5.1. Trạng thái Đề tài
```
Nháp → Chờ duyệt → Đã duyệt / Từ chối
              ↓
      Đã có SV đăng ký
              ↓
         Đầy slot (nếu đủ số SV tối đa)
              ↓
      Đang thực hiện → Hoàn thành / Hủy
```

### 5.2. Trạng thái Đăng ký
```
Chờ xác nhận GV → Đã xác nhận / Từ chối
              ↓
      Đang thực hiện → Tạm ngưng (bảo lưu)
              ↓
      Hoàn thành / Rút đăng ký
```

### 5.3. Trạng thái Milestone
```
Chưa bắt đầu → Đang thực hiện
                    ↓
            Trễ hạn (tự động nếu quá deadline)
                    ↓
              Đã nộp → GV duyệt / Yêu cầu chỉnh sửa
                        ↓
                  Hoàn thành
```

### 5.4. Trạng thái Báo cáo tuần
```
Nháp → Đã nộp → Đang chờ phản hồi → Đã duyệt / Yêu cầu nộp lại
```

### 5.5. Trạng thái Hồ sơ bảo vệ
```
Chưa đủ điều kiện → Đủ điều kiện → Đã lên lịch → Đang bảo vệ
                                            ↓
              Đã bảo vệ → Chờ tổng hợp điểm → Hoàn thành / Phải bảo vệ lại
```

---

## 6. Hệ thống thông báo tự động

| Sự kiện | Người nhận | Nội dung mẫu |
|---------|-----------|-------------|
| Đề tài được duyệt | GV | "Đề tài của bạn đã được duyệt" |
| Đề tài bị từ chối | GV | "Đề tài của bạn đã bị từ chối: [lý do]" |
| Có SV đăng ký mới | GV | "Sinh viên [Tên] đã đăng ký đề tài [Tên đề tài]" |
| Đăng ký được xác nhận | SV | "Đăng ký đề tài đã được GV xác nhận" |
| Đăng ký bị từ chối | SV | "Đăng ký đề tài bị từ chối: [lý do]" |
| Gần deadline milestone | SV | "Nhắc nhở: Deadline [tên milestone] còn 2 ngày" |
| Báo cáo được phản hồi | SV | "GV đã phản hồi báo cáo tuần [số]" |
| Đủ điều kiện bảo vệ | SV, Thư ký | "Bạn đã đủ điều kiện tham gia bảo vệ" |
| Lịch bảo vệ được xếp | SV, GV, Hội đồng | "Lịch bảo vệ: Ngày [date], Phòng [room]" |
| Điểm cuối được công bố | SV | "Điểm cuối cùng: [score] ([letter grade])" |

---

## 7. Xử lý ngoại lệ

### 7.1. Các loại ngoại lệ

| Loại | Mô tả | Xử lý |
|------|-------|--------|
| **Nộp muộn** | SV nộp báo cáo/milestone quá hạn | Cảnh báo GV + Thư ký, có thể trừ điểm |
| **Đổi đề tài** | SV xin đổi sang đề tài khác | Huỷ đăng ký cũ, giữ lịch sử, đăng ký mới |
| **Đổi GVHD** | GV nghỉ/quá tải cần đổi | Log lý do, chuyển data, không xoá |
| **Xin gia hạn** | SV xin thêm thời gian | Tạm dừng deadline, không tính trễ |
| **Xin bảo lưu** | SV có hoàn cảnh đặc biệt | Tạm ngưng, giữ nguyên tiến độ |
| **Khiếu nại điểm** | SV không đồng ý với điểm | Thư ký chuyển hội đồng xem lại |
| **Yêu cầu chỉnh sửa sau BV** | Hội đồng yêu cầu sửa đổi | Tạo task riêng, deadline riêng |

### 7.2. Luồng xử lý ngoại lệ
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  SV gửi    │ ──→ │  Thư ký    │ ──→ │  GV/HT     │ ──→ │  Xử lý     │
│  yêu cầu   │     │  tiếp nhận  │     │  xem xét   │     │  & thông báo │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
        ↓                  ↓                  ↓                  ↓
   Nộp tài liệu      Kiểm tra hồ sơ    Phê duyệt/từ chối    Cập nhật trạng thái
```

---

## 8. Thống kê và báo cáo

### 8.1. Các loại thống kê

| Thống kê | Mô tả | Ai xem |
|---------|-------|--------|
| Tổng quan | Số đề tài, SV, tỷ lệ hoàn thành | Thư ký, Admin |
| Theo khoa | Phân bố theo từng khoa | Thư ký, Admin |
| Theo GV | Tỷ lệ SV đúng hạn/trễ theo GV | Thư ký, Admin |
| Phân bố điểm | Điểm A, B, C... theo đề tài | Thư ký, Admin |
| Lý do từ chối | Các lý do phổ biến bị từ chối | Thư ký |
| Thời gian xử lý | TB từng giai đoạn | Thư ký, Admin |

### 8.2. Các chỉ số chính

```
Tỷ lệ hoàn thành = (SV hoàn thành) / (Tổng SV) × 100%
Tỷ lệ đúng hạn = (SV nộp đúng hạn) / (Tổng SV) × 100%
Tỷ lệ trễ hạn = (SV nộp muộn) / (Tổng SV) × 100%
Tỷ lệ bảo vệ lại = (SV phải BV lại) / (Tổng SV) × 100%
```

---

## Sơ đồ tổng thể luồng dữ liệu

```
                    ┌──────────────────────────────────────────────┐
                    │              HỆ THỐNG QUẢN LÝ KHÓA LUẬN      │
                    └──────────────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
        ▼                              ▼                              ▼
┌───────────────┐              ┌───────────────┐              ┌───────────────┐
│  GIAI ĐOẠN A │              │  GIAI ĐOẠN B │              │  GIAI ĐOẠN C │
│  Đăng ký     │              │  Thực hiện    │              │  Đánh giá    │
├───────────────┤              ├───────────────┤              ├───────────────┤
│ • Đề tài     │              │ • Milestone   │              │ • Điểm GVHD  │
│ • Duyệt      │              │ • Báo cáo     │              │ • Điểm PB    │
│ • SV đăng ký │              │ • Tiến độ     │              │ • Điều kiện  │
│ • GV xác nhận│              │ • Cảnh báo    │              │ • Lịch BV    │
└───────┬───────┘              └───────┬───────┘              └───────┬───────┘
        │                              │                              │
        │                              │                              │
        └──────────────────────────────┼──────────────────────────────┘
                                       │
                                       ▼
                           ┌───────────────────┐
                           │   GIAI ĐOẠN D      │
                           │   Bảo vệ & Kết   │
                           ├───────────────────┤
                           │ • SV bảo vệ       │
                           │ • Hội đồng chấm  │
                           │ • Tổng hợp điểm  │
                           │ • Hoàn thành      │
                           └─────────┬─────────┘
                                     │
                                     ▼
                           ┌───────────────────┐
                           │   THỐNG KÊ &      │
                           │   BÁO CÁO         │
                           └───────────────────┘
```

---

## Liên kết các trang trong hệ thống

| Route | Mô tả | Vai trò |
|-------|-------|---------|
| `/thesis` | Trang chính đồ án/đề tài | Tất cả |
| `/thesis/registration` | Quản lý đăng ký | Thư ký, GV, SV |
| `/thesis/milestone` | Quản lý milestone | GV, Thư ký |
| `/thesis/weekly-report` | Báo cáo tuần | SV, GV |
| `/thesis/score` | Chấm điểm | GV, Thư ký |
| `/thesis/review` | Phản biện | GV phản biện |
| `/thesis/schedule` | Lịch bảo vệ | Thư ký, Hội đồng |
| `/thesis/defense` | Bảo vệ | SV, Hội đồng |
| `/thesis/exception` | Xử lý ngoại lệ | Thư ký |
| `/thesis/statistics` | Thống kê | Thư ký, Admin |
