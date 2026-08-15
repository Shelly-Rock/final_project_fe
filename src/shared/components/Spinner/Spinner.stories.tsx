import type { Meta, StoryObj } from "@storybook/react";
import { Box, Typography } from "@mui/material";
import { Spinner, LoadingSpinner } from "./Spinner";

const meta = {
  title: "Shared/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Spinner>;

export default meta;

export const BasicSpinner: StoryObj = {
  render: () => <Spinner />,
};

export const SpinnerSizes: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
      <Spinner size={20} />
      <Spinner size={30} />
      <Spinner size={40} />
      <Spinner size={50} />
    </Box>
  ),
};

export const SpinnerColors: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
      <Spinner color="primary" />
      <Spinner color="secondary" />
      <Spinner color="error" />
      <Spinner color="warning" />
      <Spinner color="success" />
      <Spinner color="info" />
    </Box>
  ),
};

export const SpinnerWithLabel: StoryObj = {
  render: () => <Spinner size={50} showLabel label="Đang tải..." />,
};

export const SpinnerWithCustomThickness: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
      <Spinner size={40} thickness={2} />
      <Spinner size={40} thickness={3} />
      <Spinner size={40} thickness={5} />
    </Box>
  ),
};

export const SpinnerWithCustomSpeed: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
      <Spinner size={40} speed={0.5} />
      <Spinner size={40} speed={1} />
      <Spinner size={40} speed={2} />
    </Box>
  ),
};

export const LoadingSpinnerBasic: StoryObj = {
  render: () => <LoadingSpinner text="Đang tải dữ liệu..." />,
};

export const LoadingSpinnerOverlay: StoryObj = {
  render: () => (
    <Box
      sx={{
        position: "relative",
        p: 4,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      <Typography>Nội dung bên trong</Typography>
      <Typography variant="body2" color="text.secondary">
        Spinner sẽ hiển thị phía trên
      </Typography>
      <LoadingSpinner overlay text="Đang xử lý..." />
    </Box>
  ),
};
