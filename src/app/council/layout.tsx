"use client";

import { AppProviders } from "@/core/providers/AppProviders";
import { PermissionProvider } from "@/core/providers/PermissionProvider";
import { Box, CircularProgress } from "@mui/material";

export default function CouncilLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <PermissionProvider>
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </PermissionProvider>
    </AppProviders>
  );
}
