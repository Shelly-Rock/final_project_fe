"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { OVERVIEW_STATS } from "../data";

export function OverviewStats() {
  return (
    <Box className="overview-stats-section">
      <Grid container spacing={3}>
        {OVERVIEW_STATS.map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Box
              className="stat-card"
              sx={
                {
                  "--stat-color": stat.color,
                  "--stat-bg": stat.bg,
                } as React.CSSProperties
              }
            >
              {/* Background pattern */}
              <Box className="stat-card-pattern" />

              {/* Gradient accent line */}
              <Box className="stat-card-accent" />

              {/* Content wrapper */}
              <Box className="stat-card-content">
                {/* Top: Icon + Trend */}
                <Box className="stat-card-header">
                  <Box className="stat-icon">
                    <span className={`bi ${stat.icon}`} />
                  </Box>
                  <Box className="stat-trend">
                    <span className="bi bi-arrow-up" />
                    <span>{stat.sub}</span>
                  </Box>
                </Box>

                {/* Middle: Value */}
                <Box className="stat-value-wrap">
                  <Typography className="stat-value">{stat.value}</Typography>
                </Box>

                {/* Bottom: Label */}
                <Box className="stat-label-wrap">
                  <Typography className="stat-label">{stat.label}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
