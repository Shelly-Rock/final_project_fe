import type { Meta, StoryObj } from "@storybook/react";
import { Box, Button, Typography, TextField, IconButton } from "@mui/material";
import { Popover } from "./Popover";
import { Settings, User, Bell, Share2, Trash2, Edit } from "lucide-react";

const meta = {
  title: "Shared/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Popover>;

export default meta;

export const ClickPopover: StoryObj = {
  render: () => (
    <Popover
      trigger={<Button variant="contained">Nhấp vào đây</Button>}
      content={
        <Typography variant="body2">
          Đây là nội dung của Popover. Nhấp bên ngoài hoặc nhấp lại để đóng.
        </Typography>
      }
    />
  ),
};

export const HoverPopover: StoryObj = {
  render: () => (
    <Box sx={{ mt: 10 }}>
      <Popover
        trigger={<Button variant="outlined">Di chuột qua đây</Button>}
        content={
          <Typography variant="body2">
            Đây là Popover với trigger hover. Di chuột ra ngoài để đóng.
          </Typography>
        }
        triggerType="hover"
      />
    </Box>
  ),
};

export const PopoverPlacement: StoryObj = {
  render: () => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 4,
        p: 8,
      }}
    >
      <Box />
      <Popover
        trigger={
          <Button variant="outlined" size="small">
            Top
          </Button>
        }
        content={<Typography variant="body2">Popover ở trên</Typography>}
        placement="top"
      />
      <Box />
      <Popover
        trigger={
          <Button variant="outlined" size="small">
            Left
          </Button>
        }
        content={<Typography variant="body2">Popover bên trái</Typography>}
        placement="left"
      />
      <Box sx={{ bgcolor: "grey.200", p: 2, borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Popover placement demo
        </Typography>
      </Box>
      <Popover
        trigger={
          <Button variant="outlined" size="small">
            Right
          </Button>
        }
        content={<Typography variant="body2">Popover bên phải</Typography>}
        placement="right"
      />
      <Box />
      <Popover
        trigger={
          <Button variant="outlined" size="small">
            Bottom
          </Button>
        }
        content={<Typography variant="body2">Popover ở dưới</Typography>}
        placement="bottom"
      />
      <Box />
    </Box>
  ),
};

export const PopoverWithActions: StoryObj = {
  render: () => (
    <Popover
      trigger={
        <IconButton>
          <Settings size={20} />
        </IconButton>
      }
      content={
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            minWidth: 150,
          }}
        >
          <Button
            size="small"
            startIcon={<User size={16} />}
            sx={{ justifyContent: "flex-start" }}
          >
            Hồ sơ
          </Button>
          <Button
            size="small"
            startIcon={<Settings size={16} />}
            sx={{ justifyContent: "flex-start" }}
          >
            Cài đặt
          </Button>
          <Button
            size="small"
            startIcon={<Bell size={16} />}
            sx={{ justifyContent: "flex-start" }}
          >
            Thông báo
          </Button>
        </Box>
      }
    />
  ),
};

export const PopoverWithForm: StoryObj = {
  render: () => (
    <Popover
      trigger={<Button variant="outlined">Mở Popover với Form</Button>}
      content={
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 250,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            Đăng nhập
          </Typography>
          <TextField label="Email" size="small" fullWidth />
          <TextField label="Mật khẩu" type="password" size="small" fullWidth />
          <Button variant="contained" size="small">
            Đăng nhập
          </Button>
        </Box>
      }
    />
  ),
};

export const DisabledPopover: StoryObj = {
  render: () => (
    <Popover
      trigger={
        <Button variant="outlined" disabled>
          Disabled
        </Button>
      }
      content={<Typography variant="body2">Nội dung không hiển thị</Typography>}
      disabled
    />
  ),
};
