"use client";

import { Box } from "@mui/material";
import { CommitteeManagement } from "@/feature/committee/components";

export default function CommitteePage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <CommitteeManagement />
    </Box>
  );
}
