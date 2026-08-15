import type { Meta, StoryObj } from "@storybook/react";
import { Box, Typography } from "@mui/material";
import { Resizable } from "./Resizable";

const meta = {
  title: "Shared/Resizable",
  component: Resizable,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Resizable>;

export default meta;

export const BasicResizable: StoryObj = {
  render: () => (
    <Resizable defaultWidth={300} defaultHeight={200}>
      <Box sx={{ p: 2, height: "100%", bgcolor: "grey.50" }}>
        <Typography variant="body2">
          Kéo các cạnh để thay đổi kích thước
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Nhấp và kéo từ góc phải dưới
        </Typography>
      </Box>
    </Resizable>
  ),
};

export const ResizableWithConstraints: StoryObj = {
  render: () => (
    <Resizable
      defaultWidth={400}
      defaultHeight={300}
      minWidth={200}
      maxWidth={600}
      minHeight={150}
      maxHeight={400}
    >
      <Box sx={{ p: 2, height: "100%", bgcolor: "grey.50" }}>
        <Typography variant="body2" fontWeight={600}>
          Resizable với giới hạn
        </Typography>
        <Typography variant="caption" color="text.secondary">
          min: 200x150, max: 600x400
        </Typography>
      </Box>
    </Resizable>
  ),
};

export const ResizableAllDirections: StoryObj = {
  render: () => (
    <Resizable
      defaultWidth={300}
      defaultHeight={200}
      enableResize={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        topLeft: true,
        bottomRight: true,
        bottomLeft: true,
      }}
    >
      <Box
        sx={{
          p: 2,
          height: "100%",
          bgcolor: "primary.light",
          color: "primary.contrastText",
        }}
      >
        <Typography variant="body2">Resize từ tất cả các hướng</Typography>
      </Box>
    </Resizable>
  ),
};

export const ResizableGrid: StoryObj = {
  render: () => (
    <Box
      sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}
    >
      <Resizable defaultWidth={200} defaultHeight={150}>
        <Box sx={{ p: 2, height: "100%", bgcolor: "grey.50" }}>
          <Typography variant="caption">Panel 1</Typography>
        </Box>
      </Resizable>
      <Resizable defaultWidth={200} defaultHeight={150}>
        <Box sx={{ p: 2, height: "100%", bgcolor: "grey.50" }}>
          <Typography variant="caption">Panel 2</Typography>
        </Box>
      </Resizable>
      <Resizable defaultWidth={200} defaultHeight={150}>
        <Box sx={{ p: 2, height: "100%", bgcolor: "grey.50" }}>
          <Typography variant="caption">Panel 3</Typography>
        </Box>
      </Resizable>
      <Resizable defaultWidth={200} defaultHeight={150}>
        <Box sx={{ p: 2, height: "100%", bgcolor: "grey.50" }}>
          <Typography variant="caption">Panel 4</Typography>
        </Box>
      </Resizable>
    </Box>
  ),
};
