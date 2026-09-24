"use client";

import type { ReactNode } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import {
  FileText,
  Clock,
  AlertTriangle,
  Users,
  Megaphone,
  CheckCircle,
} from "lucide-react";
import { Card, CardContentDiv } from "@/shared/components";
import { getCardBackground } from "@/shared/constants/gradients";

export interface ScoringOverviewStats {
  total: number;
  pending: number;
  overdue: number;
  waitingMeeting: number;
  waitingPublish: number;
  published: number;
}

export function ScoringStatCard({
  label,
  value,
  subtext,
  icon,
  iconColor,
}: {
  label: string;
  value: number | string;
  subtext: string;
  icon: ReactNode;
  iconColor: string;
}) {
  const theme = useTheme();

  return (
    <Card
      variant="soft"
      sx={{
        background: getCardBackground(theme),
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        height: "100%",
      }}
    >
      <CardContentDiv padding={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{ display: "block", opacity: 0.7, fontWeight: 500 }}
          >
            {label}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 1,
              backgroundColor: `${iconColor}15`,
            }}
          >
            <Box sx={{ color: iconColor, display: "flex" }}>{icon}</Box>
          </Box>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
          {value}
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: "block", fontSize: "9px", opacity: 0.7 }}
        >
          {subtext}
        </Typography>
      </CardContentDiv>
    </Card>
  );
}

export function ScoringStats({ stats }: { stats: ScoringOverviewStats }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(6, 1fr)",
        },
        gap: 2,
        mb: 2.5,
      }}
    >
      <ScoringStatCard
        label="Tổng phiếu"
        value={stats.total}
        subtext="GVHD + hội đồng"
        icon={<FileText size={18} />}
        iconColor="#2a78d6"
      />
      <ScoringStatCard
        label="Chưa chấm"
        value={stats.pending}
        subtext="Đang chờ giảng viên"
        icon={<Clock size={18} />}
        iconColor="#eda100"
      />
      <ScoringStatCard
        label="Quá hạn"
        value={stats.overdue}
        subtext="Cần đôn đốc ngay"
        icon={<AlertTriangle size={18} />}
        iconColor="#e34948"
      />
      <ScoringStatCard
        label="Chờ họp chốt"
        value={stats.waitingMeeting}
        subtext="Đủ phiếu, chưa chốt"
        icon={<Users size={18} />}
        iconColor="#eb6834"
      />
      <ScoringStatCard
        label="Chờ công bố"
        value={stats.waitingPublish}
        subtext="Đã chốt, chưa publish"
        icon={<Megaphone size={18} />}
        iconColor="#4a3aa7"
      />
      <ScoringStatCard
        label="Đã công bố"
        value={stats.published}
        subtext="Sinh viên đã xem điểm"
        icon={<CheckCircle size={18} />}
        iconColor="#1baf7a"
      />
    </Box>
  );
}
