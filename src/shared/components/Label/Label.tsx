"use client";

import { FormLabel, FormHelperText, Box } from "@mui/material";
import { clsx } from "clsx";

export interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  helperText?: string;
  size?: "small" | "medium";
  className?: string;
}

export function Label({
  children,
  htmlFor,
  required = false,
  error = false,
  disabled = false,
  helperText,
  size = "medium",
  className,
}: LabelProps) {
  return (
    <Box>
      <FormLabel
        htmlFor={htmlFor}
        className={clsx(className)}
        sx={{
          display: "block",
          mb: 0.5,
          fontSize: size === "small" ? "0.75rem" : "0.875rem",
          fontWeight: 500,
          color: error
            ? "error.main"
            : disabled
              ? "text.disabled"
              : "text.primary",
          "&.MuiFormLabel-asterisk": {
            color: "error.main",
          },
        }}
        required={required}
      >
        {children}
      </FormLabel>
      {helperText && (
        <FormHelperText
          error={error}
          disabled={disabled}
          sx={{ mt: 0, fontSize: "0.75rem" }}
        >
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
}
