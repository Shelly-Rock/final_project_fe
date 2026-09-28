"use client";

import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import {
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { Upload, Trash2, Download } from "lucide-react";
import { Dialog, Table, TableColumn } from "@/shared/components";

interface Faculty {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  facultyId?: string;
}

interface TeacherImportRow {
  code: string;
  name: string;
  email: string;
  phone?: string;
  facultyId: string;
  departmentId: string;
  academicTitle?: string;
  position?: string;
  status?: "pending" | "success" | "error";
  error?: string;
}

interface ImportExcelDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (file: File) => void | Promise<void>;
  faculties: Faculty[];
  departments?: Department[];
}

export function ImportExcelDialog({
  open,
  onClose,
  onImport,
  faculties,
  departments = [],
}: ImportExcelDialogProps) {
  const [rows, setRows] = useState<TeacherImportRow[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [fileError, setFileError] = useState("");

  const resetState = () => {
    setRows([]);
    setSelectedFile(null);
    setFileError("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // Helper to find faculty by name
  const findFacultyIdByName = useCallback(
    (name: string): string => {
      const found = faculties.find((f) =>
        f.name.toLowerCase().includes(name.toLowerCase()),
      );
      return found?.id || "";
    },
    [faculties],
  );

  const findDepartmentIdByName = useCallback(
    (name: string, facultyId?: string): string => {
      const found = departments
        .filter((item) => !facultyId || item.facultyId === facultyId)
        .find((item) => item.name.toLowerCase().includes(name.toLowerCase()));
      return found?.id || "";
    },
    [departments],
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setSelectedFile(file);
      setFileError("");

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target?.result, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const records = XLSX.utils.sheet_to_json<Record<string, unknown>>(
            worksheet,
            { defval: "" },
          );

          if (records.length === 0) {
            setRows([]);
            setFileError("File không có dữ liệu hoặc thiếu header.");
            return;
          }

          const data = records
            .map((record) => {
              const row: TeacherImportRow = {
                code: "",
                name: "",
                email: "",
                phone: undefined,
                facultyId: "",
                departmentId: "",
                academicTitle: undefined,
                position: undefined,
                status: "pending",
              };

              Object.entries(record).forEach(([key, rawValue]) => {
                const header = key.trim().toLowerCase();
                const value = String(rawValue ?? "").trim();
                switch (header) {
                  case "mã gv":
                  case "magv":
                  case "code":
                  case "teacher_code":
                    row.code = value;
                    break;
                  case "họ tên":
                  case "hoten":
                  case "name":
                  case "fullname":
                  case "full_name":
                    row.name = value;
                    break;
                  case "email":
                  case "gmail":
                  case "mail":
                    row.email = value;
                    break;
                  case "sđt":
                  case "sdt":
                  case "phone":
                  case "tel":
                  case "điện thoại":
                    row.phone = value;
                    break;
                  case "khoa":
                  case "faculty":
                  case "f":
                    row.facultyId = findFacultyIdByName(value);
                    break;
                  case "bộ môn":
                  case "bomon":
                  case "department":
                  case "chuyên ngành":
                    row.departmentId = findDepartmentIdByName(
                      value,
                      row.facultyId,
                    );
                    break;
                  case "học hàm":
                  case "hoc ham":
                  case "academic_title":
                  case "học vị":
                    row.academicTitle = value;
                    break;
                  case "chức vụ":
                  case "chucvu":
                  case "position":
                  case "title":
                    row.position = value;
                    break;
                }
              });
              return row;
            })
            .filter((row) => row.code && row.name && row.email);

          setRows(data);
          setFileError(
            data.length === 0
              ? "Không tìm thấy dòng hợp lệ. Kiểm tra các cột code, name, email."
              : "",
          );
        } catch {
          setRows([]);
          setFileError(
            "Không thể đọc file. Vui lòng chọn file Excel hoặc CSV hợp lệ.",
          );
        }
      };

      reader.readAsArrayBuffer(file);
      event.target.value = "";
    },
    [findFacultyIdByName],
  );

  const handleRemoveRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setFileError("Vui lòng chọn file trước khi import.");
      return;
    }
    if (rows.length === 0) {
      setFileError("File chưa có dòng giảng viên hợp lệ để import.");
      return;
    }

    setImporting(true);
    try {
      if (!selectedFile) return;
      await onImport(selectedFile);
      setRows([]);
      setSelectedFile(null);
      onClose();
    } catch (error) {
      setFileError(error instanceof Error ? error.message : "Import thất bại");
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const firstFaculty = faculties?.[0]?.id || "KHOA_CNTT";
    const firstDepartment = departments?.[0]?.id || "BM_KTPM";
    const rows = [
      {
        code: "GV001",
        name: "Nguyễn Văn An",
        email: "nv.an@nttu.edu.vn",
        phone: "0912345678",
        facultyId: firstFaculty,
        departmentId: firstDepartment,
        academicTitle: "DOCTOR",
        position: "Giảng viên",
        dateOfBirth: "1990-01-15",
        gender: "MALE",
        address: "TP. Hồ Chí Minh",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GiangVien");
    XLSX.writeFile(workbook, "template_giang_vien.xlsx");
  };

  const getFacultyName = (facultyId: string) => {
    return faculties.find((f) => f.id === facultyId)?.name || "—";
  };

  const getDepartmentName = (departmentId: string) => {
    return departments.find((d) => d.id === departmentId)?.name || "—";
  };

  const columns: TableColumn<TeacherImportRow>[] = [
    { key: "code", title: "Mã GV" },
    { key: "name", title: "Họ tên" },
    { key: "email", title: "Email" },
    {
      key: "facultyId",
      title: "Khoa",
      render: (row) => getFacultyName(row.facultyId),
    },
    {
      key: "departmentId",
      title: "Bộ môn",
      render: (row) => getDepartmentName(row.departmentId),
    },
    {
      key: "actions",
      title: "Xóa",
      align: "center",
      width: 60,
      render: (_, index) => (
        <IconButton
          size="small"
          color="error"
          onClick={() => handleRemoveRow(index)}
        >
          <Trash2 size={16} />
        </IconButton>
      ),
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Import danh sách giảng viên"
      size="lg"
    >
      <Box sx={{ mb: 3 }}>
        <Button
          component="label"
          variant="outlined"
          startIcon={<Upload size={18} />}
          sx={{ mb: 2 }}
        >
          Chọn file Excel/CSV
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            hidden
            onChange={handleFileUpload}
          />
        </Button>

        <Button
          variant="outlined"
          startIcon={<Download size={18} />}
          onClick={downloadTemplate}
          size="small"
          sx={{ mb: 2, ml: 1 }}
        >
          Tải file mẫu
        </Button>

        <Box
          sx={{
            p: 2,
            bgcolor: "info.light",
            borderRadius: 1,
            color: "info.dark",
          }}
        >
          <Typography variant="body2">
            File CSV cần có các cột:{" "}
            <strong>code, name, email, faculty, department</strong> (Các cột
            phone, academicTitle, position không bắt buộc)
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
            Các cột tùy chọn: phone, academicTitle, position
          </Typography>
        </Box>
      </Box>

      {rows.length > 0 ? (
        <Box sx={{ maxHeight: 400, overflow: "auto" }}>
          <Table columns={columns} data={rows} variant="bordered" />
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">
            Chưa có dữ liệu. Vui lòng upload file Excel hoặc CSV.
          </Typography>
        </Box>
      )}

      {fileError && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {fileError}
        </Typography>
      )}

      {importing && <LinearProgress sx={{ mt: 2 }} />}

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="text" onClick={handleClose}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleImport}
          disabled={!selectedFile || rows.length === 0 || importing}
        >
          Import {rows.length} giảng viên
        </Button>
      </DialogActions>
    </Dialog>
  );
}
