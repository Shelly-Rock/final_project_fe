import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box } from "@mui/material";
import { Textarea } from "./Textarea";

const meta = {
  title: "Shared/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Textarea>;

export default meta;

export const BasicTextarea: StoryObj = {
  render: () => <Textarea label="Mô tả" placeholder="Nhập mô tả của bạn..." />,
};

export const TextareaWithMinRows: StoryObj = {
  render: () => (
    <Textarea
      label="Nội dung"
      placeholder="Textarea với tối thiểu 5 dòng"
      minRows={5}
    />
  ),
};

export const TextareaWithMaxRows: StoryObj = {
  render: () => (
    <Textarea
      label="Nội dung"
      placeholder="Textarea với tối đa 8 dòng"
      minRows={3}
      maxRows={8}
    />
  ),
};

export const TextareaWithCharCount: StoryObj = {
  render: () => (
    <Textarea
      label="Bài viết"
      placeholder="Viết bài viết của bạn..."
      maxLength={500}
      showCharCount
    />
  ),
};

export const TextareaDisabled: StoryObj = {
  render: () => (
    <Textarea label="Nội dung" value="Nội dung không thể chỉnh sửa" disabled />
  ),
};

export const TextareaWithError: StoryObj = {
  render: () => (
    <Textarea
      label="Mô tả"
      value="Nội dung quá ngắn"
      error
      helperText="Mô tả phải có ít nhất 20 ký tự"
    />
  ),
};

export const TextareaVariants: StoryObj = {
  render: () => (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 500 }}
    >
      <Textarea label="Outlined (mặc định)" variant="outlined" />
      <Textarea label="Filled" variant="filled" />
      <Textarea label="Standard" variant="standard" />
    </Box>
  ),
};

export const TextareaInteractive: StoryObj = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <Box sx={{ maxWidth: 500 }}>
        <Textarea
          label="Bio"
          placeholder="Viết giới thiệu về bản thân..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={200}
          showCharCount
          helperText="Giới thiệu ngắn gọn về bản thân bạn"
        />
        {value && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
            <Box sx={{ fontSize: "0.875rem", fontWeight: 500, mb: 0.5 }}>
              Preview:
            </Box>
            <Box sx={{ fontSize: "0.875rem", whiteSpace: "pre-wrap" }}>
              {value}
            </Box>
          </Box>
        )}
      </Box>
    );
  },
};
