// ============================================================
// Export Teacher to Excel Utility
// ============================================================
import * as XLSX from "xlsx";
import type { Lecturer } from "@/feature/admin/types";
import { getFacultyName, getDepartmentName } from "@/feature/admin/mockData";

export function exportTeachersToExcel(teachers: Lecturer[]) {
  const data = teachers.map((t) => ({
    "Mã GV": t.code,
    "Họ tên": t.name,
    Email: t.email,
    "Số điện thoại": t.phone || "",
    Khoa: getFacultyName(t.facultyId),
    "Bộ môn": getDepartmentName(t.departmentId),
    "Chức vụ": t.position || "",
    "Học hàm": t.academicTitle || "",
    "Trạng thái": t.status === "active" ? "Đang công tác" : "Tạm khóa",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Giảng viên");

  worksheet["!cols"] = [
    { wch: 10 },
    { wch: 25 },
    { wch: 30 },
    { wch: 15 },
    { wch: 25 },
    { wch: 25 },
    { wch: 15 },
    { wch: 12 },
    { wch: 15 },
  ];

  XLSX.writeFile(workbook, "danh_sach_giang_vien.xlsx");
}
