"use client";

import { Box } from "@mui/material";
import { ScoringManagementPage } from "@/feature/scoring/components";

export default function ScoringAdminPage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <ScoringManagementPage />
    </Box>
  );
}
