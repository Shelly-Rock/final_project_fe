import type { Meta, StoryObj } from "@storybook/react";
import { Box, Button, Typography, Avatar } from "@mui/material";
import { Sidebar } from "./Sidebar";
import { Home, Users, FileText, Settings, Bell, LogOut } from "lucide-react";

const meta = {
  title: "Shared/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Sidebar>;

export default meta;

const menuItems = [
  { id: "home", label: "Trang chủ", icon: <Home size={20} />, href: "/" },
  {
    id: "users",
    label: "Người dùng",
    icon: <Users size={20} />,
    children: [
      {
        id: "users-list",
        label: "Danh sách người dùng",
        icon: <Users size={18} />,
      },
      { id: "users-add", label: "Thêm người dùng", icon: <Users size={18} /> },
    ],
  },
  {
    id: "documents",
    label: "Tài liệu",
    icon: <FileText size={20} />,
    badge: 5,
  },
  {
    id: "settings",
    label: "Cài đặt",
    icon: <Settings size={20} />,
    children: [
      { id: "settings-profile", label: "Hồ sơ" },
      { id: "settings-account", label: "Tài khoản" },
      { id: "settings-security", label: "Bảo mật" },
    ],
  },
];

export const BasicSidebar: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", minHeight: 400 }}>
      <Sidebar
        items={menuItems}
        header={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              Dashboard
            </Typography>
          </Box>
        }
        footer={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32 }}>JD</Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={500}>
                John Doe
              </Typography>
              <Typography variant="caption" color="text.secondary">
                john@example.com
              </Typography>
            </Box>
          </Box>
        }
      />
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography>Main content area</Typography>
      </Box>
    </Box>
  ),
};

export const SidebarWithActiveItem: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", minHeight: 400 }}>
      <Sidebar
        items={menuItems}
        defaultActiveId="home"
        header={
          <Typography variant="h6" fontWeight={600}>
            App
          </Typography>
        }
      />
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography>Sidebar with active item highlighted</Typography>
      </Box>
    </Box>
  ),
};

export const SidebarWithBadges: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", minHeight: 400 }}>
      <Sidebar
        items={menuItems}
        header={
          <Typography variant="h6" fontWeight={600}>
            Notifications
          </Typography>
        }
      />
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography>Sidebar items with badges</Typography>
      </Box>
    </Box>
  ),
};

export const SidebarWithNestedItems: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", minHeight: 400 }}>
      <Sidebar
        items={menuItems}
        header={
          <Typography variant="h6" fontWeight={600}>
            Menu
          </Typography>
        }
      />
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography>Nested menu items with expand/collapse</Typography>
      </Box>
    </Box>
  ),
};
