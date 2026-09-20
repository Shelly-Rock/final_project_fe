"use client";

import { Box } from "@mui/material";
import { StudentRevisionPage } from "@/feature/scoring/components";

export default function StudentRevisionRoute() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <StudentRevisionPage />
    </Box>
  );
}
