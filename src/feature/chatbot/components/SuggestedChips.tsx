"use client";

import { Box, Typography } from "@mui/material";
import { Bot, ChevronRight, Sparkles } from "lucide-react";
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
  const greeting = name?.trim() ? `Xin chào, ${name.trim()}` : "Xin chào";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        pt: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 1.25,
          py: 1.5,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "18px",
            background: "linear-gradient(135deg, #2563eb 0%, #1e3d6f 100%)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 12px 28px rgba(30, 61, 111, 0.28)",
          }}
        >
          <Bot size={28} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 18, lineHeight: 1.3 }}>
            {greeting}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, maxWidth: 280 }}
          >
            Hỗ trợ quy trình đồ án: hạn nộp, trạng thái và thao tác trên hệ
            thống.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, px: 0.25 }}>
        <Sparkles size={14} color="#2563eb" />
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, color: "text.secondary" }}
        >
          Gợi ý nhanh
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {questions.map((question) => (
          <Box
            key={question}
            component="button"
            onClick={() => onPick(question)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: "100%",
              textAlign: "left",
              px: 1.5,
              py: 1.25,
              borderRadius: 2.5,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              cursor: "pointer",
              color: "text.primary",
              font: "inherit",
              transition: "all 0.18s ease",
              "&:hover": {
                borderColor: "primary.light",
                bgcolor: "rgba(37,99,235,0.04)",
                transform: "translateY(-1px)",
                boxShadow: "0 8px 18px rgba(15, 23, 42, 0.06)",
              },
            }}
          >
            <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
              {question}
            </Typography>
            <Box sx={{ color: "primary.main", display: "flex" }}>
              <ChevronRight size={16} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
