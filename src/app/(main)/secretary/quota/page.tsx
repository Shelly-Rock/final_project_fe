"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Lock as LockIcon,
  Download as ExportIcon,
} from "@mui/icons-material";
import * as XLSX from "xlsx";

interface QuotaRow {
  id: string;
  lecturer: string;
  department: string;
  defaultQuota: number;
  maxQuota: number;
  overrideQuota: number | null;
  activeTopics: number;
}

const mockLecturers: QuotaRow[] = [
  { id: "1", lecturer: "TS. Nguyễn Văn A", department: "CNTT", defaultQuota: 3, maxQuota: 10, overrideQuota: null, activeTopics: 2 },
  { id: "2", lecturer: "ThS. Trần Thị B", department: "CNTT", defaultQuota: 3, maxQuota: 10, overrideQuota: 5, activeTopics: 5 },
  { id: "3", lecturer: "PGS. Lê Văn C", department: "KHMT", defaultQuota: 3, maxQuota: 10, overrideQuota: null, activeTopics: 3 },
  { id: "4", lecturer: "TS. Phạm Thị D", department: "KHMT", defaultQuota: 3, maxQuota: 10, overrideQuota: null, activeTopics: 1 },
  { id: "5", lecturer: "GS. Hoàng Văn E", department: "ATTT", defaultQuota: 3, maxQuota: 10, overrideQuota: 8, activeTopics: 8 },
  { id: "6", lecturer: "TS. Đặng Thị F", department: "CNTT", defaultQuota: 3, maxQuota: 10, overrideQuota: null, activeTopics: 0 },
  { id: "7", lecturer: "ThS. Vũ Văn G", department: "KTPM", defaultQuota: 3, maxQuota: 10, overrideQuota: null, activeTopics: 2 },
  { id: "8", lecturer: "TS. Lê Thị H", department: "HTTT", defaultQuota: 3, maxQuota: 10, overrideQuota: null, activeTopics: 4 },
];

const DEPARTMENTS = ["Tất cả", "CNTT", "KHMT", "ATTT", "KTPM", "HTTT"];

