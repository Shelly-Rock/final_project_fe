/* eslint-disable no-console */
"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState, useEffect } from "react";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import VerifiedIcon from "@mui/icons-material/Verified";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import { default as Logo } from "@/assets/image/png/logo02.png";
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
  const [videoLoading, setVideoLoading] = useState(true);
  const [showFeatures, setShowFeatures] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVideoLoading(false), 15000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowFeatures(false), 5000);
    return () => clearTimeout(timer);
  }, []);

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
        justifyContent: "center",
        padding: "clamp(2rem, 5vw, 5rem)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          background: "#0d1117",
          zIndex: 1,
          padding: 4,
          opacity: videoLoading ? 1 : 0,
          visibility: videoLoading ? "visible" : "hidden",
          transition: "opacity 0.8s ease-out, visibility 0.8s ease-out",
          pointerEvents: videoLoading ? "auto" : "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            maxWidth: 300,
            flex: 1,
            marginRight: "10%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <SecurityIcon
              sx={{ color: "white", fontSize: 32, mt: 1, flexShrink: 0 }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{ color: "white", fontWeight: 700, mb: 1 }}
              >
                Bảo mật cao
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                Dữ liệu được bảo vệ với mã hóa cấp cao
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <SpeedIcon
              sx={{ color: "white", fontSize: 32, mt: 1, flexShrink: 0 }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{ color: "white", fontWeight: 700, mb: 1 }}
              >
                Nhanh & Hiệu quả
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                Giao diện thân thiện, dễ sử dụng
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            maxWidth: 300,
            flex: 1,
            marginLeft: "10%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <VerifiedIcon
              sx={{ color: "white", fontSize: 32, mt: 1, flexShrink: 0 }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{ color: "white", fontWeight: 700, mb: 1 }}
              >
                Đáng tin cậy
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                Được tin dùng bởi hàng nghìn sinh viên
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <CloudSyncIcon
              sx={{ color: "white", fontSize: 32, mt: 1, flexShrink: 0 }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{ color: "white", fontWeight: 700, mb: 1 }}
              >
                Đồng bộ tức thời
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                Cập nhật dữ liệu realtime trên tất cả thiết bị
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {videoLoading && null}
      <video
        autoPlay
        muted
        loop
        preload="auto"
        onLoadStart={() => setVideoLoading(true)}
        onLoadedData={() => setVideoLoading(false)}
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
        <source src="/videos/video-introduce.mp4" type="video/mp4" />
      </video>
      <Box
        className="login-panel login-panel--right"
        sx={{ maxWidth: 480, mx: "auto", position: "relative", zIndex: 5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            maxWidth: 440,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Image src={Logo} alt="Logo" width={80} height={80} />
            <Typography variant="h5" fontWeight={700} sx={{ mt: 2 }}>
              Đăng nhập
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {emailError && (
            <Alert
              severity="warning"
              sx={{ mb: 2 }}
              onClose={() => setEmailError("")}
            >
              {emailError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              placeholder="Tài khoản (MSSV)"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
              autoComplete="username"
              autoFocus
              disabled={loading}
              variant="outlined"
              sx={{
                mb: 2,
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px transparent inset !important",
                  WebkitTextFillColor: "inherit !important",
                },
              }}
            />

            <TextField
              placeholder="Mật khẩu"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              autoComplete="current-password"
              disabled={loading}
              variant="outlined"
              sx={{
                mb: 2,
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px transparent inset !important",
                  WebkitTextFillColor: "inherit !important",
                },
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        aria-label={
                          showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                        }
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <FormControlLabel
                control={<Checkbox disabled={loading} size="small" />}
                label={
                  <Typography variant="body2">Ghi nhớ đăng nhập</Typography>
                }
              />
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => {}}
                sx={{ cursor: "pointer" }}
              >
                Quên mật khẩu?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !username || !password}
              startIcon={<span className="bi bi-box-arrow-in-right" />}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </Box>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary">
              Hệ thống QTQ — Quản lý Đồ án Sinh viên
            </Typography>
          </Box>
        </Paper>
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
