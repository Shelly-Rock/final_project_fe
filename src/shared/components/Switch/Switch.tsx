"use client";

import {
  Switch as MuiSwitch,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from "@mui/material";
import { forwardRef } from "react";

export interface SwitchProps {
  checked?: boolean;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
  label?: string;
  disabled?: boolean;
  size?: "small" | "medium";
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "default";
  name?: string;
  value?: string | number | boolean;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      onChange,
      label,
      disabled = false,
      size = "medium",
      color = "primary",
      name,
      value,
    },
    ref,
  ) => {
    const switchComponent = (
      <MuiSwitch
        inputRef={ref}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        size={size}
        color={color === "default" ? undefined : color}
        name={name}
        value={value}
      />
    );

    if (label !== undefined) {
      return (
        <FormGroup>
          <FormControlLabel
            control={switchComponent}
            label={label}
            sx={{
              ml: 0,
              ...(disabled && { opacity: 0.6 }),
            }}
          />
        </FormGroup>
      );
    }

    return switchComponent;
  },
);

Switch.displayName = "Switch";

export interface SwitchGroupProps {
  options: { label: string; value: string | number; disabled?: boolean }[];
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
}

export function SwitchGroup({
  options,
  value = [],
  onChange,
  label,
  error = false,
  helperText,
}: SwitchGroupProps) {
  const handleChange = (optionValue: string | number, checked: boolean) => {
    if (checked) {
      onChange?.([...value, optionValue]);
    } else {
      onChange?.(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <FormGroup>
      {label && (
        <FormHelperText error={error} sx={{ mb: 1 }}>
          {label}
        </FormHelperText>
      )}
      {options.map((option) => (
        <FormControlLabel
          key={String(option.value)}
          control={
            <MuiSwitch
              checked={value.includes(option.value)}
              onChange={(_, checked) => handleChange(option.value, checked)}
              disabled={option.disabled}
              size="small"
            />
          }
          label={option.label}
        />
      ))}
      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </FormGroup>
  );
}
