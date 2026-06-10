// ============================================================
// NEXTAUTH API ROUTE — NextAuth v4 handler
// ============================================================
import NextAuth from "next-auth";
import { authOptions } from "@/core/auth/auth.config";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
