"use client";

import { Box } from "@mui/material";
import { ScorePublicationPage } from "@/feature/scoring/components";

export default function ScoringTranscriptPage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <ScorePublicationPage />
    </Box>
  );
}
