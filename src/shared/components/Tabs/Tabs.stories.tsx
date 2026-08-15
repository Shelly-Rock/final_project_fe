import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { Tabs, TabPanel } from "./Tabs";
import { Home, User, Settings } from "lucide-react";

const meta = {
  title: "Shared/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Tabs>;

export default meta;

export const BasicTabs: StoryObj = {
  render: () => (
    <Tabs
      items={[
        { label: "Tab 1", content: <Typography>Nội dung Tab 1</Typography> },
        { label: "Tab 2", content: <Typography>Nội dung Tab 2</Typography> },
        { label: "Tab 3", content: <Typography>Nội dung Tab 3</Typography> },
      ]}
    />
  ),
};

export const TabsWithIcons: StoryObj = {
  render: () => (
    <Tabs
      items={[
        {
          label: "Trang chủ",
          content: <Typography>Nội dung Trang chủ</Typography>,
          icon: <Home size={18} />,
        },
        {
          label: "Người dùng",
          content: <Typography>Nội dung Người dùng</Typography>,
          icon: <User size={18} />,
        },
        {
          label: "Cài đặt",
          content: <Typography>Nội dung Cài đặt</Typography>,
          icon: <Settings size={18} />,
        },
      ]}
    />
  ),
};

export const TabsDisabled: StoryObj = {
  render: () => (
    <Tabs
      items={[
        { label: "Tab 1", content: <Typography>Nội dung Tab 1</Typography> },
        { label: "Tab 2", content: <Typography>Nội dung Tab 2</Typography> },
        {
          label: "Tab 3",
          content: <Typography>Nội dung Tab 3</Typography>,
          disabled: true,
        },
      ]}
    />
  ),
};

export const ScrollableTabs: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 400 }}>
      <Tabs
        variant="scrollable"
        items={[
          {
            label: "Tab rất dài 1",
            content: <Typography>Nội dung Tab 1</Typography>,
          },
          {
            label: "Tab rất dài 2",
            content: <Typography>Nội dung Tab 2</Typography>,
          },
          {
            label: "Tab rất dài 3",
            content: <Typography>Nội dung Tab 3</Typography>,
          },
          {
            label: "Tab rất dài 4",
            content: <Typography>Nội dung Tab 4</Typography>,
          },
          {
            label: "Tab rất dài 5",
            content: <Typography>Nội dung Tab 5</Typography>,
          },
        ]}
      />
    </Box>
  ),
};

export const FullWidthTabs: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 600 }}>
      <Tabs
        variant="fullWidth"
        items={[
          { label: "Tab 1", content: <Typography>Nội dung Tab 1</Typography> },
          { label: "Tab 2", content: <Typography>Nội dung Tab 2</Typography> },
          { label: "Tab 3", content: <Typography>Nội dung Tab 3</Typography> },
        ]}
      />
    </Box>
  ),
};

export const CenteredTabs: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 600 }}>
      <Tabs
        centered
        items={[
          { label: "Tab 1", content: <Typography>Nội dung Tab 1</Typography> },
          { label: "Tab 2", content: <Typography>Nội dung Tab 2</Typography> },
          { label: "Tab 3", content: <Typography>Nội dung Tab 3</Typography> },
        ]}
      />
    </Box>
  ),
};

export const ControlledTabs: StoryObj = {
  render: () => {
    const [value, setValue] = useState(0);
    return (
      <Box>
        <Tabs
          controlledValue={value}
          onChange={setValue}
          items={[
            {
              label: "Thông tin",
              content: <Typography>Thông tin chi tiết</Typography>,
            },
            {
              label: "Địa chỉ",
              content: <Typography>Thông tin địa chỉ</Typography>,
            },
            {
              label: "Thanh toán",
              content: <Typography>Phương thức thanh toán</Typography>,
            },
          ]}
        />
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Giá trị hiện tại: Tab {value + 1}
          </Typography>
        </Box>
      </Box>
    );
  },
};

export const TabsWithForm: StoryObj = {
  render: () => (
    <Tabs
      items={[
        {
          label: "Thông tin cá nhân",
          content: (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 400,
              }}
            >
              <TextField label="Họ và tên" fullWidth />
              <TextField label="Email" type="email" fullWidth />
              <TextField label="Số điện thoại" fullWidth />
            </Box>
          ),
        },
        {
          label: "Địa chỉ",
          content: (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 400,
              }}
            >
              <TextField label="Địa chỉ" fullWidth />
              <TextField label="Thành phố" fullWidth />
              <TextField label="Quốc gia" fullWidth />
            </Box>
          ),
        },
      ]}
    />
  ),
};
