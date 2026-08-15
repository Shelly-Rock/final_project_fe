import type { Meta, StoryObj } from "@storybook/react";
import { Box, Chip } from "@mui/material";
import { Table } from "./Table";

const meta = {
  title: "Shared/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Table>;

export default meta;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

const users: User[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    role: "Editor",
    status: "active",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    role: "Viewer",
    status: "inactive",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    role: "Admin",
    status: "active",
  },
];

export const BasicTable: StoryObj = {
  render: () => (
    <Table
      columns={[
        { key: "id", title: "ID" },
        { key: "name", title: "Tên" },
        { key: "email", title: "Email" },
        { key: "role", title: "Vai trò" },
      ]}
      data={users}
    />
  ),
};

export const TableWithCustomRender: StoryObj = {
  render: () => (
    <Table
      columns={[
        { key: "id", title: "ID" },
        { key: "name", title: "Tên" },
        { key: "email", title: "Email" },
        { key: "role", title: "Vai trò" },
        {
          key: "status",
          title: "Trạng thái",
          render: (row: User) => (
            <Chip
              label={row.status === "active" ? "Hoạt động" : "Không hoạt động"}
              color={row.status === "active" ? "success" : "default"}
              size="small"
            />
          ),
        },
      ]}
      data={users}
    />
  ),
};

export const StripedTable: StoryObj = {
  render: () => (
    <Table
      columns={[
        { key: "id", title: "ID" },
        { key: "name", title: "Tên" },
        { key: "email", title: "Email" },
      ]}
      data={users}
      variant="striped"
    />
  ),
};

export const BorderedTable: StoryObj = {
  render: () => (
    <Table
      columns={[
        { key: "id", title: "ID" },
        { key: "name", title: "Tên" },
        { key: "email", title: "Email" },
      ]}
      data={users}
      variant="bordered"
    />
  ),
};

export const HoverableTable: StoryObj = {
  render: () => (
    <Table
      columns={[
        { key: "id", title: "ID" },
        { key: "name", title: "Tên" },
        { key: "email", title: "Email" },
        { key: "role", title: "Vai trò" },
      ]}
      data={users}
      onRowClick={(row) => console.log("Clicked:", row)}
    />
  ),
};

export const EmptyTable: StoryObj = {
  render: () => (
    <Table
      columns={[
        { key: "id", title: "ID" },
        { key: "name", title: "Tên" },
        { key: "email", title: "Email" },
      ]}
      data={[]}
      emptyText="Không có người dùng nào"
    />
  ),
};

export const SmallTable: StoryObj = {
  render: () => (
    <Table
      columns={[
        { key: "id", title: "ID" },
        { key: "name", title: "Tên" },
        { key: "email", title: "Email" },
      ]}
      data={users}
      size="small"
    />
  ),
};
