// ============================================================
// CHANGE PASSWORD PAGE — Handle email verification + password setup
// Supports two flows:
// 1. Via email link: ?token=xxx  → verifyEmail + changePassword
// 2. After login:    ?mustChangePassword=1 → changePasswordMe (JWT)
// ============================================================
"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import LockResetIcon from "@mui/icons-material/LockReset";
import { authService } from "@/core/auth/auth.service";

function ChangePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const token = searchParams.get("token");
  const mustChangePassword = searchParams.get("mustChangePassword") === "1";
  const isAuthenticatedChange =
    !token && !mustChangePassword && !!session?.user;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Validate token only for email-link flow
  useEffect(() => {
    if (!token && !mustChangePassword && !session?.user) {
      setError("Liên kết không hợp lệ hoặc đã hết hạn.");
    }
  }, [token, mustChangePassword, session]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (newPassword.length < 6) {
        setError("Mật khẩu mới phải có ít nhất 6 ký tự");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Mật khẩu xác nhận không khớp");
        return;
      }

      // Validate current password for logged-in users
      if ((mustChangePassword || isAuthenticatedChange) && !currentPassword) {
        setError("Vui lòng nhập mật khẩu hiện tại");
        return;
      }

      setLoading(true);

      try {
        if (token) {
          // ── Flow 1: Email link ────────────────────────────────
          await authService.changePassword({ token, newPassword });

          setSuccess(true);
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else if (mustChangePassword || isAuthenticatedChange) {
          await authService.changePasswordMe({
            currentPassword,
            newPassword,
          });

          setSuccess(true);
          setTimeout(() => {
            if (mustChangePassword) {
              signIn("credentials", {
                username: session?.user?.name || "",
                password: newPassword,
                redirect: false,
              }).then(() => router.push("/"));
            } else {
              router.push("/");
            }
          }, 1500);
        } else {
          setError("Liên kết không hợp lệ.");
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Xử lý thất bại. Vui lòng thử lại.",
        );
      } finally {
        setLoading(false);
      }
    },
    [
      token,
      mustChangePassword,
      currentPassword,
      newPassword,
      confirmPassword,
      router,
      session,
      isAuthenticatedChange,
    ],
  );

  return (
    <Box className="login-root">
      <Box className="login-panel login-panel--right" sx={{ maxWidth: 480 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            maxWidth: 440,
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <LockResetIcon color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {token ? "Đặt mật khẩu mới" : "Đổi mật khẩu"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {token
                  ? "Thiết lập mật khẩu cho tài khoản của bạn"
                  : "Cập nhật mật khẩu để bảo vệ tài khoản"}
              </Typography>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              {mustChangePassword
                ? "Đổi mật khẩu thành công! Đang đăng nhập..."
                : "Đặt mật khẩu thành công! Đang chuyển hướng đến trang đăng nhập..."}
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {(mustChangePassword || isAuthenticatedChange) && (
                <TextField
                  label="Mật khẩu hiện tại"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
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
                            onClick={() => setShowCurrentPassword((v) => !v)}
                            edge="end"
                          >
                            <span
                              className={`bi ${showCurrentPassword ? "bi-eye-slash" : "bi-eye"}`}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}

              <TextField
                label="Mật khẩu mới"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                required
                disabled={
                  loading ||
                  (!token && !mustChangePassword && !isAuthenticatedChange)
                }
                sx={{ mb: 2 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword((v) => !v)}
                          edge="end"
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
                disabled={
                  loading ||
                  (!token && !mustChangePassword && !isAuthenticatedChange)
                }
                sx={{ mb: 3 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          edge="end"
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

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={
                  loading ||
                  (!token && !mustChangePassword && !isAuthenticatedChange) ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword.length < 6
                }
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Xác nhận"
                )}
              </Button>

              {token && (
                <Button
                  variant="text"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => router.push("/login")}
                >
                  Quay lại đăng nhập
                </Button>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={null}>
      <ChangePasswordForm />
    </Suspense>
  );
}
