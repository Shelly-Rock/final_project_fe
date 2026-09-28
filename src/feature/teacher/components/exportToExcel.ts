import * as XLSX from "xlsx";
import type { Lecturer } from "@/feature/admin/types";

export function exportTeachersToExcel(
  teachers: Lecturer[],
  faculties: { id: string; name: string }[] = [],
) {
  const facultyLookup = Object.fromEntries(
    faculties.map((f) => [f.id, f.name]),
  );
  const data = teachers.map((teacher) => ({
    "Ma GV": teacher.code,
    "Ho ten": teacher.name,
    Email: teacher.email,
    "So dien thoai": teacher.phone || "",
    Khoa: facultyLookup[teacher.facultyId] || "",
    "Chuc vu": teacher.position || "",
    "Hoc ham": teacher.academicTitle || "",
    "Ngay sinh": teacher.dateOfBirth
      ? new Date(teacher.dateOfBirth).toLocaleDateString("vi-VN")
      : "",
    "Gioi tinh": teacher.gender || "",
    "Dia chi": teacher.address || "",
    "Trang thai": teacher.status === "active" ? "Dang cong tac" : "Tam khoa",
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Giang vien");
  XLSX.writeFile(workbook, "danh_sach_giang_vien.xlsx");
}
