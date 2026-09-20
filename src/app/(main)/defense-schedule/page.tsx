"use client";

import { Box } from "@mui/material";
import { DefenseScheduleManagement } from "@/feature/defense-schedule/components";

export default function DefenseSchedulePage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <DefenseScheduleManagement />
    </Box>
  );
}
