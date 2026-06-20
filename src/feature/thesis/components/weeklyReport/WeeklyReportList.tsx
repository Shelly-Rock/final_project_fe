"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Stack,
  Avatar,
  Rating,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  RateReview as FeedbackIcon,
} from "@mui/icons-material";
import { FilterBar } from "@/shared/components";
import {
  mockWeeklyReports,
  getWeeklyReportStatusColor,
  getWeekLabel,
} from "@/feature/thesis/constants";
import { StatusBadge } from "@/feature/thesis/components/registration/RegistrationStatusBadge";
import type { WeeklyReport, WeeklyReportStatus } from "@/feature/thesis/types";

interface WeeklyReportListProps {
  reports?: WeeklyReport[];
  studentId?: string;
  registrationId?: string;
  showFeedback?: boolean;
  onView?: (report: WeeklyReport) => void;
  onGiveFeedback?: (report: WeeklyReport) => void;
}

export function WeeklyReportList({
  reports = mockWeeklyReports,
  studentId,
  registrationId,
  showFeedback = true,
  onView,
  onGiveFeedback,
}: WeeklyReportListProps) {
  const [statusFilter, setStatusFilter] = useState<WeeklyReportStatus | "all">("all");
  const [tab, setTab] = useState(0);

  // Filter reports
  const filteredReports = reports.filter((report) => {
    if (studentId && report.studentId !== studentId) return false;
    if (registrationId && report.registrationId !== registrationId) return false;
    if (statusFilter !== "all" && report.status !== statusFilter) return false;
    return true;
  });

  // Group by student for overview tab
  const reportsByStudent = filteredReports.reduce((acc, report) => {
    if (!acc[report.studentId]) {
      acc[report.studentId] = {
        studentName: report.studentName,
        reports: [],
      };
    }
    acc[report.studentId].reports.push(report);
    return acc;
  }, {} as Record<string, { studentName: string; reports: WeeklyReport[] }>);

  // Stats
  const stats = {
    total: filteredReports.length,
    pending: filteredReports.filter((r) => r.status === "submitted" || r.status === "waiting_feedback").length,
    approved: filteredReports.filter((r) => r.status === "approved").length,
    revision: filteredReports.filter((r) => r.status === "revision").length,
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Danh sách báo cáo" />
          <Tab label={`Theo sinh viên (${Object.keys(reportsByStudent).length})`} />
        </Tabs>
      </Box>

      {tab === 0 && (
        <>
          {/* Stats */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
              <Typography variant="h4" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng báo cáo
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
              <Typography variant="h4" color="warning.main">
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chờ xử lý
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
              <Typography variant="h4" color="success.main">
                {stats.approved}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã duyệt
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
              <Typography variant="h4" color="error.main">
                {stats.revision}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cần sửa lại
              </Typography>
            </Paper>
          </Stack>

          <FilterBar
            totalCount={reports.length}
            filteredCount={filteredReports.length}
          >
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                label="Trạng thái"
                onChange={(e) => setStatusFilter(e.target.value as WeeklyReportStatus | "all")}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="draft">Nháp</MenuItem>
                <MenuItem value="submitted">Đã nộp</MenuItem>
                <MenuItem value="waiting_feedback">Chờ phản hồi</MenuItem>
                <MenuItem value="approved">Đã duyệt</MenuItem>
                <MenuItem value="revision">Yêu cầu nộp lại</MenuItem>
              </Select>
            </FormControl>
          </FilterBar>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.100" }}>
                  <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Sinh viên</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tuần</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tiến độ tự đánh giá</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Điểm tiến độ</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ngày nộp</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.map((report, index) => (
                  <TableRow key={report.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                          {report.studentName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {report.studentName}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getWeekLabel(report.weekNumber, report.semester)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 6,
                            bgcolor: "grey.200",
                            borderRadius: 3,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${report.selfProgress}%`,
                              height: "100%",
                              bgcolor:
                                report.selfProgress >= 80
                                  ? "success.main"
                                  : report.selfProgress >= 50
                                    ? "warning.main"
                                    : "error.main",
                            }}
                          />
                        </Box>
                        <Typography variant="caption">
                          {report.selfProgress}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={report.status} />
                    </TableCell>
                    <TableCell>
                      {report.progressScore !== undefined ? (
                        <Chip
                          label={report.progressScore}
                          color={report.progressScore >= 8 ? "success" : report.progressScore >= 6 ? "warning" : "error"}
                          size="small"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{report.submittedAt}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton size="small" onClick={() => onView?.(report)}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {(report.status === "submitted" || report.status === "waiting_feedback") && showFeedback && (
                        <Tooltip title="Phản hồi">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onGiveFeedback?.(report)}
                          >
                            <FeedbackIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {tab === 1 && (
        <Stack spacing={3}>
          {Object.entries(reportsByStudent).map(([stuId, data]) => (
            <Paper key={stuId} sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {data.studentName.charAt(0)}
                </Avatar>
                <Typography variant="h6">{data.studentName}</Typography>
                <Chip label={`${data.reports.length} báo cáo`} size="small" />
              </Box>
              <Stack spacing={1}>
                {data.reports.map((report) => (
                  <Box
                    key={report.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1,
                      bgcolor: "grey.50",
                      borderRadius: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="body2">
                        {getWeekLabel(report.weekNumber, report.semester)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Nộp: {report.submittedAt}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="caption">
                        Tiến độ: {report.selfProgress}%
                      </Typography>
                      <StatusBadge status={report.status} />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
