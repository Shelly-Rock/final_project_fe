// ============================================================
// API CLIENT — Axios instance with interceptors
// ============================================================
import axios from "axios";
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor: attach JWT token ──────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      console.log("[API Client] Request interceptor", {
        url: config.url,
        hasToken: !!token,
        tokenLength: token?.length,
      });
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ── Response interceptor: handle 401 by clearing session ───────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    const requestUrl = error.config?.url ?? "";
    const isLoginPage = window.location.pathname === "/login";
    const isAuthEndpoint =
      requestUrl.includes("/auth") || requestUrl.includes("/login");

    console.log("[API Client] Response error", {
      status: error.response?.status,
      url: requestUrl,
      isLoginPage,
      isAuthEndpoint,
    });

    // Temporarily disable 401 redirect to avoid loop
    // if (error.response?.status === 401 && !isLoginPage && !isAuthEndpoint) {
    //   // Token expired or invalid → clear session, but do not loop back to login
    //   // while the user is already on the auth page or during an in-flight auth flow.
    //   localStorage.removeItem("accessToken");
    //   localStorage.removeItem("refreshToken");

    //   const currentPath = `${window.location.pathname}${window.location.search}`;
    //   const loginUrl = new URL("/login", window.location.origin);
    //   loginUrl.searchParams.set("callbackUrl", currentPath || "/");
    //   window.location.assign(loginUrl.toString());
    // }

    return Promise.reject(error);
  },
);

export default apiClient;
