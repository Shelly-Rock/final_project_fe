"use client";

import { Box } from "@mui/material";
import { SubmissionManagement } from "@/feature/submission/components";
import { PageHeader } from "@/shared/components";
import { FileCheck } from "lucide-react";

export default function SubmissionPage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Quản lý nộp bài cuối kỳ"
        subtitle="Duyệt và quản lý các bài nộp cuối kỳ của sinh viên"
        illustration={<FileCheck size={56} strokeWidth={1.5} />}
        showBgImage={true}
      />
      <SubmissionManagement />
    </Box>
  );
}
