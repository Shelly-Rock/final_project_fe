"use client";

import type { ReactNode } from "react";
import type { Role } from "@/core/permissions/types";
import { PermissionProvider } from "@/core/providers/PermissionProvider";
import { ThemeProvider } from "@/shared/theme";

interface AppProvidersProps {
  children: ReactNode;
  initialRole?: Role | null;
}
export function AppProviders({
  children,
  initialRole = null,
}: AppProvidersProps) {
  return (
    <ThemeProvider>
      <PermissionProvider initialRole={initialRole}>
        {children}
      </PermissionProvider>
    </ThemeProvider>
  );
}
