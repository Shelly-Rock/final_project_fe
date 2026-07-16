"use client";

import { forwardRef } from "react";
import { Box } from "@mui/material";
import clsx from "clsx";

export interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  height?: number | string;
  maxHeight?: number | string;
  width?: number | string;
  maxWidth?: number | string;
  padding?: number | string;
  scrollbarWidth?: "thin" | "thick" | "none";
  scrollbarColor?: string;
  showScrollbar?: boolean;
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      children,
      className,
      height,
      maxHeight,
      width,
      maxWidth,
      padding,
      scrollbarWidth = "thin",
      showScrollbar = true,
      ...props
    },
    ref,
  ) => {
    return (
      <Box
        ref={ref}
        className={clsx("scroll-area", className)}
        sx={{
          height,
          maxHeight,
          width,
          maxWidth,
          overflow: "auto",
          padding,
          "&::-webkit-scrollbar": {
            width:
              scrollbarWidth === "thin"
                ? "6px"
                : scrollbarWidth === "thick"
                  ? "12px"
                  : "0px",
            height:
              scrollbarWidth === "thin"
                ? "6px"
                : scrollbarWidth === "thick"
                  ? "12px"
                  : "0px",
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "grey.100",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "grey.400",
            borderRadius: "3px",
            "&:hover": {
              bgcolor: "grey.500",
            },
          },
          ...(showScrollbar === false && {
            scrollbarWidth: "none" as const,
            "-ms-overflow-style": "none" as const,
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }),
        }}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

ScrollArea.displayName = "ScrollArea";
