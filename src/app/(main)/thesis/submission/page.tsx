"use client";

import { Box } from "@mui/material";
import { PageHeader } from "@/shared/components";
import { mockSubmissions } from "@/feature/thesis/constants";
import { ThesisSubmissionList } from "@/feature/thesis/components/ThesisSubmissionList";

export default function ThesisSubmissionPage() {
  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Nộp bài"
        subtitle="Nộp các file bài tập và báo cáo đồ án"
      />

      <ThesisSubmissionList submissions={mockSubmissions} />
    </Box>
  );
}
