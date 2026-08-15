"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  CloudUpload as UploadIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon,
  RateReview as ReviewIcon,
} from "@mui/icons-material";
import { toast } from "sonner";
import {
  TemplateUploadDialog,
  TemplateList,
  ProgressStatsCards,
  BanWarningsList,
  BannedStudentsList,
  NotificationList,
  AutoBanCheckComponent,
} from "@/feature/progress-tracking/components";
import { progressTrackingService } from "@/feature/progress-tracking/services";
import type {
  StudentProgress,
  ProgressReport,
  ProgressStatus,
  ReportStatus,
} from "@/feature/progress-tracking/types";

// Mock admin data - replace with actual auth
const MOCK_ADMIN = {
  id: 1,
  name: "Nguyễn Văn Admin",
  email: "admin@qnq.edu.vn",
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`progress-tabpanel-${index}`}
      aria-labelledby={`progress-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// ============================================================
// All Reports Review Component (Admin)
// ============================================================

function AllReportsReview() {
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ProgressReport | null>(
    null,
  );
  const [reviewStatus, setReviewStatus] = useState<
    "APPROVED" | "REJECTED" | null
  >(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState<number | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("ALL");

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const result = await progressTrackingService.getReports({
        page: 1,
        limit: 100,
      });
      setReports(result.data);
    } catch {
      toast.error("Không thể tải danh sách báo cáo");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const filteredReports = reports.filter((r) => {
    if (statusFilter === "ALL") return true;
    return r.status === statusFilter;
  });

  const handleReview = async () => {
    if (!selectedReport || !reviewStatus) return;

    setSubmitting(true);
    try {
      await progressTrackingService.reviewReport({
        reportId: selectedReport.id,
        reviewerId: MOCK_ADMIN.id,
        status: reviewStatus,
        feedback: feedback.trim() || undefined,
        score: reviewStatus === "APPROVED" ? score : undefined,
      });

      toast.success(
        reviewStatus === "APPROVED" ? "Đã duyệt báo cáo" : "Đã từ chối báo cáo",
      );
      setSelectedReport(null);
      setReviewStatus(null);
      setFeedback("");
      setScore(undefined);
      loadReports();
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusChip = (status: ReportStatus) => {
    switch (status) {
      case "APPROVED":
        return <Chip label="Đã duyệt" color="success" size="small" />;
      case "PENDING":
        return <Chip label="Chờ duyệt" color="warning" size="small" />;
      case "REJECTED":
        return <Chip label="Từ chối" color="error" size="small" />;
      case "REVISION_REQUESTED":
        return <Chip label="Cần sửa" color="info" size="small" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          Tất cả báo cáo ({filteredReports.length})
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Lọc theo trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Lọc theo trạng thái"
              onChange={(e) =>
                setStatusFilter(e.target.value as ReportStatus | "ALL")
              }
            >
              <MenuItem value="ALL">Tất cả</MenuItem>
              <MenuItem value="PENDING">Chờ duyệt</MenuItem>
              <MenuItem value="APPROVED">Đã duyệt</MenuItem>
              <MenuItem value="REJECTED">Từ chối</MenuItem>
            </Select>
          </FormControl>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadReports}
            variant="outlined"
          >
            Làm mới
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell sx={{ fontWeight: 600 }}>Tiêu đề</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sinh viên</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Giảng viên</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tháng</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Điểm</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Không có báo cáo nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {report.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {report.studentName || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {report.teacherName || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      Tháng {report.month}/{report.year}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(report.status)}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={report.score ? "success.main" : "text.disabled"}
                    >
                      {report.score ?? "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setSelectedReport(report)}
                    >
                      Xem / Duyệt
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Review Dialog */}
      <Dialog
        open={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ReviewIcon color="primary" />
            Duyệt báo cáo
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ bgcolor: "background.default", p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Tiêu đề
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {selectedReport?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sinh viên: {selectedReport?.studentName} • GV:{" "}
                {selectedReport?.teacherName}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Nội dung báo cáo
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: "background.default",
                  maxHeight: 200,
                  overflow: "auto",
                }}
                dangerouslySetInnerHTML={{
                  __html: selectedReport?.content || "",
                }}
              />
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Quyết định <span style={{ color: "red" }}>*</span>
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant={
                    reviewStatus === "APPROVED" ? "contained" : "outlined"
                  }
                  color="success"
                  onClick={() => setReviewStatus("APPROVED")}
                  fullWidth
                >
                  Duyệt
                </Button>
                <Button
                  variant={
                    reviewStatus === "REJECTED" ? "contained" : "outlined"
                  }
                  color="error"
                  onClick={() => setReviewStatus("REJECTED")}
                  fullWidth
                >
                  Từ chối
                </Button>
              </Box>
            </Box>

            {reviewStatus === "APPROVED" && (
              <TextField
                label="Điểm (1-10)"
                type="number"
                value={score ?? ""}
                onChange={(e) =>
                  setScore(parseInt(e.target.value) || undefined)
                }
                inputProps={{ min: 1, max: 10 }}
                sx={{ width: 150 }}
              />
            )}

            <TextField
              label="Phản hồi"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setSelectedReport(null)} disabled={submitting}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color={reviewStatus === "APPROVED" ? "success" : "error"}
            onClick={handleReview}
            disabled={submitting || !reviewStatus}
          >
            {submitting ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ============================================================
// All Students Progress Component (Admin)
// ============================================================

function AllStudentsProgress() {
  const [progressList, setProgressList] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ProgressStatus | "ALL">(
    "ALL",
  );
  const [selectedStudent, setSelectedStudent] =
    useState<StudentProgress | null>(null);

  const loadProgress = useCallback(async () => {
    setLoading(true);
    try {
      const result = await progressTrackingService.getStudentProgress({
        page: 1,
        limit: 100,
      });
      setProgressList(result.data);
    } catch {
      toast.error("Không thể tải danh sách");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const filteredList = progressList.filter((p) => {
    if (statusFilter === "ALL") return true;
    return p.status === statusFilter;
  });

  const getStatusChip = (status: ProgressStatus, isBanned: boolean) => {
    if (isBanned || status === "BANNED") {
      return (
        <Chip icon={<BlockIcon />} label="Cấm thi" color="error" size="small" />
      );
    }
    switch (status) {
      case "ON_TRACK":
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Tiến hành"
            color="success"
            size="small"
          />
        );
      case "EXTENDED":
        return (
          <Chip
            icon={<ScheduleIcon />}
            label="Gia hạn"
            color="warning"
            size="small"
          />
        );
      case "TOPIC_CHANGED":
        return (
          <Chip
            icon={<InfoIcon />}
            label="Đổi đề tài"
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
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          Tiến độ tất cả sinh viên ({filteredList.length})
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Lọc theo trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Lọc theo trạng thái"
              onChange={(e) =>
                setStatusFilter(e.target.value as ProgressStatus | "ALL")
              }
            >
              <MenuItem value="ALL">Tất cả</MenuItem>
              <MenuItem value="ON_TRACK">Tiến hành</MenuItem>
              <MenuItem value="EXTENDED">Gia hạn</MenuItem>
              <MenuItem value="TOPIC_CHANGED">Đổi đề tài</MenuItem>
              <MenuItem value="BANNED">Cấm thi</MenuItem>
            </Select>
          </FormControl>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadProgress}
            variant="outlined"
          >
            Làm mới
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell sx={{ fontWeight: 600 }}>Sinh viên</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>MSSV</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Đề tài</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Giảng viên</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Báo cáo
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Trạng thái
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Không có sinh viên nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredList.map((progress) => (
                <TableRow
                  key={progress.studentId}
                  hover
                  sx={{ bgcolor: progress.isBanned ? "error.50" : "inherit" }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {progress.studentName || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {progress.studentMssv || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200 }}>
                      {progress.topicName || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {progress.teacherName || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={500}>
                      {progress.totalReportsSubmitted}/
                      {progress.totalReportsRequired}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {getStatusChip(progress.status, progress.isBanned)}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setSelectedStudent(progress)}
                    >
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <InfoIcon color="primary" />
            Chi tiết tiến độ - {selectedStudent?.studentName}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedStudent && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  MSSV
                </Typography>
                <Typography variant="body1">
                  {selectedStudent.studentMssv || "-"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Trạng thái
                </Typography>
                {getStatusChip(
                  selectedStudent.status,
                  selectedStudent.isBanned,
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Đề tài
                </Typography>
                <Typography variant="body1">
                  {selectedStudent.topicName || "-"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Giảng viên
                </Typography>
                <Typography variant="body1">
                  {selectedStudent.teacherName || "-"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Báo cáo
                </Typography>
                <Typography variant="body1">
                  {selectedStudent.totalReportsSubmitted}/
                  {selectedStudent.totalReportsRequired}
                </Typography>
              </Grid>
              {selectedStudent.isBanned && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    <Typography variant="subtitle2">Lý do cấm thi</Typography>
                    <Typography variant="body2">
                      {selectedStudent.banReason}
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedStudent(null)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ============================================================
// Main Admin Progress Page
// ============================================================

export default function AdminProgressPage() {
  const [tabValue, setTabValue] = useState(0);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Theo dõi tiến trình thực hiện
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý và giám sát tiến độ thực hiện đề tài của tất cả sinh viên
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Tải lên Template
          </Button>
          <AutoBanCheckComponent />
          <Button
            variant="outlined"
            startIcon={<NotificationsIcon />}
            onClick={() => setNotificationDialogOpen(true)}
          >
            Thông báo
          </Button>
          <Box sx={{ flex: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Quản trị viên: <strong>{MOCK_ADMIN.name}</strong>
          </Typography>
        </Box>
      </Paper>

      {/* Ban Warnings */}
      <BanWarningsList />

      {/* Statistics Cards */}
      <ProgressStatsCards key={`stats-${refreshKey}`} />

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            label="Tiến độ sinh viên"
            icon={<DescriptionIcon />}
            iconPosition="start"
          />
          <Tab
            label="Duyệt báo cáo"
            icon={<ReviewIcon />}
            iconPosition="start"
          />
          <Tab
            label="Sinh viên bị cấm"
            icon={<BlockIcon />}
            iconPosition="start"
          />
          <Tab label="Templates" icon={<UploadIcon />} iconPosition="start" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <AllStudentsProgress key={`progress-${refreshKey}`} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <AllReportsReview key={`reports-${refreshKey}`} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <BannedStudentsList />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <TemplateList onUploadClick={() => setUploadDialogOpen(true)} />
        </TabPanel>
      </Paper>

      {/* Upload Template Dialog */}
      <TemplateUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        teacherId={MOCK_ADMIN.id}
        teacherName={MOCK_ADMIN.name}
        onSuccess={() => {
          toast.success("Template đã được tải lên");
          handleRefresh();
        }}
      />

      {/* Notification Dialog */}
      <Dialog
        open={notificationDialogOpen}
        onClose={() => setNotificationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{ "& .MuiDialog-paper": { maxHeight: "80vh" } }}
      >
        <NotificationList recipientId={MOCK_ADMIN.id} maxHeight={500} />
      </Dialog>
    </Box>
  );
}
