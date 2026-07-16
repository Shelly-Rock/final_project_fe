"use client";

import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ChevronDown, ChevronUp } from "lucide-react";
import { clsx } from "clsx";

export interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  disabled?: boolean;
  variant?: "default" | "bordered" | "filled";
  iconPosition?: "start" | "end";
  customTrigger?: React.ReactNode;
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  controlledOpen,
  onToggle,
  disabled = false,
  variant = "default",
  iconPosition = "end",
  customTrigger,
}: CollapsibleProps & { controlledOpen?: boolean }) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const handleToggle = () => {
    if (disabled) return;
    if (isControlled) {
      onToggle?.(!isOpen);
    } else {
      setInternalOpen(!internalOpen);
      onToggle?.(!isOpen);
    }
  };

  const trigger = customTrigger || (
    <IconButton
      size="small"
      onClick={handleToggle}
      disabled={disabled}
      sx={{
        transition: "transform 0.2s",
        transform: isOpen ? "rotate(0deg)" : "rotate(0deg)",
      }}
    >
      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </IconButton>
  );

  return (
    <Box
      className={clsx(variant !== "default" && `collapsible--${variant}`)}
      sx={{
        border: variant === "bordered" ? "1px solid" : "none",
        borderColor: "divider",
        borderRadius: variant === "bordered" ? 1 : 0,
        bgcolor: variant === "filled" ? "action.hover" : "transparent",
        overflow: "hidden",
      }}
    >
      <Box
        onClick={handleToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            iconPosition === "end" ? "space-between" : "flex-start",
          gap: 1,
          p: 2,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          "&:hover": {
            bgcolor: disabled ? "transparent" : "action.hover",
          },
        }}
      >
        {iconPosition === "start" && trigger}
        <Typography variant="subtitle1" sx={{ fontWeight: 500, flex: 1 }}>
          {title}
        </Typography>
        {iconPosition === "end" && trigger}
      </Box>
      <Box
        sx={{
          display: isOpen ? "block" : "none",
          p: 2,
          pt: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export interface CollapsibleAccordionProps {
  items: { title: string; content: React.ReactNode }[];
  defaultOpenIndex?: number | number[];
  allowMultiple?: boolean;
  variant?: "default" | "bordered" | "filled";
}

export function CollapsibleAccordion({
  items,
  defaultOpenIndex,
  allowMultiple = false,
  variant = "default",
}: CollapsibleAccordionProps) {
  const initialOpen = Array.isArray(defaultOpenIndex)
    ? defaultOpenIndex
    : defaultOpenIndex !== undefined
      ? [defaultOpenIndex]
      : [];
  const [openIndices, setOpenIndices] = useState<number[]>(initialOpen);

  const handleToggle = (index: number) => {
    setOpenIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }
      if (allowMultiple) {
        return [...prev, index];
      }
      return [index];
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: variant === "default" ? 0 : 1,
      }}
    >
      {items.map((item, index) => (
        <Collapsible
          key={index}
          title={item.title}
          controlledOpen={openIndices.includes(index)}
          onToggle={() => handleToggle(index)}
          variant={variant}
        >
          {item.content}
        </Collapsible>
      ))}
    </Box>
  );
}
