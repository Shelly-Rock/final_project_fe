"use client";

import { Grid, Typography } from "@mui/material";
import { Card, CardHeader, CardContentDiv } from "@/shared/components";

interface DefenseScheduleStatsProps {
  stats: {
    totalSessions: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    totalProjectsDefended: number;
    averageScore: number | null;
  };
}

export function DefenseScheduleStats({ stats }: DefenseScheduleStatsProps) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={2}>
        <Card>
          <CardHeader title="Tổng lịch" />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {stats.totalSessions}
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <Card>
          <CardHeader title="Đã lên lịch" />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1976d2" }}>
              {stats.scheduled}
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <Card>
          <CardHeader title="Hoàn thành" />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#22c55e" }}>
              {stats.completed}
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <Card>
          <CardHeader title="Đã hủy" />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#ef4444" }}>
              {stats.cancelled}
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <Card>
          <CardHeader title="Đề tài đã bảo vệ" />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {stats.totalProjectsDefended}
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <Card>
          <CardHeader title="Điểm TB" />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {stats.averageScore !== null
                ? stats.averageScore.toFixed(2)
                : "-"}
              <Typography component="span" variant="body2">
                /10
              </Typography>
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>
    </Grid>
  );
}
