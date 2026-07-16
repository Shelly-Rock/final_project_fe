import type { Meta, StoryObj } from "@storybook/react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { Tooltip } from "./Tooltip";
import { Settings, Edit, Trash2, Copy, Info } from "lucide-react";

const meta = {
  title: "Shared/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

export const BasicTooltip: StoryObj = {
  render: () => (
    <Tooltip title="Đây là một tooltip">
      <Button variant="contained">Di chuột qua đây</Button>
    </Tooltip>
  ),
};

export const TooltipPlacements: StoryObj = {
  render: () => (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4, p: 8 }}>
      <Box />
      <Tooltip title="Tooltip ở trên" placement="top">
        <Button variant="outlined" size="small">Top</Button>
      </Tooltip>
      <Box />
      <Tooltip title="Tooltip bên trái" placement="left">
        <Button variant="outlined" size="small">Left</Button>
      </Tooltip>
      <Box sx={{ bgcolor: "grey.200", p: 4, borderRadius: 1, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">Tooltip placements</Typography>
      </Box>
      <Tooltip title="Tooltip bên phải" placement="right">
        <Button variant="outlined" size="small">Right</Button>
      </Tooltip>
      <Box />
      <Tooltip title="Tooltip ở dưới" placement="bottom">
        <Button variant="outlined" size="small">Bottom</Button>
      </Tooltip>
      <Box />
    </Box>
  ),
};

export const TooltipWithIcons: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Tooltip title="Chỉnh sửa">
        <IconButton><Edit size={20} /></IconButton>
      </Tooltip>
      <Tooltip title="Sao chép">
        <IconButton><Copy size={20} /></IconButton>
      </Tooltip>
      <Tooltip title="Xóa">
        <IconButton color="error"><Trash2 size={20} /></IconButton>
      </Tooltip>
      <Tooltip title="Cài đặt">
        <IconButton><Settings size={20} /></IconButton>
      </Tooltip>
    </Box>
  ),
};

export const TooltipWithRichContent: StoryObj = {
  render: () => (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle2">Thông tin chi tiết</Typography>
          <Typography variant="caption">Đây là nội dung tooltip với nhiều thông tin hơn.</Typography>
        </Box>
      }
    >
      <Button variant="outlined" startIcon={<Info size={16} />}>
        Xem thông tin
      </Button>
    </Tooltip>
  ),
};

export const TooltipDisabled: StoryObj = {
  render: () => (
    <Tooltip title="Tooltip không hiển thị" disabled>
      <Button variant="contained" disabled>Button Disabled</Button>
    </Tooltip>
  ),
};

export const TooltipWithCustomDelay: StoryObj = {
  render: () => (
    <Tooltip title="Tooltip với delay" enterDelay={500} leaveDelay={200}>
      <Button variant="outlined">Di chuột và đợi 500ms</Button>
    </Tooltip>
  ),
};

export const TooltipWithoutArrow: StoryObj = {
  render: () => (
    <Tooltip title="Tooltip không có mũi tên" arrow={false}>
      <Button variant="contained">Không có mũi tên</Button>
    </Tooltip>
  ),
};

export const TooltipGrid: StoryObj = {
  render: () => (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
      {[
        { placement: "top-start", label: "Top Start" },
        { placement: "top", label: "Top" },
        { placement: "top-end", label: "Top End" },
        { placement: "left-start", label: "Left Start" },
        { placement: "right-start", label: "Right Start" },
        { placement: "left", label: "Left" },
        { placement: "right", label: "Right" },
        { placement: "left-end", label: "Left End" },
        { placement: "right-end", label: "Right End" },
        { placement: "bottom-start", label: "Bottom Start" },
        { placement: "bottom", label: "Bottom" },
        { placement: "bottom-end", label: "Bottom End" },
      ].map((item) => (
        <Tooltip key={item.placement} title={`Placement: ${item.placement}`} placement={item.placement as any}>
          <Button variant="outlined" size="small">{item.label}</Button>
        </Tooltip>
      ))}
    </Box>
  ),
};
