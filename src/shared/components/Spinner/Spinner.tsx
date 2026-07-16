"use client";

import { Box, keyframes } from "@mui/material";

export interface SpinnerProps {
  size?: number;
  color?: string;
  thickness?: number;
  speed?: number;
  label?: string;
  showLabel?: boolean;
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export function Spinner({
  size = 40,
  color = "primary",
  thickness = 3,
  speed = 1,
  label = "Loading...",
  showLabel = false,
}: SpinnerProps) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: size,
          height: size,
          border: `${thickness}px solid`,
          borderColor: `${color}.light`,
          borderTopColor: `${color}.main`,
          borderRadius: "50%",
          animation: `${spin} ${1 / speed}s linear infinite`,
        }}
      />
      {showLabel && (
        <Box
          component="span"
          sx={{
            fontSize: size / 4,
            color: "text.secondary",
          }}
        >
          {label}
        </Box>
      )}
    </Box>
  );
}

export interface LoadingSpinnerProps {
  fullScreen?: boolean;
  overlay?: boolean;
  text?: string;
  size?: number;
}

export function LoadingSpinner({
  fullScreen = false,
  overlay = false,
  text = "Đang tải...",
  size = 40,
}: LoadingSpinnerProps) {
  const spinner = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Spinner size={size} />
      <Box
        component="span"
        sx={{
          fontSize: size / 3,
          color: "text.secondary",
        }}
      >
        {text}
      </Box>
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
        }}
      >
        {spinner}
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
        {spinner}
      </Box>
    );
  }

  return spinner;
}
