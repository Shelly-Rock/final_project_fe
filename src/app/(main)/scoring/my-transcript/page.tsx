"use client";

import { Box } from "@mui/material";
import { FileText } from "lucide-react";
import { StudentScoreSheetPage } from "@/feature/scoring/components";
import { PageHeader } from "@/shared/components";

export default function StudentTranscriptPage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Bảng điểm"
        subtitle="Điểm tổng và nhận xét hội đồng sau khi được công bố"
        illustration={<FileText size={56} strokeWidth={1.5} />}
        showBgImage={true}
      />
      <StudentScoreSheetPage />
    </Box>
  );
}
