// ============================================================
// PASSWORD CHANGE DIALOG — Force change password after email verify
// ============================================================
"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LockReset } from "@mui/icons-material";
import { authService } from "@/core/auth/auth.service";

interface PasswordChangeDialogProps {
  open: boolean;
  onSuccess: () => void;
  token?: string;
}

export function PasswordChangeDialog({
  open,
  onSuccess,
  token,
}: PasswordChangeDialogProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(async () => {
    setError("");

    if (!newPassword || newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      await authService.changePassword({
        token,
        newPassword,
      });

      setNewPassword("");
      setConfirmPassword("");
      onSuccess();
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Đổi mật khẩu thất bại. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  }, [newPassword, confirmPassword, token, onSuccess]);

  const handleClose = () => {
    if (!loading) {
      setError("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <LockReset color="primary" />
        Đặt mật khẩu mới
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Vui lòng đặt mật khẩu mới cho tài khoản của bạn. Mật khẩu phải có ít
          nhất 6 ký tự.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <TextField
          label="Mật khẩu mới"
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          required
          autoFocus
          disabled={loading}
          sx={{ mb: 2 }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword((v) => !v)}
                    edge="end"
                    size="small"
                  >
                    <span
                      className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          label="Xác nhận mật khẩu mới"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          required
          disabled={loading}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    edge="end"
                    size="small"
                  >
                    <span
                      className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            loading ||
            !newPassword ||
            !confirmPassword ||
            newPassword.length < 6
          }
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Đổi mật khẩu"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
