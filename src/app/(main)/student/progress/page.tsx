"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  IconButton,
  Collapse,
  Divider,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  AccessTime as TimeIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Cancel as CancelIcon,
  Description as FileIcon,
} from "@mui/icons-material";
import { DeadlineCountdownBanner } from "@/shared/components/DeadlineCountdownBanner";

const BAN_THRESHOLD = 2;
const SUBMISSION_DEADLINE = new Date("2026-11-15");

interface MonthCard {
  month: number;
  label: string;
  status: "submitted" | "pending" | "late" | "missing";
  submittedAt?: string;
  fileName?: string;
  teacherComment?: string;
  approved?: boolean;
  isCurrent?: boolean;
}

const mockMonths: MonthCard[] = [
  { month: 1, label: "Tháng 1 — Khảo sát & Đề cương", status: "submitted", submittedAt: "2026-02-15", fileName: "BaoCao_Thang1_Minh.pdf", teacherComment: "Đạt yêu cầu.", approved: true },
  { month: 2, label: "Tháng 2 — Thiết kế hệ thống", status: "submitted", submittedAt: "2026-03-14", fileName: "BaoCao_Thang2_Minh.pdf", teacherComment: "Cần bổ sung biểu đồ UML.", approved: true },
  { month: 3, label: "Tháng 3 — Cài đặt prototype", status: "submitted", submittedAt: "2026-04-12", fileName: "BaoCao_Thang3_Minh.pdf", teacherComment: "Prototype hoạt động tốt.", approved: true },
  { month: 4, label: "Tháng 4 — Thu thập dữ liệu", status: "late", submittedAt: "2026-05-20", fileName: "BaoCao_Thang4_Minh.pdf", teacherComment: "Nộp trễ 5 ngày. Đã chấp nhận.", approved: true },
  { month: 5, label: "Tháng 5 — Huấn luyện mô hình AI", status: "missing", isCurrent: true },
  { month: 6, label: "Tháng 6 — Đánh giá kết quả", status: "pending" },
  { month: 7, label: "Tháng 7 — Viết luận văn", status: "pending" },
  { month: 8, label: "Tháng 8 — Hoàn thiện & Bảo vệ", status: "pending" },
];

