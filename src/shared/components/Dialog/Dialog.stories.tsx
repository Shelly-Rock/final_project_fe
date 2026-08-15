import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Dialog } from "./Dialog";

const meta = {
  title: "Shared/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Dialog>;

export default meta;

export const BasicDialog: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Mở Dialog
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Tiêu đề Dialog"
          description="Mô tả ngắn về nội dung dialog"
          actions={
            <>
              <Button variant="outlined" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button variant="contained" onClick={() => setOpen(false)}>
                Xác nhận
              </Button>
            </>
          }
        >
          <Typography>Đây là nội dung của dialog.</Typography>
        </Dialog>
      </Box>
    );
  },
};

export const DialogSizes: StoryObj = {
  render: () => {
    const [openSize, setOpenSize] = useState<string | null>(null);
    const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

    return (
      <Box sx={{ display: "flex", gap: 2 }}>
        {sizes.map((size) => (
          <Button
            key={size}
            variant="outlined"
            onClick={() => setOpenSize(size)}
          >
            {size.toUpperCase()}
          </Button>
        ))}
        {sizes.map((size) => (
          <Dialog
            key={size}
            open={openSize === size}
            onClose={() => setOpenSize(null)}
            title={`Dialog ${size.toUpperCase()}`}
            size={size}
            actions={
              <>
                <Button variant="outlined" onClick={() => setOpenSize(null)}>
                  Hủy
                </Button>
                <Button variant="contained" onClick={() => setOpenSize(null)}>
                  Xác nhận
                </Button>
              </>
            }
          >
            <Typography>
              Dialog với kích thước {size.toUpperCase()}. Chiều rộng tối đa:{" "}
              {size === "xs"
                ? "300px"
                : size === "sm"
                  ? "400px"
                  : size === "md"
                    ? "500px"
                    : size === "lg"
                      ? "700px"
                      : "900px"}
            </Typography>
          </Dialog>
        ))}
      </Box>
    );
  },
};

export const DialogWithoutCloseButton: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Mở Dialog
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Dialog không có nút đóng"
          showCloseButton={false}
          actions={
            <Button variant="contained" onClick={() => setOpen(false)}>
              Đóng
            </Button>
          }
        >
          <Typography>
            Dialog này chỉ có thể đóng bằng nút bên trong.
          </Typography>
        </Dialog>
      </Box>
    );
  },
};

export const DialogForm: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Mở Form Dialog
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Thêm người dùng mới"
          actions={
            <>
              <Button variant="outlined" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button variant="contained" onClick={() => setOpen(false)}>
                Lưu
              </Button>
            </>
          }
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Họ và tên" fullWidth />
            <TextField label="Email" type="email" fullWidth />
            <TextField label="Số điện thoại" fullWidth />
          </Box>
        </Dialog>
      </Box>
    );
  },
};

export const DialogNoBackdropClose: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Mở Dialog
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Không thể đóng bằng backdrop"
          closeOnBackdrop={false}
          actions={
            <Button variant="contained" onClick={() => setOpen(false)}>
              Đóng
            </Button>
          }
        >
          <Typography>
            Hãy nhấn nút đóng hoặc nhấn Escape để đóng dialog này.
          </Typography>
        </Dialog>
      </Box>
    );
  },
};
