import type { Meta, StoryObj } from "@storybook/react";
import { Box, Typography } from "@mui/material";
import { Progress, ProgressGroup } from "./Progress";

const meta = {
  title: "Shared/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Progress>;

export default meta;

export const BasicLinearProgress: StoryObj = {
  render: () => <Progress value={60} />,
};

export const ProgressWithLabel: StoryObj = {
  render: () => <Progress value={75} label="Tiến độ tải lên" showValue />,
};

export const ProgressSizes: StoryObj = {
  render: () => (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 400 }}
    >
      <Progress value={40} size="small" />
      <Progress value={60} size="medium" />
      <Progress value={80} size="large" />
    </Box>
  ),
};

export const ProgressColors: StoryObj = {
  render: () => (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
    >
      <Progress value={30} color="primary" />
      <Progress value={50} color="secondary" />
      <Progress value={70} color="success" />
      <Progress value={40} color="warning" />
      <Progress value={60} color="error" />
      <Progress value={80} color="info" />
    </Box>
  ),
};

export const CircularProgress: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 4 }}>
      <Progress value={25} variant="circular" />
      <Progress value={50} variant="circular" showValue />
      <Progress value={75} variant="circular" size="large" showValue />
    </Box>
  ),
};

export const CircularProgressSizes: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
      <Progress value={60} variant="circular" size="small" />
      <Progress value={60} variant="circular" size="medium" />
      <Progress value={60} variant="circular" size="large" />
    </Box>
  ),
};

export const ProgressGroupStory: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Thống kê dự án
      </Typography>
      <ProgressGroup
        items={[
          { label: "Thiết kế", value: 90, color: "primary" },
          { label: "Phát triển", value: 65, color: "success" },
          { label: "Kiểm thử", value: 30, color: "warning" },
          { label: "Triển khai", value: 10, color: "error" },
        ]}
      />
    </Box>
  ),
};

export const UploadProgressStory: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 400 }}>
      <Progress
        value={68}
        label="Tải lên tài liệu.pdf"
        showValue
        color="primary"
      />
    </Box>
  ),
};
