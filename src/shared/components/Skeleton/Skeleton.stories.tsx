import type { Meta, StoryObj } from "@storybook/react";
import { Box, Typography } from "@mui/material";
import {
  SkeletonComponent,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonTable,
} from "./Skeleton";

const meta = {
  title: "Shared/Skeleton",
  component: SkeletonComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof SkeletonComponent>;

export default meta;

export const BasicSkeleton: StoryObj = {
  render: () => (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 300 }}
    >
      <SkeletonComponent variant="text" width="100%" />
      <SkeletonComponent variant="text" width="80%" />
      <SkeletonComponent variant="text" width="60%" />
    </Box>
  ),
};

export const SkeletonRectangular: StoryObj = {
  render: () => (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 300 }}
    >
      <SkeletonComponent variant="rectangular" width="100%" height={100} />
      <SkeletonComponent variant="text" width="70%" />
      <SkeletonComponent variant="text" width="50%" />
    </Box>
  ),
};

export const SkeletonCircular: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 2 }}>
      <SkeletonComponent variant="circular" width={40} height={40} />
      <SkeletonComponent variant="circular" width={60} height={60} />
      <SkeletonComponent variant="circular" width={80} height={80} />
    </Box>
  ),
};

export const SkeletonRounded: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 2 }}>
      <SkeletonComponent variant="rounded" width={100} height={40} />
      <SkeletonComponent variant="rounded" width={150} height={40} />
    </Box>
  ),
};

export const SkeletonTextStory: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 400 }}>
      <SkeletonText lines={4} spacing={0.75} />
    </Box>
  ),
};

export const SkeletonAvatarStory: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 2 }}>
      <SkeletonAvatar size={32} />
      <SkeletonAvatar size={40} />
      <SkeletonAvatar size={48} />
      <SkeletonAvatar size={64} />
    </Box>
  ),
};

export const SkeletonCardStory: StoryObj = {
  render: () => (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
    >
      <SkeletonCard />
      <SkeletonCard avatar={false} />
    </Box>
  ),
};

export const SkeletonTableStory: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 600 }}>
      <SkeletonTable rows={5} columns={4} />
    </Box>
  ),
};

export const SkeletonWithAnimation: StoryObj = {
  render: () => (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 300 }}
    >
      <Typography variant="caption" color="text.secondary">
        Wave Animation
      </Typography>
      <SkeletonComponent variant="text" width="100%" animation="wave" />
      <SkeletonComponent variant="text" width="80%" animation="wave" />
      <SkeletonComponent variant="text" width="60%" animation="wave" />
    </Box>
  ),
};
