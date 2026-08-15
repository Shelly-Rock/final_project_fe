import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { GlobalLoading, LoadingOverlay } from "./GlobalLoading";

const meta = {
  title: "Shared/GlobalLoading",
  component: GlobalLoading,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof GlobalLoading>;

export default meta;

export const BasicLoading: StoryObj = {
  render: () => <GlobalLoading />,
};

export const LoadingWithText: StoryObj = {
  render: () => <GlobalLoading text="Đang xử lý dữ liệu..." />,
};

export const LoadingWithCustomText: StoryObj = {
  render: () => (
    <GlobalLoading text="Vui lòng đợi trong khi chúng tôi lưu thông tin của bạn..." />
  ),
};

export const FullScreenLoading: StoryObj = {
  render: () => <GlobalLoading fullScreen text="Đang tải ứng dụng..." />,
};

export const LoadingOverlayStory: StoryObj = {
  render: () => {
    const [loading, setLoading] = useState(false);

    const handleLoad = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };

    return (
      <Box>
        <Button variant="contained" onClick={handleLoad} sx={{ mb: 2 }}>
          Simulate Loading
        </Button>
        <LoadingOverlay loading={loading} text="Đang tải dữ liệu...">
          <Card sx={{ width: 400, p: 2 }}>
            <CardContent>
              <Typography variant="h6">Nội dung Card</Typography>
              <Typography variant="body2" color="text.secondary">
                Nhấn nút trên để thấy loading overlay xuất hiện.
              </Typography>
            </CardContent>
          </Card>
        </LoadingOverlay>
      </Box>
    );
  },
};

export const ControlledLoading: StoryObj = {
  render: () => {
    const [loading, setLoading] = useState(true);

    return (
      <Box>
        <Button
          variant="outlined"
          onClick={() => setLoading(!loading)}
          sx={{ mb: 2 }}
        >
          {loading ? "Tắt Loading" : "Bật Loading"}
        </Button>
        <GlobalLoading loading={loading} text="Đang xử lý..." />
      </Box>
    );
  },
};
