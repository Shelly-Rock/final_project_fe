"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  Block as BlockIcon,
  RateReview as ReviewIcon,
} from "@mui/icons-material";
import { toast } from "sonner";
import {
  StudentProgressTable,
  ProgressStatsCards,
  BanWarningsList,
  BannedStudentsList,
  StatusUpdateDialog,
  NotificationList,
  AutoBanCheckComponent,
  StudentDetailDialog,
} from "@/feature/progress-tracking/components";
import { progressTrackingService } from "@/feature/progress-tracking/services";
import type {
  StudentProgress,
  ProgressReport,
  ReportStatus,
} from "@/feature/progress-tracking/types";
import { PageHeader } from "@/shared/components";
import { TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";

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
// Report Review Component
// ============================================================

interface PendingReportsListProps {
  teacherId: number;
  onReviewComplete?: () => void;
}

function PendingReportsList({
  teacherId,
  onReviewComplete,
}: PendingReportsListProps) {
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ProgressReport | null>(
    null,
  );
  const [reviewStatus, setReviewStatus] = useState<ReportStatus | null>(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState<number | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const result = await progressTrackingService.getReports({
        teacherId,
        status: "PENDING",
        page: 1,
        limit: 50,
      });
      setReports(result.data);
    } catch {
      toast.error("Không thể tải danh sách báo cáo");
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleReview = async () => {
    if (!selectedReport || !reviewStatus) return;

    setSubmitting(true);
    try {
      await progressTrackingService.reviewReport({
        reportId: selectedReport.id,
        reviewerId: teacherId,
        status: reviewStatus,
        feedback: feedback.trim() || undefined,
        score: reviewStatus === "APPROVED" ? score : undefined,
      });

      toast.success(
        reviewStatus === "APPROVED"
          ? "Đã duyệt báo cáo thành công"
          : "Đã từ chối báo cáo",
      );
      setSelectedReport(null);
      setReviewStatus(null);
      setFeedback("");
      setScore(undefined);
      loadReports();
      onReviewComplete?.();
    } catch {
      toast.error("Có lỗi xảy ra khi duyệt báo cáo");
    } finally {
      setSubmitting(false);
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
          Báo cáo chờ duyệt ({reports.length})
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadReports}
          variant="outlined"
          size="small"
        >
          Làm mới
        </Button>
      </Box>

      {reports.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <ReviewIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Không có báo cáo nào chờ duyệt
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
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body1" fontWeight={500}>
                        {report.title}
                      </Typography>
                      <Chip label="Chờ duyệt" size="small" color="warning" />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="caption"
                        component="span"
                        sx={{ display: "block" }}
                      >
                        Sinh viên: <strong>{report.studentName}</strong> • Tháng{" "}
                        {report.month}/{report.year} • Nộp lúc:{" "}
                        {new Date(report.createdAt).toLocaleDateString("vi-VN")}
                      </Typography>
                      <Typography
                        variant="caption"
                        component="span"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        Mã SV: {report.studentId}
                      </Typography>
                    </>
                  }
                />
                <Button
                  size="small"
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedReport(report);
                  }}
                >
                  Duyệt / Từ chối
                </Button>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

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
                Sinh viên: {selectedReport?.studentName} • Tháng{" "}
                {selectedReport?.month}/{selectedReport?.year}
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
                  Duyệt báo cáo
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
              label="Phản hồi / Nhận xét"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              multiline
              rows={3}
              fullWidth
              placeholder="Nhập nhận xét cho sinh viên..."
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
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ============================================================
// Main Teacher Progress Page
// ============================================================

export default function TeacherProgressPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const parsedTeacherId = user?.id ? Number.parseInt(user.id, 10) : NaN;
  const teacherId =
    Number.isInteger(parsedTeacherId) && parsedTeacherId > 0
      ? parsedTeacherId
      : undefined;

  const [tabValue, setTabValue] = useState(0);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentProgress | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleStatusUpdate = (studentId: number, _topicId: number) => {
    progressTrackingService
      .getStudentProgress({ teacherId: teacherId })
      .then((result) => {
        const student = result.data.find((s) => s.studentId === studentId);
        if (student) {
          setSelectedStudent(student);
          setStatusDialogOpen(true);
        }
      });
  };

  const handleViewDetails = (student: StudentProgress) => {
    setSelectedStudent(student);
    setDetailDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
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
          <AutoBanCheckComponent />
          <Button
            variant="outlined"
            startIcon={<NotificationsIcon />}
            onClick={() => setNotificationDrawerOpen(true)}
          >
            Thông báo
          </Button>
          <Box sx={{ flex: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Giảng viên: <strong>{user?.name}</strong>
          </Typography>
        </Box>
      </Paper>

      {/* Ban Warnings */}
      <BanWarningsList teacherId={teacherId} />

      {/* Statistics Cards */}
      <ProgressStatsCards teacherId={teacherId} key={`stats-${refreshKey}`} />

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            label="Danh sách sinh viên"
            icon={<DescriptionIcon />}
            iconPosition="start"
          />
          <Tab
            label="Báo cáo chờ duyệt"
            icon={<ReviewIcon />}
            iconPosition="start"
          />
          <Tab
            label="Sinh viên bị cấm"
            icon={<BlockIcon />}
            iconPosition="start"
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <StudentProgressTable
            teacherId={teacherId}
            onStatusChange={handleStatusUpdate}
            onViewDetails={handleViewDetails}
            key={`table-${refreshKey}`}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {teacherId !== undefined && (
            <PendingReportsList
              teacherId={teacherId}
              onReviewComplete={handleRefresh}
            />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <BannedStudentsList
            teacherId={teacherId}
            onUnban={(studentId: number) => {
              progressTrackingService.updateStudentProgress(studentId, {
                status: "ON_TRACK",
              });
              toast.success("Đã bỏ cấm thi cho sinh viên");
              handleRefresh();
            }}
          />
        </TabPanel>
      </Paper>

      {/* Status Update Dialog */}
      {teacherId !== undefined && (
        <StatusUpdateDialog
          open={statusDialogOpen}
          onClose={() => {
            setStatusDialogOpen(false);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
          userId={teacherId}
          userName={user?.name || ""}
          userRole="teacher"
          onSuccess={() => {
            handleRefresh();
          }}
        />
      )}

      {/* Detail Dialog */}
      {detailDialogOpen && selectedStudent && (
        <StudentDetailDialog
          student={selectedStudent}
          onClose={() => {
            setDetailDialogOpen(false);
            setSelectedStudent(null);
          }}
          onUnban={(studentId: number) => {
            progressTrackingService.updateStudentProgress(studentId, {
              status: "ON_TRACK",
            });
            toast.success("Đã bỏ cấm thi cho sinh viên");
            handleRefresh();
          }}
          onReviewClick={(reportId) => {
            setDetailDialogOpen(false);
            setTabValue(1); // Chuyển sang Tab Báo cáo chờ duyệt
            // Ideally we could select this specific report, but Tab 1 lists all pending
          }}
        />
      )}

      {/* Notification Drawer */}
      <Dialog
        open={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{ "& .MuiDialog-paper": { maxHeight: "80vh" } }}
      >
        {teacherId !== undefined && (
          <NotificationList recipientId={teacherId} maxHeight={500} />
        )}
      </Dialog>
    </Box>
  );
}
