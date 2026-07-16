import type { Meta, StoryObj } from "@storybook/react";
import { Box, Typography } from "@mui/material";
import { ScrollArea } from "./ScrollArea";

const meta = {
  title: "Shared/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;

const longContent = Array.from({ length: 30 }, (_, i) => (
  <Box
    key={i}
    sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}
  >
    <Typography variant="body2">Item {i + 1}</Typography>
  </Box>
));

export const BasicScrollArea: StoryObj = {
  render: () => (
    <ScrollArea height={300} padding={2}>
      {longContent}
    </ScrollArea>
  ),
};

export const ScrollAreaWithMaxHeight: StoryObj = {
  render: () => (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Danh sách cuộn
      </Typography>
      <ScrollArea maxHeight={200}>{longContent}</ScrollArea>
    </Box>
  ),
};

export const ScrollAreaWithWidth: StoryObj = {
  render: () => (
    <ScrollArea width={300} maxHeight={200} padding={2}>
      <Typography variant="body2">
        Nội dung có thể cuộn ngang và dọc. Nội dung có thể cuộn ngang và dọc.
        Nội dung có thể cuộn ngang và dọc. Nội dung có thể cuộn ngang và dọc.
      </Typography>
    </ScrollArea>
  ),
};

export const ScrollAreaThin: StoryObj = {
  render: () => (
    <ScrollArea height={200} scrollbarWidth="thin">
      {longContent}
    </ScrollArea>
  ),
};

export const ScrollAreaThick: StoryObj = {
  render: () => (
    <ScrollArea height={200} scrollbarWidth="thick">
      {longContent}
    </ScrollArea>
  ),
};

export const ScrollAreaHidden: StoryObj = {
  render: () => (
    <ScrollArea height={200} showScrollbar={false}>
      {longContent}
    </ScrollArea>
  ),
};

export const ScrollAreaNoScroll: StoryObj = {
  render: () => (
    <ScrollArea height={300} padding={2}>
      <Typography variant="body2">Nội dung ngắn không cần cuộn</Typography>
      <Typography variant="body2">Dòng 2</Typography>
      <Typography variant="body2">Dòng 3</Typography>
    </ScrollArea>
  ),
};
