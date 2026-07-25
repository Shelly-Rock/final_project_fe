"use client";

import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { RefreshCw, Plus, AlertTriangle } from "lucide-react";
import { DataTable } from "@/shared/components";
import { Badge } from "@/shared/components";
import type { Column, Action, HeaderAction } from "@/shared/components";
import type { MyTopic } from "../types";

interface TopicDataTableProps {
  topics: MyTopic[];
  loading?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onEdit: (topic: MyTopic) => void;
  onDelete: (topic: MyTopic) => void;
  onCreate: () => void;
  onCreateException: () => void;
  onRefresh: () => void;
}

const statusConfig: Record<
  string,
  { label: string; color: "success" | "warning" | "error" | "default" | "info" }
> = {
  Draft: { label: "Nháp", color: "default" },
  Pending: { label: "Chờ duyệt", color: "warning" },
  Approved: { label: "Đã duyệt", color: "success" },
  Rejected: { label: "Từ chối", color: "error" },
  Waiting_For_Secretary: { label: "Chờ Thư ký", color: "info" },
};

export function TopicDataTable({
  topics,
  loading = false,
  searchValue = "",
  onSearchChange,
  onEdit,
  onDelete,
  onCreate,
  onCreateException,
  onRefresh,
}: TopicDataTableProps) {
  const headerActions: HeaderAction[] = [
    {
      id: "refresh",
      icon: <RefreshCw size={16} />,
      label: "Làm mới",
      onClick: onRefresh,
      variant: "outlined",
    },
    {
      id: "exception",
      icon: <AlertTriangle size={16} />,
      label: "Đề xuất ngoại lệ",
      onClick: onCreateException,
      variant: "outlined",
      color: "secondary",
    },
    {
      id: "add",
      icon: <Plus size={16} />,
      label: "Thêm đề tài",
      onClick: onCreate,
      variant: "contained",
    },
  ];
  const columns: Column<MyTopic>[] = [
    {
      id: "name",
      label: "Tên đề tài",
      minWidth: 280,
      format: (_, row) => <span style={{ fontWeight: 500 }}>{row.name}</span>,
    },
    {
      id: "status",
      label: "Trạng thái",
      minWidth: 120,
      align: "center",
      sortable: false,
      format: (val) => {
        const config = statusConfig[val as string];
        return config ? (
          <Badge label={config.label} color={config.color} variant="soft" />
        ) : (
          <Badge label={String(val)} color="default" variant="soft" />
        );
      },
    },
    {
      id: "enrollment",
      label: "Sĩ số",
      minWidth: 80,
      align: "center",
      format: (_, row) => {
        const approvedCount =
          row.registeredStudents?.filter((s) => s.status === "Approved")
            .length || 0;
        const maxStudents = row.maxStudents;
        const isFull = approvedCount >= maxStudents;
        return (
          <span
            style={{
              fontWeight: isFull ? 600 : 400,
              color: isFull ? "#ef4444" : "inherit",
            }}
          >
            {approvedCount}/{maxStudents}
          </span>
        );
      },
    },
    {
      id: "createdAt",
      label: "Ngày tạo",
      minWidth: 110,
      format: (val) => {
        const date = new Date(val as string);
        return date.toLocaleDateString("vi-VN");
      },
    },
  ];

  const actions: Action<MyTopic>[] = [
    {
      id: "edit",
      icon: <EditIcon fontSize="small" />,
      label: "Sửa",
      color: "primary" as const,
      onClick: (row) => onEdit(row),
    },
    {
      id: "delete",
      icon: <DeleteIcon fontSize="small" />,
      label: "Xóa",
      color: "error" as const,
      onClick: (row) => onDelete(row),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={topics}
      rowKey="id"
      actions={actions}
      headerActions={headerActions}
      loading={loading}
      emptyMessage="Chưa có đề tài nào"
      showSearchInput
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      showExportButton={false}
      showImportButton={false}
      showFilterButton={false}
    />
  );
}
