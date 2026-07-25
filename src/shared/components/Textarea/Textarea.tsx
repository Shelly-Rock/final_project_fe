"use client";

import { forwardRef } from "react";
import { TextField, TextFieldProps } from "@mui/material";

export interface TextareaProps extends Omit<
  TextFieldProps,
  "variant" | "multiline" | "onChange"
> {
  minRows?: number;
  maxRows?: number;
  autoResize?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
  variant?: "outlined" | "filled" | "standard";
  onChange?: (value: string) => void;
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
      onChange,
      ...props
    },
    ref,
  ) => {
    const charCount = typeof value === "string" ? value.length : 0;
    const mergedMaxLength = maxLength ?? inputProps?.maxLength;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <TextField
        ref={ref}
        multiline
        minRows={minRows}
        maxRows={maxRows}
        value={value}
        error={error}
        variant={variant}
        onChange={handleChange}
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
          spellCheck: false,
        }}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
