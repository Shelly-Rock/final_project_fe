// ============================================================
// NEXTAUTH CONFIGURATION — NextAuth v4 backed by NestJS JWT API
// ============================================================
import type { Role } from "@/core/permissions/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Role;
      mustChangePassword: boolean;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    role: Role;
    username: string;
    mustChangePassword: boolean;
    emailVerified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    username: string;
    accessToken: string;
    mustChangePassword: boolean;
    emailVerified: boolean;
  }
}

// ---------- Auth options (used by API route + getServerSession) ----------
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { authService } from "@/core/auth/auth.service";

const nextAuthUrl =
  process.env.NEXTAUTH_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username / MSSV / Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
        }

        try {
          const result = await authService.login({
            username: credentials.username,
            password: credentials.password,
          });

          // Backend throws if email not verified or must change password
          // The FE must handle these cases
          return {
            id: String(result.user.id),
            name: result.user.username,
            email: result.user.email,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            role: mapRole(result.user.role.name),
            username: result.user.username,
            mustChangePassword: result.user.mustChangePassword,
            emailVerified: !!result.user.emailVerifiedAt,
          };
        } catch (err: unknown) {
          const status = axios.isAxiosError(err)
            ? err.response?.status
            : undefined;
          const backendMessage = axios.isAxiosError(err)
            ? err.response?.data?.message
            : undefined;
          const message = Array.isArray(backendMessage)
            ? backendMessage.join(", ")
            : typeof backendMessage === "string"
              ? backendMessage
              : err instanceof Error
                ? err.message
                : "Đăng nhập thất bại";

          if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console
            console.error("[NextAuth] Credentials login failed", {
              status,
              message,
              username: credentials.username,
            });
          }

          throw new Error(message);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.mustChangePassword = user.mustChangePassword;
        token.emailVerified = !!user.emailVerified;
        token.accessToken =
          (user as { accessToken?: string }).accessToken ?? "";
      }
      // Persist tokens when session is updated
      if (trigger === "update" && token.accessToken) {
        authService.setTokens(token.accessToken, "");
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.name = token.username as string;
      }
      session.user.mustChangePassword = !!token.mustChangePassword;
      session.accessToken = (token.accessToken as string) || "";
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
  ...(nextAuthUrl
    ? { pages: { ...{ signIn: "/login", error: "/login" } } }
    : {}),
  debug: process.env.NODE_ENV === "development",
};

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
