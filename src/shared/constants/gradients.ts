import { Theme } from "@mui/material";

export const GRADIENT_STYLES = {
  darkGradient:
    "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 58, 138, 0.4) 100%)",
};

export const getCardBackground = (theme: Theme): string => {
  const isDark = theme.palette.mode === "dark";
  return isDark ? GRADIENT_STYLES.darkGradient : theme.palette.background.paper;
};

export const getPaperBackground = (theme: Theme): string => {
  const isDark = theme.palette.mode === "dark";
  return isDark ? GRADIENT_STYLES.darkGradient : theme.palette.background.paper;
};

export const getTableContainerSx = (theme: Theme) => ({
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 2,
  background: getCardBackground(theme),
});

export const getChipSx = (theme: Theme) => ({
  borderColor: "divider",
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "transparent",
});
