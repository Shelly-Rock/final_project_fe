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
  StudentStatusCard,
  ProgressTimeline,
  ExceptionRequests,
} from "@/feature/progress-tracking/components";
import { progressTrackingService } from "@/feature/progress-tracking/services";
import type {
  StudentProgress,
  ProgressReport,
} from "@/feature/progress-tracking/types";
import { PageHeader } from "@/shared/components";
import { TrendingUp } from "lucide-react";

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
        limit: 100,
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

import { useSession } from "next-auth/react";

// ============================================================
// Main Student Progress Page
// ============================================================

export default function StudentProgressPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const userId = user?.id;

  const [tabValue, setTabValue] = useState(0);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [activeDeadlineId, setActiveDeadlineId] = useState<
    number | undefined
  >();
  const [activeDeadlineLabel, setActiveDeadlineLabel] = useState<
    string | undefined
  >();
  const [refreshKey, setRefreshKey] = useState(0);

  const [studentProgress, setStudentProgress] =
    useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStudentProgress = useCallback(async () => {
    try {
      if (!userId) return;
      setLoading(true);
      const data = await progressTrackingService.getMyProgress();
      setStudentProgress(data);
    } catch {
      // Silently fail
      setStudentProgress(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

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

      {loading ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      ) : !studentProgress ? (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body1">
            Bạn chưa đăng ký đề tài hoặc yêu cầu đăng ký chưa được phê duyệt nên
            chưa có tiến độ thực hiện.
          </Typography>
        </Alert>
      ) : (
        <>
          {/* Progress Status Card */}
          <Box sx={{ mt: 3 }}>
            <StudentStatusCard student={studentProgress} />
          </Box>

          {/* Tabs */}
          <Paper sx={{ mt: 3 }}>
            <Tabs
              value={tabValue}
              onChange={(_, v) => setTabValue(v)}
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab
                label="Tiến trình thực hiện"
                icon={<ScheduleIcon />}
                iconPosition="start"
              />
              <Tab
                label="Biểu mẫu ngoại lệ"
                icon={<DescriptionIcon />}
                iconPosition="start"
              />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 2 }}>
                <ProgressTimeline
                  studentId={studentProgress.studentId}
                  key={`timeline-${refreshKey}`}
                  onUploadClick={(deadlineId: number, label: string) => {
                    setActiveDeadlineId(deadlineId);
                    setActiveDeadlineLabel(label);
                    setSubmitDialogOpen(true);
                  }}
                />
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 2 }}>
                <ExceptionRequests
                  studentId={studentProgress.studentId}
                  onRefresh={handleRefresh}
                />
              </Box>
            </TabPanel>
          </Paper>

          {/* Submit Report Dialog */}
          <ReportSubmissionDialog
            open={submitDialogOpen}
            onClose={() => {
              setSubmitDialogOpen(false);
              setActiveDeadlineId(undefined);
              setActiveDeadlineLabel(undefined);
            }}
            studentId={studentProgress.studentId}
            deadlineId={activeDeadlineId}
            deadlineLabel={activeDeadlineLabel}
            onSuccess={() => {
              toast.success("Nộp báo cáo thành công!");
              handleRefresh();
            }}
          />
        </>
      )}
    </Box>
  );
}
