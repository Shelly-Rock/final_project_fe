import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { Sheet } from "./Sheet";

const meta = {
  title: "Shared/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Sheet>;

export default meta;

export const BasicSheet: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Mở Sheet từ phải
        </Button>
        <Sheet
          open={open}
          onClose={() => setOpen(false)}
          title="Tiêu đề Sheet"
          description="Mô tả ngắn về nội dung"
        >
          <Typography>Nội dung của sheet.</Typography>
        </Sheet>
      </Box>
    );
  },
};

export const SheetFromBottom: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Mở Sheet từ dưới
        </Button>
        <Sheet
          open={open}
          onClose={() => setOpen(false)}
          anchor="bottom"
          size={300}
          title="Bottom Sheet"
        >
          <Typography>Nội dung sheet từ dưới lên.</Typography>
        </Sheet>
      </Box>
    );
  },
};

export const SheetFromLeft: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Mở Sheet từ trái
        </Button>
        <Sheet
          open={open}
          onClose={() => setOpen(false)}
          anchor="left"
          title="Menu"
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button variant="text" sx={{ justifyContent: "flex-start" }}>
              Trang chủ
            </Button>
            <Button variant="text" sx={{ justifyContent: "flex-start" }}>
              Sản phẩm
            </Button>
            <Button variant="text" sx={{ justifyContent: "flex-start" }}>
              Dịch vụ
            </Button>
            <Button variant="text" sx={{ justifyContent: "flex-start" }}>
              Liên hệ
            </Button>
          </Box>
        </Sheet>
      </Box>
    );
  },
};

export const SheetWithForm: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Mở Form Sheet
        </Button>
        <Sheet
          open={open}
          onClose={() => setOpen(false)}
          title="Thêm người dùng mới"
          footer={
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button variant="contained" onClick={() => setOpen(false)}>
                Lưu
              </Button>
            </Box>
          }
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Họ và tên" fullWidth />
            <TextField label="Email" type="email" fullWidth />
            <TextField label="Số điện thoại" fullWidth />
          </Box>
        </Sheet>
      </Box>
    );
  },
};

export const SheetWithoutHeader: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Mở Sheet không có header
        </Button>
        <Sheet open={open} onClose={() => setOpen(false)} showHeader={false}>
          <Typography>Sheet không có header.</Typography>
        </Sheet>
      </Box>
    );
  },
};

export const SheetSizes: StoryObj = {
  render: () => {
    const [open, setOpen] = useState<string | null>(null);
    return (
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="outlined" onClick={() => setOpen("sm")}>
          Small (300px)
        </Button>
        <Button variant="outlined" onClick={() => setOpen("md")}>
          Medium (400px)
        </Button>
        <Button variant="outlined" onClick={() => setOpen("lg")}>
          Large (600px)
        </Button>

        {(["sm", "md", "lg"] as const).map((size) => (
          <Sheet
            key={size}
            open={open === size}
            onClose={() => setOpen(null)}
            title={`Sheet ${size.toUpperCase()}`}
            size={size === "sm" ? 300 : size === "md" ? 400 : 600}
          >
            <Typography>
              Nội dung sheet với kích thước {size.toUpperCase()}
            </Typography>
          </Sheet>
        ))}
      </Box>
    );
  },
};
