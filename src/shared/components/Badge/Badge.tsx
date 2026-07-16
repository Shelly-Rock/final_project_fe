"use client";

import { Chip, ChipProps } from "@mui/material";
import { useTheme } from "@/shared/theme";

export interface BadgeProps extends Omit<ChipProps, "variant"> {
  variant?: "filled" | "outlined" | "soft";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info";
}

export function Badge({
  variant = "soft",
  color = "default",
  label,
  children,
  sx,
  ...props
}: BadgeProps) {
  const { resolvedMode } = useTheme();
  const isDark = resolvedMode === "dark";

  const colorMap = {
    default: {
      filled: {
        bg: isDark ? "#334155" : "#f1f5f9",
        text: isDark ? "#cbd5e1" : "#475569",
        border: "transparent",
      },
      outlined: {
        bg: "transparent",
        text: isDark ? "#94a3b8" : "#64748b",
        border: isDark ? "#475569" : "#cbd5e1",
      },
      soft: {
        bg: isDark ? "#1e293b" : "#f1f5f9",
        text: isDark ? "#94a3b8" : "#64748b",
        border: "transparent",
      },
    },
    primary: {
      filled: {
        bg: isDark ? "#1e3d6f" : "#2563eb",
        text: "#ffffff",
        border: "transparent",
      },
      outlined: {
        bg: "transparent",
        text: isDark ? "#60a5fa" : "#2563eb",
        border: isDark ? "#1e3d6f" : "#2563eb",
      },
      soft: {
        bg: isDark ? "#1e3d6f" : "#dbeafe",
        text: isDark ? "#60a5fa" : "#2563eb",
        border: "transparent",
      },
    },
    secondary: {
      filled: {
        bg: isDark ? "#5b21b6" : "#7c3aed",
        text: "#ffffff",
        border: "transparent",
      },
      outlined: {
        bg: "transparent",
        text: isDark ? "#a78bfa" : "#7c3aed",
        border: isDark ? "#5b21b6" : "#7c3aed",
      },
      soft: {
        bg: isDark ? "#2e1065" : "#f5f3ff",
        text: isDark ? "#a78bfa" : "#7c3aed",
        border: "transparent",
      },
    },
    success: {
      filled: {
        bg: isDark ? "#15803d" : "#22c55e",
        text: "#ffffff",
        border: "transparent",
      },
      outlined: {
        bg: "transparent",
        text: isDark ? "#4ade80" : "#22c55e",
        border: isDark ? "#15803d" : "#22c55e",
      },
      soft: {
        bg: isDark ? "#14532d" : "#dcfce7",
        text: isDark ? "#4ade80" : "#22c55e",
        border: "transparent",
      },
    },
    warning: {
      filled: {
        bg: isDark ? "#c2410c" : "#f97316",
        text: "#ffffff",
        border: "transparent",
      },
      outlined: {
        bg: "transparent",
        text: isDark ? "#fb923c" : "#f97316",
        border: isDark ? "#c2410c" : "#f97316",
      },
      soft: {
        bg: isDark ? "#431407" : "#ffedd5",
        text: isDark ? "#fb923c" : "#f97316",
        border: "transparent",
      },
    },
    error: {
      filled: {
        bg: isDark ? "#b91c1c" : "#ef4444",
        text: "#ffffff",
        border: "transparent",
      },
      outlined: {
        bg: "transparent",
        text: isDark ? "#f87171" : "#ef4444",
        border: isDark ? "#b91c1c" : "#ef4444",
      },
      soft: {
        bg: isDark ? "#450a0a" : "#fef2f2",
        text: isDark ? "#f87171" : "#ef4444",
        border: "transparent",
      },
    },
    info: {
      filled: {
        bg: isDark ? "#0369a1" : "#0ea5e9",
        text: "#ffffff",
        border: "transparent",
      },
      outlined: {
        bg: "transparent",
        text: isDark ? "#38bdf8" : "#0ea5e9",
        border: isDark ? "#0369a1" : "#0ea5e9",
      },
      soft: {
        bg: isDark ? "#0c4a6e" : "#e0f2fe",
        text: isDark ? "#38bdf8" : "#0ea5e9",
        border: "transparent",
      },
    },
  };

  const colors = colorMap[color][variant];

  return (
    <Chip
      label={label || children}
      size="small"
      sx={{
        bgcolor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        fontWeight: 500,
        fontSize: "0.75rem",
        ...sx,
      }}
      {...props}
    />
  );
}