export default function StudentProgressPage() {
  const [months] = useState<MonthCard[]>(mockMonths);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 5: true });
  const [uploadDialog, setUploadDialog] = useState<{ open: boolean; month: number | null }>({
    open: false,
    month: null,
  });
  const [uploadNote, setUploadNote] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submittedFiles, setSubmittedFiles] = useState<Record<number, string>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" });

  const now = new Date();
  const currentMonth = 5;
  const missingConsecutive = (() => {
    let count = 0;
    for (let i = months.length - 1; i >= 0; i--) {
      if (months[i].status === "missing") count++;
      else break;
    }
    return count;
  })();

  const isBanned = missingConsecutive >= BAN_THRESHOLD;
  const onTimeRate = (() => {
    const submitted = months.filter((m) => m.status === "submitted").length;
    return Math.round((submitted / (currentMonth - 1)) * 100);
  })();

  const handleOpenUpload = useCallback((month: number) => {
    setUploadDialog({ open: true, month });
    setUploadNote("");
  }, []);

  const handleSubmitReport = useCallback(async () => {
    if (!uploadDialog.month) return;
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmittedFiles((prev) => ({
      ...prev,
      [uploadDialog.month!]: `BaoCao_Thang${uploadDialog.month}_Minh.pdf`,
    }));
    setUploadDialog({ open: false, month: null });
    setUploading(false);
    setSnackbar({ open: true, message: "Nộp báo cáo thành công!", severity: "success" });
  }, [uploadDialog.month]);

  const toggleExpand = useCallback((month: number) => {
    setExpanded((prev) => ({ ...prev, [month]: !prev[month] }));
  }, []);

  const statusConfig: Record<string, { label: string; color: "success" | "warning" | "error" | "default"; bg: string; icon: React.ReactElement }> = {
    submitted: { label: "Đã nộp", color: "success", bg: "success.50", icon: <SuccessIcon fontSize="small" /> },
    late: { label: "Nộp trễ", color: "warning", bg: "warning.50", icon: <TimeIcon fontSize="small" /> },
    pending: { label: "Chưa đến hạn", color: "default", bg: "grey.50", icon: <TimeIcon fontSize="small" /> },
    missing: { label: "Chưa nộp", color: "error", bg: "error.50", icon: <WarningIcon fontSize="small" /> },
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Tiến độ luận văn
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Theo dõi và nộp báo cáo tiến độ hàng tháng
        </Typography>
      </Box>

      {/* Deadline */}
      <Box sx={{ mb: 3, maxWidth: 500 }}>
        <DeadlineCountdownBanner deadline={SUBMISSION_DEADLINE} />
      </Box>

      {/* Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Tháng hiện tại", value: `Tháng ${currentMonth}`, color: "primary.main" },
          { label: "Đã nộp", value: months.filter((m) => m.status === "submitted" || m.status === "late").length, color: "success.main" },
          { label: "Tỷ lệ đúng hạn", value: `${onTimeRate}%`, color: onTimeRate >= 80 ? "success.main" : "warning.main" },
          { label: "Tháng trễ", value: months.filter((m) => m.status === "late").length, color: "warning.main" },
        ].map((stat) => (
          <Grid item xs={6} sm={3} key={stat.label}>
            <Card>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Ban warning */}
      {isBanned && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          icon={<CancelIcon />}
          action={
            <Button size="small" color="inherit">
              Liên hệ GVHD
            </Button>
          }
        >
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Cảnh báo cấm thi!
          </Typography>
          <Typography variant="caption">
            Bạn đã không nộp báo cáo {missingConsecutive} tháng liên tiếp. Theo quy định, bạn có thể bị cấm thi.
            Vui lòng nộp báo cáo ngay hoặc liên hệ GVHD để xin gia hạn.
          </Typography>
        </Alert>
      )}

      {/* Missing warning */}
      {!isBanned && missingConsecutive > 0 && (
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          icon={<WarningIcon />}
          action={
            <Button size="small" color="inherit" onClick={() => handleOpenUpload(currentMonth)}>
              Nộp ngay
            </Button>
          }
        >
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Bạn đang trễ {missingConsecutive} tháng!
          </Typography>
          <Typography variant="caption">
            Hãy nộp báo cáo ngay để tránh bị cấm thi (quy định: {BAN_THRESHOLD} tháng trễ liên tiếp).
          </Typography>
        </Alert>
      )}

      {/* Month cards */}
      <Grid container spacing={2}>
        {months.map((month) => {
          const cfg = statusConfig[month.status];
          const isExpanded = expanded[month.month] ?? false;
          const canSubmit = month.status === "missing" || month.status === "pending" || month.isCurrent;

          return (
            <Grid item xs={12} md={6} lg={4} key={month.month}>
              <Card
                sx={{
                  border: "2px solid",
                  borderColor: month.isCurrent ? "primary.main" : cfg.color === "error" ? "error.main" : "divider",
                  bgcolor: cfg.bg,
                  borderRadius: 2,
                  opacity: cfg.color === "default" ? 0.7 : 1,
                }}
              >
                <CardContent sx={{ pb: "16px !important" }}>
                  {/* Header */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {month.label}
                        </Typography>
                        {month.isCurrent && (
                          <Chip label="Hiện tại" size="small" color="primary" sx={{ fontSize: "0.6rem", height: 18 }} />
                        )}
                      </Box>
                      <Chip
                        icon={cfg.icon}
                        label={cfg.label}
                        color={cfg.color as "success" | "warning" | "error" | "default"}
                        size="small"
                        variant="filled"
                        sx={{ fontWeight: 700, fontSize: "0.7rem" }}
                      />
                    </Box>

                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      {canSubmit && (
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          startIcon={<UploadIcon />}
                          onClick={() => handleOpenUpload(month.month)}
                          sx={{ fontSize: "0.7rem", whiteSpace: "nowrap" }}
                        >
                          Nộp report
                        </Button>
                      )}
                      <IconButton size="small" onClick={() => toggleExpand(month.month)}>
                        {isExpanded ? <CollapseIcon fontSize="small" /> : <ExpandIcon fontSize="small" />}
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Progress bar */}
                  <Box sx={{ mt: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Tiến độ</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        {month.month <= currentMonth
                          ? `${Math.round((months.filter((m) => m.month <= month.month && (m.status === "submitted" || m.status === "late")).length / month.month) * 100)}%`
                          : "-"}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        month.month <= currentMonth
                          ? (months.filter((m) => m.month <= month.month && (m.status === "submitted" || m.status === "late")).length / month.month) * 100
                          : 0
                      }
                      color={cfg.color === "error" ? "error" : cfg.color === "warning" ? "warning" : "primary"}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>

                  {/* Expand content */}
                  <Collapse in={isExpanded}>
                    <Divider sx={{ my: 1.5 }} />
                    {month.submittedAt && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                        📅 Ngày nộp: {month.submittedAt}
                      </Typography>
                    )}
                    {month.fileName && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                        <FileIcon sx={{ fontSize: 14 }} color="primary" />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {month.fileName}
                        </Typography>
                      </Box>
                    )}
                    {month.teacherComment && (
                      <Alert severity="info" sx={{ mt: 1, py: 0.5 }}>
                        <Typography variant="caption">
                          <strong>GVHD:</strong> {month.teacherComment}
                        </Typography>
                      </Alert>
                    )}
                    {month.status === "missing" && (
                      <Alert severity="error" sx={{ mt: 1, py: 0.5 }}>
                        <Typography variant="caption">
                          ⚠️ Đã quá hạn! Hãy nộp báo cáo ngay để tránh bị cấm thi.
                        </Typography>
                      </Alert>
                    )}
                    {month.status === "pending" && (
                      <Alert severity="info" sx={{ mt: 1, py: 0.5 }}>
                        <Typography variant="caption">
                          ⏳ Chưa đến hạn nộp. Hạn: cuối tháng {month.month}.
                        </Typography>
                      </Alert>
                    )}
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Upload dialog */}
      <Dialog open={uploadDialog.open} onClose={() => setUploadDialog({ open: false, month: null })} maxWidth="sm" fullWidth>
        <DialogTitle>
          Nộp báo cáo tiến độ
          {uploadDialog.month && (
            <Typography variant="caption" sx={{ display: "block", fontWeight: 400, color: "text.secondary" }}>
              Tháng {uploadDialog.month}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="caption">
              File báo cáo: <strong>.docx, .pdf, .zip</strong> — Tối đa 20MB
            </Typography>
          </Alert>

          <Box
            sx={{
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              mb: 2,
              cursor: "pointer",
              "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
            }}
          >
            <UploadIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Kéo thả file vào đây
            </Typography>
            <Typography variant="caption" color="text.secondary">
              hoặc click để chọn file
            </Typography>
          </Box>

          <TextField
            fullWidth
            size="small"
            label="Ghi chú (tùy chọn)"
            value={uploadNote}
            onChange={(e) => setUploadNote(e.target.value)}
            multiline
            rows={2}
            placeholder="VD: Đã hoàn thành training model, cần thêm dữ liệu..."
          />

          {uploading && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ mb: 0.5, display: "block" }}>
                Đang upload...
              </Typography>
              <LinearProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog({ open: false, month: null })}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmitReport} disabled={uploading}>
            {uploading ? "Đang nộp..." : "Nộp báo cáo"}
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
