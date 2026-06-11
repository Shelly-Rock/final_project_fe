"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { THESIS_TREND } from "../data";

export function ThesisTrendChart() {
  const maxCount = Math.max(...THESIS_TREND.map((t) => t.count));

  return (
    <Card className="dashboard-card thesis-trend-card" sx={{ p: 2, mb: 4 }}>
      <Box className="dashboard-card-header">
        <Typography className="dashboard-card-title">
          <i
            className="bi bi-graph-up-arrow"
            style={{ marginRight: 8, color: "#2a5bc0" }}
          />
          Xu hướng đồ án theo năm
        </Typography>
      </Box>
      <Box className="dashboard-card-body">
        <Box className="trend-chart">
          {/* Chart Content */}
          <Box className="trend-chart-content">
            {/* Y-Axis Labels */}
            <Box className="trend-y-axis">
              <Typography className="trend-y-label">{maxCount}</Typography>
              <Typography className="trend-y-label">
                {Math.round(maxCount / 2)}
              </Typography>
              <Typography className="trend-y-label">0</Typography>
            </Box>

            {/* Chart Area with Grid Lines */}
            <Box className="trend-chart-area">
              {/* Grid Lines */}
              <Box className="trend-chart-grid-lines">
                <Box className="trend-chart-grid-line" />
                <Box className="trend-chart-grid-line" />
                <Box className="trend-chart-grid-line" />
              </Box>

              {/* Bars */}
              <Box className="trend-bars-container">
                {THESIS_TREND.map((item) => (
                  <Box key={item.year} className="trend-bar-wrapper">
                    <Box className="trend-bar-value">{item.count}</Box>
                    <Box
                      className="trend-bar"
                      sx={{
                        height: `${(item.count / maxCount) * 100}%`,
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* X-Axis Years */}
          <Box className="trend-x-axis">
            {THESIS_TREND.map((item) => (
              <Typography key={item.year} className="trend-year">
                {item.year}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
