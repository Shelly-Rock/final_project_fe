"use client";

import { useState } from "react";
import { Box, IconButton, InputBase } from "@mui/material";
import { Send } from "lucide-react";

export function ChatInput({
  disabled,
  onSend,
}: {
  disabled: boolean;
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState("");
  const canSend = !disabled && value.trim().length > 0;

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: 1,
        px: 1.25,
        py: 1,
        borderRadius: 4,
        bgcolor: "action.hover",
        border: "1px solid",
        borderColor: "divider",
        "&:focus-within": {
          borderColor: "primary.main",
          bgcolor: "background.paper",
          boxShadow: "0 0 0 3px rgba(37,99,235,0.12)",
        },
      }}
    >
      <InputBase
        fullWidth
        multiline
        maxRows={4}
        placeholder="Hỏi về quy trình đồ án…"
        value={value}
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        sx={{
          px: 0.5,
          py: 0.5,
          fontSize: 14,
          lineHeight: 1.5,
          "& .MuiInputBase-input::placeholder": {
            opacity: 0.7,
          },
        }}
      />
      <IconButton
        aria-label="Gửi"
        onClick={submit}
        disabled={!canSend}
        sx={{
          width: 36,
          height: 36,
          flexShrink: 0,
          background: canSend
            ? "linear-gradient(135deg, #2563eb 0%, #1e3d6f 100%)"
            : "transparent",
          color: canSend ? "#fff" : "text.disabled",
          "&:hover": {
            background: canSend
              ? "linear-gradient(135deg, #3b82f6 0%, #1e3d6f 100%)"
              : "transparent",
          },
          "&.Mui-disabled": { color: "text.disabled" },
        }}
      >
        <Send size={16} />
      </IconButton>
    </Box>
  );
}
