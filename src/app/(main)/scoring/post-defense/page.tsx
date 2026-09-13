"use client";

import { Box } from "@mui/material";
import { Trophy } from "lucide-react";
import { PostDefenseRankingPage } from "@/feature/scoring/components";
import { PageHeader } from "@/shared/components";

export default function PostDefensePage() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <PageHeader
        title="Hậu kiểm và xếp hạng"
        subtitle="Chỉnh sửa hồ sơ, xếp hạng sinh viên xuất sắc và in biểu mẫu lưu trữ"
        illustration={<Trophy size={56} strokeWidth={1.5} />}
        showBgImage={true}
      />
      <PostDefenseRankingPage />
    </Box>
  );
}
