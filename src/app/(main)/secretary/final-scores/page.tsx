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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Grid,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Download as ExportIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CheckCircle as ConfirmIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { WeightedScoreFormula } from "@/shared/components/WeightedScoreFormula";
import { ThreeColumnFeedback } from "@/shared/components/ThreeColumnFeedback";

interface ThesisRow {
  id: string;
  mssv: string;
  studentName: string;
  topicName: string;
  gvhdScore: number;
  gvhdFeedback: string;
  pbNgoaiScore: number;
  pbNgoaiFeedback: string;
  councilScores: {
    chutich: number;
    thuky: number;
    pbTrong: number;
  };
  hoiDongAvg: number; // average of 3 council members
  bonusScore: number; // 0-3, entered by secretary
  finalScore: number;
  grade: string;
  confirmed: boolean;
}

const mockTheses: ThesisRow[] = [
  {
    id: "t1",
    mssv: "CN200101",
    studentName: "Nguyễn Văn Minh",
    topicName: "Ứng dụng AI trong y tế",
    gvhdScore: 85,
    gvhdFeedback: "Luận văn có nội dung tốt, phương pháp rõ ràng.",
    pbNgoaiScore: 82,
    pbNgoaiFeedback: "Kết quả có tính ứng dụng thực tiễn cao.",
    councilScores: { chutich: 81, thuky: 79, pbTrong: 80 },
    hoiDongAvg: 80,
    bonusScore: 0,
    finalScore: 82,
    grade: "B",
    confirmed: true,
  },
  {
    id: "t2",
    mssv: "CN200102",
    studentName: "Trần Thị Lan",
    topicName: "Hệ thống IoT",
    gvhdScore: 78,
    gvhdFeedback: "Bài làm đầy đủ, có cải thiện so với bản draft.",
    pbNgoaiScore: 80,
    pbNgoaiFeedback: "Hệ thống hoạt động ổn định, có khả năng triển khai.",
    councilScores: { chutich: 76, thuky: 77, pbTrong: 75 },
    hoiDongAvg: 76,
    bonusScore: 1,
    finalScore: 77.6,
    grade: "C",
    confirmed: false,
  },
  {
    id: "t3",
    mssv: "CN200103",
    studentName: "Lê Văn Hoàng",
    topicName: "Blockchain",
    gvhdScore: 58,
    gvhdFeedback: "Nội dung còn sơ lược, cần bổ sung thêm thực nghiệm.",
    pbNgoaiScore: 55,
    pbNgoaiFeedback: "Kết quả hạn chế, chưa có đóng góp mới.",
    councilScores: { chutich: 50, thuky: 52, pbTrong: 48 },
    hoiDongAvg: 50,
    bonusScore: 0,
    finalScore: 54.2,
    grade: "D",
    confirmed: true,
  },
  {
    id: "t4",
    mssv: "CN200104",
    studentName: "Phạm Thị Mai",
    topicName: "NLP cho tiếng Việt",
    gvhdScore: 90,
    gvhdFeedback: "Xuất sắc, có bài báo khoa học.",
    pbNgoaiScore: 88,
    pbNgoaiFeedback: "Kết quả ấn tượng, có triển vọng ứng dụng lớn.",
    councilScores: { chutich: 87, thuky: 89, pbTrong: 88 },
    hoiDongAvg: 88,
    bonusScore: 3,
    finalScore: 89.2,
    grade: "A",
    confirmed: true,
  },
  {
    id: "t5",
    mssv: "CN200105",
    studentName: "Vũ Văn Long",
    topicName: "Bảo mật 5G",
    gvhdScore: 72,
    gvhdFeedback: "Bài hoàn thành đúng yêu cầu.",
    pbNgoaiScore: 70,
    pbNgoaiFeedback: "Phương pháp phù hợp, kết quả chấp nhận được.",
    councilScores: { chutich: 68, thuky: 69, pbTrong: 70 },
    hoiDongAvg: 69,
    bonusScore: 0,
    finalScore: 70.4,
    grade: "C",
    confirmed: false,
  },
  {
    id: "t6",
    mssv: "CN200106",
    studentName: "Đặng Thị Hà",
    topicName: "AR/VR trong giáo dục",
    gvhdScore: 40,
    gvhdFeedback: "Nội dung thiếu sót nghiêm trọng, không đạt yêu cầu.",
    pbNgoaiScore: 38,
    pbNgoaiFeedback: "Kết quả không có giá trị thực tiễn.",
    councilScores: { chutich: 35, thuky: 36, pbTrong: 34 },
    hoiDongAvg: 35,
    bonusScore: 0,
    finalScore: 37.8,
    grade: "F",
    confirmed: true,
  },
];

