"use client";

import { Box } from "@mui/material";
import { CommitteeManagement } from "@/feature/committee/components";
import { PageHeader } from "@/shared/components";
import { Users } from "lucide-react";

export default function CommitteePage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Quản lý Hội đồng bảo vệ"
        subtitle="Thiết lập và quản lý các hội đồng bảo vệ khóa luận"
        illustration={<Users size={56} strokeWidth={1.5} />}
        showBgImage={true}
      />
      <CommitteeManagement />
    </Box>
  );
}
