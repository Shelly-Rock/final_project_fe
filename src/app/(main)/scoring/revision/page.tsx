"use client";

import { Box } from "@mui/material";
import { FileText } from "lucide-react";
import { StudentRevisionPage } from "@/feature/scoring/components";
import { PageHeader } from "@/shared/components";

export default function StudentRevisionRoute() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Chỉnh sửa hồ sơ"
        subtitle="Nộp lại đồ án theo nhận xét hội đồng trong thời hạn quy định"
        illustration={<FileText size={56} strokeWidth={1.5} />}
        showBgImage={true}
      />
      <StudentRevisionPage />
    </Box>
  );
}
