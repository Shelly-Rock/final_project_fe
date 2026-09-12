"use client";

import { Box } from "@mui/material";
import { FileText } from "lucide-react";
import { ScorePublicationPage } from "@/feature/scoring/components";
import { PageHeader } from "@/shared/components";

export default function ScoringTranscriptPage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Tính toán và công bố bảng điểm"
        subtitle="Tổng hợp điểm theo trọng số, cộng điểm thưởng và công bố cho sinh viên"
        illustration={<FileText size={56} strokeWidth={1.5} />}
        showBgImage={true}
      />
      <ScorePublicationPage />
    </Box>
  );
}
