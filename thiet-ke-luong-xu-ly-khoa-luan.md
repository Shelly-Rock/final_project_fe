# Thiết kế luồng xử lý — Hệ thống quản lý hồ sơ khóa luận

## 0. Luồng gốc (rút gọn)

```
Đề tài (GV tạo) → Thư ký duyệt → SV đăng ký → GV xác nhận
→ Milestone/Task gán → SV nộp báo cáo tuần → GV phản hồi
→ GV phản biện → GV chấm điểm (4 tiêu chí) → TK lên lịch bảo vệ
→ SV bảo vệ → Hội đồng cho điểm → Hoàn thành → Thống kê
```

Tài liệu này mở rộng luồng trên thành thiết kế chi tiết: 4 giai đoạn, vai trò, trạng thái (status) của từng đối tượng, trường dữ liệu, các nhánh ngoại lệ, thông báo tự động, và thống kê.

---

## 1. Mô hình tổng thể — 4 giai đoạn lớn

### Giai đoạn A — Khởi tạo & đăng ký đề tài
GV tạo đề tài → Thư ký duyệt → SV đăng ký → GV xác nhận → (Thư ký duyệt lần 2, optional nếu trường yêu cầu kiểm tra trùng đề tài)

### Giai đoạn B — Thực hiện
Gán Milestone/Task → Lặp hàng tuần: SV nộp báo cáo → GV phản hồi/đánh giá tiến độ → (cảnh báo nếu SV nộp muộn hoặc tiến độ trễ)

### Giai đoạn C — Đánh giá trước bảo vệ
GV hướng dẫn chấm điểm quá trình → GV phản biện (độc lập, đọc báo cáo + chấm theo rubric riêng) → Thư ký tổng hợp điều kiện đủ → Lên lịch bảo vệ (kiểm tra phòng, hội đồng, xung đột giờ)

### Giai đoạn D — Bảo vệ & hoàn thành
SV bảo vệ → Hội đồng chấm điểm → Tổng hợp điểm (GVHD + Phản biện + Hội đồng theo trọng số) → Hoàn thành → Lưu hồ sơ + Thống kê/báo cáo

---

## 2. Vai trò & quyền hạn

| Vai trò | Quyền chính |
|---|---|
| **Admin** | Cấu hình kỳ khóa luận, phân quyền, set trọng số điểm, quản lý danh sách hội đồng |
| **Thư ký khoa** | Duyệt đề tài, kiểm tra trùng lặp, xác nhận điều kiện đủ, lên lịch bảo vệ, tổng hợp điểm, xuất báo cáo thống kê |
| **GV hướng dẫn** | Tạo đề tài, xác nhận SV, gán milestone/task, phản hồi báo cáo tuần, chấm điểm quá trình |
| **GV phản biện** | Đọc báo cáo/sản phẩm, chấm độc lập theo rubric riêng (không nhìn thấy điểm của GVHD trước khi chấm — tránh bias) |
| **Sinh viên** | Đăng ký đề tài, nộp báo cáo tuần, nộp báo cáo cuối kỳ, bảo vệ |
| **Hội đồng bảo vệ** | Chấm điểm độc lập trong buổi bảo vệ, ghi nhận ý kiến/yêu cầu chỉnh sửa sau bảo vệ |

---

## 3. Trạng thái (status) của từng đối tượng

### Đề tài
```
Nháp → Chờ duyệt → Đã duyệt / Từ chối
     → Đã có SV đăng ký → Đầy slot (nếu giới hạn số SV/đề tài)
     → Đang thực hiện → Hoàn thành / Hủy
```

### Đăng ký của SV
```
Chờ xác nhận GV → Đã xác nhận / Từ chối
                → Đang thực hiện → Tạm ngưng (SV xin gia hạn, bảo lưu)
                → Hoàn thành / Rút đăng ký
```

### Milestone/Task
```
Chưa bắt đầu → Đang thực hiện → Trễ hạn (tự động đổi nếu quá deadline chưa nộp)
             → Đã nộp → GV duyệt / Yêu cầu chỉnh sửa → Hoàn thành
```

