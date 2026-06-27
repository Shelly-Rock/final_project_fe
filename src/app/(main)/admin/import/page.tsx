"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
  TableChart as TableIcon,
} from "@mui/icons-material";
import { ExcelUploadDropzone } from "@/shared/components/ExcelUploadDropzone";
import * as XLSX from "xlsx";

interface ImportResult {
  success: number;
  failed: number;
  total: number;
  errors: { row: number; mssv: string; reason: string }[];
  successRows: Record<string, string | number>[];
}

const TEMPLATE_HEADERS = ["stt", "mssv", "hoTen", "khoa", "khoaHoc", "gmail"];

function downloadTemplate() {
  const ws = XLSX.utils.json_to_sheet([
    { stt: 1, mssv: "20210001", hoTen: "Nguyễn Văn A", khoa: "CNTT", khoaHoc: "K2020", gmail: "nguyenvana@example.com" },
    { stt: 2, mssv: "20210002", hoTen: "Trần Thị B", khoa: "CNTT", khoaHoc: "K2020", gmail: "tranthib@example.com" },
  ]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Mau_Import_SV");
  XLSX.writeFile(wb, "Mau_Import_SinhVien.xlsx");
}

export default function AdminImportPage() {
  const [preview, setPreview] = useState<Record<string, string | number>[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleUpload = useCallback((data: Record<string, string | number | null>[], errs: string[]) => {
    setPreview(data.map((row) => {
      const cleaned: Record<string, string | number> = {};
      for (const [k, v] of Object.entries(row)) {
        if (v !== null && v !== undefined) {
          cleaned[k] = v as string | number;
        }
      }
      return cleaned;
    }));
    setErrors(errs);
    setConfirmOpen(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    setImporting(true);
    setConfirmOpen(false);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 2000));

    const successCount = Math.floor((preview?.length ?? 0) * 0.85);
    const failCount = (preview?.length ?? 0) - successCount;
    const mockResult: ImportResult = {
      success: successCount,
      failed: failCount,
      total: preview?.length ?? 0,
      errors: Array.from({ length: failCount }, (_, i) => ({
        row: i + 3,
        mssv: `20210${String(i + 3).padStart(3, "0")}`,
        reason: ["Trùng MSSV", "Email không hợp lệ", "Thiếu khoa", "MSSV đã tồn tại"][i % 4],
      })),
      successRows: preview?.slice(0, successCount) ?? [],
    };

    setResult(mockResult);
    setImporting(false);
    setSnackbar({
      open: true,
      message: `Import hoàn tất: ${successCount} thành công, ${failCount} lỗi`,
      severity: failCount > 0 ? "warning" : "success",
    });
  }, [preview]);

  const handleReset = useCallback(() => {
    setPreview(null);
    setErrors([]);
    setResult(null);
    setConfirmOpen(false);
  }, []);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Nhập liệu từ Excel
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tải lên file Excel (.xlsx, .xls, .csv) để nhập danh sách sinh viên. Dữ liệu sẽ được preview trước khi xác nhận.
        </Typography>
      </Box>

      {/* Result summary */}
      {result && (
        <Alert severity={result.failed > 0 ? "warning" : "success"} sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Kết quả Import: {result.success} thành công, {result.failed} lỗi / {result.total} tổng
          </Typography>
        </Alert>
      )}

      <Box sx={{ display: "grid", gridTemplateColumns: result ? "1fr 1fr" : "1fr", gap: 3 }}>
        {/* Left: Upload */}
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  1. Tải file lên
                </Typography>
                <Button
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={downloadTemplate}
                  variant="outlined"
                >
                  Tải mẫu
                </Button>
              </Box>
              <ExcelUploadDropzone
                onUpload={handleUpload}
                templateHeaders={TEMPLATE_HEADERS}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Right: Error list */}
        {result && result.errors.length > 0 && (
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <ErrorIcon color="error" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Danh sách lỗi ({result.errors.length})
                </Typography>
              </Box>
              <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "error.50" }}>
                      <TableCell sx={{ fontWeight: 700 }}>Dòng</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>MSSV</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Lý do lỗi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.errors.map((err) => (
                      <TableRow key={err.row}>
                        <TableCell>{err.row}</TableCell>
                        <TableCell>{err.mssv}</TableCell>
                        <TableCell>
                          <Chip label={err.reason} size="small" color="error" variant="outlined" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Preview table */}
      {preview && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <TableIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Xem trước dữ liệu ({preview.length} dòng)
              </Typography>
            </Box>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.50" }}>
                    {TEMPLATE_HEADERS.map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, textTransform: "capitalize" }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {preview.map((row, idx) => (
                    <TableRow key={idx} sx={{ "&:nth-of-type(odd)": { bgcolor: "grey.50" } }}>
                      {TEMPLATE_HEADERS.map((h) => (
                        <TableCell key={h}>{String(row[h] ?? "-")}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button variant="outlined" onClick={handleReset}>
                Chọn file khác
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<UploadIcon />}
                onClick={() => setConfirmOpen(true)}
              >
                Xác nhận Import
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Xác nhận Import</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Sẽ import <strong>{preview?.length ?? 0} sinh viên</strong>. Các dòng có lỗi sẽ bị bỏ qua.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Bạn có chắc muốn tiếp tục không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleConfirm} disabled={importing}>
            {importing ? "Đang import..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Importing progress */}
      {importing && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>Đang xử lý...</Typography>
          <LinearProgress />
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
