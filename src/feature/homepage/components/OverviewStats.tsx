"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { ROLE } from "@/core/permissions/types";
import { ROLE_STATS } from "../roleData";

interface OverviewStatsProps {
  role?:
    | typeof ROLE.ADMIN
    | typeof ROLE.SECRETARY
    | typeof ROLE.TEACHER
    | typeof ROLE.STUDENT
    | typeof ROLE.COUNCIL;
}

const DEFAULT_ROLE = ROLE.ADMIN;

export function OverviewStats({ role = DEFAULT_ROLE }: OverviewStatsProps) {
  const stats = ROLE_STATS[role]?.stats ?? ROLE_STATS[DEFAULT_ROLE].stats;

  return (
    <Box className="overview-stats-section">
      <Grid container spacing={3}>
        {stats.map((stat) => (
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
              <Box className="stat-card-pattern" />
              <Box className="stat-card-accent" />
              <Box className="stat-card-content">
                <Box className="stat-card-header">
                  <Box className="stat-icon">
                    <span className={`bi ${stat.icon}`} />
                  </Box>
                  <Box className="stat-trend">
                    <span className="bi bi-arrow-up" />
                    <span>{stat.sub}</span>
                  </Box>
                </Box>
                <Box className="stat-value-wrap">
                  <Typography className="stat-value">{stat.value}</Typography>
                </Box>
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
