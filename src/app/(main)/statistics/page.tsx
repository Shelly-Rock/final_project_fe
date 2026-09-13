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
        <PageHeader
          title="Thống kê và báo cáo"
          subtitle="Tỷ lệ đậu/rớt, năng suất giảng viên và xuất Excel phục vụ học vụ"
          illustration={<BarChart3 size={56} strokeWidth={1.5} />}
          showBgImage={true}
        />
        <StatisticsDashboardPage />
      </Box>
    </RoleGate>
  );
}
