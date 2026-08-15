"use client";

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio as MuiRadio,
  RadioGroup as MuiRadioGroup,
  FormHelperText,
  RadioGroupProps as MuiRadioGroupProps,
} from "@mui/material";
import { forwardRef } from "react";

export interface RadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface RadioProps {
  checked?: boolean;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ) => void;
  label?: string;
  disabled?: boolean;
  size?: "small" | "medium";
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  name?: string;
  value?: string | number | boolean;
}

export const Radio = forwardRef<HTMLButtonElement, RadioProps>(
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
    const handleChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      checked: boolean,
    ) => {
      onChange?.(event, String(value));
    };

    const radio = (
      <MuiRadio
        inputRef={ref}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        size={size}
        color={color}
        name={name}
        value={value}
      />
    );

    if (label !== undefined) {
      return (
        <FormControlLabel
          control={radio}
          label={label}
          sx={{
            ml: 0,
            ...(disabled && { opacity: 0.6 }),
          }}
        />
      );
    }

    return radio;
  },
);

Radio.displayName = "Radio";

export interface RadioGroupProps extends Omit<MuiRadioGroupProps, "onChange"> {
  options: RadioOption[];
  value?: string | number;
  onChange?: (value: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  row?: boolean;
  size?: "small" | "medium";
}

export function RadioGroup({
  options,
  value,
  onChange,
  label,
  error = false,
  helperText,
  row = false,
  size = "medium",
  ...props
}: RadioGroupProps) {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    newValue: string,
  ) => {
    onChange?.(newValue);
  };

  return (
    <FormControl error={error} component="fieldset">
      {label && (
        <FormLabel component="legend" sx={{ fontWeight: 500, mb: 1 }}>
          {label}
        </FormLabel>
      )}
      <MuiRadioGroup value={value} onChange={handleChange} row={row} {...props}>
        {options.map((option) => (
          <FormControlLabel
            key={String(option.value)}
            value={option.value}
            control={<MuiRadio size={size} />}
            label={option.label}
            disabled={option.disabled}
          />
        ))}
      </MuiRadioGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
