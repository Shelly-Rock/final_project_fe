"use client";

import { Box, Typography } from "@mui/material";
import { PageHeader, FilterBar } from "@/shared/components";
import { mockTopics } from "@/feature/thesis/constants";
import { ThesisTopicList } from "@/feature/thesis/components/ThesisTopicList";

export default function ThesisTopicPage() {
  return (
    <Box sx={{ p: 3 }}>
      <PageHeader title="Đề tài" subtitle="Danh sách đề tài đồ án tốt nghiệp" />

      <FilterBar totalCount={mockTopics.length}>
        <Typography variant="body2" color="text.secondary">
          Hiển thị <strong>{mockTopics.length}</strong> đề tài
        </Typography>
      </FilterBar>

      <ThesisTopicList topics={mockTopics} />
    </Box>
  );
}
