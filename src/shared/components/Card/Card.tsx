"use client";

import {
  Paper,
  Typography,
  Box,
  CardContent,
  CardActions,
  CardActionArea,
} from "@mui/material";
import { useTheme } from "@/shared/theme";
import { clsx } from "clsx";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "elevation" | "outlined" | "soft";
  onClick?: () => void;
  padding?: number | string;
}

export interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  avatar?: React.ReactNode;
  className?: string;
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  padding?: number | string;
}

export interface CardActionsProps {
  children: React.ReactNode;
  direction?: "row" | "column";
  align?: "start" | "center" | "end";
  className?: string;
}

export function Card({
  children,
  className,
  variant = "elevation",
  onClick,
  padding = 2,
}: CardProps) {
  const { resolvedMode } = useTheme();
  const isDark = resolvedMode === "dark";

  const variantStyles = {
    elevation: {
      boxShadow: isDark
        ? "0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)"
        : "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      border: "none",
    },
    outlined: {
      boxShadow: "none",
      border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
    },
    soft: {
      boxShadow: "none",
      border: "none",
      bgcolor: isDark ? "#1e293b" : "#ffffff",
    },
  };

  return (
    <Paper
      elevation={variant === "elevation" ? 1 : 0}
      className={clsx(className)}
      onClick={onClick}
      sx={{
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        borderRadius: 2,
        transition: "all 0.2s ease",
        "&:hover": onClick
          ? {
              transform: "translateY(-2px)",
              boxShadow: isDark
                ? "0 10px 15px -3px rgb(0 0 0 / 0.4)"
                : "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            }
          : {},
        ...variantStyles[variant],
      }}
    >
      {onClick ? (
        <CardActionArea sx={{ height: "100%" }}>{children}</CardActionArea>
      ) : (
        children
      )}
    </Paper>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  avatar,
  className,
}: CardHeaderProps) {
  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        pb: 0,
      }}
    >
      {avatar && <Box sx={{ mr: 2, display: "flex" }}>{avatar}</Box>}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: 600, fontSize: "1.1rem" }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ ml: 2 }}>{action}</Box>}
    </Box>
  );
}

export function CardContentDiv({
  children,
  className,
  padding = 2,
}: CardContentProps) {
  return (
    <CardContent className={className} sx={{ p: padding }}>
      {children}
    </CardContent>
  );
}

export function CardActionsDiv({
  children,
  direction = "row",
  align = "start",
  className,
}: CardActionsProps) {
  return (
    <CardActions
      className={className}
      sx={{
        p: 2,
        pt: 1,
        display: "flex",
        flexDirection: direction,
        justifyContent:
          align === "end"
            ? "flex-end"
            : align === "center"
              ? "center"
              : "flex-start",
        gap: 1,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      {children}
    </CardActions>
  );
}
