"use client";

import { Box } from "@mui/material";
import { PageHeader } from "@/shared/components";
import { mockDefenses } from "@/feature/thesis/constants";
import { ThesisDefenseTable } from "@/feature/thesis/components/ThesisDefenseTable";

export default function ThesisDefensePage() {
  return (
    <Box sx={{ p: 3 }}>
      <PageHeader title="Bảo vệ" subtitle="Lịch bảo vệ đồ án tốt nghiệp" />

      <ThesisDefenseTable defenses={mockDefenses} />
    </Box>
  );
}
