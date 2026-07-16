import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import { DropdownMenu } from "./DropdownMenu";
import {
  Edit,
  Copy,
  Trash2,
  Download,
  Settings,
  User,
  MoreVertical,
  FolderOpen,
  FileText,
  Share2,
} from "lucide-react";

const meta = {
  title: "Shared/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;

const menuItems = [
  {
    id: "edit",
    label: "Chỉnh sửa",
    icon: <Edit size={16} />,
    onClick: () => console.log("Edit clicked"),
  },
  {
    id: "duplicate",
    label: "Sao chép",
    icon: <Copy size={16} />,
    onClick: () => console.log("Duplicate clicked"),
  },
  {
    id: "share",
    label: "Chia sẻ",
    icon: <Share2 size={16} />,
    onClick: () => console.log("Share clicked"),
  },
  {
    id: "download",
    label: "Tải xuống",
    icon: <Download size={16} />,
    onClick: () => console.log("Download clicked"),
  },
  { id: "divider", label: "---", onClick: () => {} },
  {
    id: "delete",
    label: "Xóa",
    icon: <Trash2 size={16} />,
    danger: true,
    onClick: () => console.log("Delete clicked"),
  },
];

export const BasicDropdownMenu: StoryObj = {
  render: () => (
    <Box>
      <DropdownMenu
        trigger={<Button variant="outlined">Mở Menu</Button>}
        items={menuItems}
      />
    </Box>
  ),
};

export const IconButtonDropdown: StoryObj = {
  render: () => (
    <Box>
      <DropdownMenu
        trigger={
          <IconButton>
            <MoreVertical size={20} />
          </IconButton>
        }
        items={menuItems}
      />
    </Box>
  ),
};

export const DropdownMenuWithSubmenu: StoryObj = {
  render: () => (
    <Box>
      <DropdownMenu
        trigger={<Button variant="outlined">Menu có submenu</Button>}
        items={[
          {
            id: "file",
            label: "Tệp",
            icon: <FileText size={16} />,
            children: [
              {
                id: "new",
                label: "Tạo mới",
                icon: <FileText size={16} />,
                onClick: () => console.log("New file"),
              },
              {
                id: "open",
                label: "Mở",
                icon: <FolderOpen size={16} />,
                onClick: () => console.log("Open file"),
              },
              {
                id: "save",
                label: "Lưu",
                icon: <Download size={16} />,
                onClick: () => console.log("Save file"),
              },
            ],
          },
          {
            id: "edit-menu",
            label: "Chỉnh sửa",
            icon: <Edit size={16} />,
            children: [
              {
                id: "copy",
                label: "Sao chép",
                icon: <Copy size={16} />,
                onClick: () => console.log("Copy"),
              },
              {
                id: "paste",
                label: "Dán",
                icon: <Copy size={16} />,
                onClick: () => console.log("Paste"),
              },
            ],
          },
          {
            id: "delete",
            label: "Xóa",
            icon: <Trash2 size={16} />,
            danger: true,
            onClick: () => console.log("Delete"),
          },
        ]}
      />
    </Box>
  ),
};

export const ControlledDropdownMenu: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box>
        <Button variant="outlined" onClick={() => setOpen(!open)}>
          {open ? "Đóng Menu" : "Mở Menu (Controlled)"}
        </Button>
        <DropdownMenu
          trigger={<span />}
          items={menuItems}
          controlledOpen={open}
          onOpenChange={setOpen}
        />
      </Box>
    );
  },
};

export const RightAlignedDropdown: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <DropdownMenu
        trigger={<Button variant="outlined">Menu phải</Button>}
        items={menuItems}
        align="end"
      />
    </Box>
  ),
};
