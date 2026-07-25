"use client";

import { forwardRef } from "react";
import {
  Box,
  TextField,
  TextFieldProps,
  InputAdornment,
  InputLabelProps,
} from "@mui/material";

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
      type,
      ...props
    },
    ref,
  ) => {
    const charCount = typeof value === "string" ? value.length : 0;
    const mergedMaxLength = maxLength ?? inputProps?.maxLength;
    const isDateInput = type === "date";

    const inputLabelProps: InputLabelProps = isDateInput
      ? { shrink: true }
      : {};

    return (
      <TextField
        ref={ref}
        variant={variant}
        type={type}
        value={value}
        error={error}
        helperText={
          showCharCount && mergedMaxLength
            ? `${charCount}/${mergedMaxLength}`
            : error
              ? helperText
              : helperText
        }
        InputLabelProps={inputLabelProps}
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
          spellCheck: false,
        }}
        sx={{
          "& .MuiInputBase-root": {
            "& .MuiInputAdornment-root": {
              color: "#2563eb",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #2563eb",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2563eb",
              boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.15)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2563eb",
              boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.2)",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#2563eb",
              opacity: 0.7,
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
