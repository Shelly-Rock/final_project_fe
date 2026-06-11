"use client";

import { Box } from "@mui/material";
import { PageHeader } from "@/shared/components";
import { mockReviews } from "@/feature/thesis/constants";
import { ThesisReviewList } from "@/feature/thesis/components/ThesisReviewList";

export default function ThesisReviewPage() {
  return (
    <Box sx={{ p: 3 }}>
      <PageHeader title="Phản biện" subtitle="Đánh giá và nhận xét đồ án" />

      <ThesisReviewList reviews={mockReviews} />
    </Box>
  );
}
