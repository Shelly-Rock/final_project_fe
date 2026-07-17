"use client";

import { IconButton, Tooltip } from "@mui/material";
import { Sun, Moon } from "lucide-react";
import { useTheme, ThemeMode } from "./ThemeProvider";

export interface ThemeSwitcherProps {
  variant?: "icon" | "menu";
  showLabel?: boolean;
  size?: "small" | "medium";
}

const modeOrder: ThemeMode[] = ["light", "dark"];

export function ThemeSwitcher({
  variant = "icon",
  size = "medium",
}: ThemeSwitcherProps) {
  const { mode, setMode } = useTheme();

  const getNextMode = (current: ThemeMode): ThemeMode => {
    const currentIndex = modeOrder.indexOf(current);
    const nextIndex = (currentIndex + 1) % modeOrder.length;
    return modeOrder[nextIndex];
  };

  const handleToggle = () => {
    const nextMode = getNextMode(mode);
    setMode(nextMode);
  };

  const currentIcon =
    mode === "dark" ? (
      <Moon size={size === "small" ? 18 : 22} />
    ) : (
      <Sun size={size === "small" ? 18 : 22} />
    );

  const tooltipLabel = mode === "dark" ? "Chế độ tối" : "Chế độ sáng";

  return (
    <Tooltip title={tooltipLabel}>
      <IconButton
        onClick={handleToggle}
        size={size}
        sx={{
          color: "text.secondary",
          "&:hover": {
            color: "primary.main",
            bgcolor: "action.hover",
          },
        }}
      >
        {currentIcon}
      </IconButton>
    </Tooltip>
  );
}
