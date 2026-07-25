"use client";

import { useState } from "react";
import { Tab as MuiTab, Tabs as MuiTabs, Box } from "@mui/material";

export interface TabItem {
  label: string | React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  variant?: "standard" | "scrollable" | "fullWidth";
  orientation?: "horizontal" | "vertical";
  indicatorColor?: "secondary" | "primary";
  textColor?: "secondary" | "primary" | "inherit";
  centered?: boolean;
  showContent?: boolean;
}

export function Tabs({
  items,
  defaultValue = 0,
  controlledValue,
  onChange,
  variant = "standard",
  orientation = "horizontal",
  indicatorColor = "primary",
  textColor = "primary",
  centered = false,
  showContent = true,
}: TabsProps & { controlledValue?: number }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <MuiTabs
        value={currentValue}
        onChange={handleChange}
        variant={variant === "fullWidth" ? "fullWidth" : variant}
        orientation={orientation}
        indicatorColor={indicatorColor}
        textColor={textColor}
        centered={centered}
        scrollButtons="auto"
        sx={{
          borderBottom: orientation === "horizontal" ? 1 : 0,
          borderColor: "divider",
          minHeight: 40,
          "& .MuiTab-root": {
            minHeight: 40,
            textTransform: "none",
            fontWeight: 500,
          },
        }}
      >
        {items.map((item, index) => (
          <MuiTab
            key={index}
            label={item.label}
            icon={
              item.icon ? <Box sx={{ mr: 0.5 }}>{item.icon}</Box> : undefined
            }
            iconPosition="start"
            disabled={item.disabled}
            sx={{
              flexDirection: orientation === "vertical" ? "row" : "column",
            }}
          />
        ))}
      </MuiTabs>
      {showContent && <Box sx={{ mt: 2 }}>{items[currentValue]?.content}</Box>}
    </Box>
  );
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  className?: string;
}

export function TabPanel({ children, value, index, className }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      className={className}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}
