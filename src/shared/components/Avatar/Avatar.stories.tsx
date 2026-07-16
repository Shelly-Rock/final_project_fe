import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
import { Avatar } from "./Avatar";
import { User } from "lucide-react";

const meta = {
  title: "Shared/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    src: {
      control: "text",
      description: "URL of the avatar image",
    },
    alt: {
      control: "text",
      description: "Alt text for the avatar",
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

export const AvatarWithImage: StoryObj = {
  args: {
    src: "https://i.pravatar.cc/150?img=1",
    alt: "John Doe",
  },
};

export const AvatarWithInitials: StoryObj = {
  args: {
    alt: "Jane Smith",
  },
};

export const AvatarWithFallback: StoryObj = {
  args: {
    alt: "No Image",
    fallback: <User size={24} />,
  },
};

export const AvatarSizes: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Avatar alt="Small User" sx={{ width: 32, height: 32 }} />
      <Avatar alt="Medium User" sx={{ width: 48, height: 48 }} />
      <Avatar alt="Large User" sx={{ width: 64, height: 64 }} />
    </Box>
  ),
};

export const AvatarGroup: StoryObj = {
  render: () => (
    <Box sx={{ display: "flex", gap: -1 }}>
      <Avatar
        src="https://i.pravatar.cc/150?img=1"
        alt="User 1"
        sx={{ width: 48, height: 48, border: "2px solid #fff" }}
      />
      <Avatar
        src="https://i.pravatar.cc/150?img=2"
        alt="User 2"
        sx={{ width: 48, height: 48, border: "2px solid #fff", ml: -1 }}
      />
      <Avatar
        src="https://i.pravatar.cc/150?img=3"
        alt="User 3"
        sx={{ width: 48, height: 48, border: "2px solid #fff", ml: -1 }}
      />
      <Avatar
        alt="User 4"
        sx={{
          width: 48,
          height: 48,
          border: "2px solid #fff",
          ml: -1,
          bgcolor: "secondary.main",
        }}
      >
        +5
      </Avatar>
    </Box>
  ),
};
