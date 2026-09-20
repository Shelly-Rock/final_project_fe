"use client";

import { Box } from "@mui/material";
import { BarChart3 } from "lucide-react";
import { StatisticsDashboardPage } from "@/feature/statistics/components";
import { PageHeader } from "@/shared/components";
import { RoleGate } from "@/shared/components/PermissionGuard/PermissionGuard";

export default function StatisticsRoute() {
  return (
    <RoleGate
      roles={["admin", "secretary"]}
      fallback={
        <Box sx={{ p: 3, width: "100%", textAlign: "center" }}>
          Bạn không có quyền truy cập trang này
        </Box>
      }
    >
      <Box sx={{ p: 3, width: "100%" }}>
        <StatisticsDashboardPage />
      </Box>
    </RoleGate>
  );
}
