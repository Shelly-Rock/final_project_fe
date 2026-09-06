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

    console.log("[API Client] Response error", {
      status: error.response?.status,
      url: requestUrl,
      isLoginPage,
      isAuthEndpoint,
    });

    const requestConfig = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    if (
      error.response?.status === 401 &&
      requestConfig &&
      !requestConfig._retry &&
      !isAuthEndpoint
    ) {
      requestConfig._retry = true;
      const accessToken = await refreshAccessToken();
      if (accessToken) {
        requestConfig.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(requestConfig);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
