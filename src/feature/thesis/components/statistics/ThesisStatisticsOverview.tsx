"use client";

import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  LinearProgress,
} from "@mui/material";
import {
  School as ThesisIcon,
  CheckCircle as CompletedIcon,
  TrendingUp as ProgressIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  mockThesisStatistics,
  departmentStatistics,
  lecturerStatistics,
  formatPercentage,
  getCompletionRate,
} from "@/feature/thesis/constants";

export function ThesisStatisticsOverview() {
  const stats = mockThesisStatistics;

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <ThesisIcon sx={{ fontSize: 40, color: "primary.main" }} />
                <Box>
                  <Typography variant="h4">{stats.totalTopics}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng đề tài
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Chip label={`${stats.approvedTopics} đã duyệt`} size="small" color="success" />
                <Chip label={`${stats.rejectedTopics} từ chối`} size="small" color="error" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CompletedIcon sx={{ fontSize: 40, color: "success.main" }} />
                <Box>
                  <Typography variant="h4">{stats.completedStudents}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    SV hoàn thành
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {getCompletionRate(stats.completedStudents, stats.totalStudents)}% hoàn thành
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={getCompletionRate(stats.completedStudents, stats.totalStudents)}
                  sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <ProgressIcon sx={{ fontSize: 40, color: "info.main" }} />
                <Box>
                  <Typography variant="h4">{stats.inProgressStudents}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đang thực hiện
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
                Tiến độ trung bình: {stats.averageScore.toFixed(1)}/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <WarningIcon sx={{ fontSize: 40, color: "warning.main" }} />
                <Box>
                  <Typography variant="h4">{stats.lateRate * 100}%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tỷ lệ trễ hạn
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Chip label={`${stats.retakeRate * 100}% bảo vệ lại`} size="small" color="error" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Metrics */}
      <Grid container spacing={3}>
        {/* By Department */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thống kê theo khoa
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {departmentStatistics.map((dept) => (
                <Box key={dept.department}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {dept.department}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Điểm TB: {dept.avgScore.toFixed(1)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getCompletionRate(dept.completedStudents, dept.totalTopics)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "primary.main",
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {dept.completedStudents}/{dept.totalTopics} hoàn thành
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* By Lecturer */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thống kê theo GVHD
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {lecturerStatistics.map((lecturer) => (
                <Box
                  key={lecturer.lecturerId}
                  sx={{
                    p: 2,
                    bgcolor: "grey.50",
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {lecturer.lecturerName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Điểm TB: {lecturer.avgScore.toFixed(1)}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2}>
                    <Chip
                      label={`${lecturer.completedStudents}/${lecturer.totalStudents} SV`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`Đúng hạn: ${formatPercentage(lecturer.onTimeRate)}`}
                      size="small"
                      color={lecturer.onTimeRate >= 0.8 ? "success" : "warning"}
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Processing Time */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Thời gian xử lý trung bình
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                bgcolor: "primary.light",
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="h3" color="primary.dark">
                {stats.avgRegistrationToConfirmation}
              </Typography>
              <Typography variant="body2" color="primary.dark">
                ngày
              </Typography>
              <Typography variant="caption" color="primary.dark">
                Đăng ký → Xác nhận
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                bgcolor: "info.light",
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="h3" color="info.dark">
                {stats.avgReadyToDefense}
              </Typography>
              <Typography variant="body2" color="info.dark">
                ngày
              </Typography>
              <Typography variant="caption" color="info.dark">
                Đủ điều kiện → Bảo vệ
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
