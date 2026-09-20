"use client";

import { Box } from "@mui/material";
import { OfficialScoreSheetPage } from "@/feature/scoring/components";

export default function OfficialScoreSheetRoute() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <OfficialScoreSheetPage />
    </Box>
  );
}
