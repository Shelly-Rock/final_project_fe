import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box } from "@mui/material";
import {
  PhoneNumberInput,
  PhoneNumberInputWithPrefix,
} from "./PhoneNumberInput";

const meta = {
  title: "Shared/PhoneNumberInput",
  component: PhoneNumberInput,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof PhoneNumberInput>;

export default meta;

export const BasicPhoneNumberInput: StoryObj = {
  render: () => {
    const [phone, setPhone] = useState("");
    return (
      <Box sx={{ maxWidth: 400 }}>
        <PhoneNumberInput
          value={phone}
          onChange={setPhone}
          label="Số điện thoại"
        />
      </Box>
    );
  },
};

export const PhoneNumberInputRequired: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 400 }}>
      <PhoneNumberInput
        label="Số điện thoại"
        required
        placeholder="Nhập số điện thoại của bạn"
      />
    </Box>
  ),
};

export const PhoneNumberInputDisabled: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 400 }}>
      <PhoneNumberInput label="Số điện thoại" disabled value="091 234 5678" />
    </Box>
  ),
};

export const PhoneNumberInputError: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 400 }}>
      <PhoneNumberInput
        label="Số điện thoại"
        error
        helperText="Số điện thoại không hợp lệ"
        defaultValue="123"
      />
    </Box>
  ),
};

export const PhoneNumberInputWithPrefixDemo: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <PhoneNumberInputWithPrefix
        label="Số điện thoại"
        showProvinceSelect
        placeholder="Nhập số điện thoại"
      />
    </Box>
  ),
};

export const PhoneNumberInputInteractive: StoryObj = {
  render: () => {
    const [phone, setPhone] = useState("");

    return (
      <Box sx={{ maxWidth: 400 }}>
        <PhoneNumberInput
          value={phone}
          onChange={setPhone}
          label="Số điện thoại liên hệ"
          helperText="Chúng tôi sẽ sử dụng số này để xác minh tài khoản"
        />
        <Box sx={{ mt: 2 }}>
          {phone && (
            <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
              <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                Giá trị: <strong>{phone}</strong>
              </Box>
              <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                Số ký tự: <strong>{phone.replace(/\s/g, "").length}</strong>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    );
  },
};
