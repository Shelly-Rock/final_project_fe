"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FACULTY_PROGRESS_DATA } from "../data";

export function FacultyCharts() {
  const displayData = FACULTY_PROGRESS_DATA.slice(0, 4);

  return (
    <Card sx={{ p: 2, mb: 4 }}>
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
      <Box className="faculty-charts-scroll">
        <Box className="faculty-charts-grid">
          {displayData.map((f) => {
            const total =
              f.HoànThành + f["Đang thực hiện"] + f["Chờ duyệt"] + f["Từ chối"];
            const completed = f.HoànThành;
            const percent =
              total > 0 ? Math.round((completed / total) * 100) : 0;

            const chartData = [
              { name: "completed", value: completed },
              { name: "remaining", value: total - completed },
            ];

            return (
              <Card
                key={f.code}
                className="circle-chart-card"
                sx={{ borderTop: `3px solid ${f.color}` }}
              >
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
            );
          })}
        </Box>
      </Box>
    </Card>
  );
}
