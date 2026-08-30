"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState, useEffect } from "react";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { toast } from "@/shared/components/Sonner/Sonner";

const BACKEND_ERRORS = {
  EMAIL_NOT_VERIFIED: "Please verify your email first",
  MUST_CHANGE_PASSWORD: "You must change your password before logging in",
};

function getDefaultRouteForRole(role?: string) {
  switch (role) {
    case "student":
      return "/topic-registration";
    case "teacher":
      return "/my-topics";
    case "admin":
    case "secretary":
      return "/students";
    default:
      return "/";
  }
}

function getSafeRedirectUrl(target: string | null | undefined, role?: string) {
  if (
    !target ||
    target === "/login" ||
    target.startsWith("/api") ||
    target.startsWith("/auth")
  ) {
    return getDefaultRouteForRole(role);
  }

  return target;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { data: session } = useSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (session?.user) {
      const destination = session.user.mustChangePassword
        ? "/change-password?mustChangePassword=1"
        : getSafeRedirectUrl(callbackUrl, session.user.role);

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== destination
      ) {
        window.location.assign(destination);
      }
    }
  }, [session, callbackUrl]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_emailToVerify, setEmailToVerify] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setEmailError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        const msg = result.error;

        if (
          msg.toLowerCase().includes("verify") ||
          msg === BACKEND_ERRORS.EMAIL_NOT_VERIFIED
        ) {
          setEmailError(
            "Email chưa được xác minh. Vui lòng kiểm tra hộp thư và click link xác nhận.",
          );
        } else if (
          msg.toLowerCase().includes("change password") ||
          msg === BACKEND_ERRORS.MUST_CHANGE_PASSWORD
        ) {
          // Redirect to change password page (email already verified, just need to set password)
          router.push("/change-password?mustChangePassword=1");
        } else {
          setError(msg || "Tài khoản hoặc mật khẩu không chính xác.");
        }
      } else if (result?.ok) {
        const refreshedSession = await getSession();
        const destination = getSafeRedirectUrl(
          result?.url ?? callbackUrl,
          refreshedSession?.user?.role ?? session?.user?.role,
        );

        toast.success("Đăng nhập thành công");

        if (refreshedSession?.user) {
          window.location.assign(destination);
        } else {
          window.location.assign(destination);
        }
      }
    } catch (err: unknown) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.error("[Login] Credentials sign-in failed", err);
      }
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      );
    } finally {
      setLoading(false);
    }
  }

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

          {emailError && (
            <Alert
              severity="warning"
              className="login-alert"
              onClose={() => setEmailError("")}
            >
              {emailError}
            </Alert>
          )}

          <Box
            component="form"
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <TextField
              label="Tài khoản (MSSV)"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              autoComplete="username"
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
              disabled={loading || !username || !password}
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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
