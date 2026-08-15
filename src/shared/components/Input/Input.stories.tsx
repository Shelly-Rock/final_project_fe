import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box } from "@mui/material";
import { Input } from "./Input";
import { Search, Eye, EyeOff, Mail, Lock, User } from "lucide-react";

const meta = {
  title: "Shared/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Input>;

export default meta;

export const BasicInput: StoryObj = {
  render: () => <Input label="Tên người dùng" placeholder="Nhập tên của bạn" />,
};

export const InputVariants: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Input label="Outlined" variant="outlined" />
      <Input label="Filled" variant="filled" />
      <Input label="Standard" variant="standard" />
    </Box>
  ),
};

export const InputWithIcons: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Input
        label="Email"
        leftIcon={<Mail size={18} />}
        placeholder="Nhập email"
      />
      <Input
        label="Password"
        type="password"
        leftIcon={<Lock size={18} />}
        placeholder="Nhập mật khẩu"
      />
      <Input
        label="Search"
        leftIcon={<Search size={18} />}
        placeholder="Tìm kiếm..."
      />
    </Box>
  ),
};

export const InputWithPasswordToggle: StoryObj = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        leftIcon={<Lock size={18} />}
        rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        onRightIconClick={() => setShowPassword(!showPassword)}
        placeholder="Nhập mật khẩu"
      />
    );
  },
};

export const InputSizes: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Input label="Small" size="small" />
      <Input label="Medium" size="medium" />
    </Box>
  ),
};

export const InputStates: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Input label="Disabled" disabled value="Không thể chỉnh sửa" />
      <Input
        label="Read Only"
        value="Chỉ đọc"
        InputProps={{ readOnly: true }}
      />
      <Input
        label="Error"
        error
        helperText="Có lỗi xảy ra"
        defaultValue="Lỗi"
      />
    </Box>
  ),
};

export const InputWithCharCount: StoryObj = {
  render: () => (
    <Input
      label="Mô tả"
      placeholder="Nhập mô tả của bạn (tối đa 100 ký tự)"
      maxLength={100}
      showCharCount
      multiline
      rows={3}
    />
  ),
};

export const InputWithHelperText: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Input
        label="Email"
        type="email"
        placeholder="Nhập email"
        helperText="Chúng tôi sẽ gửi thông báo đến email này"
      />
      <Input
        label="Website"
        placeholder="https://"
        helperText="Phải bắt đầu bằng https://"
      />
    </Box>
  ),
};
