import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box, Button } from "@mui/material";
import { ConfirmDialog } from "./ConfirmDialog";

const meta = {
  title: "Shared/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;

const ConfirmDialogWrapper = ({
  variant,
}: {
  variant: "danger" | "warning" | "info" | "success";
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Mở Confirm Dialog ({variant})
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          console.log("Confirmed!");
          setOpen(false);
        }}
        variant={variant}
        title={
          variant === "danger"
            ? "Xóa mục này?"
            : variant === "warning"
              ? "Cảnh báo"
              : variant === "success"
                ? "Thành công"
                : "Thông tin"
        }
        description={
          variant === "danger"
            ? "Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn."
            : variant === "warning"
              ? "Bạn đang thực hiện hành động có thể ảnh hưởng đến dữ liệu hiện tại."
              : variant === "success"
                ? "Hành động đã được thực hiện thành công!"
                : "Đây là thông tin bạn cần biết trước khi tiếp tục."
        }
      />
    </Box>
  );
};

export const DangerDialog: StoryObj = {
  render: () => <ConfirmDialogWrapper variant="danger" />,
};

export const WarningDialog: StoryObj = {
  render: () => <ConfirmDialogWrapper variant="warning" />,
};

export const InfoDialog: StoryObj = {
  render: () => <ConfirmDialogWrapper variant="info" />,
};

export const SuccessDialog: StoryObj = {
  render: () => <ConfirmDialogWrapper variant="success" />,
};

export const LoadingDialog: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirm = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
      }, 2000);
    };

    return (
      <Box>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Mở Loading Dialog
        </Button>
        <ConfirmDialog
          open={open}
          onClose={() => !loading && setOpen(false)}
          onConfirm={handleConfirm}
          variant="danger"
          title="Xóa dữ liệu"
          description="Bạn có chắc muốn xóa dữ liệu này?"
          loading={loading}
        />
      </Box>
    );
  },
};

export const CustomTextDialog: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <Box>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Mở Custom Dialog
        </Button>
        <ConfirmDialog
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
          title="Lưu thay đổi?"
          description="Bạn có các thay đổi chưa được lưu. Bạn có muốn lưu trước khi thoát?"
          confirmText="Lưu"
          cancelText="Không lưu"
          variant="warning"
        />
      </Box>
    );
  },
};
