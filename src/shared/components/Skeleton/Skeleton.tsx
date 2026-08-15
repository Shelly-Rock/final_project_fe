"use client";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@/shared/theme";

export interface SkeletonComponentProps {
  variant?: "text" | "rectangular" | "circular" | "rounded";
  width?: number | string;
  height?: number | string;
  animation?: "pulse" | "wave" | "none";
  className?: string;
  sx?: object;
}

export function SkeletonComponent({
  variant = "text",
  width,
  height,
  animation = "wave",
  className,
  sx,
}: SkeletonComponentProps) {
  const { resolvedMode } = useTheme();
  const isDark = resolvedMode === "dark";

  return (
    <Box
      className={className}
      sx={{
        ...sx,
        display: "block",
        width: width || "100%",
        height: height || (variant === "text" ? "1em" : undefined),
        minHeight: variant === "text" ? "1em" : undefined,
        bgcolor: isDark ? "#334155" : "#e2e8f0",
        borderRadius:
          variant === "circular"
            ? "50%"
            : variant === "rectangular"
              ? 0
              : variant === "rounded"
                ? "6px"
                : "4px",
        animation:
          animation === "pulse"
            ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
            : animation === "wave"
              ? "wave 1.5s ease-in-out infinite"
              : "none",
        "@keyframes pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        "@keyframes wave": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        position: "relative",
        overflow: "hidden",
        "&::after":
          animation === "wave"
            ? {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(90deg, transparent, ${isDark ? "rgba(51, 65, 85, 0.4)" : "rgba(255, 255, 255, 0.4)"}, transparent)`,
                animation: "wave 1.5s ease-in-out infinite",
              }
            : {},
      }}
    />
  );
}

export interface SkeletonTextProps {
  lines?: number;
  spacing?: number;
  lastLineWidth?: number | string;
}

export function SkeletonText({
  lines = 3,
  spacing = 0.5,
  lastLineWidth = "60%",
}: SkeletonTextProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: spacing }}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonComponent
          key={index}
          variant="text"
          width={index === lines - 1 ? lastLineWidth : "100%"}
          height={16}
        />
      ))}
    </Box>
  );
}

export interface SkeletonAvatarProps {
  size?: number;
  variant?: "circular" | "square" | "rounded";
}

export function SkeletonAvatar({
  size = 40,
  variant = "circular",
}: SkeletonAvatarProps) {
  return (
    <SkeletonComponent
      variant={variant === "square" ? "rectangular" : variant}
      width={size}
      height={size}
    />
  );
}

export interface SkeletonCardProps {
  avatar?: boolean;
  titleWidth?: number | string;
  lines?: number;
}

export function SkeletonCard({
  avatar = true,
  titleWidth = "60%",
  lines = 3,
}: SkeletonCardProps) {
  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        {avatar && <SkeletonAvatar />}
        <Box sx={{ flex: 1 }}>
          <SkeletonComponent variant="text" width={titleWidth} height={20} />
          <SkeletonComponent variant="text" width="40%" height={14} />
        </Box>
      </Box>
      <SkeletonText lines={lines} />
    </Box>
  );
}

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  const { resolvedMode } = useTheme();
  const isDark = resolvedMode === "dark";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          pb: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <SkeletonComponent
            key={index}
            variant="text"
            height={16}
            sx={{ flex: 1 }}
          />
        ))}
      </Box>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ display: "flex", gap: 2, py: 1 }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonComponent
              key={colIndex}
              variant="text"
              height={14}
              sx={{ flex: 1 }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}
