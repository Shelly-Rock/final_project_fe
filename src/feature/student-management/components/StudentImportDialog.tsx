"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Paper,
  Chip,
} from "@mui/material";
import {
  Upload as UploadIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { useBoolean } from "@/shared/hooks";
import type { StudentImportRow } from "../types";

const REQUIRED_COLUMNS = ["stt", "mssv", "hoTen", "khoa", "khoaHoc", "gmail"];

interface StudentImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (data: StudentImportRow[]) => Promise<void>;
}

export function StudentImportDialog({
  open,
  onClose,
  onImport,
}: StudentImportDialogProps) {
  const [excelData, setExcelData] = useState<StudentImportRow[]>([]);
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const {
    value: importing,
    setTrue: startImporting,
    setFalse: stopImporting,
  } = useBoolean(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setExcelData([]);
    setExcelHeaders([]);
    setError(null);
  }, []);

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
            setError("File không hợp lệ hoặc không có dữ liệu");
            return;
          }

          const headers = lines[0]
            .split(",")
            .map((h) => h.trim().toLowerCase());
          setExcelHeaders(headers);

          const missingCols = REQUIRED_COLUMNS.filter(
            (col) => !headers.includes(col),
          );
          if (missingCols.length > 0) {
            setError(`Thiếu cột bắt buộc: ${missingCols.join(", ")}`);
            return;
          }

          const rows: StudentImportRow[] = [];
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map((v) => v.trim());
            const row: Partial<StudentImportRow> = {};
            headers.forEach((header, idx) => {
              const value = values[idx] ?? "";
              (row as Record<string, string | number>)[header] =
                header === "stt" ? parseInt(value) || i : value;
            });
            rows.push(row as StudentImportRow);
          }

          setExcelData(rows);
          setError(null);
        } catch {
          setError("Không thể đọc file Excel");
        }
      };
      reader.readAsText(file);
      event.target.value = "";
    },
    [],
  );

  const handleImport = useCallback(async () => {
    startImporting();
    setError(null);
    try {
      if (excelData.length === 0) {
        setError("Không có dữ liệu để import");
        return;
      }
      await onImport(excelData);
      resetForm();
      onClose();
    } catch {
      setError("Import thất bại");
    } finally {
      stopImporting();
    }
  }, [excelData, onImport, resetForm, onClose, startImporting, stopImporting]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Import Sinh Viên</DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadIcon />}
            sx={{ mb: 2 }}
          >
            Chọn file Excel
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              hidden
              onChange={handleFileUpload}
            />
          </Button>

          {excelHeaders.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Cột trong file:{" "}
                {excelHeaders.map((h) => (
                  <Chip key={h} label={h} size="small" sx={{ mr: 0.5 }} />
                ))}
              </Typography>
            </Box>
          )}

          {excelData.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <CheckIcon color="success" fontSize="small" />
                <Typography variant="body2" color="success.main">
                  Đã đọc {excelData.length} dòng dữ liệu
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                File cần có các cột: stt, mssv, hoTen, khoa, khoaHoc, gmail
              </Typography>
            </Box>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {excelData.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Xem trước ({excelData.length} sinh viên):
            </Typography>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ maxHeight: 250 }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.100" }}>
                    <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>MSSV</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Họ và tên</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Khoa</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Khóa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {excelData.slice(0, 10).map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.stt}</TableCell>
                      <TableCell>{row.mssv}</TableCell>
                      <TableCell>{row.hoTen}</TableCell>
                      <TableCell>{row.khoa}</TableCell>
                      <TableCell>{row.khoaHoc}</TableCell>
                    </TableRow>
                  ))}
                  {excelData.length > 10 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        sx={{ textAlign: "center", color: "text.secondary" }}
                      >
                        ... và {excelData.length - 10} sinh viên khác
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={excelData.length === 0 || importing}
        >
          {importing ? "Đang import..." : "Import"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