### Báo cáo tuần
```
Nháp → Đã nộp → Đang chờ phản hồi → Đã duyệt / Yêu cầu nộp lại
```
> Nên lưu lịch sử các lần nộp lại (version), không overwrite, để GV và hội đồng xem được tiến trình thực tế.

### Hồ sơ bảo vệ
```
Chưa đủ điều kiện → Đủ điều kiện → Đã lên lịch → Đang bảo vệ
                   → Đã bảo vệ — chờ tổng hợp điểm → Hoàn thành / Phải bảo vệ lại
```

---

## 4. Trường dữ liệu chính

**Đề tài**
- Mã đề tài, tên (VN/EN), lĩnh vực, GV hướng dẫn
- Số SV tối đa, mô tả/yêu cầu đầu vào, file đính kèm, đợt khóa luận

**Milestone/Task**
- Tên, mô tả, deadline, % trọng số trong tổng tiến độ
- Trạng thái, file sản phẩm đính kèm, người tạo

**Báo cáo tuần**
- Tuần số, nội dung đã làm, vướng mắc, kế hoạch tuần sau
- File/link demo, % hoàn thành tự đánh giá
- Phản hồi GV, điểm tiến độ (nếu chấm theo tuần)

**Điểm**
- Tách rõ 3 nguồn: điểm GVHD (4 tiêu chí — tiến độ, kỹ năng, tinh thần, kỹ thuật, tuỳ trường), điểm phản biện, điểm hội đồng (từng thành viên)
- Công thức trọng số tổng hợp (ví dụ: GVHD 40% – Phản biện 20% – Hội đồng 40%), cấu hình được ở cấp Admin để linh hoạt theo từng kỳ

**Lịch bảo vệ**
- Phòng, ca, danh sách hội đồng, danh sách SV theo ca
- Ràng buộc không trùng GV trong 2 hội đồng cùng giờ

---

## 5. Các nhánh ngoại lệ cần thiết kế từ đầu

| Tình huống | Hướng xử lý |
|---|---|
| SV không nộp báo cáo đúng hạn nhiều lần | Hệ thống tự cảnh báo GV + Thư ký, có thể dẫn đến cảnh báo học vụ |
| Đổi đề tài giữa kỳ | Huỷ đăng ký cũ, giữ lịch sử báo cáo cũ để truy vết, đăng ký đề tài mới phải qua xác nhận lại |
| Đổi GV hướng dẫn (GV nghỉ, quá tải) | Log lý do, không xoá dữ liệu cũ |
| SV xin gia hạn/bảo lưu | Tạm dừng đồng hồ deadline milestone, không tính trễ hạn trong thời gian bảo lưu |
| Khiếu nại điểm sau bảo vệ | SV gửi khiếu nại → Thư ký chuyển hội đồng/GV liên quan xem lại → cập nhật điểm có log thay đổi (audit trail), không sửa trực tiếp điểm cũ |
| Hội đồng yêu cầu chỉnh sửa sau bảo vệ ("bảo vệ có điều kiện") | Tạo task chỉnh sửa, deadline riêng, GVHD xác nhận hoàn tất trước khi chốt điểm |

---

## 6. Thông báo tự động (trigger điểm)

| Sự kiện | Người nhận |
|---|---|
| Đề tài được duyệt/từ chối | GV |
| SV đăng ký đề tài | GV |
| GV xác nhận/từ chối đăng ký | SV |
| Gần deadline milestone (trước 2 ngày) | SV |
| Báo cáo tuần được phản hồi | SV |
| Đủ điều kiện bảo vệ | SV + Thư ký |
| Lịch bảo vệ được set | SV + GV + Hội đồng |
| Điểm cuối được công bố | SV |

---

## 7. Thống kê cuối (cho Thư ký/Admin)

- Tỷ lệ SV đúng hạn/trễ hạn theo từng GV
- Phân bố điểm theo đề tài/khoa
- Số đề tài bị từ chối và lý do phổ biến
- Tỷ lệ SV phải bảo vệ lại
- Thời gian xử lý trung bình mỗi giai đoạn (đăng ký → xác nhận, đủ điều kiện → bảo vệ) — hữu ích để tối ưu quy trình kỳ sau
