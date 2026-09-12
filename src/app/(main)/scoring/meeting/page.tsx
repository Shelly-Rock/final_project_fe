"use client";

import { Box } from "@mui/material";
import { Users } from "lucide-react";
import { CommitteeMeetingPage } from "@/feature/scoring/components";
import { PageHeader } from "@/shared/components";

export default function ScoringMeetingPage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Họp và chốt điểm hội đồng"
        subtitle="Đối chiếu phiếu chấm độc lập, chỉnh điểm sau thống nhất và khóa kết quả"
        illustration={<Users size={56} strokeWidth={1.5} />}
        showBgImage={true}
      />
      <CommitteeMeetingPage />
    </Box>
  );
}
