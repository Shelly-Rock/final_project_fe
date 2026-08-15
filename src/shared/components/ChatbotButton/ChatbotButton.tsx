"use client";

import { Box } from "@mui/material";
import "@/styles/main.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

export function ChatbotButton() {
  return (
    <Box
      component="button"
      className="chatbot-fab"
      aria-label="Mở chatbot"
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #2a5bc0 0%, #1e3d8a 100%)",
        border: "3px solid #fff",
        boxShadow:
          "0 4px 20px rgba(42, 91, 192, 0.4), 0 2px 8px rgba(0,0,0,0.15)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
        zIndex: 9999,
        "&:hover": {
          transform: "scale(1.1)",
          boxShadow:
            "0 6px 28px rgba(42, 91, 192, 0.5), 0 4px 12px rgba(0,0,0,0.2)",
        },
        "&:active": {
          transform: "scale(0.95)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          inset: -6,
          borderRadius: "50%",
          border: "2px solid rgba(42, 91, 192, 0.3)",
          animation: "chatbot-pulse 2s ease-in-out infinite",
        },
        "@keyframes chatbot-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: 1 },
          "50%": { transform: "scale(1.15)", opacity: 0 },
        },
      }}
    >
      <Box
        component="i"
        className="bi bi-robot"
        sx={{ color: "#fff", fontSize: 28 }}
      />
    </Box>
  );
}
