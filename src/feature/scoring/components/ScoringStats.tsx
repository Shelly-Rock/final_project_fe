"use client";

import { Grid, Typography } from "@mui/material";
import { Card, CardHeader, CardContentDiv } from "@/shared/components";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

interface ScoringStatsProps {
  stats: {
    total: number;
    pending: number;
    submitted: number;
    failed: number;
  };
}

export function ScoringStats({ stats }: ScoringStatsProps) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardHeader
            title="Tổng phiếu"
            action={<FileText size={20} color="#64748b" />}
          />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {stats.total}
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardHeader
            title="Chưa chấm"
            action={<Clock size={20} color="#f97316" />}
          />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#f97316" }}>
              {stats.pending}
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardHeader
            title="Đã nộp"
            action={<CheckCircle size={20} color="#22c55e" />}
          />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#22c55e" }}>
              {stats.submitted}
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardHeader
            title="Bị rớt"
            action={<XCircle size={20} color="#ef4444" />}
          />
          <CardContentDiv padding={2}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#ef4444" }}>
              {stats.failed}
            </Typography>
          </CardContentDiv>
        </Card>
      </Grid>
    </Grid>
  );
}
