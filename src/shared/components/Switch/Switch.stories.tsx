import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box } from "@mui/material";
import { Switch, SwitchGroup } from "./Switch";

const meta = {
  title: "Shared/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Switch>;

export default meta;

export const BasicSwitch: StoryObj = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Box>
        <Switch
          checked={checked}
          onChange={(_, c) => setChecked(c)}
          label="Bật/tắt"
        />
      </Box>
    );
  },
};

export const SwitchStates: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Switch label="Chưa bật" />
      <Switch label="Đã bật" checked />
      <Switch label="Không được phép" disabled />
      <Switch label="Đã bật nhưng không được phép" checked disabled />
    </Box>
  ),
};

export const SwitchSizes: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Switch label="Size nhỏ" size="small" />
      <Switch label="Size trung bình" size="medium" />
    </Box>
  ),
};

export const SwitchColors: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Switch label="Primary" color="primary" checked />
      <Switch label="Secondary" color="secondary" checked />
      <Switch label="Success" color="success" checked />
      <Switch label="Error" color="error" checked />
      <Switch label="Warning" color="warning" checked />
      <Switch label="Info" color="info" checked />
    </Box>
  ),
};

export const SwitchGroupStory: StoryObj = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["email"]);
    return (
      <Box>
        <SwitchGroup
          label="Thông báo"
          options={[
            { label: "Email thông báo", value: "email" },
            { label: "SMS thông báo", value: "sms" },
            { label: "Push thông báo", value: "push" },
          ]}
          value={selected}
          onChange={setSelected as (value: (string | number)[]) => void}
        />
        <Box sx={{ mt: 2, color: "text.secondary" }}>
          Đã bật: {selected.join(", ") || "Không có"}
        </Box>
      </Box>
    );
  },
};

export const SettingsExample: StoryObj = {
  render: () => {
    const [settings, setSettings] = useState({
      darkMode: false,
      notifications: true,
      autoSave: true,
      twoFactor: false,
    });

    const handleChange =
      (key: keyof typeof settings) =>
      (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setSettings((prev) => ({ ...prev, [key]: checked }));
      };

    return (
      <Box sx={{ maxWidth: 400 }}>
        <Switch
          label="Chế độ tối"
          checked={settings.darkMode}
          onChange={handleChange("darkMode")}
        />
        <Switch
          label="Nhận thông báo"
          checked={settings.notifications}
          onChange={handleChange("notifications")}
        />
        <Switch
          label="Tự động lưu"
          checked={settings.autoSave}
          onChange={handleChange("autoSave")}
        />
        <Switch
          label="Xác thực hai yếu tố"
          checked={settings.twoFactor}
          onChange={handleChange("twoFactor")}
        />
      </Box>
    );
  },
};
