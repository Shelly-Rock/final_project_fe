"use client";

import { useState, useEffect } from "react";
import { Drawer, Box, IconButton, Typography } from "@mui/material";
import { X } from "lucide-react";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  anchor?: "top" | "bottom" | "left" | "right";
  size?: number | string;
  hideCloseButton?: boolean;
  showHeader?: boolean;
  footer?: React.ReactNode;
}

export function Sheet({
  open,
  onClose,
  children,
  title,
  description,
  anchor = "right",
  size = 400,
  hideCloseButton = false,
  showHeader = true,
  footer,
}: SheetProps) {
  const isVertical = anchor === "left" || anchor === "right";

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isVertical ? size : "100%",
          height: !isVertical ? size : "100%",
          borderRadius: isVertical
            ? 0
            : anchor === "top"
              ? "16px 16px 0 0"
              : "0 0 16px 16px",
        },
      }}
    >
      {showHeader && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box>
            {title && (
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            )}
            {description && (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            )}
          </Box>
          {!hideCloseButton && (
            <IconButton onClick={onClose} size="small">
              <X size={20} />
            </IconButton>
          )}
        </Box>
      )}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          ...(footer && { pb: 0 }),
        }}
      >
        {children}
      </Box>
      {footer && (
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            mt: 2,
          }}
        >
          {footer}
        </Box>
      )}
    </Drawer>
  );
}
