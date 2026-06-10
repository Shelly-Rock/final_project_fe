"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FACULTY_PROGRESS_DATA } from "../data";

export function FacultyCharts() {
  const displayData = FACULTY_PROGRESS_DATA.slice(0, 4);

  return (
    <Box className="dashboard-section">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Tiến độ theo khoa
        </Typography>
        <Button variant="text" size="small" color="primary">
          Xem tất cả
        </Button>
      </Box>
      <Grid container spacing={3}>
        {displayData.map((f) => {
          const total =
            f.HoànThành + f["Đang thực hiện"] + f["Chờ duyệt"] + f["Từ chối"];
          const completed = f.HoànThành;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

          const chartData = [
            { name: "completed", value: completed },
            { name: "remaining", value: total - completed },
          ];

          return (
            <Grid key={f.code} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                className="circle-chart-card"
                sx={{ borderTop: `3px solid ${f.color}` }}
              >
                {/* Header */}
                <Box className="circle-chart-header">
                  <Box
                    className="circle-chart-badge"
                    sx={{ background: `${f.color}15`, color: f.color }}
                  >
                    {f.code}
                  </Box>
                  <Typography className="circle-chart-title">
                    {f.faculty}
                  </Typography>
                </Box>

                {/* Donut Chart */}
                <Box className="circle-chart-wrapper">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={72}
                        paddingAngle={2}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        strokeWidth={0}
                      >
                        <Cell fill={f.color} className="circle-chart-segment" />
                        <Cell fill="#f1f5f9" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center text */}
                  <Box className="circle-chart-center">
                    <Typography
                      className="circle-chart-total"
                      sx={{ color: f.color }}
                    >
                      {total}
                    </Typography>
                    <Typography className="circle-chart-label">
                      đồ án
                    </Typography>
                  </Box>
                </Box>

                {/* Progress */}
                <Box className="circle-chart-progress">
                  <Box className="circle-chart-progress-bar">
                    <Box
                      className="circle-chart-progress-fill"
                      sx={{
                        width: `${percent}%`,
                        background: f.color,
                      }}
                    />
                  </Box>
                  <Typography
                    className="circle-chart-percent"
                    sx={{ color: f.color }}
                  >
                    {percent}% hoàn thành
                  </Typography>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
