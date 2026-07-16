"use client";

import { forwardRef } from "react";
import { TextField, TextFieldProps } from "@mui/material";

export interface TextareaProps extends Omit<
  TextFieldProps,
  "variant" | "multiline"
> {
  minRows?: number;
  maxRows?: number;
  autoResize?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
  variant?: "outlined" | "filled" | "standard";
}

export const Textarea = forwardRef<HTMLDivElement, TextareaProps>(
  (
    {
      minRows = 3,
      maxRows = 10,
      showCharCount = false,
      maxLength,
      inputProps,
      value,
      helperText,
      error,
      variant = "outlined",
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
        multiline
        minRows={minRows}
        maxRows={maxRows}
        value={value}
        error={error}
        variant={variant}
        helperText={
          showCharCount && mergedMaxLength
            ? `${charCount}/${mergedMaxLength}`
            : error
              ? helperText
              : helperText
        }
        sx={{
          "& .MuiInputBase-root": {
            alignItems: "flex-start",
          },
          ...sx,
        }}
        inputProps={{
          ...inputProps,
          maxLength: mergedMaxLength,
        }}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
