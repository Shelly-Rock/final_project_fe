"use client";

import { Box } from "@mui/material";
import { FileText } from "lucide-react";
import { StudentScoreSheetPage } from "@/feature/scoring/components";
import { PageHeader } from "@/shared/components";

export default function StudentTranscriptPage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <StudentScoreSheetPage />
    </Box>
  );
}
