"use client";

import type { ReactNode } from "react";
import type { Role } from "@/core/permissions/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PermissionProvider } from "@/core/providers/PermissionProvider";
import { ThemeProvider } from "@/shared/theme";

const queryClient = new QueryClient();

interface AppProvidersProps {
  children: ReactNode;
  initialRole?: Role | null;
}
export function AppProviders({
  children,
  initialRole = null,
}: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PermissionProvider initialRole={initialRole}>
          {children}
        </PermissionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
