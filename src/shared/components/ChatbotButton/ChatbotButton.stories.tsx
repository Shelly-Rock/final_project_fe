import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
import { ChatbotButton } from "./ChatbotButton";

const meta = {
  title: "Shared/ChatbotButton",
  component: ChatbotButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <Box
        sx={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          bgcolor: "#f5f5f5",
        }}
      >
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof ChatbotButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
