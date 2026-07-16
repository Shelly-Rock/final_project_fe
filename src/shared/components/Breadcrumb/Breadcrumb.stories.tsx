import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb";
import { Users, Settings, FileText, Folder } from "lucide-react";

const meta = {
  title: "Shared/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const BasicBreadcrumb: Story = {
  args: {
    items: [
      { label: "Trang chủ", href: "/" },
      { label: "Quản lý người dùng", href: "/users" },
      { label: "Chi tiết" },
    ],
  },
};

export const BreadcrumbWithIcons: Story = {
  args: {
    items: [
      { label: "Trang chủ", href: "/", icon: <Users size={16} /> },
      { label: "Tài liệu", href: "/docs", icon: <FileText size={16} /> },
      { label: "Cài đặt", href: "/settings", icon: <Settings size={16} /> },
      { label: "Hồ sơ" },
    ],
  },
};

export const BreadcrumbWithoutHomeIcon: Story = {
  args: {
    items: [
      { label: "Trang chủ", href: "/" },
      { label: "Danh mục", href: "/category" },
      { label: "Sản phẩm" },
    ],
    showHomeIcon: false,
  },
};

export const BreadcrumbWithLongPath: Story = {
  args: {
    items: [
      { label: "Trang chủ", href: "/" },
      { label: "Quản trị", href: "/admin" },
      { label: "Người dùng", href: "/admin/users" },
      { label: "Danh sách", href: "/admin/users/list" },
      { label: "Chi tiết", href: "/admin/users/list/detail" },
      { label: "Lịch sử", href: "/admin/users/list/detail/history" },
      { label: "Hoạt động" },
    ],
    maxItems: 5,
  },
};

export const BreadcrumbInteractive: Story = {
  args: {
    items: [
      { label: "Trang chủ" },
      { label: "Quản lý" },
      { label: "Người dùng" },
      { label: "Chi tiết" },
    ],
    onClick: (item: BreadcrumbItem, index: number) =>
      console.log(`Clicked: ${item.label} at index ${index}`),
  },
};

export const BreadcrumbSizes: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box>
        <Box sx={{ mb: 1, fontSize: 12, color: "text.secondary" }}>Small</Box>
        <Breadcrumb
          size="small"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Danh mục", href: "/category" },
            { label: "Sản phẩm" },
          ]}
        />
      </Box>
      <Box>
        <Box sx={{ mb: 1, fontSize: 12, color: "text.secondary" }}>
          Medium (default)
        </Box>
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Danh mục", href: "/category" },
            { label: "Sản phẩm" },
          ]}
        />
      </Box>
    </Box>
  ),
};

export const BreadcrumbWithFolderIcons: Story = {
  args: {
    items: [
      { label: "My Files", href: "/files", icon: <Folder size={16} /> },
      {
        label: "Documents",
        href: "/files/documents",
        icon: <Folder size={16} />,
      },
      { label: "Reports", href: "/files/documents/reports" },
      { label: "2024" },
    ],
    showHomeIcon: false,
  },
};
