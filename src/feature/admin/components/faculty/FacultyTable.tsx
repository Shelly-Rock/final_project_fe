"use client";

import { Plus } from "lucide-react";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { Badge, DataTable } from "@/shared/components";
import type { Action, Column, HeaderAction } from "@/shared/components";
import type { Faculty } from "@/feature/admin/types";

interface FacultyTableProps {
  faculties: Faculty[];
  loading?: boolean;
  canCreate?: boolean;
  canDelete?: boolean;
  searchValue?: string;
  filterValue?: string;
  onSearchChange?: (value: string) => void;
  onFilterChange?: (value: string) => void;
  onCreate: () => void;
  onEdit: (faculty: Faculty) => void;
  onDelete: (faculty: Faculty) => void;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("vi-VN");
}

export function FacultyTable({
  faculties,
  loading = false,
  canCreate = false,
  canDelete = false,
  searchValue = "",
  filterValue = "all",
  onSearchChange,
  onFilterChange,
  onCreate,
  onEdit,
  onDelete,
}: FacultyTableProps) {
  const columns: Column<Faculty>[] = [
    {
      id: "id",
      label: "Mã khoa",
      minWidth: 130,
      format: (value) => <span style={{ fontWeight: 700 }}>{value}</span>,
    },
    {
      id: "name",
      label: "Tên khoa",
      minWidth: 220,
      format: (value) => <span style={{ fontWeight: 600 }}>{value}</span>,
    },
    {
      id: "description",
      label: "Mô tả",
      minWidth: 260,
      format: (value) => value || "—",
    },
    {
      id: "isActive",
      label: "Trạng thái",
      minWidth: 120,
      align: "center",
      sortable: false,
      format: (value) =>
        value ? (
          <Badge label="Hoạt động" color="success" variant="soft" />
        ) : (
          <Badge label="Tạm khóa" color="default" variant="soft" />
        ),
    },
    {
      id: "updatedAt",
      label: "Cập nhật",
      minWidth: 110,
      format: (_, row) => formatDate(row.updatedAt ?? row.createdAt),
    },
  ];

  const actions: Action<Faculty>[] = [
    {
      id: "edit",
      icon: <EditIcon fontSize="small" />,
      label: "Sửa",
      color: "primary",
      onClick: onEdit,
    },
    ...(canDelete
      ? [
          {
            id: "delete",
            icon: <DeleteIcon fontSize="small" />,
            label: "Xóa",
            color: "error" as const,
            onClick: onDelete,
          },
        ]
      : []),
  ];

  const headerActions: HeaderAction[] = canCreate
    ? [
        {
          id: "create",
          icon: <Plus size={18} />,
          label: "Thêm khoa",
          onClick: onCreate,
          variant: "contained",
        },
      ]
    : [];

  return (
    <DataTable
      columns={columns}
      rows={faculties}
      rowKey="id"
      actions={actions}
      headerActions={headerActions}
      loading={loading}
      emptyMessage="Chưa có khoa nào"
      showSearchInput
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      filterOptions={[
        { value: "all", label: "Tất cả" },
        { value: "active", label: "Hoạt động" },
        { value: "inactive", label: "Tạm khóa" },
      ]}
      filterValue={filterValue}
      onFilterChange={onFilterChange}
      showExportButton={false}
      showImportButton={false}
    />
  );
}
