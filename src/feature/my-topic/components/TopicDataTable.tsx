"use client";

import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  RefreshCw,
  Plus,
  AlertTriangle,
  Lock,
  Unlock,
  Users,
} from "lucide-react";
import { Chip, Box } from "@mui/material";
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
  onToggleLock?: (topic: MyTopic) => void;
  onManageTeam?: (topic: MyTopic) => void;
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

// Trạng thái đăng ký
const registrationStatusConfig = {
  OPEN: { label: "Mở", bgColor: "#dcfce7", textColor: "#166534" },
  FULL: { label: "Đã đầy", bgColor: "#fef3c7", textColor: "#92400e" },
  LOCKED: { label: "Đã chốt", bgColor: "#f3f4f6", textColor: "#6b7280" },
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
  onToggleLock,
  onManageTeam,
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
      id: "code",
      label: "Mã Đề Tài",
      minWidth: 100,
      format: (_, row) =>
        row.code ? (
          <span style={{ fontWeight: 600 }}>{row.code}</span>
        ) : (
          <Chip
            label="Chờ cấp mã"
            size="small"
            variant="outlined"
            color="warning"
          />
        ),
    },
    {
      id: "name",
      label: "Tên đề tài",
      minWidth: 250,
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
      minWidth: 100,
      align: "center",
      format: (_, row) => {
        const approvedCount =
          row.registeredStudents?.filter((s) => s.status === "Approved")
            .length || 0;
        const maxStudents = row.maxStudents;
        const isFull = approvedCount >= maxStudents;
        return (
          <Box
            component="span"
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontWeight: isFull ? 600 : 500,
              bgcolor: isFull ? "#fee2e2" : "#dcfce7",
              color: isFull ? "#dc2626" : "#166534",
              fontSize: "0.8rem",
            }}
          >
            {approvedCount}/{maxStudents}
          </Box>
        );
      },
    },
    {
      id: "registrationStatus",
      label: "Đăng ký",
      minWidth: 110,
      align: "center",
      format: (_, row) => (
        <Box
          component="span"
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.75rem",
            fontWeight: 600,
            bgcolor:
              registrationStatusConfig[row.registrationStatus]?.bgColor ||
              "#f3f4f6",
            color:
              registrationStatusConfig[row.registrationStatus]?.textColor ||
              "#6b7280",
          }}
        >
          {registrationStatusConfig[row.registrationStatus]?.label || "Mở"}
        </Box>
      ),
    },
    {
      id: "createdAt",
      label: "Ngày tạo",
      minWidth: 110,
      format: (val) => {
        if (!val) return "—";
        const date = new Date(val as string);
        return isNaN(date.getTime()) ? "—" : date.toLocaleDateString("vi-VN");
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
      id: "lock",
      icon: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {row.registrationStatus === "LOCKED" ? (
            <Unlock size={16} />
          ) : (
            <Lock size={16} />
          )}
        </Box>
      ),
      label: (row) =>
        row.registrationStatus === "LOCKED" ? "Mở khóa" : "Khóa",
      color: (row) =>
        (row.registrationStatus === "LOCKED" ? "success" : "warning") as
          | "success"
          | "warning",
      onClick: (row) => {
        if (onToggleLock) onToggleLock(row);
      },
    },
    {
      id: "group",
      icon: <Users size={16} />,
      label: "Nhóm SV",
      color: "primary" as const,
      onClick: (row) => {
        if (onManageTeam) onManageTeam(row);
      },
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
    <>
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
    </>
  );
}
