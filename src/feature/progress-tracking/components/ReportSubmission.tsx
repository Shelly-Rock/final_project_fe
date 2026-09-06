"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
  Divider,
  Grid,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as PendingIcon,
  Cancel as RejectIcon,
  Edit as RevisionIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { toast } from "sonner";
import { progressTrackingService } from "../services";
import type { ProgressReport, ReportStatus } from "../types";

interface ReportSubmissionDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (report: ProgressReport) => void;
  studentId: number;
}

const MONTHS = [
  { value: 1, label: "Tháng 1" },
  { value: 2, label: "Tháng 2" },
  { value: 3, label: "Tháng 3" },
  { value: 4, label: "Tháng 4" },
  { value: 5, label: "Tháng 5" },
  { value: 6, label: "Tháng 6" },
  { value: 7, label: "Tháng 7" },
  { value: 8, label: "Tháng 8" },
  { value: 9, label: "Tháng 9" },
  { value: 10, label: "Tháng 10" },
  { value: 11, label: "Tháng 11" },
  { value: 12, label: "Tháng 12" },
];

export function ReportSubmissionDialog({
  open,
  onClose,
  onSuccess,
  studentId,
}: ReportSubmissionDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year] = useState(new Date().getFullYear());
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề báo cáo");
      return;
    }
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung báo cáo");
      return;
    }

    setUploading(true);
    try {
      const report = await progressTrackingService.submitReport({
        studentId,
        title: title.trim(),
        content: content.trim(),
        month,
        year,
      });
      toast.success("Nộp báo cáo thành công!");
      onSuccess?.(report);
      handleClose();
    } catch {
      toast.error("Có lỗi xảy ra khi nộp báo cáo");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setMonth(new Date().getMonth() + 1);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DescriptionIcon color="primary" />
          Nộp báo cáo tiến độ
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Quy định:</strong> Sinh viên phải nộp ít nhất 1 báo cáo cá
              nhân mỗi tháng. Hệ thống sẽ tự động đánh dấu cấm thi (bảo vệ) đối
              với Sinh viên có 0 báo cáo.
            </Typography>
          </Alert>

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Tháng</InputLabel>
              <Select
                value={month}
                label="Tháng"
                onChange={(e) => setMonth(e.target.value as number)}
              >
                {MONTHS.map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Năm" value={year} disabled sx={{ width: 120 }} />
          </Box>

          <TextField
            label="Tiêu đề báo cáo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Báo cáo tiến độ tháng 8/2026"
            fullWidth
            required
          />

          <TextField
            label="Nội dung báo cáo"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Mô tả chi tiết tiến độ thực hiện..."
            multiline
            rows={10}
            fullWidth
            required
            helperText="Có thể sử dụng HTML để định dạng: <p>, <strong>, <ul>, <li>"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={uploading}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={uploading || !title.trim() || !content.trim()}
          startIcon={
            uploading ? <CircularProgress size={20} /> : <DescriptionIcon />
          }
        >
          {uploading ? "Đang nộp..." : "Nộp báo cáo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ============================================================
// Report History List Component
// ============================================================

interface ReportHistoryListProps {
  studentId: number;
  onSubmitClick?: () => void;
  canSubmit?: boolean;
}

export function ReportHistoryList({
  studentId,
  onSubmitClick,
  canSubmit = true,
}: ReportHistoryListProps) {
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ProgressReport | null>(
    null,
  );

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const result = await progressTrackingService.getReports({
        studentId,
        page: 1,
        limit: 50,
      });
      setReports(
        result.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch {
      toast.error("Không thể tải lịch sử báo cáo");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const getStatusChip = (status: ReportStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Đã duyệt"
            color="success"
            size="small"
          />
        );
      case "PENDING":
        return (
          <Chip
            icon={<PendingIcon />}
            label="Chờ duyệt"
            color="warning"
            size="small"
          />
        );
      case "REJECTED":
        return (
          <Chip
            icon={<RejectIcon />}
            label="Bị từ chối"
            color="error"
            size="small"
          />
        );
      case "REVISION_REQUESTED":
        return (
          <Chip
            icon={<RevisionIcon />}
            label="Cần sửa đổi"
            color="info"
            size="small"
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {canSubmit && onSubmitClick && (
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            startIcon={<DescriptionIcon />}
            onClick={onSubmitClick}
          >
            Nộp báo cáo mới
          </Button>
        </Box>
      )}

      {reports.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <DescriptionIcon
            sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary">
            Chưa có báo cáo nào
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Nộp báo cáo đầu tiên của bạn
          </Typography>
        </Paper>
      ) : (
        <List>
          {reports.map((report) => (
            <Paper key={report.id} sx={{ mb: 1 }}>
              <ListItem
                sx={{
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => setSelectedReport(report)}
              >
                <ListItemIcon>
                  <DescriptionIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body1" fontWeight={500}>
                        {report.title}
                      </Typography>
                      {getStatusChip(report.status)}
                    </Box>
                  }
                  secondary={
                    <Box component="span">
                      <Typography
                        variant="caption"
                        component="span"
                        sx={{ display: "block" }}
                      >
                        Tháng {report.month}/{report.year} • Nộp lúc{" "}
                        {new Date(report.createdAt).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </Typography>
                      {report.score !== null && (
                        <Typography
                          variant="caption"
                          color="success.main"
                          component="span"
                        >
                          • Điểm: {report.score}/10
                        </Typography>
                      )}
                    </Box>
                  }
                />
                {report.feedback && (
                  <Chip
                    icon={<WarningIcon />}
                    label="Có phản hồi"
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                )}
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

      {/* Report Detail Dialog */}
      <ReportDetailDialog
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </Box>
  );
}

// ============================================================
// Report Detail Dialog
// ============================================================

interface ReportDetailDialogProps {
  report: ProgressReport | null;
  onClose: () => void;
}

export function ReportDetailDialog({
  report,
  onClose,
}: ReportDetailDialogProps) {
  if (!report) return null;

  const getStatusChip = (status: ReportStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <Chip icon={<CheckCircleIcon />} label="Đã duyệt" color="success" />
        );
      case "PENDING":
        return (
          <Chip icon={<PendingIcon />} label="Chờ duyệt" color="warning" />
        );
      case "REJECTED":
        return <Chip icon={<RejectIcon />} label="Bị từ chối" color="error" />;
      case "REVISION_REQUESTED":
        return (
          <Chip icon={<RevisionIcon />} label="Cần sửa đổi" color="info" />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={!!report} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DescriptionIcon color="primary" />
            Chi tiết báo cáo
          </Box>
          {getStatusChip(report.status)}
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Tiêu đề
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {report.title}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Tháng/Năm
            </Typography>
            <Typography variant="body1">
              Tháng {report.month}/{report.year}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Điểm
            </Typography>
            <Typography
              variant="body1"
              fontWeight={500}
              color={report.score !== null ? "success.main" : "text.disabled"}
            >
              {report.score !== null ? `${report.score}/10` : "Chưa chấm"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Nội dung báo cáo
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: "background.default",
                maxHeight: 300,
                overflow: "auto",
              }}
              dangerouslySetInnerHTML={{ __html: report.content }}
            />
          </Grid>

          {report.feedback && (
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Alert
                severity={report.status === "APPROVED" ? "success" : "warning"}
                sx={{ mt: 1 }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Phản hồi từ giảng viên
                </Typography>
                <Typography variant="body2">{report.feedback}</Typography>
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
