import type { Meta, StoryObj } from "@storybook/react";
import { Box, Typography } from "@mui/material";
import { Separator } from "./Separator";

const meta = {
  title: "Shared/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Separator>;

export default meta;

export const BasicSeparator: StoryObj = {
  render: () => (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2">Nội dung trên</Typography>
      <Separator sx={{ my: 2 }} />
      <Typography variant="body2">Nội dung dưới</Typography>
    </Box>
  ),
};

export const SeparatorWithLabel: StoryObj = {
  render: () => (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2">Phần 1</Typography>
      <Separator label="Hoặc" sx={{ my: 2 }} />
      <Typography variant="body2">Phần 2</Typography>
    </Box>
  ),
};

export const SeparatorVertical: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", height: 100, alignItems: "center", gap: 2 }}>
      <Typography variant="body2">Trái</Typography>
      <Separator orientation="vertical" sx={{ height: "100%" }} />
      <Typography variant="body2">Phải</Typography>
    </Box>
  ),
};

export const SeparatorVariants: StoryObj = {
  render: () => (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}
    >
      <Box>
        <Typography variant="caption" color="text.secondary">
          Horizontal (mặc định)
        </Typography>
        <Separator />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          Với nhãn
        </Typography>
        <Separator label="Tiếp tục" />
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          Light variant
        </Typography>
        <Separator light />
      </Box>
    </Box>
  ),
};

export const SeparatorInCard: StoryObj = {
  render: () => (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        width: 300,
      }}
    >
      <Typography variant="subtitle2">Tiêu đề Card</Typography>
      <Separator sx={{ my: 2 }} />
      <Typography variant="body2" color="text.secondary">
        Nội dung của card với separator ở giữa.
      </Typography>
    </Box>
  ),
};
