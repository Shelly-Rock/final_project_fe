"use client";

import {
  Checkbox as MuiCheckbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from "@mui/material";
import { forwardRef } from "react";

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  error?: boolean;
  helperText?: string;
  size?: "small" | "medium";
  color?:
    | "primary"
    | "secondary"
    | "error"
    | "success"
    | "warning"
    | "info"
    | "default";
  name?: string;
  value?: string | number | boolean;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      checked,
      onChange,
      label,
      disabled = false,
      indeterminate = false,
      error = false,
      helperText,
      size = "medium",
      color = "primary",
      name,
      value,
    },
    ref,
  ) => {
    const checkbox = (
      <MuiCheckbox
        inputRef={ref}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        indeterminate={indeterminate}
        size={size}
        color={color === "default" ? undefined : color}
        name={name}
        value={value}
        sx={{
          ...(color === "default" && {
            color: error ? "error.main" : "grey.500",
            "&.Mui-checked": { color: "grey.700" },
          }),
          ...(error && color === undefined && { color: "error.main" }),
        }}
      />
    );

    if (label !== undefined) {
      return (
        <FormGroup>
          <FormControlLabel
            control={checkbox}
            label={label}
            sx={{
              ml: 0,
              ...(disabled && { opacity: 0.6 }),
            }}
          />
          {helperText && (
            <FormHelperText error={error} sx={{ ml: 0 }}>
              {helperText}
            </FormHelperText>
          )}
        </FormGroup>
      );
    }

    return checkbox;
  },
);

Checkbox.displayName = "Checkbox";

export interface CheckboxGroupProps {
  label?: string;
  options: { label: string; value: string | number; disabled?: boolean }[];
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  row?: boolean;
  error?: boolean;
  helperText?: string;
}

export function CheckboxGroup({
  label,
  options,
  value = [],
  onChange,
  row = false,
  error = false,
  helperText,
}: CheckboxGroupProps) {
  const handleChange = (optionValue: string | number, checked: boolean) => {
    if (checked) {
      onChange?.([...value, optionValue]);
    } else {
      onChange?.(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <FormGroup row={row}>
      {label && (
        <FormHelperText error={error} sx={{ mb: 1 }}>
          {label}
        </FormHelperText>
      )}
      {options.map((option) => (
        <Checkbox
          key={String(option.value)}
          label={option.label}
          checked={value.includes(option.value)}
          onChange={(_, checked) => handleChange(option.value, checked)}
          disabled={option.disabled}
          error={error}
        />
      ))}
      {helperText && (
        <FormHelperText error={error} sx={{ ml: 0 }}>
          {helperText}
        </FormHelperText>
      )}
    </FormGroup>
  );
}
