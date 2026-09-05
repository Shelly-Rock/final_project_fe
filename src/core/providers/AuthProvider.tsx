"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface AuthProviderProps {
  children: ReactNode;
  session?: Session | null;
}

function TokenSyncer({ session }: { session?: Session | null }) {
  useEffect(() => {
    if (session?.accessToken) {
      localStorage.setItem("accessToken", session.accessToken);
    }
  }, [session]);
  return null;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider session={session}>
      <TokenSyncer session={session} />
      {children}
    </SessionProvider>
  );
}
