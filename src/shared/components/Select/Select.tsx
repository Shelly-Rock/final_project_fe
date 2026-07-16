"use client";

import { forwardRef } from "react";
import { TextField, TextFieldProps, MenuItem, Checkbox } from "@mui/material";
import type { SelectOption } from "@/shared/types";

export interface SelectProps extends Omit<
  TextFieldProps,
  "variant" | "select" | "onChange"
> {
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string) => void;
  placeholder?: string;
  showClearButton?: boolean;
  onClear?: () => void;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder,
      showClearButton,
      onClear,
      size = "medium",
      ...props
    },
    ref,
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.value);
    };

    return (
      <TextField
        ref={ref}
        select
        value={value}
        onChange={handleChange}
        size={size}
        fullWidth
        {...props}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem
            key={String(option.value)}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  },
);

Select.displayName = "Select";

export interface MultiSelectProps {
  options: SelectOption[];
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  size?: "small" | "medium";
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  label,
  placeholder,
  disabled,
  error,
  helperText,
  size = "medium",
}: MultiSelectProps) {
  const handleChange = (selectedValue: string | number, checked: boolean) => {
    if (checked) {
      onChange?.([...value, selectedValue]);
    } else {
      onChange?.(value.filter((v) => v !== selectedValue));
    }
  };

  return (
    <TextField
      select
      label={label}
      size={size}
      disabled={disabled}
      error={error}
      helperText={helperText}
      fullWidth
      SelectProps={{
        multiple: true,
        value,
        renderValue: (selected) => {
          if ((selected as string[]).length === 0) {
            return placeholder || "Chọn...";
          }
          return `${(selected as string[]).length} đã chọn`;
        },
      }}
      onChange={(e) => {
        const target = e.target as HTMLInputElement & { value: string[] };
        onChange?.(target.value);
      }}
    >
      {options.map((option) => (
        <MenuItem
          key={String(option.value)}
          value={option.value}
          disabled={option.disabled}
        >
          <Checkbox
            checked={value.includes(option.value)}
            onChange={(_, checked) => handleChange(option.value, checked)}
            size="small"
          />
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
