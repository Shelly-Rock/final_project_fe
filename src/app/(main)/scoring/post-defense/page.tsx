"use client";

import { Box } from "@mui/material";
import { Trophy } from "lucide-react";
import { PostDefenseRankingPage } from "@/feature/scoring/components";
import { PageHeader } from "@/shared/components";

export default function PostDefensePage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PostDefenseRankingPage />
    </Box>
  );
}
