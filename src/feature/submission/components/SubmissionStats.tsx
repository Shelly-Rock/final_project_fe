"use client";

import { Grid, Typography } from "@mui/material";
import { Card, CardHeader, CardContentDiv } from "@/shared/components";

interface SubmissionStatsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export function SubmissionStats({ stats }: SubmissionStatsProps) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardHeader title="Tổng bài nộp" />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {stats.total}
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardHeader title="Chờ duyệt" />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#f97316" }}>
              {stats.pending}
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardHeader title="Đã duyệt" />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#22c55e" }}>
              {stats.approved}
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardHeader title="Từ chối" />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#ef4444" }}>
              {stats.rejected}
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>
    </Grid>
  );
}
