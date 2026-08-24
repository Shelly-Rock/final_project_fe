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
import { authService } from "@/core/auth/auth.service";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username / MSSV", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

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
            role: mapRole(result.user.role.name),
            username: result.user.username,
            mustChangePassword: result.user.mustChangePassword,
            emailVerified: !!result.user.emailVerifiedAt,
          };
        } catch (err: unknown) {
          // Re-throw structured errors so the login page can show them
          const message =
            err instanceof Error ? err.message : "Đăng nhập thất bại";
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
        token.emailVerified = user.emailVerified;
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
  debug: process.env.NODE_ENV === "development",
};

// ── Map backend role name → frontend Role type ──────────────────
function mapRole(backendRole: string): Role {
  switch (backendRole.toUpperCase()) {
    case "ADMIN":
      return "admin";
    case "SECRETARY":
      return "secretary";
    case "TEACHER":
      return "teacher";
    case "STUDENT":
      return "student";
    default:
      return "student";
  }
}