function computeFinalScore(gvhd: number, pbNgoai: number, hoiDongAvg: number, bonus: number): number {
  return Math.min(100, Math.max(0, gvhd * 0.4 + pbNgoai * 0.2 + hoiDongAvg * 0.4 + bonus));
}

function computeGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 50) return "D";
  return "F";
}

function gradeColor(grade: string): "success" | "info" | "primary" | "warning" | "error" {
  const map: Record<string, "success" | "info" | "primary" | "warning" | "error"> = {
    A: "success", B: "info", C: "primary", D: "warning", F: "error",
  };
  return map[grade] ?? "default";
}

export default function SecretaryFinalScoresPage() {
  const [theses, setTheses] = useState<ThesisRow[]>(mockTheses);
  const [editingBonus, setEditingBonus] = useState<{ id: string; value: number } | null>(null);
  const [viewDialog, setViewDialog] = useState<ThesisRow | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" });

  const passCount = theses.filter((t) => t.finalScore >= 50).length;
  const failCount = theses.filter((t) => t.finalScore < 50).length;
  const avgScore = theses.length > 0
    ? Math.round((theses.reduce((s, t) => s + t.finalScore, 0) / theses.length) * 10) / 10
    : 0;

  const handleBonusChange = useCallback((id: string, bonus: number) => {
    const clamped = Math.min(3, Math.max(0, bonus));
    setTheses((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const hoiDongAvg = Math.round((t.councilScores.chutich + t.councilScores.thuky + t.councilScores.pbTrong) / 3);
        const finalScore = computeFinalScore(t.gvhdScore, t.pbNgoaiScore, hoiDongAvg, clamped);
        const grade = computeGrade(finalScore);
        return { ...t, bonusScore: clamped, finalScore, grade };
      })
    );
    setEditingBonus(null);
    setSnackbar({ open: true, message: "Đã cập nhật điểm cộng!", severity: "success" });
  }, []);

  const handleExportExcel = useCallback(() => {
    const data = theses.map((t, idx) => ({
      STT: idx + 1,
      MSSV: t.mssv,
      "Họ tên": t.studentName,
      "Tên đề tài": t.topicName,
      "GVHD (40%)": t.gvhdScore,
      "PB ngoài (20%)": t.pbNgoaiScore,
      "HĐ CT": t.councilScores.chutich,
      "HĐ TK": t.councilScores.thuky,
      "HĐ PB trong": t.councilScores.pbTrong,
      "Trung bình HĐ": t.hoiDongAvg,
      "Điểm cộng": t.bonusScore,
      "Điểm tổng": t.finalScore.toFixed(2),
      "Xếp loại": t.grade,
      "Đạt/Rớt": t.finalScore >= 50 ? "ĐẠT" : "RỚT",
      "Đã duyệt": t.confirmed ? "Rồi" : "Chưa",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DiemTong");
    XLSX.writeFile(wb, "BangDiemTong_Khoa.xlsx");
    setSnackbar({ open: true, message: "Đã xuất bảng điểm Excel!", severity: "success" });
  }, [theses]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Bảng điểm tổng hợp
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tính điểm: GVHD × 40% + PB ngoài × 20% + HĐ × 40% + Điểm cộng (max 3).
        </Typography>
      </Box>

      {/* Formula explanation */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          Công thức tính:
        </Typography>
        <Typography variant="caption" sx={{ display: "block", fontFamily: "monospace" }}>
          Điểm = GVHD × 0.4 + PB ngoài × 0.2 + HĐ × 0.4 + Điểm cộng (max 3)
        </Typography>
        <Typography variant="caption" color="text.secondary">
          HĐ = trung bình (Chủ tịch + Thư ký + PB trong). Đạt ≥ 50/100.
        </Typography>
      </Alert>

      {/* Summary */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, mb: 3 }}>
        {[
          { label: "Tổng SV", value: theses.length, color: "primary.main" },
          { label: "Đạt", value: passCount, color: "success.main" },
          { label: "Rớt", value: failCount, color: "error.main" },
          { label: "Điểm TB", value: avgScore > 0 ? avgScore : "-", color: "info.main" },
        ].map((s) => (
          <Paper key={s.label} variant="outlined" sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: s.color }}>{s.value}</Typography>
            <Typography variant="caption" color="text.secondary">{s.label}</Typography>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" startIcon={<ExportIcon />} onClick={handleExportExcel}>
          Xuất Excel
        </Button>
      </Box>

      {/* Table */}
      <Card>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.50" }}>
                <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>MSSV</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Sinh viên</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Đề tài</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">GVHD (40%)</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">PB ngoài (20%)</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">HĐ TB (40%)</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Cộng</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Tổng</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Loại</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {theses.map((t, idx) => (
                <TableRow
                  key={t.id}
                  sx={{
                    "&:nth-of-type(odd)": { bgcolor: "grey.50" },
                    bgcolor: t.finalScore < 50 ? "error.50" : undefined,
                  }}
                >
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 700 }}>
                      {t.mssv}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, maxWidth: 150 }}>
                    <Typography variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {t.studentName}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 180 }}>
                    <Typography variant="caption" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                      {t.topicName}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 700 }}>
                      {t.gvhdScore}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 700 }}>
                      {t.pbNgoaiScore}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 700, color: "warning.main" }}>
                      {t.hoiDongAvg}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {editingBonus?.id === t.id ? (
                      <TextField
                        type="number"
                        size="small"
                        defaultValue={t.bonusScore}
                        inputProps={{ min: 0, max: 3, step: 0.5 }}
                        sx={{ width: 60 }}
                        autoFocus
                        onBlur={(e) => handleBonusChange(t.id, Number(e.target.value))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleBonusChange(t.id, Number((e.target as HTMLInputElement).value));
                          if (e.key === "Escape") setEditingBonus(null);
                        }}
                      />
                    ) : (
                      <Tooltip title="Click để sửa điểm cộng">
                        <Chip
                          label={`+${t.bonusScore}`}
                          size="small"
                          color={t.bonusScore > 0 ? "success" : "default"}
                          variant={t.bonusScore > 0 ? "filled" : "outlined"}
                          onClick={() => setEditingBonus({ id: t.id, value: t.bonusScore })}
                          sx={{ fontWeight: 900, cursor: "pointer", minWidth: 36 }}
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 900 }}>
                    <WeightedScoreFormula
                      gvhdScore={t.gvhdScore}
                      pbNgoaiScore={t.pbNgoaiScore}
                      hoiDongAvg={t.hoiDongAvg}
                      bonusScore={t.bonusScore}
                      compact
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={t.grade}
                      color={gradeColor(t.grade)}
                      size="small"
                      sx={{ fontWeight: 900, minWidth: 32 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => setViewDialog(t)}
                    >
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!viewDialog} onClose={() => setViewDialog(null)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết điểm — {viewDialog?.studentName}</DialogTitle>
        <DialogContent>
          {viewDialog && (
            <Box>
              <Alert severity={viewDialog.finalScore >= 50 ? "success" : "error"} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {viewDialog.finalScore >= 50 ? "ĐẠT" : "RỚT"} — {viewDialog.finalScore.toFixed(2)}/100 — Xếp loại: {viewDialog.grade}
                </Typography>
              </Alert>

              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <WeightedScoreFormula
                    gvhdScore={viewDialog.gvhdScore}
                    pbNgoaiScore={viewDialog.pbNgoaiScore}
                    hoiDongAvg={viewDialog.hoiDongAvg}
                    bonusScore={viewDialog.bonusScore}
                  />
                </Grid>
                <Grid item xs={12} md={7}>
                  <ThreeColumnFeedback
                    columns={[
                      {
                        role: "gvhd",
                        roleLabel: "GVHD",
                        feedback: viewDialog.gvhdFeedback,
                        score: viewDialog.gvhdScore,
                      },
                      {
                        role: "pbNgoai",
                        roleLabel: "PB ngoài",
                        feedback: viewDialog.pbNgoaiFeedback,
                        score: viewDialog.pbNgoaiScore,
                      },
                      {
                        role: "chutich",
                        roleLabel: "HĐ (trung bình)",
                        feedback: `CT: ${viewDialog.councilScores.chutich}, TK: ${viewDialog.councilScores.thuky}, PB: ${viewDialog.councilScores.pbTrong}`,
                        score: viewDialog.hoiDongAvg,
                      },
                    ]}
                    showScores
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(null)}>Đóng</Button>
          {viewDialog && (
            <Button
              variant="contained"
              color="success"
              startIcon={<ConfirmIcon />}
              onClick={() => {
                setTheses((prev) =>
                  prev.map((t) => t.id === viewDialog.id ? { ...t, confirmed: true } : t)
                );
                setViewDialog(null);
                setSnackbar({ open: true, message: "Đã duyệt kết quả!", severity: "success" });
              }}
              disabled={viewDialog.confirmed}
            >
              {viewDialog.confirmed ? "Đã duyệt" : "Duyệt kết quả"}
            </Button>
          )}
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
