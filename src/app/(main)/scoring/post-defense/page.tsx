"use client";

import { Box } from "@mui/material";
import { PostDefenseRankingPage } from "@/feature/scoring/components";

export default function PostDefensePage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PostDefenseRankingPage />
    </Box>
  );
}
