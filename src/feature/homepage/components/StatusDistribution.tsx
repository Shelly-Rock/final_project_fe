"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { STATUS_DISTRIBUTION } from "../data";

export function StatusDistribution() {
  const maxPercent = Math.max(...STATUS_DISTRIBUTION.map((s) => s.percent));

  return (
    <Card className="dashboard-card status-distribution-card">
      <Box className="dashboard-card-header">
        <Typography className="dashboard-card-title">
          <i
            className="bi bi-pie-chart-fill"
            style={{ marginRight: 8, color: "#2a5bc0" }}
          />
          Phân bố trạng thái đồ án
        </Typography>
      </Box>
      <Box className="dashboard-card-body">
        <Box className="status-distribution-list">
          {STATUS_DISTRIBUTION.map((status) => (
            <Box key={status.name} className="status-distribution-item">
              <Box className="status-distribution-header">
                <Box className="status-distribution-label">
                  <Box
                    className="status-distribution-dot"
                    sx={{ backgroundColor: status.color }}
                  />
                  <Typography className="status-distribution-name">
                    {status.name}
                  </Typography>
                </Box>
                <Typography className="status-distribution-value">
                  {status.percent}%
                </Typography>
              </Box>
              <Box className="status-distribution-bar-bg">
                <Box
                  className="status-distribution-bar"
                  sx={{
                    width: `${(status.percent / maxPercent) * 100}%`,
                    backgroundColor: status.color,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
}
