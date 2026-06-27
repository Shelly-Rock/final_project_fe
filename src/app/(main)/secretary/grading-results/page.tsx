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
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import {
  CheckCircle as PassIcon,
  Cancel as FailIcon,
  Download as ExportIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import * as XLSX from "xlsx";

interface ThesisScore {
  thesisId: string;
  studentName: string;
  mssv: string;
  topicName: string;
  scores: {
    chutich: number | null;
    pth: number | null;
    uv1: number | null;
    uv2: number | null;
    final: number | null;
  };
  status: "pending" | "pass" | "fail";
  submittedCount: number;
  totalMembers: number;
}

const mockScores: ThesisScore[] = [
  {
    thesisId: "t1",
    studentName: "Nguyễn Văn Minh",
    mssv: "CN200101",
    topicName: "Ứng dụng AI trong y tế",
    scores: { chutich: 20, pth: 18, uv1: null, uv2: null, final: null },
    status: "pending",
    submittedCount: 2,
    totalMembers: 4,
  },
  {
    thesisId: "t2",
    studentName: "Trần Thị Lan",
    mssv: "CN200102",
    topicName: "Hệ thống IoT",
    scores: { chutich: 22, pth: 20, uv1: 19, uv2: 21, final: null },
    status: "pass",
    submittedCount: 4,
    totalMembers: 4,
  },
  {
    thesisId: "t3",
    studentName: "Lê Văn Hoàng",
    mssv: "CN200103",
    topicName: "Blockchain",
    scores: { chutich: 5, pth: 6, uv1: 4, uv2: 5, final: null },
    status: "fail",
    submittedCount: 4,
    totalMembers: 4,
  },
  {
    thesisId: "t4",
    studentName: "Phạm Thị Mai",
    mssv: "CN200104",
    topicName: "NLP cho tiếng Việt",
    scores: { chutich: 18, pth: 19, uv1: 17, uv2: 18, final: null },
    status: "pass",
    submittedCount: 4,
    totalMembers: 4,
  },
  {
    thesisId: "t5",
    studentName: "Vũ Văn Long",
    mssv: "CN200105",
    topicName: "Bảo mật 5G",
    scores: { chutich: 12, pth: 14, uv1: 13, uv2: null, final: null },
    status: "pending",
    submittedCount: 3,
    totalMembers: 4,
  },
  {
    thesisId: "t6",
    studentName: "Đặng Thị Hà",
    mssv: "CN200106",
    topicName: "AR/VR trong giáo dục",
    scores: { chutich: 8, pth: 7, uv1: 8, uv2: 6, final: null },
    status: "fail",
    submittedCount: 4,
    totalMembers: 4,
  },
];

function computeStatus(scores: ThesisScore["scores"]): "pass" | "fail" | "pending" {
  const vals = [scores.chutich, scores.pth, scores.uv1, scores.uv2].filter(
    (v): v is number => v !== null
  );
  if (vals.length < 4) return "pending";
  const pass = vals.filter((v) => v >= 10).length;
  return pass >= 3 ? "pass" : "fail";
}

function computeFinal(scores: ThesisScore["scores"]): number | null {
  const vals = [scores.chutich, scores.pth, scores.uv1, scores.uv2].filter(
    (v): v is number => v !== null
  );
  if (vals.length === 0) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10;
}

export default function SecretaryGradingResultsPage() {
  const [scores, setScores] = useState<ThesisScore[]>(mockScores);
  const [viewDialog, setViewDialog] = useState<ThesisScore | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" });

  const passCount = scores.filter((s) => s.status === "pass").length;
  const failCount = scores.filter((s) => s.status === "fail").length;
  const pendingCount = scores.filter((s) => s.status === "pending").length;
  const avgScore = (() => {
    const finals = scores.map((s) => computeFinal(s.scores)).filter((v): v is number => v !== null);
    if (finals.length === 0) return 0;
    return Math.round(finals.reduce((a, b) => a + b, 0) / finals.length * 10) / 10;
  })();

  const handleExport = useCallback(() => {
    const data = scores.map((s, idx) => {
      const final = computeFinal(s.scores);
      const status = computeStatus(s.scores);
      return {
        STT: idx + 1,
        MSSV: s.mssv,
        "Họ tên": s.studentName,
        "Tên đề tài": s.topicName,
        "Chủ tịch": s.scores.chutich ?? "-",
        "Phó CT": s.scores.pth ?? "-",
        "UV1": s.scores.uv1 ?? "-",
        "UV2": s.scores.uv2 ?? "-",
        "Điểm TB": final ?? "-",
        "Đạt/Rớt": status === "pass" ? "ĐẠT" : status === "fail" ? "RỚT" : "Chưa đủ phiếu",
        "Đã gửi": `${s.submittedCount}/${s.totalMembers}`,
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "KetQuaChamDiem");
    XLSX.writeFile(wb, "KetQuaChamDiem_HoiDong.xlsx");
    setSnackbar({ open: true, message: "Đã xuất kết quả chấm điểm!", severity: "success" });
  }, [scores]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Kết quả chấm điểm vòng bảo vệ
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tổng hợp điểm từ Hội đồng. Quy định: ≥ 3/4 phiếu ≥ 10 điểm = ĐẠT, ngược lại = RỚT.
        </Typography>
      </Box>

      {/* Summary */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2, mb: 3 }}>
        {[
          { label: "Tổng đề tài", value: scores.length, color: "primary.main" },
          { label: "Đạt", value: passCount, color: "success.main" },
          { label: "Rớt", value: failCount, color: "error.main" },
          { label: "Chưa đủ phiếu", value: pendingCount, color: "warning.main" },
          { label: "Điểm TB chung", value: avgScore > 0 ? avgScore : "-", color: avgScore > 0 ? "info.main" : "text.secondary" },
        ].map((s) => (
          <Paper key={s.label} variant="outlined" sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: s.color }}>
              {s.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">{s.label}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Rule notice */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="caption">
          <strong>Quy định chấm điểm:</strong> Mỗi thành viên HĐ chấm 0-10 cho mỗi tiêu chí.
          Kết quả: <strong>≥ 3/4 phiếu có điểm ≥ 10 = ĐẠT</strong>, ngược lại = <strong>RỚT</strong>.
          Điểm trung bình chỉ tính khi đủ 4 phiếu.
        </Typography>
      </Alert>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" startIcon={<ExportIcon />} onClick={handleExport}>
          Xuất Excel
        </Button>
      </Box>

      {/* Results table */}
      <Card>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.50" }}>
                <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>MSSV</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Sinh viên</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Đề tài</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>CT</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>PCT</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>UV1</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>UV2</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>�iểm TB</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Kết quả</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Đã gửi</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scores.map((s, idx) => {
                const final = computeFinal(s.scores);
                const status = computeStatus(s.scores);
                const allSubmitted = s.submittedCount === s.totalMembers;
                const statusChip = status === "pass"
                  ? { label: "ĐẠT", color: "success" as const }
                  : status === "fail"
                  ? { label: "RỚT", color: "error" as const }
                  : { label: "Chờ", color: "warning" as const };

                return (
                  <TableRow
                    key={s.thesisId}
                    sx={{
                      "&:nth-of-type(odd)": { bgcolor: "grey.50" },
                      bgcolor: status === "fail" ? "error.50" : status === "pass" ? "success.50" : undefined,
                    }}
                  >
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 700 }}>
                        {s.mssv}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{s.studentName}</TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {s.topicName}
                      </Typography>
                    </TableCell>
                    {(["chutich", "pth", "uv1", "uv2"] as const).map((role) => (
                      <TableCell key={role}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color: s.scores[role] === null
                              ? "text.disabled"
                              : s.scores[role] !== null && s.scores[role] < 10
                              ? "error.main"
                              : "success.main",
                          }}
                        >
                          {s.scores[role] ?? "-"}
                        </Typography>
                      </TableCell>
                    ))}
                    <TableCell>
                      {final !== null ? (
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 900, fontFamily: "monospace", color: final >= 10 ? "success.main" : "error.main" }}
                        >
                          {final}
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusChip.label}
                        color={statusChip.color}
                        size="small"
                        variant="filled"
                        sx={{ fontWeight: 800 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${s.submittedCount}/${s.totalMembers}`}
                        size="small"
                        color={allSubmitted ? "success" : "warning"}
                        variant={allSubmitted ? "filled" : "outlined"}
                        sx={{ fontSize: "0.7rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => setViewDialog(s)}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!viewDialog} onClose={() => setViewDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Kết quả chi tiết</DialogTitle>
        <DialogContent>
          {viewDialog && (
            <Box>
              <Alert severity={viewDialog.status === "pass" ? "success" : viewDialog.status === "fail" ? "error" : "warning"} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {viewDialog.studentName} — {viewDialog.topicName}
                </Typography>
              </Alert>

              <Table size="small">
                <TableBody>
                  {(["chutich", "pth", "uv1", "uv2"] as const).map((role) => {
                    const labels = { chutich: "Chủ tịch", pth: "Phó CT", uv1: "UV1", uv2: "UV2" };
                    const score = viewDialog.scores[role];
                    return (
                      <TableRow key={role}>
                        <TableCell sx={{ fontWeight: 700 }}>{labels[role]}</TableCell>
                        <TableCell>
                          {score !== null ? (
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 900, fontFamily: "monospace", color: score < 10 ? "error.main" : "success.main" }}
                            >
                              {score}/10
                            </Typography>
                          ) : (
                            <Typography variant="caption" color="text.secondary">Chưa gửi</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {score !== null && (
                            <Chip
                              label={score >= 10 ? "Đạt" : "Rớt"}
                              size="small"
                              color={score >= 10 ? "success" : "error"}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow sx={{ bgcolor: "grey.100" }}>
                    <TableCell sx={{ fontWeight: 900 }}>Điểm trung bình</TableCell>
                    <TableCell colSpan={2}>
                      {computeFinal(viewDialog.scores) !== null ? (
                        <Typography variant="body2" sx={{ fontWeight: 900 }}>
                          {computeFinal(viewDialog.scores)}/10
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="text.secondary">Chưa đủ phiếu</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900 }}>Kết quả</TableCell>
                    <TableCell colSpan={2}>
                      <Chip
                        label={viewDialog.status === "pass" ? "ĐẠT" : viewDialog.status === "fail" ? "RỚT" : "Chưa đủ phiếu"}
                        color={viewDialog.status === "pass" ? "success" : viewDialog.status === "fail" ? "error" : "warning"}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(null)}>Đóng</Button>
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
