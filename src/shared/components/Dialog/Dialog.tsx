"use client";

import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Slide,
} from "@mui/material";
import { X } from "lucide-react";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef } from "react";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "fullWidth";
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  fullWidth?: boolean;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
}: DialogProps) {
  const sizeMap = {
    xs: 300,
    sm: 400,
    md: 500,
    lg: 700,
    xl: 900,
    fullWidth: undefined,
  };

  const handleClose = (_: unknown, reason: string) => {
    if (!closeOnBackdrop && reason === "backdropClick") return;
    if (!closeOnEscape && reason === "escapeKeyDown") return;
    onClose();
  };

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      maxWidth={size === "fullWidth" ? undefined : size}
      fullWidth={size === "fullWidth" || true}
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxWidth: sizeMap[size] || undefined,
          bgcolor: "background.paper",
          color: "text.primary",
        },
      }}
      TransitionComponent={Transition}
    >
      {(title || showCloseButton) && (
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: title ? 1 : 3,
          }}
        >
          <Box>
            {title && (
              <Typography
                variant="h6"
                component="span"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                {title}
              </Typography>
            )}
            {description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {description}
              </Typography>
            )}
          </Box>
          {showCloseButton && (
            <IconButton onClick={onClose} size="small" sx={{ ml: 1 }}>
              <X size={20} />
            </IconButton>
          )}
        </DialogTitle>
      )}
      {children && (
        <DialogContent sx={{ pt: title || showCloseButton ? 0 : 3 }}>
          {children}
        </DialogContent>
      )}
      {actions && (
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>{actions}</DialogActions>
      )}
    </MuiDialog>
  );
}
