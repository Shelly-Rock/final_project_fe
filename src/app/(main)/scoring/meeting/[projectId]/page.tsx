"use client";

import { useParams } from "next/navigation";
import { Box } from "@mui/material";
import { Users } from "lucide-react";
import { CommitteeMeetingDetailPage } from "@/feature/scoring/components";
import { PageHeader } from "@/shared/components";

export default function ScoringMeetingDetailPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = Number(params.projectId);

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Phiên họp hội đồng"
        subtitle="Chỉnh điểm sau thống nhất rồi nhấn OK để chốt"
        illustration={<Users size={56} strokeWidth={1.5} />}
        showBgImage={true}
        showBackButton
        onBack={() => history.back()}
      />
      <CommitteeMeetingDetailPage projectId={projectId} />
    </Box>
  );
}