export default function SecretaryQuotaPage() {
  const [rows, setRows] = useState<QuotaRow[]>(mockLecturers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(3);
  const [filterDept, setFilterDept] = useState("Tất cả");
  const [globalDefault, setGlobalDefault] = useState(3);
  const [globalMax, setGlobalMax] = useState(10);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; id: string | null; value: number | null }>({
    open: false,
    id: null,
    value: null,
  });

  const filteredRows = filterDept === "Tất cả" ? rows : rows.filter((r) => r.department === filterDept);

  const handleStartEdit = useCallback((row: QuotaRow) => {
    setEditingId(row.id);
    setEditValue(row.overrideQuota ?? row.defaultQuota);
  }, []);

  const handleSaveEdit = useCallback((id: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, overrideQuota: editValue !== r.defaultQuota ? editValue : null }
          : r
      )
    );
    setEditingId(null);
  }, [editValue]);

  const handleBulkReset = useCallback(() => {
    setRows((prev) => prev.map((r) => ({ ...r, overrideQuota: null })));
  }, []);

  const handleConfirmOverride = useCallback((id: string, value: number) => {
    setConfirmDialog({ open: true, id, value });
  }, []);

  const handleConfirmSave = useCallback(() => {
    if (confirmDialog.id && confirmDialog.value !== null) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === confirmDialog.id
            ? { ...r, overrideQuota: confirmDialog.value !== r.defaultQuota ? confirmDialog.value : null }
            : r
        )
      );
    }
    setConfirmDialog({ open: false, id: null, value: null });
  }, [confirmDialog]);

  const handleExport = useCallback(() => {
    const data = rows.map((r) => ({
      "Họ tên GV": r.lecturer,
      "Khoa": r.department,
      "Định mức mặc định": r.defaultQuota,
      "Định mức tối đa": r.maxQuota,
      "Định mức hiệu chỉnh": r.overrideQuota ?? "-",
      "Đề tài đang hoạt động": r.activeTopics,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PhanQuySoDeTai");
    XLSX.writeFile(wb, "PhanQuySoDeTai_GV.xlsx");
  }, [rows]);

  const getEffectiveQuota = (row: QuotaRow) => row.overrideQuota ?? row.defaultQuota;
  const getStatusChip = (row: QuotaRow) => {
    const effective = getEffectiveQuota(row);
    if (effective === row.defaultQuota) return <Chip label="Mặc định" size="small" color="default" />;
    if (effective > row.defaultQuota) return <Chip label={`+${effective - row.defaultQuota}`} size="small" color="warning" />;
    return <Chip label={`-${row.defaultQuota - effective}`} size="small" color="info" />;
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Phân quỹ số đề tài / Giảng viên
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Thiết lập số lượng đề tài tối đa mỗi giảng viên có thể hướng dẫn. Override từng dòng hoặc thiết lập global.
        </Typography>
      </Box>

      {/* Global settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Cấu hình toàn cục
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Định mức mặc định</InputLabel>
              <Select
                label="Định mức mặc định"
                value={globalDefault}
                onChange={(e) => setGlobalDefault(e.target.value as number)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <MenuItem key={n} value={n}>{n} đề tài</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Định mức tối đa</InputLabel>
              <Select
                label="Định mức tối đa"
                value={globalMax}
                onChange={(e) => setGlobalMax(e.target.value as number)}
              >
                {[5, 6, 7, 8, 9, 10, 15, 20].map((n) => (
                  <MenuItem key={n} value={n}>{n} đề tài</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              size="small"
              onClick={handleBulkReset}
            >
              Reset về mặc định
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Lọc theo khoa</InputLabel>
              <Select
                label="Lọc theo khoa"
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              >
                {DEPARTMENTS.map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<ExportIcon />}
              onClick={handleExport}
              size="small"
            >
              Xuất Excel
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.50" }}>
                  <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Giảng viên</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Khoa</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Định mức mặc định</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tối đa</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Hiệu chỉnh</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Đang hoạt động</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row, idx) => (
                  <TableRow key={row.id} sx={{ "&:nth-of-type(odd)": { bgcolor: "grey.50" } }}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.lecturer}</TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.defaultQuota}</TableCell>
                    <TableCell>{row.maxQuota}</TableCell>
                    <TableCell>
                      {editingId === row.id ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <TextField
                            type="number"
                            size="small"
                            value={editValue}
                            onChange={(e) => setEditValue(Number(e.target.value))}
                            inputProps={{ min: 1, max: row.maxQuota }}
                            sx={{ width: 80 }}
                          />
                          <Tooltip title="Lưu">
                            <IconButton size="small" color="primary" onClick={() => handleConfirmOverride(row.id, editValue)}>
                              <SaveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Typography sx={{ fontWeight: 700 }}>
                          {row.overrideQuota ?? row.defaultQuota}
                          {row.overrideQuota && (
                            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              (mặc định: {row.defaultQuota})
                            </Typography>
                          )}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.activeTopics}
                        size="small"
                        color={row.activeTopics >= getEffectiveQuota(row) ? "error" : "default"}
                        variant={row.activeTopics >= getEffectiveQuota(row) ? "filled" : "outlined"}
                      />
                    </TableCell>
                    <TableCell>{getStatusChip(row)}</TableCell>
                    <TableCell>
                      <Tooltip title="Hiệu chỉnh">
                        <IconButton size="small" onClick={() => handleStartEdit(row)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Định mức mặc định:</strong> {globalDefault} đề tài/GV &nbsp;|&nbsp;
              <strong>Tối đa:</strong> {globalMax} đề tài/GV &nbsp;|&nbsp;
              <strong>GV vượt định mức:</strong> {rows.filter((r) => r.activeTopics >= getEffectiveQuota(r)).length}
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {/* Confirm dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, id: null, value: null })} maxWidth="xs" fullWidth>
        <DialogTitle>Xác nhận hiệu chỉnh</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Đặt định mức hiệu chỉnh thành <strong>{confirmDialog.value}</strong> cho giảng viên này?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, id: null, value: null })}>Hủy</Button>
          <Button variant="contained" onClick={handleConfirmSave}>Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
