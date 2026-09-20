"use client";

import { useParams } from "next/navigation";
import { Box } from "@mui/material";
import { ScorePublicationDetailPage } from "@/feature/scoring/components";

export default function ScoringTranscriptDetailPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = Number(params.projectId);

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <ScorePublicationDetailPage projectId={projectId} />
    </Box>
  );
}
