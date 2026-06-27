"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { PermissionProvider } from "@/core/providers/PermissionProvider";
import { ThemeProvider } from "@mui/material/styles";
import { muiTheme } from "@/core/providers/MuiTheme";
import { ROLE } from "@/core/permissions/types";
import { useAuthStore, DEMO_USERS } from "@/store";

interface AppProvidersProps {
  children: ReactNode;
  /**
   * Fallback role shown while auth store hydrates from localStorage.
   * Defaults to ADMIN so the app is never blank on first load.
   */
  fallbackRole?: (typeof ROLE)[keyof typeof ROLE] | null;
}

export function AppProviders({ children, fallbackRole = ROLE.ADMIN }: AppProvidersProps) {
  // Auto-login ADMIN on first visit (when no user is stored)
  useEffect(() => {
    const { user, _hasHydrated } = useAuthStore.getState();
    if (_hasHydrated && !user) {
      useAuthStore.getState().login(DEMO_USERS[ROLE.ADMIN]);
    }
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      {/* PermissionProvider reads role from useAuthStore (Zustand + localStorage) */}
      <PermissionProvider fallbackRole={fallbackRole}>
        {children}
      </PermissionProvider>
    </ThemeProvider>
  );
}
