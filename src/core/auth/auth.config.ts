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
      roles: Role[];
      mustChangePassword: boolean;
    };
    accessToken: string;
    refreshToken?: string;
  }

  interface User {
    id: string;
    role: Role;
    roles: Role[];
    username: string;
    mustChangePassword: boolean;
    emailVerified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    roles: Role[];
    username: string;
    accessToken: string;
    refreshToken: string;
    mustChangePassword: boolean;
    emailVerified: boolean;
  }
}

// ---------- Auth options (used by API route + getServerSession) ----------
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { serverAuthService } from "@/core/auth/auth.server";

const nextAuthUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : undefined);

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
          const result = await serverAuthService.login({
            username: credentials.username,
            password: credentials.password,
          });

          // Backend throws if email not verified or must change password
          // The FE must handle these cases
          const roles: Role[] = (result.user.roles ?? []).map((r) =>
            mapRole(r.name),
          );
          const primaryRole = mapRole(result.user.role.name);
          return {
            id: String(result.user.id),
            name: result.user.username,
            email: result.user.email,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            role: primaryRole,
            roles: roles.length > 0 ? roles : [primaryRole],
            username: result.user.username,
            mustChangePassword: result.user.mustChangePassword,
            emailVerified: !!result.user.emailVerifiedAt,
          };
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Đăng nhập thất bại";

          if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console
            console.error("[NextAuth] Credentials login failed", {
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.roles = (user as { roles?: Role[] }).roles ?? [user.role];
        token.username = user.username;
        token.mustChangePassword = user.mustChangePassword;
        token.emailVerified = !!user.emailVerified;
        token.accessToken =
          (user as { accessToken?: string }).accessToken ?? "";
        token.refreshToken =
          (user as { refreshToken?: string }).refreshToken ?? "";
        // Store token in localStorage for API client
        if (typeof window !== "undefined") {
          console.log("[NextAuth JWT] Storing accessToken in localStorage", {
            accessToken: token.accessToken,
            user: user,
          });
          localStorage.setItem("accessToken", token.accessToken as string);
          localStorage.setItem("refreshToken", token.refreshToken as string);
        }
      }
      // Handle session updates (e.g., role switching)
      if (trigger === "update" && session) {
        if (session.user?.role) token.role = session.user.role;
        if (session.user?.roles) token.roles = session.user.roles;
        if (session.accessToken) token.accessToken = session.accessToken;
        if (session.refreshToken) token.refreshToken = session.refreshToken;
        if (session.user?.name) token.username = session.user.name;
      }
      // Persist tokens when session is updated (server-side only)
      if (trigger === "update" && token.accessToken) {
        // Tokens stored in JWT, no need to persist to storage on server
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.roles = (token.roles as Role[]) ?? [token.role as Role];
        session.user.name = token.username as string;
      }
      session.user.mustChangePassword = !!token.mustChangePassword;
      session.accessToken = (token.accessToken as string) || "";
      // Ensure token is in localStorage
      if (typeof window !== "undefined" && session.accessToken) {
        console.log("[NextAuth Session] Ensuring accessToken in localStorage", {
          accessToken: session.accessToken,
        });
        localStorage.setItem("accessToken", session.accessToken);
        localStorage.setItem(
          "refreshToken",
          (token.refreshToken as string) || "",
        );
      }
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
