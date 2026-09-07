// ============================================================
// API Client - Wrapper around fetch for API calls
// ============================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

interface ApiClientOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (typeof window === "undefined") return false;

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;

    const response = await fetch(`${this.baseUrl}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => null);

    if (!response?.ok) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return false;
    }

    const data = (await response.json()) as {
      accessToken?: string;
      refreshToken?: string;
    };
    if (!data.accessToken || !data.refreshToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return false;
    }

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return true;
  }

  private async request<T>(
    endpoint: string,
    options: ApiClientOptions = {},
    canRetry = true,
  ): Promise<T> {
    const { params, ...fetchOptions } = options;

    // Build URL with query params
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // Get auth token from storage (client-side only)
    let headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(fetchOptions.headers as Record<string, string>),
    };

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers = {
          ...headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (
      response.status === 401 &&
      canRetry &&
      !endpoint.startsWith("/auth/") &&
      (await this.refreshAccessToken())
    ) {
      return this.request<T>(endpoint, options, false);
    }

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(
        (error as { message?: string }).message || `HTTP ${response.status}`,
      );
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) return {} as T;

    return JSON.parse(text) as T;
  }

  async get<T>(endpoint: string, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiClientOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiClientOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiClientOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  // Upload file with multipart/form-data
  async uploadFile<T>(
    endpoint: string,
    file: File | Blob,
    fieldName: string = "file",
    additionalData?: Record<string, string>,
  ): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    let headers: HeadersInit = {};
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers = { Authorization: `Bearer ${token}` };
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(
        (error as { message?: string }).message || `HTTP ${response.status}`,
      );
    }

    return response.json() as Promise<T>;
  }

  // Download a binary response (Excel export, ...) with auth + 401 refresh.
  // Returns the Blob plus the filename parsed from Content-Disposition.
  async downloadBlob(
    endpoint: string,
    options: ApiClientOptions = {},
    canRetry = true,
  ): Promise<{ blob: Blob; filename: string | null }> {
    const { params, ...fetchOptions } = options;

    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    let headers: HeadersInit = {
      ...(fetchOptions.headers as Record<string, string>),
    };
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers = { ...headers, Authorization: `Bearer ${token}` };
      }
    }

    const response = await fetch(url, {
      ...fetchOptions,
      method: fetchOptions.method || "GET",
      headers,
    });

    if (
      response.status === 401 &&
      canRetry &&
      !endpoint.startsWith("/auth/") &&
      (await this.refreshAccessToken())
    ) {
      return this.downloadBlob(endpoint, options, false);
    }

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(
        (error as { message?: string }).message || `HTTP ${response.status}`,
      );
    }

    const disposition = response.headers.get("Content-Disposition");
    let filename: string | null = null;
    if (disposition) {
      const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
      const plainMatch = disposition.match(/filename="?([^";]+)"?/i);
      if (utf8Match) {
        filename = decodeURIComponent(utf8Match[1]);
      } else if (plainMatch) {
        filename = plainMatch[1];
      }
    }

    return { blob: await response.blob(), filename };
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
