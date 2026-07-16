import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box } from "@mui/material";
import { RadioGroup } from "./RadioGroup";

const meta = {
  title: "Shared/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

export const BasicRadioGroup: StoryObj = {
  render: () => {
    const [value, setValue] = useState("option1");
    return (
      <Box>
        <RadioGroup
          label="Chọn một tùy chọn"
          options={[
            { label: "Tùy chọn 1", value: "option1" },
            { label: "Tùy chọn 2", value: "option2" },
            { label: "Tùy chọn 3", value: "option3" },
          ]}
          value={value}
          onChange={setValue}
        />
      </Box>
    );
  },
};

export const RadioGroupRow: StoryObj = {
  render: () => {
    const [value, setValue] = useState("small");
    return (
      <Box>
        <RadioGroup
          label="Kích thước"
          options={[
            { label: "Nhỏ", value: "small" },
            { label: "Trung bình", value: "medium" },
            { label: "Lớn", value: "large" },
          ]}
          value={value}
          onChange={setValue}
          row
        />
      </Box>
    );
  },
};

export const RadioGroupWithError: StoryObj = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Box>
        <RadioGroup
          label="Giới tính *"
          options={[
            { label: "Nam", value: "male" },
            { label: "Nữ", value: "female" },
            { label: "Khác", value: "other" },
          ]}
          value={value}
          onChange={setValue}
          error={!value}
          helperText={!value ? "Vui lòng chọn giới tính" : ""}
        />
      </Box>
    );
  },
};

export const RadioGroupDisabled: StoryObj = {
  render: () => (
    <Box>
      <RadioGroup
        label="Tùy chọn bị vô hiệu hóa"
        options={[
          { label: "Tùy chọn 1", value: "1" },
          { label: "Tùy chọn 2", value: "2", disabled: true },
          { label: "Tùy chọn 3", value: "3", disabled: true },
        ]}
        value="1"
        onChange={() => {}}
      />
    </Box>
  ),
};

export const RadioGroupColors: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <RadioGroup
        label="Primary"
        options={[{ label: "Option", value: "1" }]}
        value="1"
        onChange={() => {}}
      />
      <RadioGroup
        label="Secondary"
        options={[{ label: "Option", value: "1" }]}
        value="1"
        onChange={() => {}}
      />
    </Box>
  ),
};

export const RadioGroupInteractive: StoryObj = {
  render: () => {
    const [selected, setSelected] = useState<string>("");

    return (
      <Box>
        <RadioGroup
          label="Phương thức thanh toán"
          options={[
            { label: "Thẻ tín dụng", value: "credit" },
            { label: "Chuyển khoản ngân hàng", value: "bank" },
            { label: "Ví điện tử", value: "ewallet" },
            { label: "Khi nhận hàng (COD)", value: "cod", disabled: true },
          ]}
          value={selected}
          onChange={setSelected}
        />
        {selected && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
            Bạn đã chọn: <strong>{selected}</strong>
          </Box>
        )}
      </Box>
    );
  },
};
