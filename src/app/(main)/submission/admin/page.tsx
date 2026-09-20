"use client";

import { Box } from "@mui/material";
import { SubmissionManagement } from "@/feature/submission/components";

export default function SubmissionPage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <SubmissionManagement />
    </Box>
  );
}
