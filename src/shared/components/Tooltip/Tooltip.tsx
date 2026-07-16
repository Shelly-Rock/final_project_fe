"use client";

import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from "@mui/material";

export interface TooltipProps {
  title: string | React.ReactNode;
  children: React.ReactElement;
  placement?: "top" | "bottom" | "left" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end" | "right-start" | "right-end";
  arrow?: boolean;
  enterDelay?: number;
  leaveDelay?: number;
  disabled?: boolean;
}

export function Tooltip({
  title,
  children,
  placement = "top",
  arrow = true,
  enterDelay,
  leaveDelay,
  disabled = false,
}: TooltipProps) {
  if (disabled) {
    return children;
  }

  return (
    <MuiTooltip
      title={title}
      placement={placement}
      arrow={arrow}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
    >
      {children}
    </MuiTooltip>
  );
}
