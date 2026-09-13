// ============================================================
// API CLIENT — Axios instance with interceptors
// ============================================================
import axios from "axios";
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { signOut } from "next-auth/react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = apiClient
      .post<{ accessToken: string; refreshToken: string }>(
        "/auth/refresh-token",
        { refreshToken },
      )
      .then(({ data }) => {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        return data.accessToken;
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

// ── Request interceptor: attach JWT token ──────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ── Response interceptor: refresh expired access tokens ───────

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    const requestUrl = error.config?.url ?? "";
    const isLoginPage = window.location.pathname === "/login";
    const isAuthEndpoint =
      requestUrl.includes("/auth") || requestUrl.includes("/login");

    const requestConfig = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (error.response?.status === 401 && !isAuthEndpoint) {
      if (requestConfig && !requestConfig._retry) {
        requestConfig._retry = true;
        const accessToken = await refreshAccessToken();
        if (accessToken) {
          requestConfig.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(requestConfig);
        }
      }

      // Nếu refresh token thất bại hoặc không có token -> Logout NextAuth và chuyển về login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      if (!isLoginPage) {
        signOut({ callbackUrl: "/login" });
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
