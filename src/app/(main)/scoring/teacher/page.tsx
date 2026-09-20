"use client";

import { Box } from "@mui/material";
import TeacherScoring from "@/feature/scoring/components/TeacherScoring";
import { PageHeader } from "@/shared/components";
import { ClipboardCheck } from "lucide-react";

export default function ScoreSheetPage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <TeacherScoring />
    </Box>
  );
}
