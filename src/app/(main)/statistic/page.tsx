"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from "@mui/material";
import { PageHeader } from "@/shared/components";
import { mockStatistics } from "@/feature/statistic/constants";

export default function StatisticPage() {
  return (
    <Box sx={{ p: 3 }}>
      <PageHeader title="Thống kê" subtitle="Thống kê dữ liệu hệ thống" />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockStatistics.overview.totalStudents}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng sinh viên
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockStatistics.overview.totalTeachers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Giảng viên
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mockStatistics.overview.totalTheses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng đồ án
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {Math.round(
                  (mockStatistics.overview.completedTheses /
                    mockStatistics.overview.totalTheses) *
                    100,
                )}
                %
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tỷ lệ hoàn thành
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Tỷ lệ hoàn thành theo khoa
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Khoa</TableCell>
                      <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                        Tổng
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                        Hoàn thành
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Tỷ lệ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockStatistics.byDepartment.map((dept) => (
                      <TableRow key={dept.department}>
                        <TableCell>{dept.department}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {dept.total}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {dept.completed}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <LinearProgress
                              variant="determinate"
                              value={dept.rate}
                              sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="body2">
                              {dept.rate}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Phân bố điểm
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Khoảng điểm
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                        Số lượng
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Tỷ lệ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockStatistics.byScore.map((score) => (
                      <TableRow key={score.range}>
                        <TableCell>{score.range}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {score.count}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <LinearProgress
                              variant="determinate"
                              value={score.percentage}
                              sx={{
                                flexGrow: 1,
                                height: 8,
                                borderRadius: 4,
                                bgcolor: "grey.200",
                                "& .MuiLinearProgress-bar": {
                                  bgcolor:
                                    score.range === "9-10"
                                      ? "success.main"
                                      : score.range === "8-9"
                                        ? "info.main"
                                        : "warning.main",
                                },
                              }}
                            />
                            <Typography variant="body2">
                              {score.percentage}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
