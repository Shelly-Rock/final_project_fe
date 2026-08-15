import type { Meta, StoryObj } from "@storybook/react";
import { Box, Typography } from "@mui/material";
import { Collapsible, CollapsibleAccordion } from "./Collapsible";

const meta = {
  title: "Shared/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Collapsible>;

export default meta;

export const BasicCollapsible: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <Collapsible title="Nhấp để mở rộng">
        <Typography variant="body2" color="text.secondary">
          Nội dung bên trong collapsible. Có thể chứa bất kỳ thành phần React
          nào.
        </Typography>
      </Collapsible>
    </Box>
  ),
};

export const CollapsibleOpenByDefault: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <Collapsible title="Mở sẵn" defaultOpen>
        <Typography variant="body2" color="text.secondary">
          Thành phần này được mở sẵn khi trang được tải.
        </Typography>
      </Collapsible>
    </Box>
  ),
};

export const CollapsibleBordered: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <Collapsible title="Collapsible có viền" variant="bordered">
        <Typography variant="body2" color="text.secondary">
          Thành phần này có viền border.
        </Typography>
      </Collapsible>
    </Box>
  ),
};

export const CollapsibleFilled: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <Collapsible title="Collapsible có nền" variant="filled">
        <Typography variant="body2" color="text.secondary">
          Thành phần này có nền màu.
        </Typography>
      </Collapsible>
    </Box>
  ),
};

export const CollapsibleDisabled: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <Collapsible title="Collapsible bị vô hiệu hóa" disabled>
        <Typography variant="body2" color="text.secondary">
          Nội dung bên trong.
        </Typography>
      </Collapsible>
    </Box>
  ),
};

export const CollapsibleWithIconStart: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <Collapsible title="Icon ở bên trái" iconPosition="start">
        <Typography variant="body2" color="text.secondary">
          Icon nằm ở bên trái tiêu đề.
        </Typography>
      </Collapsible>
    </Box>
  ),
};

export const Accordion: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <CollapsibleAccordion
        items={[
          {
            title: "Phần 1",
            content: <Typography>Nội dung phần 1</Typography>,
          },
          {
            title: "Phần 2",
            content: <Typography>Nội dung phần 2</Typography>,
          },
          {
            title: "Phần 3",
            content: <Typography>Nội dung phần 3</Typography>,
          },
        ]}
        defaultOpenIndex={0}
      />
    </Box>
  ),
};

export const AccordionMultipleOpen: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 500 }}>
      <CollapsibleAccordion
        items={[
          {
            title: "Phần 1",
            content: <Typography>Nội dung phần 1</Typography>,
          },
          {
            title: "Phần 2",
            content: <Typography>Nội dung phần 2</Typography>,
          },
          {
            title: "Phần 3",
            content: <Typography>Nội dung phần 3</Typography>,
          },
        ]}
        allowMultiple
        defaultOpenIndex={[0, 2]}
      />
    </Box>
  ),
};
