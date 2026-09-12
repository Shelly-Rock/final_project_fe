"use client";

import { useState } from "react";
import { Box, IconButton, TextField } from "@mui/material";
import { Send } from "lucide-react";

export function ChatInput({
  disabled,
  onSend,
}: {
  disabled: boolean;
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
      <TextField
        fullWidth
        multiline
        maxRows={4}
        size="small"
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
      />
      <IconButton
        color="primary"
        aria-label="Gửi"
        onClick={submit}
        disabled={disabled || !value.trim()}
      >
        <Send size={18} />
      </IconButton>
    </Box>
  );
}
