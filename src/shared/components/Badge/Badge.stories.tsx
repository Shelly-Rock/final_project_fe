import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
import { Badge } from "./Badge";

const meta = {
  title: "Shared/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "outlined", "soft"],
    },
    color: {
      control: "select",
      options: [
        "default",
        "primary",
        "secondary",
        "success",
        "warning",
        "error",
        "info",
      ],
    },
    label: {
      control: "text",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

export const FilledBadges: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      <Badge label="Default" color="default" variant="filled" />
      <Badge label="Primary" color="primary" variant="filled" />
      <Badge label="Secondary" color="secondary" variant="filled" />
      <Badge label="Success" color="success" variant="filled" />
      <Badge label="Warning" color="warning" variant="filled" />
      <Badge label="Error" color="error" variant="filled" />
      <Badge label="Info" color="info" variant="filled" />
    </Box>
  ),
};

export const OutlinedBadges: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      <Badge label="Default" color="default" variant="outlined" />
      <Badge label="Primary" color="primary" variant="outlined" />
      <Badge label="Secondary" color="secondary" variant="outlined" />
      <Badge label="Success" color="success" variant="outlined" />
      <Badge label="Warning" color="warning" variant="outlined" />
      <Badge label="Error" color="error" variant="outlined" />
      <Badge label="Info" color="info" variant="outlined" />
    </Box>
  ),
};

export const SoftBadges: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      <Badge label="Default" color="default" variant="soft" />
      <Badge label="Primary" color="primary" variant="soft" />
      <Badge label="Secondary" color="secondary" variant="soft" />
      <Badge label="Success" color="success" variant="soft" />
      <Badge label="Warning" color="warning" variant="soft" />
      <Badge label="Error" color="error" variant="soft" />
      <Badge label="Info" color="info" variant="soft" />
    </Box>
  ),
};

export const BadgeSizes: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <Badge label="Small" size="small" />
      <Badge label="Medium" size="medium" />
    </Box>
  ),
};
