"use client";
import { useState, useCallback, useEffect, type FormEvent } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { default as Logo } from "@/assets/image/png/logo.png";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Already logged in → redirect to home
  useEffect(() => {
    if (session?.user) {
      router.push("/");
      router.refresh();
    }
  }, [session, router]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Email hoặc mật khẩu không chính xác. Vui lòng thử lại.");
        } else {
          router.push("/");
          router.refresh();
        }
      } catch {
        setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    },
    [email, password, router],
  );

  return (
    <Box className="login-root">
      {/* Left panel */}
      <Box className="login-panel login-panel--left">
        <Box className="login-panel-content">
          <Box className="login-brand">
            <Box className="login-brand-logo-wrap">
              <Image
                src={Logo}
                alt="Logo"
                width={80}
                height={80}
                className="login-brand-logo"
              />
            </Box>
            <Typography className="login-brand-text">Thesis Manager</Typography>
          </Box>

          <Box className="login-hero">
            <Typography className="login-hero-title">
              Quản lý đồ án sinh viên
            </Typography>
            <Typography className="login-hero-desc">
              Nền tảng hỗ trợ quản lý toàn diện: từ đăng ký đề tài, phân công
              giảng viên, theo dõi tiến độ, đến đánh giá kết quả bảo vệ.
            </Typography>
          </Box>

          <Box className="login-features">
            {[
              {
                icon: "bi-mortarboard",
                text: "Quản lý đồ án & đề tài",
              },
              {
                icon: "bi-people",
                text: "Phân công giảng viên hướng dẫn",
              },
              {
                icon: "bi-bar-chart",
                text: "Thống kê & báo cáo chi tiết",
              },
              {
                icon: "bi-shield-lock",
                text: "Phân quyền người dùng chặt chẽ",
              },
            ].map((f) => (
              <Box key={f.text} className="login-feature-item">
                <Box className="login-feature-icon-wrap">
                  <span className={`bi ${f.icon} login-feature-icon`} />
                </Box>
                <Typography className="login-feature-text">{f.text}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box className="login-deco login-deco--circle1" />
        <Box className="login-deco login-deco--circle2" />
        <Box className="login-deco login-deco--circle3" />
      </Box>

      {/* Right panel — form */}
      <Box className="login-panel login-panel--right">
        <Box className="login-form-wrap">
          <Box className="login-form-header">
            <Typography className="login-form-title">Đăng nhập</Typography>
            <Typography className="login-form-subtitle">
              Chào mừng bạn quay trở lại. Vui lòng nhập thông tin.
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              className="login-alert"
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
              autoFocus
              slotProps={{
                input: { className: "login-field-input" },
              }}
            />

            <TextField
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
              slotProps={{
                input: {
                  className: "login-field-input",
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        aria-label={
                          showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                        }
                        className="login-password-toggle"
                      >
                        <span
                          className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
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
              disabled={loading || !email || !password}
              className="login-submit-btn"
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <>
                  <span className="bi bi-box-arrow-in-right login-btn-icon" />
                  Đăng nhập
                </>
              )}
            </Button>
          </Box>

          <Box className="login-footer">
            <Typography className="login-footer-text">
              Hệ thống QTQ — Quản lý Đồ án Sinh viên
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
