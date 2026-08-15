import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
import { Button } from "./Button";
import { Plus, Download, Trash2, Edit, Save } from "lucide-react";

const meta = {
  title: "Shared/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["contained", "outlined", "text", "dashed"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    color: {
      control: "select",
      options: [
        "inherit",
        "primary",
        "secondary",
        "success",
        "error",
        "warning",
        "info",
      ],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

export const ContainedButtons: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      <Button variant="contained">Mặc định</Button>
      <Button variant="contained" color="primary">
        Primary
      </Button>
      <Button variant="contained" color="secondary">
        Secondary
      </Button>
      <Button variant="contained" color="success">
        Success
      </Button>
      <Button variant="contained" color="error">
        Error
      </Button>
      <Button variant="contained" color="warning">
        Warning
      </Button>
    </Box>
  ),
};

export const OutlinedButtons: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      <Button variant="outlined">Mặc định</Button>
      <Button variant="outlined" color="primary">
        Primary
      </Button>
      <Button variant="outlined" color="secondary">
        Secondary
      </Button>
      <Button variant="outlined" color="success">
        Success
      </Button>
      <Button variant="outlined" color="error">
        Error
      </Button>
    </Box>
  ),
};

export const TextButtons: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      <Button variant="text">Mặc định</Button>
      <Button variant="text" color="primary">
        Primary
      </Button>
      <Button variant="text" color="secondary">
        Secondary
      </Button>
      <Button variant="text" color="error">
        Error
      </Button>
    </Box>
  ),
};

export const DashedButtons: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      <Button variant="dashed">Dashed Primary</Button>
      <Button variant="dashed" color="secondary">
        Dashed Secondary
      </Button>
      <Button variant="dashed" color="error">
        Dashed Error
      </Button>
    </Box>
  ),
};

export const ButtonSizes: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </Box>
  ),
};

export const ButtonsWithIcons: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      <Button variant="contained" leftIcon={<Plus size={16} />}>
        Thêm mới
      </Button>
      <Button variant="outlined" leftIcon={<Download size={16} />}>
        Tải xuống
      </Button>
      <Button variant="text" leftIcon={<Edit size={16} />}>
        Chỉnh sửa
      </Button>
      <Button variant="dashed" rightIcon={<Save size={16} />}>
        Lưu
      </Button>
    </Box>
  ),
};

export const LoadingButtons: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      <Button loading>Đang xử lý...</Button>
      <Button loading variant="outlined">
        Loading
      </Button>
      <Button loading variant="text">
        Loading
      </Button>
    </Box>
  ),
};

export const DisabledButtons: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      <Button disabled>Disabled Contained</Button>
      <Button disabled variant="outlined">
        Disabled Outlined
      </Button>
      <Button disabled variant="text">
        Disabled Text
      </Button>
    </Box>
  ),
};

export const FullWidthButtons: StoryObj = {
  render: () => (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 300 }}
    >
      <Button fullWidth variant="contained" leftIcon={<Save size={16} />}>
        Lưu thay đổi
      </Button>
      <Button
        fullWidth
        variant="outlined"
        color="error"
        leftIcon={<Trash2 size={16} />}
      >
        Xóa
      </Button>
    </Box>
  ),
};
