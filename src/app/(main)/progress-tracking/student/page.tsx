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
  Card,
  CardContent,
  Dialog,
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
} from "@mui/icons-material";
import { toast } from "sonner";
import {
  ReportSubmissionDialog,
  ReportHistoryList,
  TemplateList,
  NotificationList,
} from "@/feature/progress-tracking/components";
import { progressTrackingService } from "@/feature/progress-tracking/services";
import type {
  StudentProgress,
  ProgressReport,
} from "@/feature/progress-tracking/types";
import { PageHeader } from "@/shared/components";
import { TrendingUp } from "lucide-react";

// Mock student data - replace with actual auth
// Note: id is a number to match the new service types.
const MOCK_STUDENT = {
  id: 4,
  name: "Nguyễn Hoàng Sinh Viên",
  email: "student@qnq.edu.vn",
  mssv: "B22DCCN001",
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
// Progress Status Card
// ============================================================

function StudentProgressCard({ studentId }: { studentId: number }) {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    setLoading(true);
    try {
      // New service: getStudentProgress returns a paginated list of all
      // student progress records. We then filter by studentId since the
      // paginated endpoint does not (yet) accept studentId as a param.
      const result = await progressTrackingService.getStudentProgress({
        limit: 1000,
      });
      const data = result.data.find((p) => p.studentId === studentId) || null;
      setProgress(data);

      // Reports are separate from StudentProgress — fetch them directly.
      const reportsResult = await progressTrackingService.getReports({
        studentId,
        limit: 100,
      });
      setReports(reportsResult.data);
    } catch {
      toast.error("Không thể tải tiến độ");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!progress) {
    return (
      <Alert severity="warning">
        <Typography variant="body2">
          Bạn chưa được phân công đề tài hoặc chưa có thông tin tiến độ.
        </Typography>
      </Alert>
    );
  }

  const reportsThisMonth = reports.filter(
    (r) =>
      r.month === new Date().getMonth() + 1 &&
      r.year === new Date().getFullYear(),
  ).length;

  const complianceRate = Math.round(
    (progress.totalReportsSubmitted / progress.totalReportsRequired) * 100,
  );

  return (
    <Box>
      {/* Ban Warning */}
      {progress.isBanned && (
        <Alert
          severity="error"
          icon={<BlockIcon />}
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => window.location.reload()}
            >
              Làm mới
            </Button>
          }
        >
          <Typography variant="h6" gutterBottom>
            Bạn đang bị CẤM THI / CẤM BẢO VỆ
          </Typography>
          <Typography variant="body2">
            <strong>Lý do:</strong>{" "}
            {progress.banReason || "Không nộp báo cáo đúng hạn"}
          </Typography>
          {progress.bannedAt && (
            <Typography variant="caption">
              Ngày cấm:{" "}
              {new Date(progress.bannedAt).toLocaleDateString("vi-VN")}
            </Typography>
          )}
          <Typography variant="body2" sx={{ mt: 1 }}>
            Vui lòng liên hệ giảng viên hướng dẫn để được xem xét và hỗ trợ.
          </Typography>
        </Alert>
      )}

      {/* Progress Info */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Trạng thái tiến độ
                </Typography>
              </Box>
              <Chip
                icon={
                  progress.isBanned ? (
                    <BlockIcon />
                  ) : progress.status === "EXTENDED" ? (
                    <ScheduleIcon />
                  ) : (
                    <CheckCircleIcon />
                  )
                }
                label={
                  progress.isBanned
                    ? "Cấm thi"
                    : progress.status === "ON_TRACK"
                      ? "Tiến hành bình thường"
                      : progress.status === "EXTENDED"
                        ? "Được gia hạn"
                        : "Đổi đề tài"
                }
                color={
                  progress.isBanned
                    ? "error"
                    : progress.status === "ON_TRACK"
                      ? "success"
                      : "warning"
                }
                sx={{ fontWeight: 600 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Đề tài
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {progress.topicName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                GVHD: {progress.teacherName}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" color="primary" fontWeight={700}>
                {progress.totalReportsSubmitted}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Báo cáo đã nộp
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" color="warning.main" fontWeight={700}>
                {progress.totalReportsRequired}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Báo cáo yêu cầu
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                color={complianceRate >= 50 ? "success.main" : "error.main"}
                fontWeight={700}
              >
                {complianceRate}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tỷ lệ hoàn thành
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                color={reportsThisMonth > 0 ? "success.main" : "error.main"}
                fontWeight={700}
              >
                {reportsThisMonth}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Báo cáo tháng này
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Important Notice */}
      <Alert severity="info" icon={<InfoIcon />}>
        <Typography variant="subtitle2" gutterBottom>
          Quy định báo cáo
        </Typography>
        <Typography variant="body2">
          Sinh viên phải nộp{" "}
          <strong>ít nhất 1 báo cáo cá nhân mỗi tháng</strong>. Hệ thống sẽ tự
          động đánh dấu <strong>cấm thi (bảo vệ)</strong> đối với Sinh viên có{" "}
          <strong>0 báo cáo</strong>.
        </Typography>
      </Alert>
    </Box>
  );
}

// ============================================================
// Main Student Progress Page
// ============================================================

export default function StudentProgressPage() {
  const [tabValue, setTabValue] = useState(0);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [studentProgress, setStudentProgress] =
    useState<StudentProgress | null>(null);

  const loadStudentProgress = useCallback(async () => {
    try {
      // Filter the paginated list of student progress records by studentId,
      // since the new service no longer exposes getStudentById.
      const result = await progressTrackingService.getStudentProgress({
        limit: 1000,
      });
      const data =
        result.data.find((p) => p.studentId === MOCK_STUDENT.id) || null;
      setStudentProgress(data);
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    loadStudentProgress();
  }, [loadStudentProgress]);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
    loadStudentProgress();
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Theo dõi tiến trình thực hiện"
        subtitle="Theo dõi tiến độ thực hiện đề tài và nộp báo cáo"
        illustration={<TrendingUp size={56} strokeWidth={1.5} />}
        showBgImage={true}
      />

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
            color="primary"
            startIcon={<DescriptionIcon />}
            onClick={() => setSubmitDialogOpen(true)}
            disabled={studentProgress?.isBanned}
          >
            Nộp báo cáo mới
          </Button>
          <Button
            variant="outlined"
            startIcon={<NotificationsIcon />}
            onClick={() => setNotificationDialogOpen(true)}
          >
            Thông báo
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Làm mới
          </Button>
          <Box sx={{ flex: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Sinh viên: <strong>{MOCK_STUDENT.name}</strong> • MSSV:{" "}
            {MOCK_STUDENT.mssv}
          </Typography>
        </Box>
      </Paper>

      {/* Progress Status Card */}
      <StudentProgressCard
        studentId={MOCK_STUDENT.id}
        key={`progress-card-${refreshKey}`}
      />

      {/* Tabs */}
      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            label="Lịch sử báo cáo"
            icon={<DescriptionIcon />}
            iconPosition="start"
          />
          <Tab
            label="Templates & Biểu mẫu"
            icon={<UploadIcon />}
            iconPosition="start"
          />
          <Tab
            label="Thông báo"
            icon={<NotificationsIcon />}
            iconPosition="start"
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <ReportHistoryList
            studentId={MOCK_STUDENT.id}
            canSubmit={!studentProgress?.isBanned}
            onSubmitClick={() => setSubmitDialogOpen(true)}
            key={`reports-${refreshKey}`}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Templates:</strong> Giảng viên hướng dẫn sẽ cung cấp các
                biểu mẫu chuẩn (Template Word) để bạn viết báo cáo. Hãy tải về
                và sử dụng theo đúng mẫu quy định.
              </Typography>
            </Alert>
            <TemplateList
              showUploadButton={false}
              key={`templates-${refreshKey}`}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <NotificationList
            recipientId={MOCK_STUDENT.id}
            maxHeight={600}
            key={`notifications-${refreshKey}`}
          />
        </TabPanel>
      </Paper>

      {/* Submit Report Dialog */}
      <ReportSubmissionDialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
        studentId={MOCK_STUDENT.id}
        onSuccess={() => {
          toast.success("Nộp báo cáo thành công!");
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
        <NotificationList recipientId={MOCK_STUDENT.id} maxHeight={500} />
      </Dialog>
    </Box>
  );
}
