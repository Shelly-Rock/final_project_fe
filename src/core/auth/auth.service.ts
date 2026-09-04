// ============================================================
// AUTH SERVICE — Calls to /auth/* endpoints on the backend
// ============================================================
import apiClient from "@/core/api";
import type { Role } from "@/core/permissions/types";

// ── DTOs matching backend auth.dto.ts ──────────────────────────
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    username: string;
    mustChangePassword: boolean;
    emailVerifiedAt: string | null;
    role: {
      id: number;
      name: string;
      displayName: string;
    };
  };
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export interface ChangePasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
}

export interface UserInfo {
  id: number;
  email: string;
  username: string;
  mustChangePassword: boolean;
  emailVerifiedAt: string | null;
  role: {
    id: number;
    name: string;
    displayName: string;
  };
}

// ── Map backend role value → frontend Role type ──────────────────
function mapRole(backendRole: string | number): Role {
  const normalized = String(backendRole).trim().toUpperCase();

  switch (normalized) {
    case "ADMIN":
    case "4":
      return "admin";
    case "SECRETARY":
    case "3":
      return "secretary";
    case "COMMITTEE":
      return "teacher"; // Map COMMITTEE to teacher for now
    case "TEACHER":
    case "2":
      return "teacher";
    case "STUDENT":
    case "1":
      return "student";
    default:
      return "student";
  }
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials,
    );
    return data;
  }

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    const { data } = await apiClient.post<VerifyEmailResponse>(
      "/auth/verify-email",
      { token },
    );
    return data;
  }

  async changePassword(
    req: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    const { data } = await apiClient.post<ChangePasswordResponse>(
      "/auth/change-password",
      req,
    );
    return data;
  }

  async changePasswordMe(req: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ChangePasswordResponse> {
    const { data } = await apiClient.post<ChangePasswordResponse>(
      "/auth/change-password/me",
      req,
    );
    return data;
  }

  async resendVerification(
    req: ResendVerificationRequest,
  ): Promise<ResendVerificationResponse> {
    const { data } = await apiClient.post<ResendVerificationResponse>(
      "/auth/resend-verification",
      req,
    );
    return data;
  }

  async getMe(): Promise<UserInfo> {
    const { data } = await apiClient.get<UserInfo>("/auth/me");
    return data;
  }

  // ── Token helpers ─────────────────────────────────────────────
  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }

  clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }

  // ── Build NextAuth-compatible session from stored token ────────
  buildSession(): {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: Role;
    };
    accessToken: string;
    expires: string;
  } | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      // Decode JWT payload (base64url)
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        user: {
          id: String(payload.sub ?? payload.userId ?? ""),
          name: payload.username || payload.email || "",
          email: payload.email || "",
          role: mapRole(payload.role || ""),
        },
        accessToken: token,
        expires: new Date(payload.exp * 1000).toISOString(),
      };
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;
