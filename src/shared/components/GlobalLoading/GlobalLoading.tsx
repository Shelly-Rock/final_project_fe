"use client";

import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export interface GlobalLoadingProps {
  loading?: boolean;
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

export function GlobalLoading({
  loading = true,
  text = "Đang tải...",
  fullScreen = false,
  overlay = true,
}: GlobalLoadingProps) {
  const [visible, setVisible] = useState(loading);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (loading) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      },
      loading ? 0 : 300,
    );

    return () => clearTimeout(timeout);
  }, [loading]);

  if (!visible) return null;

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        p: 4,
      }}
    >
      <CircularProgress size={40} thickness={3} />
      {text && (
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(255,255,255,0.9)",
          zIndex: 9999,
          opacity: loading ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      >
        {content}
      </Box>
    );
  }

  if (overlay) {
    return (
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(2px)",
          borderRadius: "inherit",
          zIndex: 10,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
}

export interface LoadingOverlayProps {
  loading?: boolean;
  children: React.ReactNode;
  text?: string;
}

export function LoadingOverlay({
  loading,
  children,
  text = "Đang tải...",
}: LoadingOverlayProps) {
  return (
    <Box sx={{ position: "relative" }}>
      {children}
      <GlobalLoading loading={loading} text={text} overlay />
    </Box>
  );
}
