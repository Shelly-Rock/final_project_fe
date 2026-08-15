import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

const meta = {
  title: "Shared/PasswordStrengthMeter",
  component: PasswordStrengthMeter,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof PasswordStrengthMeter>;

export default meta;

export const BasicPasswordStrengthMeter: StoryObj = {
  render: () => {
    const [password, setPassword] = useState("");

    return (
      <Box sx={{ maxWidth: 400 }}>
        <TextField
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <PasswordStrengthMeter password={password} />
      </Box>
    );
  },
};

export const PasswordStrengthWeak: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 400 }}>
      <TextField
        label="Mật khẩu"
        type="password"
        defaultValue="abc"
        fullWidth
      />
      <PasswordStrengthMeter password="abc" />
    </Box>
  ),
};

export const PasswordStrengthMedium: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 400 }}>
      <TextField
        label="Mật khẩu"
        type="password"
        defaultValue="Password123"
        fullWidth
      />
      <PasswordStrengthMeter password="Password123" />
    </Box>
  ),
};

export const PasswordStrengthStrong: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 400 }}>
      <TextField
        label="Mật khẩu"
        type="password"
        defaultValue="MyP@ssw0rd!2024"
        fullWidth
      />
      <PasswordStrengthMeter password="MyP@ssw0rd!2024" />
    </Box>
  ),
};

export const PasswordStrengthWithoutFeedback: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 400 }}>
      <TextField
        label="Mật khẩu"
        type="password"
        defaultValue="StrongPass123!"
        fullWidth
      />
      <PasswordStrengthMeter password="StrongPass123!" showFeedback={false} />
    </Box>
  ),
};

export const PasswordStrengthInteractive: StoryObj = {
  render: () => {
    const [password, setPassword] = useState("");

    const getSuggestions = () => {
      const suggestions: string[] = [];
      if (password.length < 8) suggestions.push("Thêm ít nhất 8 ký tự");
      if (!/[A-Z]/.test(password)) suggestions.push("Thêm chữ hoa");
      if (!/[a-z]/.test(password)) suggestions.push("Thêm chữ thường");
      if (!/\d/.test(password)) suggestions.push("Thêm số");
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
        suggestions.push("Thêm ký tự đặc biệt");
      return suggestions;
    };

    return (
      <Box sx={{ maxWidth: 400 }}>
        <TextField
          label="Mật khẩu mới"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          helperText="Tạo mật khẩu mạnh để bảo vệ tài khoản"
        />
        <PasswordStrengthMeter password={password} />

        {password && getSuggestions().length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Gợi ý:
            </Typography>
            {getSuggestions().map((suggestion, index) => (
              <Typography
                key={index}
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", fontSize: "0.75rem" }}
              >
                • {suggestion}
              </Typography>
            ))}
          </Box>
        )}
      </Box>
    );
  },
};
