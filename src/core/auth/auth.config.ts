// ============================================================
// NEXTAUTH CONFIGURATION — NextAuth v4
// ============================================================
import type { Role } from "@/core/permissions/types";
// import { defineAbilityFor } from "@/core/permissions/ability";

// ---------- Module augmentation for NextAuth v4 ----------
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Role;
    };
  }

  interface User {
    id: string;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

// ---------- Mock session (re-exported for use in client layouts) ----------
export const MOCK_SESSION = {
  user: {
    id: "usr_001",
    name: "Nguyễn Văn Admin",
    email: "admin@qnq.edu.vn",
    role: "admin" as Role,
  },
  expires: "2099-12-31T23:59:59.999Z",
};

// ---------- Mock user store ----------
interface MockUser {
  id: string;
  password: string;
  role: Role;
  name: string;
}

const MOCK_USERS: Record<string, MockUser> = {
  "admin@qnq.edu.vn": {
    id: "usr_001",
    password: "admin123",
    role: "admin",
    name: "Nguyễn Văn Admin",
  },
  "secretary@qnq.edu.vn": {
    id: "usr_002",
    password: "secretary123",
    role: "secretary",
    name: "Trần Thị Thư Ký",
  },
  "teacher@qnq.edu.vn": {
    id: "usr_003",
    password: "teacher123",
    role: "teacher",
    name: "PGS.TS. Lê Văn Giảng",
  },
  "student@qnq.edu.vn": {
    id: "usr_004",
    password: "student123",
    role: "student",
    name: "Nguyễn Hoàng Sinh Viên",
  },
};

// ---------- Auth options (used by API route + getServerSession) ----------
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // TODO: Replace with real DB call
        // const user = await db.user.findUnique({ where: { email } });
        // if (!user || !await bcrypt.compare(credentials.password, user.passwordHash)) return null;

        const user = MOCK_USERS[credentials.email];
        if (!user || user.password !== credentials.password) return null;

        return {
          id: user.id,
          name: user.name,
          email: credentials.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
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
    maxAge: 8 * 60 * 60, // 8 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
