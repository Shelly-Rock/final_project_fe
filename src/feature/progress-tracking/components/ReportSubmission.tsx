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
  CloudUpload as CloudUploadIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import { toast } from "sonner";
import { progressTrackingService } from "../services";
import type { ProgressReport, ReportStatus } from "../types";
import { apiClient } from "@/shared/services/api-client";

interface ReportSubmissionDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (report: ProgressReport) => void;
  studentId: number;
  deadlineId?: number;
  deadlineLabel?: string;
}

export function ReportSubmissionDialog({
  open,
  onClose,
  onSuccess,
  studentId,
  deadlineId,
  deadlineLabel,
}: ReportSubmissionDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      if (deadlineId && deadlineLabel) {
        setTitle(deadlineLabel);
      } else {
        setTitle("");
      }
      setContent("");
      setFile(null);
    }
  }, [open, deadlineId, deadlineLabel]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề báo cáo");
      return;
    }
    if (!file) {
      toast.error("Vui lòng đính kèm file báo cáo/biểu mẫu");
      return;
    }

    setUploading(true);
    try {
      let fileUrl = "";
      let fileName = "";
      if (file) {
        const uploadRes = (await apiClient.uploadFile(
          "/upload/reports",
          file,
          "file",
        )) as { file_url?: string; url?: string };
        fileUrl =
          uploadRes.file_url || uploadRes.url || `/uploads/${file.name}`;
        fileName = file.name;
      }

      const report = await progressTrackingService.submitReport({
        studentId,
        title: title.trim(),
        content: content.trim(),
        deadlineId,
        fileUrl,
        fileName,
      });

      if (onSuccess) {
        onSuccess(report);
      }
      handleClose();
    } catch (err: unknown) {
      const error = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };
      toast.error(error.response?.data?.message || "Lỗi khi nộp báo cáo");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DescriptionIcon color="primary" />
          {deadlineId ? "Nộp báo cáo tiến độ" : "Nộp biểu mẫu ngoại lệ"}
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Alert severity="info">
            <Typography variant="body2">
              {deadlineId ? (
                <>
                  <strong>Quy định:</strong> Sinh viên phải nộp báo cáo đúng hạn
                  theo đợt. Hệ thống sẽ ghi nhận lịch sử nộp bài của bạn.
                </>
              ) : (
                <>
                  Giảng viên hướng dẫn sẽ xem xét và phản hồi đơn yêu cầu của
                  bạn.
                </>
              )}
            </Typography>
          </Alert>

          <TextField
            label="Tiêu đề báo cáo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={deadlineId ? "" : "VD: Đơn xin đổi đề tài"}
            fullWidth
            required
            disabled={!!deadlineId && !!deadlineLabel}
          />

          <Box
            sx={{
              border: "2px dashed",
              borderColor: file ? "success.main" : "divider",
              borderRadius: 1,
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: file ? "success.lighter" : "background.default",
              "&:hover": { bgcolor: "action.hover" },
            }}
            onClick={() =>
              document.getElementById("report-file-upload")?.click()
            }
          >
            <input
              id="report-file-upload"
              type="file"
              hidden
              accept=".doc,.docx,.pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
            {file ? (
              <Box>
                <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography
                  variant="body1"
                  fontWeight={500}
                  color="success.main"
                >
                  Đã chọn: {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB) - Click để chọn
                  lại
                </Typography>
              </Box>
            ) : (
              <Box>
                <CloudUploadIcon
                  sx={{ fontSize: 40, color: "text.disabled", mb: 1 }}
                />
                <Typography variant="body1" fontWeight={500}>
                  Click để đính kèm file báo cáo/biểu mẫu
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hỗ trợ: .doc, .docx, .pdf
                </Typography>
              </Box>
            )}
          </Box>

          <TextField
            label="Ghi chú thêm (Không bắt buộc)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Bạn có thể để lại lời nhắn ngắn gọn cho Giảng viên hướng dẫn..."
            multiline
            rows={3}
            fullWidth
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
          disabled={uploading || !title.trim() || !file}
          startIcon={
            uploading ? <CircularProgress size={20} /> : <UploadIcon />
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
        <Box sx={{ p: 4, textAlign: "center" }}>
          <DescriptionIcon
            sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary">
            Chưa có báo cáo nào
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Nộp báo cáo đầu tiên của bạn
          </Typography>
        </Box>
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
