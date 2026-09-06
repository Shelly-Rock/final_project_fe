"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { toast } from "sonner";
import { progressTrackingService } from "../services";
import type {
  StudentProgress,
  BanWarning,
  ProgressStatus,
  ProgressStatistics,
} from "../services/progress-tracking.service";

interface _AutoBanCheckProps {
  teacherId?: number;
}

const STATUS_LABELS: Record<ProgressStatus, string> = {
  ON_TRACK: "Tiến hành",
  EXTENDED: "Gia hạn",
  TOPIC_CHANGED: "Đổi đề tài",
  BANNED: "Cấm thi",
};

// ============================================================
// Statistics Cards
// ============================================================

interface ProgressStatsCardsProps {
  teacherId?: number;
}

export function ProgressStatsCards({
  teacherId: _teacherId,
}: ProgressStatsCardsProps) {
  const [stats, setStats] = useState<ProgressStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await progressTrackingService.getStatistics();
      setStats(data);
    } catch {
      toast.error("Không thể tải thống kê");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) return null;

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6} sm={4} md={2}>
        <Card>
          <CardContent sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h4" color="primary" fontWeight={700}>
              {stats.totalStudents}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tổng sinh viên
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Card>
          <CardContent sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h4" color="success.main" fontWeight={700}>
              {stats.onTrackStudents}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tiến hành tốt
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Card>
          <CardContent sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h4" color="warning.main" fontWeight={700}>
              {stats.extendedStudents}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Được gia hạn
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Card>
          <CardContent sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h4" color="error.main" fontWeight={700}>
              {stats.bannedStudents}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Bị cấm thi
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Card>
          <CardContent sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h4" color="info.main" fontWeight={700}>
              {stats.pendingReports}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Chờ duyệt
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Card>
          <CardContent sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="h4" color="success.main" fontWeight={700}>
              {stats.complianceRate}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tuân thủ
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// ============================================================
// Student Progress Table (for Teacher view)
// ============================================================

interface StudentProgressTableProps {
  teacherId?: number;
  onStatusChange?: (studentId: number, progressId: number) => void;
  onViewDetails?: (student: StudentProgress) => void;
}

