"use client";

import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
  variant?: "contained" | "outlined" | "text" | "dashed";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "contained",
      size = "medium",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      sx,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const buttonSx = {
      ...(variant === "dashed" && {
        borderStyle: "dashed" as const,
        border: "2px dashed",
        bgcolor: "transparent",
        color: "primary.main",
        "&:hover": {
          border: "2px dashed",
          bgcolor: "action.hover",
        },
      }),
      ...(fullWidth && { width: "100%" }),
    };

    return (
      <MuiButton
        ref={ref}
        variant={variant === "dashed" ? "outlined" : variant}
        size={size}
        disabled={isDisabled}
        startIcon={
          loading ? <Loader2 size={16} className="animate-spin" /> : leftIcon
        }
        endIcon={!loading && rightIcon}
        sx={{ ...buttonSx, ...sx }}
        {...props}
      >
        {children}
      </MuiButton>
    );
  },
);

Button.displayName = "Button";
