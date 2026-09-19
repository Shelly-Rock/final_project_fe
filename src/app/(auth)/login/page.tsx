/* eslint-disable no-console */
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
      return "/department";
    default:
      return "/";
  }
}

function getSafeRedirectUrl(target: string | null | undefined, role?: string) {
  if (!target) {
    return getDefaultRouteForRole(role);
  }

  // Normalize: extract pathname from absolute URL (e.g. "http://localhost:3000/login" → "/login")
  let pathname = target;
  try {
    const url = new URL(target);
    pathname = url.pathname;
  } catch {
    // target is already a relative path, use as-is
  }

  if (
    pathname === "/login" ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth")
  ) {
    return getDefaultRouteForRole(role);
  }

  return pathname;
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

      console.log("[Login] Session updated, redirecting", {
        session,
        destination,
        callbackUrl,
        currentPath: window.location.pathname,
      });

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== destination
      ) {
        router.push(destination);
      }
    }
  }, [session, callbackUrl, router]);

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
        // Force session update by calling getSession multiple times
        let refreshedSession = await getSession();
        let retries = 0;
        while (!refreshedSession?.user && retries < 5) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          refreshedSession = await getSession();
          retries++;
        }

        const destination = getSafeRedirectUrl(
          result?.url ?? callbackUrl,
          refreshedSession?.user?.role ?? session?.user?.role,
        );

        console.log("[Login] Login successful", {
          refreshedSession,
          destination,
          callbackUrl,
          resultUrl: result?.url,
          retries,
          accessToken: refreshedSession?.accessToken,
        });

        // Store backend JWTs for the Axios API client
        if (refreshedSession?.accessToken) {
          localStorage.setItem("accessToken", refreshedSession.accessToken);
        }
        if (refreshedSession?.refreshToken) {
          localStorage.setItem("refreshToken", refreshedSession.refreshToken);
        }

        toast.success("Đăng nhập thành công");

        // Use window.location.replace to force full page reload with new session
        window.location.replace(destination);
      }
    } catch (err: unknown) {
      if (process.env.NODE_ENV === "development") {
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
    <Box
      className="login-root"
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <video
        autoPlay
        muted
        loop
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          margin: 0,
          padding: 0,
        }}
      >
        <source src="/assets/video/video-introduce.mp4" type="video/mp4" />
      </video>
      <Box className="login-card" sx={{ position: "relative", zIndex: 1 }}>
        <Box className="login-form-wrap">
          <Box className="login-card-brand">
            <Image
              src={Logo}
              alt="Logo"
              width={110}
              height={42}
              className="login-card-logo"
            />
          </Box>

          <Box className="login-form-header">
            <Typography className="login-form-title">Đăng nhập</Typography>
            <Typography className="login-form-subtitle">
              Vui lòng đăng nhập để tiếp tục sử dụng hệ thống
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

            <Box className="login-options">
              <label className="login-remember">
                <input type="checkbox" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <button type="button" className="login-forgot-password">
                Quên mật khẩu?
              </button>
            </Box>

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
