"use client";

import { Box } from "@mui/material";
import { ScoringManagementPage } from "@/feature/scoring/components";
import { PageHeader } from "@/shared/components";
import { FileText } from "lucide-react";

export default function ScoringAdminPage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Quản lý chấm điểm"
        subtitle="Theo dõi và quản lý phiếu chấm của giảng viên"
        illustration={<FileText size={56} strokeWidth={1.5} />}
        showBgImage={true}
      />
      <ScoringManagementPage />
    </Box>
  );
}
