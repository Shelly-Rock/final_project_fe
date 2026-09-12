"use client";

import { useParams } from "next/navigation";
import { Box } from "@mui/material";
import { FileText } from "lucide-react";
import { ScorePublicationDetailPage } from "@/feature/scoring/components";
import { PageHeader } from "@/shared/components";

export default function ScoringTranscriptDetailPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = Number(params.projectId);

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Bảng điểm tổng hợp"
        subtitle="Điểm trọng số, điểm cộng và nhận xét hội đồng"
        illustration={<FileText size={56} strokeWidth={1.5} />}
        showBgImage={true}
        showBackButton
        onBack={() => history.back()}
      />
      <ScorePublicationDetailPage projectId={projectId} />
    </Box>
  );
}
