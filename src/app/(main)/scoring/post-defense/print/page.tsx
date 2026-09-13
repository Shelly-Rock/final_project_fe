"use client";

import { Box } from "@mui/material";
import { FileText } from "lucide-react";
import { OfficialScoreSheetPage } from "@/feature/scoring/components";
import { PageHeader } from "@/shared/components";

export default function OfficialScoreSheetRoute() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Bảng điểm chính thức"
        subtitle="Biểu mẫu lưu trữ học vụ"
        illustration={<FileText size={56} strokeWidth={1.5} />}
        showBgImage={true}
        showBackButton
        onBack={() => history.back()}
      />
      <OfficialScoreSheetPage />
    </Box>
  );
}
