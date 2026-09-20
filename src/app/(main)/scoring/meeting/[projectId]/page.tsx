"use client";

import { useParams } from "next/navigation";
import { Box } from "@mui/material";
import { CommitteeMeetingDetailPage } from "@/feature/scoring/components";

export default function ScoringMeetingDetailPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = Number(params.projectId);

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <CommitteeMeetingDetailPage projectId={projectId} />
    </Box>
  );
}
