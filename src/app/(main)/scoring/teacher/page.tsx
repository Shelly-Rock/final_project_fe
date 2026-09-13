"use client";

import { Box } from "@mui/material";
import TeacherScoring from "@/feature/scoring/components/TeacherScoring";
import { PageHeader } from "@/shared/components";
import { ClipboardCheck } from "lucide-react";

export default function ScoreSheetPage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Phiếu chấm điểm"
        subtitle="Chấm điểm đề tài khóa luận của sinh viên"
        illustration={<ClipboardCheck size={56} strokeWidth={1.5} />}
        showBgImage={true}
      />
      <TeacherScoring />
    </Box>
  );
}
