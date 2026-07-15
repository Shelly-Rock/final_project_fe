// ============================================================
// Student Import Dialog Component
// ============================================================
"use client";

import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  LinearProgress,
} from "@mui/material";
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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Sinh viên từ file</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadIcon />}
            sx={{ mb: 2 }}
          >
            Chọn file CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileUpload}
            />
          </Button>

          <Alert severity="info" sx={{ mt: 1 }}>
            File CSV cần có các cột:{" "}
            <strong>mssv, hoten, gmail, khoa, khoahoc, lop</strong>
          </Alert>
        </Box>

        {rows.length > 0 ? (
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: "grey.200", fontWeight: 600 }}>
                    MSSV
                  </TableCell>
                  <TableCell sx={{ bgcolor: "grey.200", fontWeight: 600 }}>
                    Họ tên
                  </TableCell>
                  <TableCell sx={{ bgcolor: "grey.200", fontWeight: 600 }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ bgcolor: "grey.200", fontWeight: 600 }}>
                    Khoa
                  </TableCell>
                  <TableCell sx={{ bgcolor: "grey.200", fontWeight: 600 }}>
                    Khóa
                  </TableCell>
                  <TableCell sx={{ bgcolor: "grey.200", fontWeight: 600 }}>
                    Lớp
                  </TableCell>
                  <TableCell sx={{ bgcolor: "grey.200", fontWeight: 600 }}>
                    Xóa
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.mssv}</TableCell>
                    <TableCell>{row.hoTen}</TableCell>
                    <TableCell>{row.gmail}</TableCell>
                    <TableCell>{row.khoa}</TableCell>
                    <TableCell>{row.khoaHoc}</TableCell>
                    <TableCell>{row.lop}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveRow(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">
              Chưa có dữ liệu. Vui lòng upload file CSV.
            </Typography>
          </Box>
        )}

        {importing && <LinearProgress sx={{ mt: 2 }} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
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
