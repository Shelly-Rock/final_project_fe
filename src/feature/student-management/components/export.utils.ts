// ============================================================
// STUDENT MANAGEMENT - Export Utils
// ============================================================

import type { Student } from "../types";

export function exportStudentsToExcel(students: Student[]): void {
  const headers = [
    "stt",
    "mssv",
    "hoTen",
    "khoa",
    "khoaHoc",
    "gmail",
    "deTai",
    "giaoVienHuongDan",
  ];

  const rows = students.map((s) => [
    s.stt,
    s.mssv,
    s.hoTen,
    s.khoa,
    s.khoaHoc,
    s.gmail,
    s.deTai ?? "",
    s.giaoVienHuongDan ?? "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const str = String(cell);
          return str.includes(",") || str.includes('"') || str.includes("\n")
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob(["\ufeff" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `danh_sach_sinh_vien_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadExcelTemplate(): void {
  const headers = [
    "stt",
    "mssv",
    "hoTen",
    "khoa",
    "khoaHoc",
    "gmail",
    "deTai",
    "giaoVienHuongDan",
  ];

  const sampleData = [
    [
      "1",
      "20200001",
      "Nguyễn Văn A",
      "Công nghệ thông tin",
      "2020",
      "20200001@student.hcmus.edu.vn",
      "",
      "",
    ],
    [
      "2",
      "20200002",
      "Trần Thị B",
      "Khoa học máy tính",
      "2020",
      "20200002@student.hcmus.edu.vn",
      "Đề tài mẫu",
      "TS. Nguyễn Văn A",
    ],
  ];

  const csvContent = [
    headers.join(","),
    ...sampleData.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob(["\ufeff" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "template_import_sinh_vien.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
