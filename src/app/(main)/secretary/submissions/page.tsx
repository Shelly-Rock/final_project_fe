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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Schedule as TimeIcon,
  Download as ExportIcon,
} from "@mui/icons-material";
import * as XLSX from "xlsx";

type SubmissionStatus = "on_time" | "late" | "extended" | "missing";

interface SubmissionRow {
  id: string;
  mssv: string;
  studentName: string;
  topicName: string;
  lecturer: string;
  department: string;
  months: number; // how many months submitted
  lastSubmitAt?: string;
  banCount: number; // consecutive missing
  status: SubmissionStatus;
  eligible: boolean;
  note?: string;
}

const mockSubmissions: SubmissionRow[] = [
  { id: "1", mssv: "CN200101", studentName: "Nguyễn Văn Minh", topicName: "Ứng dụng AI trong y tế", lecturer: "TS. Nguyễn Văn A", department: "CNTT", months: 6, lastSubmitAt: "2026-06-15", banCount: 0, status: "on_time", eligible: true },
  { id: "2", mssv: "CN200102", studentName: "Trần Thị Lan", topicName: "Hệ thống IoT", lecturer: "TS. Nguyễn Văn A", department: "CNTT", months: 5, lastSubmitAt: "2026-05-14", banCount: 0, status: "late", eligible: true },
  { id: "3", mssv: "CN200103", studentName: "Lê Văn Hoàng", topicName: "Blockchain", lecturer: "PGS. Lê Văn C", department: "KHMT", months: 2, lastSubmitAt: "2026-03-20", banCount: 3, status: "missing", eligible: false },
  { id: "4", mssv: "CN200104", studentName: "Phạm Thị Mai", topicName: "NLP cho tiếng Việt", lecturer: "TS. Phạm Thị D", department: "KHMT", months: 6, lastSubmitAt: "2026-06-18", banCount: 0, status: "extended", eligible: true },
  { id: "5", mssv: "CN200105", studentName: "Vũ Văn Long", topicName: "Bảo mật 5G", lecturer: "GS. Hoàng Văn E", department: "ATTT", months: 4, banCount: 1, status: "late", eligible: false },
  { id: "6", mssv: "CN200106", studentName: "Đặng Thị Hà", topicName: "AR/VR trong giáo dục", lecturer: "TS. Đặng Thị F", department: "CNTT", months: 6, lastSubmitAt: "2026-06-20", banCount: 0, status: "on_time", eligible: true },
  { id: "7", mssv: "CN200107", studentName: "Bùi Văn Đức", topicName: "Tối ưu thuật toán", lecturer: "TS. Nguyễn Văn A", department: "CNTT", months: 6, lastSubmitAt: "2026-06-12", banCount: 0, status: "on_time", eligible: true },
  { id: "8", mssv: "CN200108", studentName: "Hoàng Thị Ngọc", topicName: "An ninh IoT", lecturer: "ThS. Vũ Văn G", department: "ATTT", months: 1, banCount: 2, status: "missing", eligible: false },
];

const statusConfig: Record<SubmissionStatus, { label: string; color: "success" | "warning" | "error" | "default" | "info"; chipColor: "success" | "warning" | "error" | "default" | "info" }> = {
  on_time: { label: "Đúng tiến độ", color: "success", chipColor: "success" },
  late: { label: "Trễ hạn", color: "warning", chipColor: "warning" },
  extended: { label: "Gia hạn", color: "info", chipColor: "info" },
  missing: { label: "Trễ hạn nghiêm trọng", color: "error", chipColor: "error" },
};

