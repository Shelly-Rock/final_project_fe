"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Box, Chip, Typography } from "@mui/material";
import type { ChatMessage } from "../types";

const LINK_RE = /\[([^\]]+)\]\((\/[-a-zA-Z0-9/]+)\)/g;

function MessageBody({ content }: { content: string }) {
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
        sx={{ mx: 0.5, my: 0.25 }}
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
      sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
    >
      {nodes}
    </Typography>
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
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
              alignSelf: isUser ? "flex-end" : "flex-start",
              maxWidth: "90%",
              px: 1.5,
              py: 1,
              borderRadius: 2,
              bgcolor: isUser ? "primary.main" : "action.hover",
              color: isUser ? "primary.contrastText" : "text.primary",
            }}
          >
            {placeholder ? (
              <Typography variant="body2" color="text.secondary">
                {placeholder}
              </Typography>
            ) : (
              <MessageBody content={message.content} />
            )}
          </Box>
        );
      })}
    </Box>
  );
}
