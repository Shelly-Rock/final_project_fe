// ============================================================
// Export to Excel Utility
// ============================================================
import * as XLSX from "xlsx";
import type { Student } from "../types";

export function exportStudentsToExcel(students: Student[]) {
  const data = students.map((s) => ({
    MSSV: s.mssv,
    "Họ tên": s.hoTen,
    Email: s.gmail,
    Khoa: s.khoa,
    "Khóa học": s.khoaHoc,
    Lớp: s.lop,
    "Số điện thoại": s.soDienThoai || "",
    "Ngày sinh": s.ngaySinh || "",
    "Địa chỉ": s.diaChi || "",
    "Đề tài": s.deTai || "",
    "GV hướng dẫn": s.giangVienHuongDan || "",
    "Trạng thái":
      s.trangThai === "active"
        ? "Đang học"
        : s.trangThai === "inactive"
          ? "Nghỉ học"
          : "Đã tốt nghiệp",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sinh viên");

  worksheet["!cols"] = [
    { wch: 10 },
    { wch: 25 },
    { wch: 30 },
    { wch: 20 },
    { wch: 10 },
    { wch: 12 },
    { wch: 15 },
    { wch: 12 },
    { wch: 25 },
    { wch: 30 },
    { wch: 20 },
    { wch: 12 },
  ];

  XLSX.writeFile(workbook, "danh_sach_sinh_vien.xlsx");
}