export default function SecretarySubmissionsPage() {
  const [rows, setRows] = useState<SubmissionRow[]>(mockSubmissions);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<SubmissionStatus | "all">("all");
  const [filterDept, setFilterDept] = useState("Tất cả");
  const [selected, setSelected] = useState<string[]>([]);
  const [noteDialog, setNoteDialog] = useState<{ open: boolean; id: string; note: string }>({
    open: false,
    id: "",
    note: "",
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" }>({ open: false, message: "", severity: "success" });

  const filtered = rows.filter((r) => {
    const matchSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.mssv.toLowerCase().includes(search.toLowerCase()) ||
      r.topicName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchDept = filterDept === "Tất cả" || r.department === filterDept;
    return matchSearch && matchStatus && matchDept;
  });

  const handleSelectAll = useCallback(() => {
    const eligibleIds = filtered.filter((r) => r.eligible).map((r) => r.id);
    setSelected(selected.length === eligibleIds.length ? [] : eligibleIds);
  }, [filtered, selected.length]);

  const handleSelectOne = useCallback((id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  const handleToggleEligibility = useCallback((id: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, eligible: !r.eligible } : r))
    );
  }, []);

  const handleSaveNote = useCallback(() => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === noteDialog.id ? { ...r, note: noteDialog.note } : r
      )
    );
    setNoteDialog({ open: false, id: "", note: "" });
    setSnackbar({ open: true, message: "Đã lưu ghi chú!", severity: "success" });
  }, [noteDialog]);

  const handleExport = useCallback(() => {
    const data = rows.map((r, idx) => ({
      STT: idx + 1,
      MSSV: r.mssv,
      "Họ tên": r.studentName,
      "Đề tài": r.topicName,
      GVHD: r.lecturer,
      Khoa: r.department,
      "Số tháng nộp": r.months,
      "Ngày nộp cuối": r.lastSubmitAt ?? "-",
      "Trạng thái": statusConfig[r.status].label,
      "Đủ điều kiện": r.eligible ? "Có" : "Không",
      "Ghi chú": r.note ?? "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DS_BaoCao");
    XLSX.writeFile(wb, "DanhSachBaoCaoTienDo.xlsx");
  }, [rows]);

  const eligibleCount = rows.filter((r) => r.eligible).length;
  const selectedEligible = rows.filter((r) => selected.includes(r.id) && r.eligible).length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Danh sách nộp báo cáo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Theo dõi tiến độ nộp báo cáo hàng tháng. Tick chọn SV đủ điều kiện để xếp vào Hội đồng bảo vệ.
        </Typography>
      </Box>

      {/* Summary */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2, mb: 3 }}>
        {[
          { label: "Tổng SV", value: rows.length, color: "primary.main" },
          { label: "Đúng tiến độ", value: rows.filter((r) => r.status === "on_time").length, color: "success.main" },
          { label: "Trễ hạn", value: rows.filter((r) => r.status === "late").length, color: "warning.main" },
          { label: "Trễ nghiêm trọng", value: rows.filter((r) => r.status === "missing").length, color: "error.main" },
          { label: "Đủ điều kiện BV", value: eligibleCount, color: "success.main" },
        ].map((s) => (
          <Paper key={s.label} variant="outlined" sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: s.color }}>
              {s.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">{s.label}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ pb: "16px !important" }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <TextField
              size="small"
              placeholder="Tìm MSSV, tên, đề tài..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 280 }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                label="Trạng thái"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as SubmissionStatus | "all")}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {(Object.keys(statusConfig) as SubmissionStatus[]).map((s) => (
                  <MenuItem key={s} value={s}>{statusConfig[s].label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
              {filtered.length} kết quả
            </Typography>
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={handleExport}
              size="small"
              color="success"
            >
              Xuất Excel
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.50" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    indeterminate={selected.length > 0 && selected.length < filtered.filter((r) => r.eligible).length}
                    checked={selected.length === filtered.filter((r) => r.eligible).length && filtered.filter((r) => r.eligible).length > 0}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>MSSV</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Sinh viên</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Đề tài</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>GVHD</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tháng nộp</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Đủ ĐK</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ghi chú</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((row) => {
                const cfg = statusConfig[row.status];
                const isEligible = row.eligible;
                return (
                  <TableRow
                    key={row.id}
                    sx={{
                      bgcolor: !isEligible ? "error.50" : selected.includes(row.id) ? "action.selected" : undefined,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={selected.includes(row.id)}
                        onChange={() => handleSelectOne(row.id)}
                        disabled={!isEligible}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 700 }}>
                        {row.mssv}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.studentName}</TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {row.topicName}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.lecturer}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: row.months < 6 ? "error.main" : "success.main",
                        }}
                      >
                        {row.months}/8
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={cfg.label}
                        color={cfg.chipColor}
                        size="small"
                        variant="filled"
                        sx={{ fontWeight: 700, fontSize: "0.7rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={isEligible ? "Đủ ĐK" : "Không"}
                        color={isEligible ? "success" : "error"}
                        size="small"
                        onClick={() => handleToggleEligibility(row.id)}
                        sx={{ cursor: "pointer", fontWeight: 700, fontSize: "0.7rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => setNoteDialog({ open: true, id: row.id, note: row.note ?? "" })}
                      >
                        {row.note ? "Sửa" : "Thêm"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {selected.length > 0 && (
        <Alert
          severity="success"
          sx={{ mt: 2 }}
          action={
            <Button size="small" color="inherit">
              Xếp vào HĐ ({selected.length} SV)
            </Button>
          }
        >
          <Typography variant="body2">
            Đã chọn <strong>{selected.length} SV</strong> đủ điều kiện. Bấm "Xếp vào HĐ" để tạo Hội đồng.
          </Typography>
        </Alert>
      )}

      {/* Note dialog */}
      <Dialog open={noteDialog.open} onClose={() => setNoteDialog({ open: false, id: "", note: "" })} maxWidth="sm" fullWidth>
        <DialogTitle> Ghi chú sinh viên</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={noteDialog.note}
            onChange={(e) => setNoteDialog((p) => ({ ...p, note: e.target.value }))}
            placeholder="VD: Đã xin gia hạn 1 tháng, được GV chấp nhận..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialog({ open: false, id: "", note: "" })}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveNote}>Lưu</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
