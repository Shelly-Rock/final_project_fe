"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Box, Chip, Typography } from "@mui/material";
import { Bot } from "lucide-react";
import type { ChatMessage } from "../types";

const LINK_RE = /\[([^\]]+)\]\((\/[-a-zA-Z0-9/]+)\)/g;

function MessageBody({
  content,
  inverted,
}: {
  content: string;
  inverted?: boolean;
}) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(LINK_RE);
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(content.slice(lastIndex, match.index));
    }
    nodes.push(
      <Chip
        key={`${match[2]}-${match.index}`}
        component={Link}
        href={match[2]}
        label={match[1]}
        clickable
        size="small"
        sx={{
          mx: 0.5,
          my: 0.25,
          height: 24,
          fontWeight: 600,
          bgcolor: inverted ? "rgba(255,255,255,0.18)" : "rgba(37,99,235,0.1)",
          color: inverted ? "#fff" : "primary.dark",
          "&:hover": {
            bgcolor: inverted
              ? "rgba(255,255,255,0.28)"
              : "rgba(37,99,235,0.16)",
          },
        }}
      />,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    nodes.push(content.slice(lastIndex));
  }
  return (
    <Typography
      variant="body2"
      sx={{ whiteSpace: "pre-wrap", lineHeight: 1.65 }}
    >
      {nodes}
    </Typography>
  );
}

function TypingDots({ label }: { label: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", height: 16 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: "primary.main",
              animation: "chat-dot 1.1s ease-in-out infinite",
              animationDelay: `${i * 0.16}s`,
              "@keyframes chat-dot": {
                "0%, 80%, 100%": { opacity: 0.25, transform: "translateY(0)" },
                "40%": { opacity: 1, transform: "translateY(-3px)" },
              },
            }}
          />
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

export function ChatMessageList({
  messages,
  lookingUp,
}: {
  messages: ChatMessage[];
  lookingUp: boolean;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
      {messages.map((message, index) => {
        const isUser = message.role === "user";
        const isLastAssistant = !isUser && index === messages.length - 1;
        const placeholder =
          isLastAssistant && message.content === ""
            ? lookingUp
              ? "Đang tra cứu…"
              : "Đang soạn…"
            : null;

        return (
          <Box
            key={`${message.role}-${index}`}
            sx={{
              display: "flex",
              alignItems: "flex-end",
              gap: 1,
              alignSelf: isUser ? "flex-end" : "flex-start",
              maxWidth: "92%",
              flexDirection: isUser ? "row-reverse" : "row",
            }}
          >
            {!isUser && (
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1e3d6f 100%)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  mb: 0.25,
                }}
              >
                <Bot size={14} />
              </Box>
            )}
            <Box
              sx={{
                px: 1.75,
                py: 1.15,
                borderRadius: isUser
                  ? "16px 16px 4px 16px"
                  : "16px 16px 16px 4px",
                bgcolor: isUser ? undefined : "background.paper",
                background: isUser
                  ? "linear-gradient(135deg, #2563eb 0%, #1e3d6f 100%)"
                  : undefined,
                color: isUser ? "#fff" : "text.primary",
                border: isUser ? "none" : "1px solid",
                borderColor: "divider",
                boxShadow: isUser
                  ? "0 8px 18px rgba(30, 61, 111, 0.22)"
                  : "0 4px 14px rgba(15, 23, 42, 0.05)",
              }}
            >
              {placeholder ? (
                <TypingDots label={placeholder} />
              ) : (
                <MessageBody content={message.content} inverted={isUser} />
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
