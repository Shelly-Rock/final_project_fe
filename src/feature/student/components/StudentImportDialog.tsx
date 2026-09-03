// ============================================================
// Student Import Dialog Component
// ============================================================
"use client";

import React, { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import {
  DialogActions,
  Box,
  Typography,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { Dialog, Table, TableColumn, Button } from "@/shared/components";
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
interface StudentImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
}

type ImportRow = {
  mssv: string;
  hoTen: string;
  gmail: string;
  khoa: string;
  khoaHoc: string;
  lop: string;
  soDienThoai?: string;
  ngaySinh?: string;
  diaChi?: string;
  status?: "pending" | "success" | "error";
  error?: string;
};

export function StudentImportDialog({
  open,
  onClose,
  onImport,
}: StudentImportDialogProps) {
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setSelectedFile(file);

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
            alert("File không có dữ liệu hoặc thiếu header");
            return;
          }

          const data = records
            .map((record) => {
              const row: ImportRow = {
                mssv: "",
                hoTen: "",
                gmail: "",
                khoa: "",
                khoaHoc: "",
                lop: "",
                status: "pending",
              };

              Object.entries(record).forEach(([key, rawValue]) => {
                const header = key.trim().toLowerCase();
                const value = String(rawValue ?? "").trim();
                switch (header) {
                  case "mssv":
                  case "student_id":
                    row.mssv = value;
                    break;
                  case "first_name":
                    row.hoTen = `${value} ${row.hoTen}`.trim();
                    break;
                  case "middle_name":
                    row.hoTen = `${row.hoTen} ${value}`.trim();
                    break;
                  case "last_name":
                    row.hoTen = `${value} ${row.hoTen}`.trim();
                    break;
                  case "hoten":
                  case "họ tên":
                  case "name":
                    row.hoTen = value;
                    break;
                  case "gmail":
                  case "email":
                    row.gmail = value;
                    break;
                  case "khoa":
                  case "major":
                    row.khoa = value;
                    break;
                  case "khoahoc":
                  case "khóa":
                  case "course_year":
                  case "academic_year":
                    row.khoaHoc = value;
                    break;
                  case "lop":
                  case "lớp":
                  case "class_name":
                    row.lop = value;
                    break;
                  case "sodienthoai":
                  case "sdt":
                    row.soDienThoai = value;
                    break;
                  case "ngaysinh":
                    row.ngaySinh = value;
                    break;
                  case "diachi":
                    row.diaChi = value;
                    break;
                }
              });
              return row;
            })
            .filter((row) => row.mssv && row.hoTen);

          setRows(data);
        } catch {
          alert("Không thể đọc file. Vui lòng kiểm tra định dạng.");
        }
      };

      reader.readAsArrayBuffer(file);
      event.target.value = "";
    },
    [],
  );

  const handleRemoveRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    if (rows.length === 0) return;

    setImporting(true);
    try {
      if (!selectedFile) return;
      await onImport(selectedFile);
      setRows([]);
      setSelectedFile(null);
      onClose();
    } catch {
      alert("Import thất bại");
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setRows([]);
    setSelectedFile(null);
    onClose();
  };

  const columns: TableColumn<ImportRow>[] = [
    { key: "mssv", title: "MSSV" },
    { key: "hoTen", title: "Họ tên" },
    { key: "gmail", title: "Email" },
    { key: "khoa", title: "Khoa" },
    { key: "khoaHoc", title: "Khóa" },
    { key: "lop", title: "Lớp" },
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
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Import Sinh viên từ file"
      size="lg"
    >
      <Box sx={{ mb: 3 }}>
        <Button
          component="label"
          variant="outlined"
          startIcon={<UploadIcon />}
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
            <strong>mssv, hoten, gmail, khoa, khoahoc, lop</strong>
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
            Chưa có dữ liệu. Vui lòng upload file CSV.
          </Typography>
        </Box>
      )}

      {importing && <LinearProgress sx={{ mt: 2 }} />}

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="text" onClick={handleClose}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleImport}
          disabled={rows.length === 0 || importing}
        >
          Import {rows.length} sinh viên
        </Button>
      </DialogActions>
    </Dialog>
  );
}
