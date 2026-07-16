"use client";

import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
} from "@mui/material";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";
import NextLink from "next/link";
import { useTheme } from "@/shared/theme";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  showHomeIcon?: boolean;
  onClick?: (item: BreadcrumbItem, index: number) => void;
  size?: "small" | "medium";
}

export function Breadcrumb({
  items,
  separator,
  maxItems = 8,
  showHomeIcon = true,
  onClick,
  size = "medium",
}: BreadcrumbProps) {
  const { resolvedMode } = useTheme();
  const isDark = resolvedMode === "dark";

  const defaultSeparator = separator || (
    <ChevronRight size={size === "small" ? 14 : 16} />
  );
  const fontSize = size === "small" ? "0.75rem" : "0.875rem";

  const processedItems = [...items];
  const showEllipsis = items.length > maxItems;

  if (showEllipsis) {
    const firstItems = processedItems.slice(0, 1);
    const lastItems = processedItems.slice(-(maxItems - 1));
    processedItems.splice(1, processedItems.length - maxItems, ...lastItems);
  }

  return (
    <MuiBreadcrumbs
      separator={defaultSeparator}
      sx={{
        "& .MuiBreadcrumbs-separator": {
          mx: 0.5,
          color: isDark ? "#64748b" : "#94a3b8",
        },
        "& .MuiBreadcrumbs-ol": {
          flexWrap: "nowrap",
        },
      }}
    >
      {processedItems.map((item, index) => {
        const isLast = index === processedItems.length - 1;
        const isFirst = index === 0;
        const isEllipsis = showEllipsis && index === 1;

        if (isEllipsis) {
          return (
            <Box
              key="ellipsis"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                color: isDark ? "#64748b" : "#94a3b8",
                fontSize,
              }}
            >
              <MoreHorizontal size={size === "small" ? 14 : 16} />
            </Box>
          );
        }

        if (isLast) {
          return (
            <Typography
              key={index}
              color={isDark ? "#f1f5f9" : "#0f172a"}
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize,
                cursor: onClick ? "pointer" : "default",
                color: isDark ? "#f1f5f9" : "#334155",
              }}
              onClick={() => onClick?.(item, index)}
            >
              {item.icon && (
                <Box
                  component="span"
                  sx={{
                    mr: 0.5,
                    display: "inline-flex",
                    verticalAlign: "middle",
                  }}
                >
                  {item.icon}
                </Box>
              )}
              {item.label}
            </Typography>
          );
        }

        const linkContent = (
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              fontSize,
              color: isDark ? "#94a3b8" : "#64748b",
              cursor: onClick ? "pointer" : "default",
              borderRadius: 1,
              px: 0.5,
              "&:hover": {
                color: isDark ? "#60a5fa" : "#2563eb",
                bgcolor: isDark
                  ? "rgba(59, 130, 246, 0.1)"
                  : "rgba(37, 99, 235, 0.05)",
              },
            }}
            onClick={() => onClick?.(item, index)}
          >
            {isFirst && showHomeIcon && (
              <Home size={size === "small" ? 14 : 16} />
            )}
            {item.icon && item.icon}
            {item.label}
          </Box>
        );

        if (item.href) {
          return (
            <Link
              key={index}
              component={NextLink}
              href={item.href}
              underline="hover"
              color="inherit"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                fontSize,
                borderRadius: 1,
                px: 0.5,
                color: isDark ? "#94a3b8" : "#64748b",
                "&:hover": {
                  color: isDark ? "#60a5fa" : "#2563eb",
                  bgcolor: isDark
                    ? "rgba(59, 130, 246, 0.1)"
                    : "rgba(37, 99, 235, 0.05)",
                },
              }}
            >
              {isFirst && showHomeIcon && (
                <Home size={size === "small" ? 14 : 16} />
              )}
              {item.icon && item.icon}
              {item.label}
            </Link>
          );
        }

        return (
          <Box
            key={index}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              fontSize,
              color: isDark ? "#94a3b8" : "#64748b",
              cursor: onClick ? "pointer" : "default",
              borderRadius: 1,
              px: 0.5,
              "&:hover": {
                color: isDark ? "#60a5fa" : "#2563eb",
                bgcolor: isDark
                  ? "rgba(59, 130, 246, 0.1)"
                  : "rgba(37, 99, 235, 0.05)",
              },
            }}
            onClick={() => onClick?.(item, index)}
          >
            {isFirst && showHomeIcon && (
              <Home size={size === "small" ? 14 : 16} />
            )}
            {item.icon && item.icon}
            {item.label}
          </Box>
        );
      })}
    </MuiBreadcrumbs>
  );
}
