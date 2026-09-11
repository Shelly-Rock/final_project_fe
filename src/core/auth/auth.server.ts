// ============================================================
// SERVER-SIDE AUTH SERVICE — For NextAuth route handler
// ============================================================
import type { LoginRequest, LoginResponse } from "./auth.service";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

class ServerAuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message =
          errorData.message || `Login failed with status ${response.status}`;
        throw new Error(message);
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }
}

export const serverAuthService = new ServerAuthService();
