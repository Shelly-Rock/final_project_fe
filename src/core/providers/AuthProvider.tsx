"use client";

import { SessionProvider, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface AuthProviderProps {
  children: ReactNode;
  session?: Session | null;
}

function TokenSyncer() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.accessToken) {
        localStorage.setItem("accessToken", session.accessToken);
      }
      if (session?.refreshToken) {
        localStorage.setItem("refreshToken", session.refreshToken);
      }
      return;
    }

    if (status === "unauthenticated") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }, [session?.accessToken, session?.refreshToken, status]);

  return null;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider session={session}>
      <TokenSyncer />
      {children}
    </SessionProvider>
  );
}
