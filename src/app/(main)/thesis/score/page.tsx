"use client";

import { Box } from "@mui/material";
import { PageHeader } from "@/shared/components";
import { mockScores } from "@/feature/thesis/constants";
import { ThesisScoreTable } from "@/feature/thesis/components/ThesisScoreTable";

export default function ThesisScorePage() {
  return (
    <Box sx={{ p: 3 }}>
      <PageHeader title="Chấm điểm" subtitle="Quản lý điểm đồ án tốt nghiệp" />

      <ThesisScoreTable scores={mockScores} />
    </Box>
  );
}
