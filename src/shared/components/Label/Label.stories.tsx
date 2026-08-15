import type { Meta, StoryObj } from "@storybook/react";
import { Box, TextField } from "@mui/material";
import { Label } from "./Label";

const meta = {
  title: "Shared/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Label>;

export default meta;

export const BasicLabel: StoryObj = {
  render: () => (
    <Box>
      <Label htmlFor="name">Tên người dùng</Label>
      <TextField id="name" placeholder="Nhập tên" />
    </Box>
  ),
};

export const LabelWithRequired: StoryObj = {
  render: () => (
    <Box>
      <Label htmlFor="email" required>
        Email
      </Label>
      <TextField id="email" placeholder="Nhập email" />
    </Box>
  ),
};

export const LabelWithHelperText: StoryObj = {
  render: () => (
    <Box>
      <Label htmlFor="password" helperText="Mật khẩu phải có ít nhất 8 ký tự">
        Mật khẩu
      </Label>
      <TextField id="password" type="password" placeholder="Nhập mật khẩu" />
    </Box>
  ),
};

export const LabelWithError: StoryObj = {
  render: () => (
    <Box>
      <Label htmlFor="email" error helperText="Email không hợp lệ">
        Email
      </Label>
      <TextField
        id="email"
        defaultValue="email@example"
        error
        helperText="Email không hợp lệ"
      />
    </Box>
  ),
};

export const LabelSizes: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Label htmlFor="small" size="small">
          Small Label
        </Label>
        <TextField id="small" size="small" placeholder="Small input" />
      </Box>
      <Box>
        <Label htmlFor="medium" size="medium">
          Medium Label
        </Label>
        <TextField id="medium" placeholder="Medium input" />
      </Box>
    </Box>
  ),
};

export const LabelDisabled: StoryObj = {
  render: () => (
    <Box>
      <Label htmlFor="disabled" disabled>
        Tên người dùng
      </Label>
      <TextField id="disabled" disabled value="Không thể chỉnh sửa" />
    </Box>
  ),
};

export const LabelFormExample: StoryObj = {
  render: () => (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
    >
      <Box>
        <Label htmlFor="firstName" required>
          Họ và tên
        </Label>
        <TextField id="firstName" placeholder="Nhập họ và tên" fullWidth />
      </Box>
      <Box>
        <Label
          htmlFor="email"
          required
          helperText="Email sẽ được sử dụng để đăng nhập"
        >
          Email
        </Label>
        <TextField id="email" type="email" placeholder="Nhập email" fullWidth />
      </Box>
      <Box>
        <Label htmlFor="phone" helperText="Số điện thoại Việt Nam (10 số)">
          Số điện thoại
        </Label>
        <TextField id="phone" type="tel" placeholder="0912 345 678" fullWidth />
      </Box>
    </Box>
  ),
};
