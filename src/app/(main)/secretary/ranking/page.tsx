"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Snackbar,
  Paper,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Download as ExportIcon,
  Print as PrintIcon,
  Edit as EditIcon,
  BarChart as ChartIcon,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { RankingTable, type RankedStudent } from "@/shared/components/RankingTable";

const mockStudents: RankedStudent[] = [
  { id: "t1", mssv: "CN200101", studentName: "Nguyễn Văn Minh", topicName: "Ứng dụng AI trong y tế", finalScore: 89.2, grade: "A", status: "pass", overrideRank: 1, overrideNote: "Có bài báo khoa học" },
  { id: "t4", mssv: "CN200104", studentName: "Phạm Thị Mai", topicName: "NLP cho tiếng Việt", finalScore: 89.2, grade: "A", status: "pass", overrideRank: null, overrideNote: undefined },
  { id: "t2", mssv: "CN200102", studentName: "Trần Thị Lan", topicName: "Hệ thống IoT", finalScore: 77.6, grade: "C", status: "pass", overrideRank: null },
  { id: "t5", mssv: "CN200105", studentName: "Vũ Văn Long", topicName: "Bảo mật 5G", finalScore: 70.4, grade: "C", status: "pass", overrideRank: null },
  { id: "t3", mssv: "CN200103", studentName: "Lê Văn Hoàng", topicName: "Blockchain", finalScore: 54.2, grade: "D", status: "pass", overrideRank: null },
  { id: "t6", mssv: "CN200106", studentName: "Đặng Thị Hà", topicName: "AR/VR trong giáo dục", finalScore: 37.8, grade: "F", status: "fail", overrideRank: null },
];

function gradeLabel(grade: string): string {
  return { A: "Xuất sắc", B: "Tốt", C: "Khá", D: "Trung bình", F: "Yếu" }[grade] ?? grade;
}

export default function SecretaryRankingPage() {
  const [students, setStudents] = useState<RankedStudent[]>(mockStudents);
  const [sortField, setSortField] = useState<keyof RankedStudent>("finalScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" });
  const [printDialog, setPrintDialog] = useState(false);

  const handleSort = useCallback((field: keyof RankedStudent) => {
    if (sortField === field) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }, [sortField]);

  const handleRankOverride = useCallback((id: string, newRank: number, note: string) => {
    setStudents((prev) =>
      prev.map((s) => s.id === id ? { ...s, overrideRank: newRank, overrideNote: note || undefined } : s)
    );
    setSnackbar({ open: true, message: `Đã cập nhật thứ hạng #${newRank}`, severity: "success" });
  }, []);

  const handleExportExcel = useCallback(() => {
    const sorted = [...students].sort((a, b) => {
      const rankA = a.overrideRank ?? 0;
      const rankB = b.overrideRank ?? 0;
      if (rankA && rankB) return rankA - rankB;
      return b.finalScore - a.finalScore;
    });

    const data = sorted.map((s, idx) => {
      const rank = s.overrideRank ?? idx + 1;
      return {
        "Thứ hạng": rank,
        "MSSV": s.mssv,
        "Họ tên": s.studentName,
        "Tên đề tài": s.topicName,
        "Điểm TB": s.finalScore.toFixed(2),
        "Xếp loại": s.grade,
        "Đạt/Rớt": s.status === "pass" ? "ĐẠT" : "RỚT",
        "Ghi chú override": s.overrideNote ?? "",
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "XepHang");
    XLSX.writeFile(wb, "BangXepHang_Khoa.xlsx");
    setSnackbar({ open: true, message: "Đã xuất xếp hạng Excel!", severity: "success" });
  }, [students]);

  const handlePrintPDF = useCallback(() => {
    setPrintDialog(true);
  }, []);

  const handleConfirmPrint = useCallback(() => {
    setPrintDialog(false);
    // In production: call print API or use jsPDF to generate PDF
    window.print();
    setSnackbar({ open: true, message: "Đã mở hộp thoại in!", severity: "success" });
  }, []);

  const gradeDist = students.reduce((acc, s) => {
    acc[s.grade] = (acc[s.grade] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const passCount = students.filter((s) => s.status === "pass").length;
  const avgScore = students.length > 0
    ? Math.round((students.reduce((a, s) => a + s.finalScore, 0) / students.length) * 10) / 10
    : 0;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Xếp hạng tốt nghiệp
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sắp xếp sinh viên theo điểm tổng. Override thứ hạng khi có điểm bằng nhau hoặc lý do đặc biệt.
          In biểu mẫu chính thức sau khi xếp hạng xong.
        </Typography>
      </Box>

      {/* Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="caption">
          <strong>Nguyên tắc xếp hạng:</strong> Thứ hạng tự động theo điểm tổng giảm dần.
          Khi điểm bằng nhau, Thư ký có thể override. Thứ hạng chỉ áp dụng cho sinh viên ĐẠT.
        </Typography>
      </Alert>

      {/* Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "primary.main" }}>{students.length}</Typography>
            <Typography variant="caption" color="text.secondary">Tổng SV</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "success.main" }}>{passCount}</Typography>
            <Typography variant="caption" color="text.secondary">Đạt</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "info.main" }}>{avgScore}</Typography>
            <Typography variant="caption" color="text.secondary">Điểm TB</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
            <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center", flexWrap: "wrap" }}>
              {["A", "B", "C", "D", "F"].map((g) => (
                <Chip
                  key={g}
                  label={`${g}: ${gradeDist[g] ?? 0}`}
                  size="small"
                  color={{ A: "success", B: "info", C: "primary", D: "warning", F: "error" }[g] as any}
                  sx={{ fontSize: "0.6rem", fontWeight: 700 }}
                />
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary">Phân bố loại</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <Button variant="contained" startIcon={<ExportIcon />} onClick={handleExportExcel}>
          Xuất Excel
        </Button>
        <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrintPDF}>
          In biểu mẫu
        </Button>
        <Box sx={{ flex: 1 }} />
        <Chip
          icon={<ChartIcon sx={{ fontSize: "16px !important" }} />}
          label={`Sort: ${sortField} ${sortDir === "desc" ? "↓" : "↑"}`}
          size="small"
          variant="outlined"
          sx={{ fontFamily: "monospace" }}
        />
      </Box>

      {/* Ranking table */}
      <RankingTable
        students={students}
        onRankOverride={handleRankOverride}
        onSortBy={handleSort}
        sortField={sortField}
        sortDirection={sortDir}
      />

      {/* Print dialog */}
      <Dialog open={printDialog} onClose={() => setPrintDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>In biểu mẫu xếp hạng</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="caption">
              Chọn định dạng in. File sẽ được mở trong hộp thoại in của trình duyệt.
              Đảm bảo máy in đã được kết nối.
            </Typography>
          </Alert>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {[
              { label: "In PDF (khuyến nghị)", desc: "Xuất file PDF chất lượng cao", icon: "📄" },
              { label: "In Word", desc: "Mở file .docx để chỉnh sửa thêm", icon: "📝" },
              { label: "In trực tiếp", desc: "Gửi thẳng đến máy in mặc định", icon: "🖨️" },
            ].map(({ label, desc }) => (
              <Paper
                key={label}
                variant="outlined"
                sx={{ p: 1.5, cursor: "pointer", "&:hover": { borderColor: "primary.main", bgcolor: "primary.50" } }}
                onClick={handleConfirmPrint}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{label}</Typography>
                <Typography variant="caption" color="text.secondary">{desc}</Typography>
              </Paper>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrintDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleConfirmPrint} startIcon={<PrintIcon />}>
            Tiếp tục in
          </Button>
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
