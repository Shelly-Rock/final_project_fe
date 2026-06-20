"use client";

import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  monthlyStatistics,
  rejectionReasons,
  formatPercentage,
} from "@/feature/thesis/constants";

export function ThesisProgressChart() {
  // Find max values for scaling
  const maxRegistrations = Math.max(...monthlyStatistics.map((m) => m.registrations));
  const maxCompletions = Math.max(...monthlyStatistics.map((m) => m.completions));

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Monthly Registration & Completion */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Đăng ký và hoàn thành theo tháng
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              {/* Chart */}
              <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 200, px: 2 }}>
                {monthlyStatistics.map((month) => {
                  const regHeight = (month.registrations / maxRegistrations) * 150;
                  const compHeight = (month.completions / maxCompletions) * 150;
                  
                  return (
                    <Box
                      key={month.month}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 0.5,
                        flex: 1,
                      }}
                    >
                      {/* Bars */}
                      <Box sx={{ display: "flex", gap: 0.5, alignItems: "flex-end" }}>
                        <Box
                          sx={{
                            width: 20,
                            height: regHeight,
                            bgcolor: "primary.main",
                            borderRadius: "4px 4px 0 0",
                            transition: "height 0.5s ease-in-out",
                          }}
                        />
                        <Box
                          sx={{
                            width: 20,
                            height: compHeight,
                            bgcolor: "success.main",
                            borderRadius: "4px 4px 0 0",
                            transition: "height 0.5s ease-in-out",
                          }}
                        />
                      </Box>
                      
                      {/* Label */}
                      <Typography variant="caption" color="text.secondary">
                        {month.month.split("/")[0]}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>

              {/* Legend */}
              <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: "primary.main", borderRadius: 0.5 }} />
                  <Typography variant="caption">Đăng ký</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: "success.main", borderRadius: 0.5 }} />
                  <Typography variant="caption">Hoàn thành</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Rejection Reasons */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Lý do từ chối đề tài
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              {rejectionReasons.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography variant="body2" sx={{ maxWidth: "70%" }}>
                      {item.reason}
                    </Typography>
                    <Chip label={item.count} size="small" color="error" />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(item.count / rejectionReasons[0].count) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "error.main",
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: "primary.light" }}>
            <Typography variant="subtitle2" color="primary.dark">
              Tổng đăng ký
            </Typography>
            <Typography variant="h4" color="primary.dark">
              {monthlyStatistics.reduce((sum, m) => sum + m.registrations, 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: "success.light" }}>
            <Typography variant="subtitle2" color="success.dark">
              Tổng hoàn thành
            </Typography>
            <Typography variant="h4" color="success.dark">
              {monthlyStatistics.reduce((sum, m) => sum + m.completions, 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: "warning.light" }}>
            <Typography variant="subtitle2" color="warning.dark">
              Tỷ lệ hoàn thành/dăng ký
            </Typography>
            <Typography variant="h4" color="warning.dark">
              {formatPercentage(
                monthlyStatistics.reduce((sum, m) => sum + m.completions, 0) /
                monthlyStatistics.reduce((sum, m) => sum + m.registrations, 0)
              )}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
