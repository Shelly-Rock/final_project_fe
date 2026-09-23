"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Grid,
  useTheme,
  Theme,
} from "@mui/material";

const getCardBackground = (theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return isDark
    ? "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 58, 138, 0.4) 100%)"
    : theme.palette.background.paper;
};
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
import {
  PageHeader,
  DataTable,
  type Column,
  type Action,
  type FilterOption,
} from "@/shared/components";
import { TrendingUp } from "lucide-react";

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

  const columns: Column<ProgressReport>[] = [
    {
      id: "title",
      label: "Tiêu đề",
      format: (value, row) => (
        <Typography variant="body2" fontWeight={500}>
          {row.title}
        </Typography>
      ),
    },
    {
      id: "studentName",
      label: "Sinh viên",
      format: (value, row) => (
        <Typography variant="body2">{row.studentName || "-"}</Typography>
      ),
    },
    {
      id: "teacherName",
      label: "Giảng viên",
      format: (value, row) => (
        <Typography variant="body2">{row.teacherName || "-"}</Typography>
      ),
    },
    {
      id: "monthYear",
      label: "Tháng",
      format: (value, row) => (
        <Typography variant="body2">
          Tháng {row.month}/{row.year}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "Trạng thái",
      format: (value, row) => getStatusChip(row.status),
    },
    {
      id: "score",
      label: "Điểm",
      format: (value, row) => (
        <Typography
          variant="body2"
          color={row.score ? "success.main" : "text.disabled"}
        >
          {row.score ?? "-"}
        </Typography>
      ),
    },
  ];

  const actions: Action<ProgressReport>[] = [
    {
      id: "review",
      label: "Xem / Duyệt",
      icon: <ReviewIcon fontSize="small" />,
      onClick: (row) => setSelectedReport(row),
      color: "primary",
    },
  ];

  const filterOptions: FilterOption[] = [
    { value: "ALL", label: "Tất cả" },
    { value: "PENDING", label: "Chờ duyệt" },
    { value: "APPROVED", label: "Đã duyệt" },
    { value: "REJECTED", label: "Từ chối" },
  ];

  return (
    <Box>
      <Box sx={{ mb: 2, px: 1 }}>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Tất cả báo cáo ({filteredReports.length})
        </Typography>
      </Box>

      <DataTable
        columns={columns}
        rows={filteredReports}
        rowKey="id"
        actions={actions}
        filterOptions={filterOptions}
        filterValue={statusFilter}
        onFilterChange={(v) => setStatusFilter(v as ReportStatus | "ALL")}
        showFilterButton={true}
        loading={loading}
        emptyMessage="Không có báo cáo nào"
        headerActions={[
          {
            id: "refresh",
            label: "Làm mới",
            icon: <RefreshIcon fontSize="small" />,
            onClick: loadReports,
            variant: "outlined",
          },
        ]}
      />

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

  const columns: Column<StudentProgress>[] = [
    {
      id: "studentName",
      label: "Sinh viên",
      format: (value, row) => (
        <Typography variant="body2" fontWeight={500}>
          {row.studentName || "-"}
        </Typography>
      ),
    },
    {
      id: "studentMssv",
      label: "MSSV",
      format: (value, row) => (
        <Typography variant="body2" color="text.secondary">
          {row.studentMssv || "-"}
        </Typography>
      ),
    },
    {
      id: "topicName",
      label: "Đề tài",
      format: (value, row) => (
        <Typography variant="body2" sx={{ maxWidth: 200 }}>
          {row.topicName || "-"}
        </Typography>
      ),
    },
    {
      id: "teacherName",
      label: "Giảng viên",
      format: (value, row) => (
        <Typography variant="body2">{row.teacherName || "-"}</Typography>
      ),
    },
    {
      id: "reports",
      label: "Báo cáo",
      align: "center",
      format: (value, row) => (
        <Typography variant="body2" fontWeight={500}>
          {row.totalReportsSubmitted}/{row.totalReportsRequired}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "Trạng thái",
      align: "center",
      format: (value, row) => getStatusChip(row.status, row.isBanned),
    },
  ];

  const actions: Action<StudentProgress>[] = [
    {
      id: "detail",
      label: "Chi tiết",
      icon: <InfoIcon fontSize="small" />,
      onClick: (row) => setSelectedStudent(row),
      color: "primary",
    },
  ];

  const filterOptions: FilterOption[] = [
    { value: "ALL", label: "Tất cả" },
    { value: "ON_TRACK", label: "Tiến hành" },
    { value: "EXTENDED", label: "Gia hạn" },
    { value: "TOPIC_CHANGED", label: "Đổi đề tài" },
    { value: "BANNED", label: "Cấm thi" },
  ];

  return (
    <Box>
      <Box sx={{ mb: 2, px: 1 }}>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Tiến độ tất cả sinh viên ({filteredList.length})
        </Typography>
      </Box>

      <DataTable
        columns={columns}
        rows={filteredList}
        rowKey="studentId"
        actions={actions}
        filterOptions={filterOptions}
        filterValue={statusFilter}
        onFilterChange={(v) => setStatusFilter(v as ProgressStatus | "ALL")}
        showFilterButton={true}
        loading={loading}
        emptyMessage="Không có sinh viên nào"
        headerActions={[
          {
            id: "refresh",
            label: "Làm mới",
            icon: <RefreshIcon fontSize="small" />,
            onClick: loadProgress,
            variant: "outlined",
          },
        ]}
      />

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
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      {/* Ban Warnings */}
      <BanWarningsList />

      {/* Statistics Cards */}
      <ProgressStatsCards key={`stats-${refreshKey}`} />

      {/* Tabs */}
      <Paper sx={{ mb: 2, background: getCardBackground(theme) }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
            pr: 2,
            gap: 1,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            sx={{ flex: 1, minWidth: 0 }}
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
          </Tabs>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexShrink: 0,
            }}
          >
            <AutoBanCheckComponent />
            <Button
              variant="outlined"
              size="small"
              startIcon={<NotificationsIcon />}
              onClick={() => setNotificationDialogOpen(true)}
            >
              Thông báo
            </Button>
          </Box>
        </Box>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <AllStudentsProgress key={`progress-${refreshKey}`} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <AllReportsReview key={`reports-${refreshKey}`} />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <BannedStudentsList />
      </TabPanel>

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
