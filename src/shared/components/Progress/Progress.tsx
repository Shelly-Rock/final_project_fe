"use client";

import {
  Box,
  LinearProgress,
  CircularProgress,
  Typography,
} from "@mui/material";

export interface ProgressProps {
  value: number;
  max?: number;
  variant?: "linear" | "circular";
  size?: "small" | "medium" | "large";
  showValue?: boolean;
  label?: string;
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  trackColor?: string;
  thickness?: number;
}

export function Progress({
  value,
  max = 100,
  variant = "linear",
  size = "medium",
  showValue = false,
  label,
  color = "primary",
  trackColor,
  thickness,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeMap = {
    small: { linear: 4, circular: 24 },
    medium: { linear: 8, circular: 40 },
    large: { linear: 12, circular: 60 },
  };

  if (variant === "circular") {
    const progressSize = sizeMap[size].circular;
    return (
      <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={100}
            size={progressSize}
            sx={{ color: trackColor || "grey.200" }}
            thickness={thickness || 3}
          />
          <CircularProgress
            variant="determinate"
            value={percentage}
            size={progressSize}
            color={
              color === "primary"
                ? "primary"
                : color === "secondary"
                  ? "secondary"
                  : color
            }
            sx={{
              position: "absolute",
              left: 0,
              thickness: thickness || 3,
            }}
          />
        </Box>
        {showValue && (
          <Typography variant="body2" fontWeight={500}>
            {Math.round(percentage)}%
          </Typography>
        )}
      </Box>
    );
  }

  const linearSize = sizeMap[size].linear;

  return (
    <Box sx={{ width: "100%" }}>
      {(label || showValue) && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          {label && (
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          )}
          {showValue && (
            <Typography variant="caption" fontWeight={500}>
              {Math.round(percentage)}%
            </Typography>
          )}
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: linearSize,
          borderRadius: linearSize / 2,
          bgcolor: trackColor || "grey.200",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: `${percentage}%`,
            borderRadius: linearSize / 2,
            bgcolor: `${color}.main`,
            transition: "width 0.3s ease-in-out",
            ...(color === "success" && { bgcolor: "#2e7d32" }),
            ...(color === "warning" && { bgcolor: "#ed6c02" }),
            ...(color === "error" && { bgcolor: "#d32f2f" }),
            ...(color === "info" && { bgcolor: "#0288d1" }),
          }}
        />
      </Box>
    </Box>
  );
}

export interface ProgressGroupProps {
  items: {
    label: string;
    value: number;
    color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  }[];
  showValues?: boolean;
}

export function ProgressGroup({
  items,
  showValues = true,
}: ProgressGroupProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {items.map((item, index) => (
        <Progress
          key={index}
          value={item.value}
          label={item.label}
          showValue={showValues}
          color={item.color || "primary"}
        />
      ))}
    </Box>
  );
}
