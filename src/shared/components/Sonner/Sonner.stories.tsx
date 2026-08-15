import type { Meta, StoryObj } from "@storybook/react";
import { Box, Button, Typography } from "@mui/material";
import { toast } from "./Sonner";
import { Sonner } from "./Sonner";

const meta = {
  title: "Shared/Sonner",
  component: Sonner,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Sonner>;

export default meta;

export const SonnerProvider: StoryObj = {
  render: () => <Sonner />,
  decorators: [
    (Story) => (
      <Box>
        <Story />
      </Box>
    ),
  ],
};

export const SuccessToast: StoryObj = {
  render: () => (
    <Box>
      <Sonner />
      <Button
        variant="contained"
        color="success"
        onClick={() =>
          toast.success("Thành công!", {
            description: "Dữ liệu đã được lưu thành công",
          })
        }
      >
        Hiện thông báo thành công
      </Button>
    </Box>
  ),
};

export const ErrorToast: StoryObj = {
  render: () => (
    <Box>
      <Sonner />
      <Button
        variant="contained"
        color="error"
        onClick={() =>
          toast.error("Lỗi!", { description: "Đã xảy ra lỗi khi lưu dữ liệu" })
        }
      >
        Hiện thông báo lỗi
      </Button>
    </Box>
  ),
};

export const InfoToast: StoryObj = {
  render: () => (
    <Box>
      <Sonner />
      <Button
        variant="contained"
        color="info"
        onClick={() =>
          toast.info("Thông tin!", {
            description: "Đây là một thông báo thông tin",
          })
        }
      >
        Hiện thông báo thông tin
      </Button>
    </Box>
  ),
};

export const WarningToast: StoryObj = {
  render: () => (
    <Box>
      <Sonner />
      <Button
        variant="contained"
        color="warning"
        onClick={() =>
          toast.warning("Cảnh báo!", {
            description: "Hành động này có thể gây ra lỗi",
          })
        }
      >
        Hiện thông báo cảnh báo
      </Button>
    </Box>
  ),
};

export const AllToastTypes: StoryObj = {
  render: () => (
    <Box>
      <Sonner />
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          color="success"
          onClick={() => toast.success("Thành công")}
        >
          Success
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => toast.error("Lỗi")}
        >
          Error
        </Button>
        <Button
          variant="outlined"
          color="info"
          onClick={() => toast.info("Thông tin")}
        >
          Info
        </Button>
        <Button
          variant="outlined"
          color="warning"
          onClick={() => toast.warning("Cảnh báo")}
        >
          Warning
        </Button>
        <Button variant="outlined" onClick={() => toast("Thông báo mặc định")}>
          Default
        </Button>
      </Box>
    </Box>
  ),
};

export const ToastWithAction: StoryObj = {
  render: () => (
    <Box>
      <Sonner />
      <Button
        variant="contained"
        onClick={() =>
          toast.success("Tập tin đã tải lên", {
            description: "Bạn có thể xem hoặc xóa tập tin này",
            action: {
              label: "Xem",
              onClick: () => console.log("View clicked"),
            },
          })
        }
      >
        Toast với Action
      </Button>
    </Box>
  ),
};

export const ToastPositions: StoryObj = {
  render: () => (
    <Box>
      <Sonner position="bottom-right" />
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}
      >
        {(
          [
            "top-left",
            "top-center",
            "top-right",
            "bottom-left",
            "bottom-center",
            "bottom-right",
          ] as const
        ).map((position) => (
          <Button
            key={position}
            variant="outlined"
            size="small"
            onClick={() => toast(`Vị trí: ${position}`, { position })}
          >
            {position}
          </Button>
        ))}
      </Box>
    </Box>
  ),
};
