"use client";

import { Grid, Typography } from "@mui/material";
import { Card, CardHeader, CardContentDiv } from "@/shared/components";
import type { CommitteeStats } from "../services";

interface CommitteeStatsProps {
  stats: CommitteeStats;
}

export function CommitteeStats({ stats }: CommitteeStatsProps) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardHeader title="Tổng hội đồng" />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {stats.totalCommittees}
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardHeader title="Đủ thành viên" />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#22c55e" }}>
              {stats.committeesWithFullMembers}
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardHeader title="Thiếu thành viên" />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#f97316" }}>
              {stats.committeesMissingMembers}
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardHeader title="PB ngoài" />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {stats.totalExternalReviewers}{" "}
              <Typography component="span" variant="body2">
                người
              </Typography>
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>
    </Grid>
  );
}
