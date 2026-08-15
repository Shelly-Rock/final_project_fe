import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box } from "@mui/material";
import { Checkbox, CheckboxGroup } from "./Checkbox";

const meta = {
  title: "Shared/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

export const BasicCheckbox: StoryObj = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Box>
        <Checkbox
          checked={checked}
          onChange={(_, c) => setChecked(c)}
          label="Tôi đồng ý với điều khoản"
        />
      </Box>
    );
  },
};

export const CheckboxStates: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Checkbox label="Chưa chọn" />
      <Checkbox label="Đã chọn" checked />
      <Checkbox label="Không được phép" disabled />
      <Checkbox label="Đã chọn nhưng không được phép" checked disabled />
      <Checkbox label="Trạng thái không xác định" indeterminate />
    </Box>
  ),
};

export const CheckboxSizes: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Checkbox label="Size nhỏ" size="small" />
      <Checkbox label="Size trung bình" size="medium" />
    </Box>
  ),
};

export const CheckboxColors: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Checkbox label="Primary" color="primary" checked />
      <Checkbox label="Secondary" color="secondary" checked />
      <Checkbox label="Success" color="success" checked />
      <Checkbox label="Error" color="error" checked />
      <Checkbox label="Warning" color="warning" checked />
      <Checkbox label="Info" color="info" checked />
    </Box>
  ),
};

export const CheckboxWithError: StoryObj = {
  render: () => (
    <Box>
      <Checkbox
        label="Tôi đồng ý với điều khoản"
        error
        helperText="Bạn phải đồng ý với điều khoản để tiếp tục"
      />
    </Box>
  ),
};

export const CheckboxGroupStory: StoryObj = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["apple"]);
    return (
      <Box>
        <CheckboxGroup
          label="Chọn loại trái cây"
          options={[
            { label: "Táo", value: "apple" },
            { label: "Cam", value: "orange" },
            { label: "Chuối", value: "banana" },
          ]}
          value={selected}
          onChange={setSelected as (value: (string | number)[]) => void}
        />
        <Box sx={{ mt: 2, color: "text.secondary" }}>
          Đã chọn: {selected.join(", ") || "Không có"}
        </Box>
      </Box>
    );
  },
};

export const CheckboxGroupRow: StoryObj = {
  render: () => (
    <CheckboxGroup
      options={[
        { label: "HTML", value: "html" },
        { label: "CSS", value: "css" },
        { label: "JavaScript", value: "js" },
        { label: "TypeScript", value: "ts" },
      ]}
      value={["html", "css"]}
      row
    />
  ),
};
