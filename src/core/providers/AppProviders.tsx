"use client";

import type { ReactNode } from "react";
import type { Role } from "@/core/permissions/types";
import { PermissionProvider } from "@/core/providers/PermissionProvider";
import { ThemeProvider } from "@mui/material/styles";
import { muiTheme } from "@/core/providers/MuiTheme";

interface AppProvidersProps {
  children: ReactNode;
  initialRole?: Role | null;
}
export function AppProviders({
  children,
  initialRole = null,
}: AppProvidersProps) {
  return (
    <ThemeProvider theme={muiTheme}>
      <PermissionProvider initialRole={initialRole}>
        {children}
      </PermissionProvider>
    </ThemeProvider>
  );
}
