"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Typography,
  Alert,
  Paper,
  Chip,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { useBoolean } from "@/shared/hooks";
import type { StudentImportRow } from "../types";

const DEFAULT_ROW: StudentImportRow = {
  stt: 1,
  mssv: "",
  hoTen: "",
  khoa: "",
  khoaHoc: "",
  gmail: "",
};

const REQUIRED_COLUMNS = ["stt", "mssv", "hoTen", "khoa", "khoaHoc", "gmail"];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ py: 2 }}>
      {value === index && children}
    </Box>
  );
}

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
  const [tab, setTab] = useState(0);
  const [manualRows, setManualRows] = useState<StudentImportRow[]>([DEFAULT_ROW]);
  const [excelData, setExcelData] = useState<StudentImportRow[]>([]);
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const { value: importing, setTrue: startImporting, setFalse: stopImporting } =
    useBoolean(false);
  const [error, setError] = useState<string | null>(null);

  const hasData = useMemo(
    () => (tab === 0 ? excelData.length > 0 : manualRows.length > 0),
    [tab, excelData, manualRows]
  );

  const currentRows = useMemo(
    () => (tab === 0 ? excelData : manualRows),
    [tab, excelData, manualRows]
  );

  const resetForm = useCallback(() => {
    setTab(0);
    setManualRows([DEFAULT_ROW]);
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

          const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
          setExcelHeaders(headers);

          const missingCols = REQUIRED_COLUMNS.filter(
            (col) => !headers.includes(col)
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
    []
  );

  const addManualRow = useCallback(() => {
    setManualRows((prev) => [
      ...prev,
      { ...DEFAULT_ROW, stt: prev.length + 1 },
    ]);
  }, []);

  const removeManualRow = useCallback((index: number) => {
    setManualRows((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const updateManualRow = useCallback(
    (index: number, field: keyof StudentImportRow, value: string | number) => {
      setManualRows((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    },
    []
  );

  const handleImport = useCallback(async () => {
    startImporting();
    setError(null);
    try {
      const dataToImport = tab === 0 ? excelData : manualRows;
      if (dataToImport.length === 0) {
        setError("Không có dữ liệu để import");
        return;
      }
      await onImport(dataToImport);
      resetForm();
      onClose();
    } catch {
      setError("Import thất bại");
    } finally {
      stopImporting();
    }
  }, [excelData, manualRows, onImport, resetForm, onClose, tab, startImporting, stopImporting]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Import Sinh Viên</DialogTitle>

      <DialogContent>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Tự động (Excel)" />
          <Tab label="Thủ công" />
        </Tabs>

        <TabPanel value={tab} index={0}>
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
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
            <Button size="small" startIcon={<AddIcon />} onClick={addManualRow}>
              Thêm dòng
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell sx={{ fontWeight: 600, width: 60 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>MSSV</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Họ và tên</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Khoa</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: 80 }}>
                    Khóa
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Gmail</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: 60 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {manualRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        placeholder="20200001"
                        value={row.mssv}
                        onChange={(e) =>
                          updateManualRow(index, "mssv", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        placeholder="Nguyễn Văn A"
                        value={row.hoTen}
                        onChange={(e) =>
                          updateManualRow(index, "hoTen", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        placeholder="CNTT"
                        value={row.khoa}
                        onChange={(e) =>
                          updateManualRow(index, "khoa", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        placeholder="2020"
                        value={row.khoaHoc}
                        onChange={(e) =>
                          updateManualRow(index, "khoaHoc", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        placeholder="email@student.hcmus.edu.vn"
                        value={row.gmail}
                        onChange={(e) =>
                          updateManualRow(index, "gmail", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => removeManualRow(index)}
                        disabled={manualRows.length === 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {hasData && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Xem trước ({currentRows.length} sinh viên):
            </Typography>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ maxHeight: 200 }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.100" }}>
                    <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>MSSV</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Họ và tên</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Khoa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentRows.slice(0, 5).map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.stt}</TableCell>
                      <TableCell>{row.mssv}</TableCell>
                      <TableCell>{row.hoTen}</TableCell>
                      <TableCell>{row.khoa}</TableCell>
                    </TableRow>
                  ))}
                  {currentRows.length > 5 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        sx={{ textAlign: "center", color: "text.secondary" }}
                      >
                        ... và {currentRows.length - 5} sinh viên khác
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
          disabled={!hasData || importing}
        >
          {importing ? "Đang import..." : "Import"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
