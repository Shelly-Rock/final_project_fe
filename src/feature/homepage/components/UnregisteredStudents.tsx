"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { UNREGISTERED_STATS } from "../data";

export function UnregisteredStudents() {
  const { total, registered, unregistered } = UNREGISTERED_STATS;
  const registeredPercent = Math.round((registered / total) * 100);
  const unregisteredPercent = Math.round((unregistered / total) * 100);

  return (
    <Card className="dashboard-card unregistered-students-card">
      <Box className="dashboard-card-header">
        <Typography className="dashboard-card-title">
          <i
            className="bi bi-people"
            style={{ marginRight: 8, color: "#7a52cc" }}
          />
          Sinh viên chưa đăng ký
        </Typography>
      </Box>
      <Box className="dashboard-card-body">
        <Box className="registration-stats">
          <Box className="registration-stat-item">
            <Box className="registration-stat-header">
              <Typography className="registration-stat-label">
                Sinh viên đủ điều kiện
              </Typography>
              <Typography className="registration-stat-value">
                {total}
              </Typography>
            </Box>
          </Box>

          <Box className="registration-stat-item">
            <Box className="registration-stat-header">
              <Typography
                className="registration-stat-label"
                sx={{ color: "#1dab60" }}
              >
                Đã đăng ký
              </Typography>
              <Typography
                className="registration-stat-value"
                sx={{ color: "#1dab60" }}
              >
                {registered}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={registeredPercent}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#e8fff5",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#1dab60",
                  borderRadius: 4,
                },
              }}
            />
            <Typography className="registration-stat-percent">
              {registeredPercent}%
            </Typography>
          </Box>

          <Box className="registration-stat-item">
            <Box className="registration-stat-header">
              <Typography
                className="registration-stat-label"
                sx={{ color: "#d13b3b" }}
              >
                Chưa đăng ký
              </Typography>
              <Typography
                className="registration-stat-value"
                sx={{ color: "#d13b3b" }}
              >
                {unregistered}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={unregisteredPercent}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#ffebeb",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#d13b3b",
                  borderRadius: 4,
                },
              }}
            />
            <Typography className="registration-stat-percent">
              {unregisteredPercent}%
            </Typography>
          </Box>
        </Box>

        <Button
          fullWidth
          size="small"
          endIcon={<span className="bi bi-list-ul" />}
          sx={{
            mt: 2,
            color: "#7a52cc",
            fontWeight: 600,
            border: "1px solid #f3eeff",
            backgroundColor: "#fcf8ff",
            "&:hover": {
              backgroundColor: "#f3eeff",
            },
          }}
        >
          Xem danh sách sinh viên
        </Button>
      </Box>
    </Card>
  );
}