export function StudentProgressTable({
  teacherId,
  onStatusChange,
  onViewDetails,
}: StudentProgressTableProps) {
  const [progressList, setProgressList] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    setLoading(true);
    try {
      const result = await progressTrackingService.getStudentProgress({
        teacherId,
        page: 1,
        limit: 100,
      });
      setProgressList(result.data);
    } catch {
      toast.error("Không thể tải danh sách tiến độ");
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

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
            icon={<RefreshIcon />}
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
      <Box sx={{ p: 3, textAlign: "center" }}>
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
          Danh sách tiến độ sinh viên ({progressList.length})
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadProgress}
          variant="outlined"
          size="small"
        >
          Làm mới
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell sx={{ fontWeight: 600 }}>Sinh viên</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>MSSV</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Đề tài</TableCell>
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
            {progressList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Không có sinh viên nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              progressList.map((progress) => (
                <TableRow
                  key={progress.studentId}
                  hover
                  sx={{
                    bgcolor: progress.isBanned ? "error.50" : "inherit",
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {progress.studentName ?? "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {progress.studentMssv ?? "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200 }}>
                      {progress.topicName ?? "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={600}>
                      {progress.totalReportsSubmitted}/
                      {progress.totalReportsRequired}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {getStatusChip(progress.status, progress.isBanned)}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          onClick={() => onViewDetails?.(progress)}
                        >
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {!progress.isBanned && onStatusChange && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            onStatusChange(progress.studentId, progress.id)
                          }
                        >
                          Cập nhật
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// ============================================================
// Ban Warnings List Component
// ============================================================

interface BanWarningsListProps {
  teacherId?: number;
}

export function BanWarningsList({ teacherId }: BanWarningsListProps) {
  const [warnings, setWarnings] = useState<BanWarning[]>([]);
  const [loading, setLoading] = useState(true);

  const checkBans = useCallback(async () => {
    setLoading(true);
    try {
      const allWarnings = await progressTrackingService.getBanWarnings();
      if (teacherId !== undefined) {
        const progressList = await progressTrackingService.getStudentProgress({
          teacherId,
          page: 1,
          limit: 100,
        });
        const teacherStudentIds = new Set(
          progressList.data.map((p) => p.studentId),
        );
        const filteredWarnings = allWarnings.filter((w) =>
          teacherStudentIds.has(w.studentId),
        );
        setWarnings(filteredWarnings);
      } else {
        setWarnings(allWarnings);
      }
    } catch {
      toast.error("Không thể kiểm tra cảnh báo");
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    checkBans();
  }, [checkBans]);

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (warnings.length === 0) {
    return null;
  }

  return (
    <Alert
      severity="warning"
      icon={<WarningIcon />}
      action={
        <Button
          color="inherit"
          size="small"
          onClick={checkBans}
          startIcon={<RefreshIcon />}
        >
          Kiểm tra lại
        </Button>
      }
    >
      <Typography variant="subtitle2" gutterBottom>
        Cảnh báo cấm thi ({warnings.length} sinh viên)
      </Typography>
      <Box component="ul" sx={{ m: 0, pl: 3 }}>
        {warnings.map((warning) => (
          <li key={warning.studentId}>
            <Typography variant="body2">
              <strong>{warning.studentName}</strong> — Còn{" "}
              <Badge badgeContent={warning.daysUntilBan} color="error">
                <Typography component="span" variant="body2">
                  ngày
                </Typography>
              </Badge>{" "}
              để nộp báo cáo. Hiện tại: {warning.reportsSubmitted}/
              {warning.reportsRequired} báo cáo.
            </Typography>
          </li>
        ))}
      </Box>
    </Alert>
  );
}

// ============================================================
// Banned Students List Component
// ============================================================

interface BannedStudentsListProps {
  teacherId?: number;
  onUnban?: (studentId: number) => void;
}

export function BannedStudentsList({
  teacherId: _teacherId,
  onUnban,
}: BannedStudentsListProps) {
  const [bannedStudents, setBannedStudents] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentProgress | null>(null);

  const loadBannedStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await progressTrackingService.getBannedStudents();
      setBannedStudents(data);
    } catch {
      toast.error("Không thể tải danh sách sinh viên bị cấm");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBannedStudents();
  }, [loadBannedStudents]);

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (bannedStudents.length === 0) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, mb: 2, border: "2px solid", borderColor: "error.main" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <BlockIcon color="error" />
        <Typography variant="h6" color="error.main">
          Sinh viên bị cấm thi ({bannedStudents.length})
        </Typography>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Sinh viên</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Đề tài</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Lý do</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ngày cấm</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bannedStudents.map((student) => (
              <TableRow key={student.studentId} sx={{ bgcolor: "error.50" }}>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {student.studentName ?? "-"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {student.studentMssv ?? "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 200 }}>
                    {student.topicName ?? "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="error.main">
                    {student.banReason || "Không nộp báo cáo"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {student.bannedAt
                      ? new Date(student.bannedAt).toLocaleDateString("vi-VN")
                      : "-"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={() => setSelectedStudent(student)}
                  >
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Student Detail Dialog */}
      <StudentDetailDialog
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onUnban={onUnban}
      />
    </Paper>
  );
}

// ============================================================
// Student Detail Dialog
// ============================================================

interface StudentDetailDialogProps {
  student: StudentProgress | null;
  onClose: () => void;
  onUnban?: (studentId: number) => void;
}

export function StudentDetailDialog({
  student,
  onClose,
  onUnban,
}: StudentDetailDialogProps) {
  if (!student) return null;

  return (
    <Dialog open={!!student} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <InfoIcon color="primary" />
          Chi tiết tiến độ sinh viên
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Họ tên
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {student.studentName ?? "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              MSSV
            </Typography>
            <Typography variant="body1">
              {student.studentMssv ?? "-"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Đề tài
            </Typography>
            <Typography variant="body1">{student.topicName ?? "-"}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Giảng viên HD
            </Typography>
            <Typography variant="body1">
              {student.teacherName ?? "-"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Trạng thái
            </Typography>
            <Chip
              icon={student.isBanned ? <BlockIcon /> : <CheckCircleIcon />}
              label={
                student.isBanned ? "Cấm thi" : STATUS_LABELS[student.status]
              }
              color={student.isBanned ? "error" : "success"}
            />
          </Grid>

          {student.isBanned && (
            <Grid item xs={12}>
              <Alert severity="error">
                <Typography variant="subtitle2" gutterBottom>
                  Lý do cấm thi
                </Typography>
                <Typography variant="body2">
                  {student.banReason ?? "Không rõ"}
                </Typography>
                {student.bannedAt && (
                  <Typography variant="caption">
                    Ngày cấm:{" "}
                    {new Date(student.bannedAt).toLocaleDateString("vi-VN")}
                  </Typography>
                )}
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Báo cáo đã nộp ({student.totalReportsSubmitted}/
              {student.totalReportsRequired})
            </Typography>
            {student.totalReportsSubmitted === 0 ? (
              <Alert severity="warning">Chưa có báo cáo nào</Alert>
            ) : (
              <Alert severity="info">
                Sinh viên đã nộp {student.totalReportsSubmitted} /{" "}
                {student.totalReportsRequired} báo cáo.
                {student.lastReportDate && (
                  <>
                    {" "}
                    Báo cáo gần nhất:{" "}
                    {new Date(student.lastReportDate).toLocaleDateString(
                      "vi-VN",
                    )}
                    .
                  </>
                )}
              </Alert>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        {student.isBanned && onUnban && (
          <Button
            color="success"
            variant="contained"
            onClick={() => {
              onUnban(student.studentId);
              onClose();
            }}
          >
            Bỏ cấm thi
          </Button>
        )}
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}

// ============================================================
// Auto Ban Check Component (runs on schedule)
// ============================================================

interface AutoBanCheckComponentProps {
  onBanDetected?: (bannedStudentIds: number[]) => void;
}

export function AutoBanCheckComponent({
  onBanDetected,
}: AutoBanCheckComponentProps) {
  const [checking, setChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const runBanCheck = useCallback(async () => {
    setChecking(true);
    try {
      const bannedIds: number[] =
        await progressTrackingService.checkAndBanInactiveStudents();
      setLastCheck(new Date());
      if (bannedIds.length > 0) {
        toast.warning(
          `${bannedIds.length} sinh viên đã bị cấm thi do không nộp báo cáo`,
        );
        onBanDetected?.(bannedIds);
      }
      const warnings = await progressTrackingService.getBanWarnings();
      if (warnings.length > 0) {
        toast.info(`${warnings.length} sinh viên sắp bị cấm thi`, {
          description: warnings
            .map((w) => `${w.studentName} (${w.daysUntilBan} ngày)`)
            .join(", "),
        });
      }
    } catch {
      toast.error("Lỗi khi kiểm tra cấm thi");
    } finally {
      setChecking(false);
    }
  }, [onBanDetected]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Tooltip title="Kiểm tra và tự động cấm thi sinh viên không nộp báo cáo">
        <Button
          variant="outlined"
          color="warning"
          startIcon={
            checking ? <CircularProgress size={18} /> : <WarningIcon />
          }
          onClick={runBanCheck}
          disabled={checking}
        >
          Kiểm tra cấm thi
        </Button>
      </Tooltip>
      {lastCheck && (
        <Typography variant="caption" color="text.secondary">
          Lần kiểm tra cuối: {lastCheck.toLocaleTimeString("vi-VN")}
        </Typography>
      )}
    </Box>
  );
}
