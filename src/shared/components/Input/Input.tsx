"use client";

import { forwardRef } from "react";
import { Box, TextField, TextFieldProps, InputAdornment } from "@mui/material";

export interface InputProps extends Omit<TextFieldProps, "variant"> {
  variant?: "outlined" | "filled" | "standard";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  showCharCount?: boolean;
  maxLength?: number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "outlined",
      leftIcon,
      rightIcon,
      onLeftIconClick,
      onRightIconClick,
      showCharCount,
      maxLength,
      inputProps,
      value,
      helperText,
      error,
      sx,
      ...props
    },
    ref,
  ) => {
    const charCount = typeof value === "string" ? value.length : 0;
    const mergedMaxLength = maxLength ?? inputProps?.maxLength;

    return (
      <TextField
        ref={ref}
        variant={variant}
        value={value}
        error={error}
        helperText={
          showCharCount && mergedMaxLength
            ? `${charCount}/${mergedMaxLength}`
            : error
              ? helperText
              : helperText
        }
        InputProps={{
          startAdornment: leftIcon ? (
            <InputAdornment position="start">
              <Box
                component="span"
                onClick={onLeftIconClick}
                sx={{
                  cursor: onLeftIconClick ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {leftIcon}
              </Box>
            </InputAdornment>
          ) : undefined,
          endAdornment: rightIcon ? (
            <InputAdornment position="end">
              <Box
                component="span"
                onClick={onRightIconClick}
                sx={{
                  cursor: onRightIconClick ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {rightIcon}
              </Box>
            </InputAdornment>
          ) : undefined,
        }}
        inputProps={{
          ...inputProps,
          maxLength: mergedMaxLength,
        }}
        sx={{
          "& .MuiInputBase-root": {
            "& .MuiInputAdornment-root": {
              color: "text.secondary",
            },
          },
          ...sx,
        }}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
