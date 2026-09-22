"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Divider,
  Tabs,
  Tab,
  TextField,
  Button,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { PasswordStrengthMeter } from "@/shared/components/PasswordStrengthMeter";
import { useTheme, ThemeMode } from "@/shared/theme";
import { Switch } from "@/shared/components/Switch";
import { ROLE_LABELS } from "@/core/permissions/types";
import { authService } from "@/core/auth/auth.service";
import { toast } from "sonner";
import { User, Shield, Palette, Bell } from "lucide-react";

function ProfileTab() {
  const { data: session } = useSession();
  const user = session?.user;
  const initials = (user?.name || user?.email || "?").slice(0, 2).toUpperCase();
  const roleLabel = user?.role ? ROLE_LABELS[user.role] : "—";
  const roles = user?.roles?.length
    ? user.roles
    : user?.role
      ? [user.role]
      : [];

  return (
    <Stack spacing={3}>
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 2,
          display: "flex",
          gap: 3,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Avatar
          sx={{ width: 72, height: 72, bgcolor: "primary.main", fontSize: 28 }}
        >
          {initials}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Typography variant="h6" fontWeight={700}>
            {user?.name || "—"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email || "—"}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}
          >
            {roles.map((r) => (
              <Chip
                key={r}
                label={ROLE_LABELS[r]}
                size="small"
                color={
                  r === "admin"
                    ? "error"
                    : r === "teacher"
                      ? "success"
                      : "primary"
                }
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>
        <Box sx={{ minWidth: 180 }}>
          <Typography variant="caption" color="text.secondary">
            Vai trò hiện tại
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {roleLabel}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            ID
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
            {user?.id || "—"}
          </Typography>
        </Box>
      </Paper>

      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
            Thông tin tài khoản
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Tên đăng nhập"
              value={user?.name || ""}
              InputProps={{ readOnly: true }}
              size="small"
              fullWidth
            />
            <TextField
              label="Email"
              value={user?.email || ""}
              InputProps={{ readOnly: true }}
              size="small"
              fullWidth
            />
            <Typography variant="caption" color="text.secondary">
              Thông tin tài khoản do hệ thống quản lý. Liên hệ quản trị viên nếu
              cần chỉnh sửa.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setSuccess(false);
      if (!currentPassword) {
        setError("Vui lòng nhập mật khẩu hiện tại");
        return;
      }
      if (newPassword.length < 8) {
        setError("Mật khẩu mới phải có ít nhất 8 ký tự");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Mật khẩu xác nhận không khớp");
        return;
      }
      setLoading(true);
      try {
        await authService.changePasswordMe({ currentPassword, newPassword });
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Đổi mật khẩu thành công");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Đổi mật khẩu thất bại");
      } finally {
        setLoading(false);
      }
    },
    [currentPassword, newPassword, confirmPassword],
  );

  return (
    <Stack spacing={3} component="form" onSubmit={handleSubmit}>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
            Đổi mật khẩu
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert
              severity="success"
              sx={{ mb: 2 }}
              onClose={() => setSuccess(false)}
            >
              Đổi mật khẩu thành công.
            </Alert>
          )}
          <Stack spacing={2}>
            <TextField
              label="Mật khẩu hiện tại"
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              size="small"
              fullWidth
              required
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowCurrent((v) => !v)}
                      edge="end"
                    >
                      <span
                        className={`bi ${showCurrent ? "bi-eye-slash" : "bi-eye"}`}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Mật khẩu mới"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              size="small"
              fullWidth
              required
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowNew((v) => !v)}
                      edge="end"
                    >
                      <span
                        className={`bi ${showNew ? "bi-eye-slash" : "bi-eye"}`}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {newPassword && <PasswordStrengthMeter password={newPassword} />}
            <TextField
              label="Xác nhận mật khẩu mới"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              size="small"
              fullWidth
              required
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowConfirm((v) => !v)}
                      edge="end"
                    >
                      <span
                        className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  loading ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword
                }
                sx={{ minWidth: 140 }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Cập nhật mật khẩu"
                )}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      <Typography variant="caption" color="text.secondary">
        Nếu quên mật khẩu, dùng chức năng đặt lại qua email trên trang đăng
        nhập.
      </Typography>
    </Stack>
  );
}

function AppearanceNotificationsTab() {
  const { mode, setMode } = useTheme();
  const [emailOn, setEmailOn] = useState(true);
  const [pushOn, setPushOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("notification-prefs");
      if (raw) {
        const p = JSON.parse(raw);
        if (typeof p.emailOn === "boolean") setEmailOn(p.emailOn);
        if (typeof p.pushOn === "boolean") setPushOn(p.pushOn);
        if (typeof p.soundOn === "boolean") setSoundOn(p.soundOn);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback(
    (next: { emailOn: boolean; pushOn: boolean; soundOn: boolean }) => {
      localStorage.setItem("notification-prefs", JSON.stringify(next));
      toast.success("Đã lưu cài đặt");
    },
    [],
  );

  return (
    <Stack spacing={3}>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ mb: 0.5, display: "flex", alignItems: "center", gap: 1 }}
          >
            <Palette size={16} /> Giao diện
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Chọn chế độ hiển thị cho toàn bộ hệ thống.
          </Typography>
          <Stack direction="row" spacing={1}>
            {(["light", "dark", "system"] as ThemeMode[]).map((m) => (
              <Button
                key={m}
                variant={mode === m ? "contained" : "outlined"}
                size="small"
                onClick={() => setMode(m)}
                sx={{ textTransform: "none" }}
              >
                {m === "light"
                  ? "Sáng"
                  : m === "dark"
                    ? "Tối"
                    : "Theo hệ thống"}
              </Button>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ mb: 0.5, display: "flex", alignItems: "center", gap: 1 }}
          >
            <Bell size={16} /> Thông báo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Các tùy chọn này lưu cục bộ trên trình duyệt.
          </Typography>
          <Stack spacing={1.5} divider={<Divider />}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 0.5,
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Thông báo qua email
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Nhận email khi có thông báo quan trọng
                </Typography>
              </Box>
              <Switch
                checked={emailOn}
                onChange={(_, v) => {
                  setEmailOn(v);
                  persist({ emailOn: v, pushOn, soundOn });
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 0.5,
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Thông báo đẩy
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hiển thị chuông thông báo trong ứng dụng
                </Typography>
              </Box>
              <Switch
                checked={pushOn}
                onChange={(_, v) => {
                  setPushOn(v);
                  persist({ emailOn, pushOn: v, soundOn });
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 0.5,
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Âm thanh
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Phát âm báo khi có thông báo mới
                </Typography>
              </Box>
              <Switch
                checked={soundOn}
                onChange={(_, v) => {
                  setSoundOn(v);
                  persist({ emailOn, pushOn, soundOn: v });
                }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
        >
          <Tab
            icon={<User size={16} />}
            iconPosition="start"
            label="Hồ sơ"
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
          <Tab
            icon={<Shield size={16} />}
            iconPosition="start"
            label="Bảo mật"
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
          <Tab
            icon={<Palette size={16} />}
            iconPosition="start"
            label="Giao diện & Thông báo"
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
        </Tabs>
        <Box sx={{ p: 3 }}>
          {tab === 0 && <ProfileTab />}
          {tab === 1 && <SecurityTab />}
          {tab === 2 && <AppearanceNotificationsTab />}
        </Box>
      </Paper>
    </Box>
  );
}
