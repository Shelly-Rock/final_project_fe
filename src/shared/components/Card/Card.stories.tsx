import type { Meta, StoryObj } from "@storybook/react";
import { Box, Typography, Avatar, IconButton, Button } from "@mui/material";
import { Card, CardHeader, CardContentDiv, CardActionsDiv } from "./Card";
import { MoreVertical, Edit, Trash2, Share2, Heart } from "lucide-react";

const meta = {
  title: "Shared/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Card>;

export default meta;

export const BasicCard: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 350 }}>
      <Card>
        <CardHeader title="Tiêu đề thẻ" subtitle="Mô tả phụ" />
        <CardContentDiv>
          <Typography variant="body2" color="text.secondary">
            Nội dung của thẻ. Có thể chứa văn bản, hình ảnh và các thành phần
            khác.
          </Typography>
        </CardContentDiv>
        <CardActionsDiv>
          <Button size="small">Chia sẻ</Button>
          <Button size="small">Tìm hiểu thêm</Button>
        </CardActionsDiv>
      </Card>
    </Box>
  ),
};

export const CardWithAvatar: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 350 }}>
      <Card>
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: "primary.main" }}>JD</Avatar>}
          title="John Doe"
          subtitle="Software Engineer"
        />
        <CardContentDiv>
          <Typography variant="body2" color="text.secondary">
            Một kỹ sư phần mềm đam mê công nghệ và phát triển ứng dụng web.
          </Typography>
        </CardContentDiv>
        <CardActionsDiv>
          <IconButton size="small">
            <Heart size={18} />
          </IconButton>
          <IconButton size="small">
            <Share2 size={18} />
          </IconButton>
          <IconButton size="small">
            <Edit size={18} />
          </IconButton>
        </CardActionsDiv>
      </Card>
    </Box>
  ),
};

export const CardWithAction: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 350 }}>
      <Card>
        <CardHeader
          title="Cài đặt"
          action={
            <IconButton size="small">
              <MoreVertical size={18} />
            </IconButton>
          }
        />
        <CardContentDiv>
          <Typography variant="body2" color="text.secondary">
            Quản lý cài đặt ứng dụng và tài khoản của bạn.
          </Typography>
        </CardContentDiv>
      </Card>
    </Box>
  ),
};

export const OutlinedCard: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 350 }}>
      <Card variant="outlined">
        <CardHeader title="Thẻ viền" subtitle="Variant outlined" />
        <CardContentDiv>
          <Typography variant="body2" color="text.secondary">
            Thẻ với viền border thay vì đổ bóng.
          </Typography>
        </CardContentDiv>
        <CardActionsDiv>
          <Button size="small" variant="text">
            Hành động
          </Button>
        </CardActionsDiv>
      </Card>
    </Box>
  ),
};

export const ClickableCard: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 350 }}>
      <Card onClick={() => alert("Card clicked!")}>
        <CardHeader title="Thẻ có thể click" />
        <CardContentDiv>
          <Typography variant="body2" color="text.secondary">
            Nhấp vào thẻ này để xem hiệu ứng hover.
          </Typography>
        </CardContentDiv>
      </Card>
    </Box>
  ),
};

export const CardGrid: StoryObj = {
  render: () => (
    <Box
      sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}
    >
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader title={`Thẻ ${i}`} subtitle={`Mô tả ${i}`} />
          <CardContentDiv>
            <Typography variant="body2" color="text.secondary">
              Nội dung thẻ số {i}.
            </Typography>
          </CardContentDiv>
          <CardActionsDiv>
            <Button size="small" variant="text">
              Xem
            </Button>
          </CardActionsDiv>
        </Card>
      ))}
    </Box>
  ),
};
