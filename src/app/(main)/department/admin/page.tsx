"use client";

import { AdminDepartmentDashboard } from "@/feature/admin/components/AdminDepartmentDashboard";
import { RoleGate } from "@/shared/components/PermissionGuard/PermissionGuard";
import { Box, Typography } from "@mui/material";

export default function AdminDepartmentPage() {
  return (
    <RoleGate
      roles={["admin"]}
      fallback={
        <Box sx={{ p: 3, width: "100%", textAlign: "center" }}>
          <Typography variant="h6" color="error">
            Bạn không có quyền truy cập trang này
          </Typography>
        </Box>
      }
    >
      <AdminDepartmentDashboard />
    </RoleGate>
  );
}
