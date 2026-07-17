// ============================================================
// Student Import Dialog Component
// ============================================================
"use client";

import React, { useState, useCallback } from "react";
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
import type { StudentImportRow } from "../types";

interface StudentImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (data: StudentImportRow[]) => Promise<void>;
}

type ImportRow = StudentImportRow & {
  status?: "pending" | "success" | "error";
  error?: string;
};

export function StudentImportDialog({
  open,
  onClose,
  onImport,
}: StudentImportDialogProps) {
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [importing, setImporting] = useState(false);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split("\n").filter((line) => line.trim());

          if (lines.length < 2) {
            alert("File không có dữ liệu hoặc thiếu header");
            return;
          }

          const headers = lines[0]
            .split(",")
            .map((h) => h.trim().toLowerCase());
          const data: ImportRow[] = [];

          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map((v) => v.trim());
            const row: ImportRow = {
              mssv: "",
              hoTen: "",
              gmail: "",
              khoa: "",
              khoaHoc: "",
              lop: "",
              status: "pending",
            };

            headers.forEach((header, index) => {
              const value = values[index] || "";
              switch (header) {
                case "mssv":
                  row.mssv = value;
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
                  row.khoa = value;
                  break;
                case "khoahoc":
                case "khóa":
                  row.khoaHoc = value;
                  break;
                case "lop":
                case "lớp":
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

            if (row.mssv && row.hoTen) {
              data.push(row);
            }
          }

          setRows(data);
        } catch {
          alert("Không thể đọc file. Vui lòng kiểm tra định dạng.");
        }
      };

      reader.readAsText(file);
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
      await onImport(rows);
      setRows([]);
      onClose();
    } catch {
      alert("Import thất bại");
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setRows([]);
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
          Chọn file CSV
          <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
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
