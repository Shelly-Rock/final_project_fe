import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box } from "@mui/material";
import { Select, MultiSelect } from "./Select";

const meta = {
  title: "Shared/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Select>;

export default meta;

const countries = [
  { label: "Việt Nam", value: "vn" },
  { label: "Hoa Kỳ", value: "us" },
  { label: "Nhật Bản", value: "jp" },
  { label: "Hàn Quốc", value: "kr" },
  { label: "Trung Quốc", value: "cn" },
  { label: "Đức", value: "de" },
  { label: "Pháp", value: "fr" },
];

export const BasicSelect: StoryObj = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Box sx={{ maxWidth: 300 }}>
        <Select
          label="Quốc gia"
          options={countries}
          value={value}
          onChange={(v) => setValue(v)}
          placeholder="Chọn quốc gia"
        />
      </Box>
    );
  },
};

export const SelectWithValue: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 300 }}>
      <Select
        label="Quốc gia"
        options={countries}
        value="vn"
        onChange={() => {}}
      />
    </Box>
  ),
};

export const SelectDisabled: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 300 }}>
      <Select label="Quốc gia" options={countries} value="vn" disabled />
    </Box>
  ),
};

export const SelectWithError: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 300 }}>
      <Select
        label="Quốc gia"
        options={countries}
        value=""
        error
        helperText="Vui lòng chọn quốc gia"
      />
    </Box>
  ),
};

export const SelectSizes: StoryObj = {
  render: () => (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 300 }}
    >
      <Select
        label="Small"
        options={countries}
        size="small"
        placeholder="Chọn..."
      />
      <Select
        label="Medium"
        options={countries}
        size="medium"
        placeholder="Chọn..."
      />
    </Box>
  ),
};

export const MultiSelectStory: StoryObj = {
  render: () => {
    const [value, setValue] = useState<string[]>(["vn", "us"]);
    return (
      <Box sx={{ maxWidth: 400 }}>
        <MultiSelect
          label="Quốc gia"
          options={countries}
          value={value}
          onChange={setValue as (value: (string | number)[]) => void}
          placeholder="Chọn quốc gia"
        />
      </Box>
    );
  },
};

export const MultiSelectWithoutValue: StoryObj = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <Box sx={{ maxWidth: 400 }}>
        <MultiSelect
          label="Ngôn ngữ lập trình"
          options={[
            { label: "JavaScript", value: "js" },
            { label: "TypeScript", value: "ts" },
            { label: "Python", value: "py" },
            { label: "Java", value: "java" },
            { label: "C#", value: "cs" },
            { label: "Go", value: "go" },
          ]}
          value={value}
          onChange={setValue as (value: (string | number)[]) => void}
          placeholder="Chọn ngôn ngữ..."
        />
      </Box>
    );
  },
};

export const SelectInteractive: StoryObj = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <Box sx={{ maxWidth: 300 }}>
        <Select
          label="Chọn trạng thái"
          options={[
            { label: "Đang chờ xử lý", value: "pending" },
            { label: "Đang xử lý", value: "processing" },
            { label: "Hoàn thành", value: "completed" },
            { label: "Đã hủy", value: "cancelled" },
          ]}
          value={value}
          onChange={(v) => setValue(v)}
          placeholder="Chọn trạng thái"
        />
        {value && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
            Trạng thái đã chọn: <strong>{value}</strong>
          </Box>
        )}
      </Box>
    );
  },
};
