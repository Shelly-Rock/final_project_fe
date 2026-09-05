"use client";

import { Box } from "@mui/material";
import { DefenseScheduleManagement } from "@/feature/defense-schedule/components";
import { PageHeader } from "@/shared/components";
import { Calendar } from "lucide-react";

export default function DefenseSchedulePage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Lịch bảo vệ"
        subtitle="Thiết lập và quản lý lịch bảo vệ khóa luận"
        illustration={<Calendar size={56} strokeWidth={1.5} />}
        showBgImage={true}
      />
      <DefenseScheduleManagement />
    </Box>
  );
}
