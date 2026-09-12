"use client";

import { Box, Chip, Typography } from "@mui/material";
import type { Role } from "@/core/permissions/types";
import { suggestedQuestions } from "../knowledge/faq";

export function SuggestedChips({
  role,
  name,
  onPick,
}: {
  role: Role;
  name?: string | null;
  onPick: (text: string) => void;
}) {
  const questions = suggestedQuestions(role);
  const greeting = name?.trim() ? `Xin chào ${name.trim()}.` : "Xin chào.";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {greeting} Trợ lý đồ án hỗ trợ quy trình trên hệ thống.
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {questions.map((question) => (
          <Chip
            key={question}
            label={question}
            onClick={() => onPick(question)}
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
}
