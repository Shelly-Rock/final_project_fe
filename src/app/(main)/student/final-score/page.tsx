"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  Divider,
  Paper,
  Snackbar,
  Chip,
} from "@mui/material";
import {
  Download as ExportIcon,
  CheckCircle as PassIcon,
  Cancel as FailIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { ThreeColumnFeedback } from "@/shared/components/ThreeColumnFeedback";
import { WeightedScoreFormula } from "@/shared/components/WeightedScoreFormula";

interface ThesisScore {
  id: string;
  mssv: string;
  studentName: string;
  topicName: string;
  defenseDate: string;
  councilName: string;
  councilRoom: string;
  gvhdScore: number;
  gvhdFeedback: string;
  pbNgoaiScore: number;
  pbNgoaiFeedback: string;
  hoiDongAvg: number;
  bonusScore: number;
  finalScore: number;
  grade: string;
  status: "pass" | "fail";
  announcedAt?: string;
}

const mockThesis: ThesisScore = {
  id: "t1",
  mssv: "CN200101",
  studentName: "Nguyễn Văn Minh",
  topicName: "Ứng dụng AI trong y tế — Hệ thống chẩn đoán ung thư phổi",
  defenseDate: "2026-12-10",
  councilName: "Hội đồng A",
  councilRoom: "P.301",
  gvhdScore: 85,
  gvhdFeedback: "Luận văn có nội dung tốt, phương pháp rõ ràng, kết quả có tính ứng dụng thực tiễn cao.",
  pbNgoaiScore: 82,
  pbNgoaiFeedback: "Kết quả có ý nghĩa khoa học, có khả năng triển khai thực tế.",
  hoiDongAvg: 80,
  bonusScore: 0,
  finalScore: 82,
  grade: "B",
  status: "pass",
  announcedAt: "2026-12-15",
};

function gradeLabel(grade: string): string {
  const map: Record<string, string> = { A: "Xuất sắc", B: "Tốt", C: "Khá", D: "Trung bình", F: "Yếu" };
  return map[grade] ?? grade;
}

function gradeColor(grade: string): "success" | "info" | "primary" | "warning" | "error" {
  const map: Record<string, "success" | "info" | "primary" | "warning" | "error"> = {
    A: "success", B: "info", C: "primary", D: "warning", F: "error",
  };
  return map[grade] ?? "default";
}

export default function StudentFinalScorePage() {
  const [thesis] = useState<ThesisScore>(mockThesis);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const isPass = thesis.status === "pass";

  const handleExport = useCallback(() => {
    const data = [{
      "MSSV": thesis.mssv,
      "Họ tên": thesis.studentName,
      "Tên đề tài": thesis.topicName,
      "Ngày bảo vệ": new Date(thesis.defenseDate).toLocaleDateString("vi-VN"),
      "Hội đồng": thesis.councilName,
      "Phòng": thesis.councilRoom,
      "Điểm tổng (thang 100)": thesis.finalScore.toFixed(2),
      "Xếp loại": thesis.grade,
      "Kết quả": isPass ? "ĐẠT" : "RỚT",
      "Điểm GVHD": thesis.gvhdScore,
      "Điểm PB ngoài": thesis.pbNgoaiScore,
      "Điểm Hội đồng": thesis.hoiDongAvg,
      "Điểm cộng": thesis.bonusScore,
    }];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DiemSV");
    XLSX.writeFile(wb, `Diem_${thesis.mssv}_${thesis.studentName.replace(/\s+/g, "_")}.xlsx`);
    setSnackbar({ open: true, message: "Đã xuất phiếu điểm!" });
  }, [thesis, isPass]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Kết quả bảo vệ luận văn
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Kết quả chính thức từ Hội đồng bảo vệ. Thông tin chi tiết từng người chấm không được hiển thị.
        </Typography>
      </Box>

      {/* Pass/Fail hero banner */}
      <Paper
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 3,
          textAlign: "center",
          bgcolor: isPass ? "success.50" : "error.50",
          border: "3px solid",
          borderColor: isPass ? "success.main" : "error.main",
        }}
      >
        {isPass ? (
          <PassIcon sx={{ fontSize: 64, color: "success.main", mb: 1 }} />
        ) : (
          <FailIcon sx={{ fontSize: 64, color: "error.main", mb: 1 }} />
        )}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            color: isPass ? "success.main" : "error.main",
            mb: 0.5,
          }}
        >
          {isPass ? "ĐẠT" : "RỚT"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isPass
            ? "Chúc mừng bạn đã hoàn thành luận văn tốt nghiệp!"
            : "Rất tiếc, bạn chưa đạt yêu cầu. Vui lòng liên hệ GVHD để được hướng dẫn."}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Left: Main score card */}
        <Grid item xs={12} md={5}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Thông tin luận văn
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {[
                  { label: "MSSV", value: thesis.mssv },
                  { label: "Họ tên", value: thesis.studentName },
                  { label: "Đề tài", value: thesis.topicName },
                  { label: "Ngày bảo vệ", value: new Date(thesis.defenseDate).toLocaleDateString("vi-VN") },
                  { label: "Hội đồng", value: `${thesis.councilName} — ${thesis.councilRoom}` },
                  { label: "Thông báo lúc", value: thesis.announcedAt ? new Date(thesis.announcedAt).toLocaleDateString("vi-VN") : "Chưa công bố" },
                ].map(({ label, value }) => (
                  <Box key={label} sx={{ display: "flex", gap: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 110 }}>
                      {label}:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Score summary */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Điểm tổng hợp
              </Typography>
              <WeightedScoreFormula
                gvhdScore={thesis.gvhdScore}
                pbNgoaiScore={thesis.pbNgoaiScore}
                hoiDongAvg={thesis.hoiDongAvg}
                bonusScore={thesis.bonusScore}
              />
            </CardContent>
          </Card>

          {/* Grade card */}
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Xếp loại
              </Typography>
              <Chip
                label={thesis.grade}
                color={gradeColor(thesis.grade)}
                sx={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  height: 80,
                  width: 80,
                  borderRadius: "50%",
                  display: "inline-flex",
                  mb: 1,
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {gradeLabel(thesis.grade)}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="caption" color="text.secondary">
                Công thức: GVHD×40% + PB×20% + HĐ×40% + Cộng
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Feedback */}
        <Grid item xs={12} md={7}>
          <ThreeColumnFeedback
            columns={[
              {
                role: "gvhd",
                roleLabel: "Nhận xét của GVHD",
                feedback: thesis.gvhdFeedback,
                score: thesis.gvhdScore,
              },
              {
                role: "pbNgoai",
                roleLabel: "Nhận xét của Phản biện ngoài",
                feedback: thesis.pbNgoaiFeedback,
                score: thesis.pbNgoaiScore,
              },
              {
                role: "chutich",
                roleLabel: "Nhận xét chung của HĐ",
                feedback: `Hội đồng đã họp và thống nhất kết quả. Điểm HĐ trung bình: ${thesis.hoiDongAvg}/100. Chúc mừng bạn đã hoàn thành luận văn.`,
                score: thesis.hoiDongAvg,
              },
            ]}
            title="Nhận xét từ Hội đồng bảo vệ"
            showScores
            readonly
          />

          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="caption">
              <strong>Lưu ý:</strong> Điểm chi tiết của từng thành viên HĐ (Chủ tịch, Thư ký, UV) không được công khai cho sinh viên. Nếu bạn có thắc mắc, vui lòng liên hệ Thư ký khoa.
            </Typography>
          </Alert>

          {/* Export button */}
          <Box sx={{ mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={<ExportIcon />}
              onClick={handleExport}
              size="large"
            >
              Tải phiếu điểm (Excel)
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 1 }}>
              File Excel chỉ chứa điểm tổng và xếp loại. Không gồm điểm chi tiết từng người.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
