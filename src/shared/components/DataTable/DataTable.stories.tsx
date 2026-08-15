import type { Meta, StoryObj } from "@storybook/react";
import { Box, IconButton, Chip, Avatar, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  DataTable,
  type Column,
  type Action,
  type DataTableProps,
} from "./DataTable";

interface Student {
  id: number;
  name: string;
  email: string;
  class: string;
  status: "active" | "inactive";
  avatar?: string;
}

const meta = {
  title: "Shared/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<DataTableProps<Student>>;

const sampleStudents: Student[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    class: "CNTT-01",
    status: "active",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    class: "CNTT-02",
    status: "active",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    class: "CNTT-01",
    status: "inactive",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    class: "CNTT-03",
    status: "active",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    class: "CNTT-02",
    status: "active",
  },
];

const columns: Column<Student>[] = [
  {
    id: "id",
    label: "ID",
    minWidth: 60,
    sortable: true,
  },
  {
    id: "name",
    label: "Họ tên",
    minWidth: 150,
    sortable: true,
    format: (value, row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
          {String(value).charAt(0)}
        </Avatar>
        <Typography variant="body2">{String(value)}</Typography>
      </Box>
    ),
  },
  {
    id: "email",
    label: "Email",
    minWidth: 180,
    sortable: true,
  },
  {
    id: "class",
    label: "Lớp",
    minWidth: 100,
    sortable: true,
  },
  {
    id: "status",
    label: "Trạng thái",
    minWidth: 100,
    sortable: true,
    format: (value) => (
      <Chip
        label={value === "active" ? "Hoạt động" : "Không hoạt động"}
        color={value === "active" ? "success" : "default"}
        size="small"
        variant="outlined"
      />
    ),
  },
];

const actions: Action<Student>[] = [
  {
    id: "view",
    icon: <VisibilityIcon fontSize="small" />,
    label: "Xem chi tiết",
    onClick: (row) => console.log("View", row),
    color: "primary",
  },
  {
    id: "edit",
    icon: <EditIcon fontSize="small" />,
    label: "Sửa",
    onClick: (row) => console.log("Edit", row),
    color: "secondary",
  },
  {
    id: "delete",
    icon: <DeleteIcon fontSize="small" />,
    label: "Xóa",
    onClick: (row) => console.log("Delete", row),
    color: "error",
  },
];

export const Default: Story = {
  args: {
    columns,
    rows: sampleStudents,
    rowKey: "id",
    actions,
  },
};

export const WithPagination: Story = {
  args: {
    columns,
    rows: sampleStudents,
    rowKey: "id",
    actions,
    totalCount: 100,
    page: 0,
    rowsPerPage: 5,
    onPageChange: (page) => console.log("Page changed to:", page),
    onRowsPerPageChange: (rows) => console.log("Rows per page:", rows),
  },
};

export const Loading: Story = {
  args: {
    columns,
    rows: [],
    rowKey: "id",
    actions,
    loading: true,
  },
};

export const EmptyState: Story = {
  args: {
    columns,
    rows: [],
    rowKey: "id",
    actions,
    emptyMessage: "Không có sinh viên nào",
  },
};

export const WithoutActions: Story = {
  args: {
    columns,
    rows: sampleStudents,
    rowKey: "id",
  },
};

export const CustomEmptyMessage: Story = {
  args: {
    columns,
    rows: [],
    rowKey: "id",
    emptyMessage: "Danh sách trống. Vui lòng thêm dữ liệu mới.",
  },
};
