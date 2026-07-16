"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
  loading?: boolean;
  hideCancel?: boolean;
}

const variantConfig = {
  danger: {
    icon: <AlertTriangle size={48} />,
    color: "#d32f2f",
    bgColor: "#ffebee",
  },
  warning: {
    icon: <AlertCircle size={48} />,
    color: "#ed6c02",
    bgColor: "#fff3e0",
  },
  info: {
    icon: <Info size={48} />,
    color: "#0288d1",
    bgColor: "#e1f5fe",
  },
  success: {
    icon: <CheckCircle size={48} />,
    color: "#2e7d32",
    bgColor: "#e8f5e9",
  },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Xác nhận",
  description = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "danger",
  loading = false,
  hideCancel = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, textAlign: "center" }}>
        <Box
          sx={{
            display: "inline-flex",
            p: 2,
            borderRadius: "50%",
            bgcolor: config.bgColor,
            color: config.color,
            mb: 1,
          }}
        >
          {config.icon}
        </Box>
        <Typography
          variant="h6"
          component="span"
          sx={{ display: "block", fontWeight: 600 }}
        >
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: "center", gap: 1 }}>
        {!hideCancel && (
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
        )}
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          sx={{
            bgcolor: config.color,
            "&:hover": {
              bgcolor: config.color,
              opacity: 0.9,
            },
          }}
        >
          {loading ? "Đang xử lý..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
