import type { Meta, StoryObj } from "@storybook/react";
import { Box, Button, Typography, Avatar } from "@mui/material";
import { HoverCard, HoverCardUser } from "./HoverCard";

const meta = {
  title: "Shared/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof HoverCard>;

export default meta;

export const BasicHoverCard: StoryObj = {
  render: () => (
    <Box>
      <HoverCard
        trigger={<Button variant="outlined">Di chuột qua đây</Button>}
        content={{
          title: "Tiêu đề Hover Card",
          description:
            "Đây là mô tả của hover card. Di chuột ra ngoài để đóng.",
        }}
      />
    </Box>
  ),
};

export const HoverCardTop: StoryObj = {
  render: () => (
    <Box sx={{ mt: 10 }}>
      <HoverCard
        trigger={<Button variant="contained">Hover me (Top)</Button>}
        content={{
          title: "Thông tin chi tiết",
          description: "Hover card hiển thị phía trên trigger.",
        }}
        placement="top"
      />
    </Box>
  ),
};

export const HoverCardBottom: StoryObj = {
  render: () => (
    <Box>
      <HoverCard
        trigger={<Button variant="outlined">Hover me (Bottom)</Button>}
        content={{
          title: "Thông tin chi tiết",
          description: "Hover card hiển thị phía dưới trigger.",
        }}
        placement="bottom"
      />
    </Box>
  ),
};

export const HoverCardWithImage: StoryObj = {
  render: () => (
    <Box>
      <HoverCard
        trigger={<Button variant="outlined">Hover me</Button>}
        content={{
          image: "https://picsum.photos/300/120",
          title: "Hình ảnh đẹp",
          description: "Hover card với hình ảnh ở phía trên.",
        }}
      />
    </Box>
  ),
};

export const HoverCardUserExample: StoryObj = {
  render: () => (
    <Box>
      <HoverCardUser
        trigger={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
          >
            <Avatar src="https://i.pravatar.cc/150?img=1">JD</Avatar>
            <Typography>Di chuột qua để xem thông tin</Typography>
          </Box>
        }
        user={{
          name: "John Doe",
          email: "john.doe@example.com",
          role: "Quản trị viên",
        }}
      />
    </Box>
  ),
};

export const HoverCardGrid: StoryObj = {
  render: () => (
    <Box
      sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}
    >
      <HoverCard
        trigger={
          <Button variant="outlined" fullWidth>
            User 1
          </Button>
        }
        content={{
          title: "Người dùng 1",
          description: "user1@example.com",
        }}
      />
      <HoverCard
        trigger={
          <Button variant="outlined" fullWidth>
            User 2
          </Button>
        }
        content={{
          title: "Người dùng 2",
          description: "user2@example.com",
        }}
      />
      <HoverCard
        trigger={
          <Button variant="outlined" fullWidth>
            User 3
          </Button>
        }
        content={{
          title: "Người dùng 3",
          description: "user3@example.com",
        }}
      />
      <HoverCard
        trigger={
          <Button variant="outlined" fullWidth>
            User 4
          </Button>
        }
        content={{
          title: "Người dùng 4",
          description: "user4@example.com",
        }}
      />
    </Box>
  ),
};
